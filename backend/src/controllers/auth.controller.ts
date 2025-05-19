import { userService } from "@/services/user.service";
import { Request, Response } from "express";
import { LoginResponseDto, SuccessResponseDto, } from "@/dtos/auth.dto";
import { denyToken, generateAccessToken, generateRefreshToken, isTokenDenied, verifyToken } from "@/utils/jwt.util";


export const authController = {
    signUp: async (req: Request, res: Response) => {
        try {
            await userService.createUser(req.body);
            const responseDto = new SuccessResponseDto(
                "We have sent you a verification code. Please check your email."
            );
            res.status(201).json(responseDto);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Registration failed" });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await userService.login(email, password);

            const payload = {
                email: user.email,
                role: user.role,
                profileIcon: user.profileIcon
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            const tokens = new LoginResponseDto(accessToken, refreshToken);

            res.status(200).json(tokens);
        } catch (error: any) {
            res.status(401).json({ message: error.message || "Unauthorized" });
        }
    },

    verifyEmail: async (req: Request, res: Response) => {
        try {
            const { token } = req.query;
            await userService.verifyEmail(token as string);
            const responseDto = new SuccessResponseDto(
                "Email is verified"
            );
            res.status(200).json(responseDto);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Verification failed" });
        }
    },

    resendVerification: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            await userService.regenerateVerificationToken(email);


            const responseDto = new SuccessResponseDto(
                "Verification email resent. Please check your inbox."
            );
            res.status(200).json(responseDto);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Failed to resend verification email" });
        }
    },

    refreshToken: async (req: Request, res: Response): Promise<void> => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                res.status(400).json({ message: "Refresh token is required" });
                return;
            }

            // Check if the refresh token is in the denial list
            const isDenied = await isTokenDenied(refreshToken);
            if (isDenied) {
                res.status(401).json({ message: "Refresh token has already been used or denied" });
                return;
            }

            // Verify the refresh token and extract the payload using the utility function
            const payload = verifyToken(refreshToken);

            // Retrieve user info from payload
            const user = await userService.getUserByEmail(payload.email);

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const newPayload = {
                email: user.email,
                role: user.role,
                profileIcon: user.profileIcon
            };

            // Generate a new access token and refresh token
            const newAccessToken = generateAccessToken(newPayload);
            const newRefreshToken = generateRefreshToken(newPayload);

            // Deny the refresh token (add it to the denial list after use)
            await denyToken(refreshToken);

            // Return the new access token and refresh token to the user
            const tokens = new LoginResponseDto(newAccessToken, newRefreshToken);
            res.status(200).json(tokens);  // Send the response

        } catch (error: any) {
            res.status(401).json({ message: error.message || "Invalid or expired refresh token" });
        }
    }
};
