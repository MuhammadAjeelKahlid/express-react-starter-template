import { Request, Response } from "express";
import { userService } from "@/services/user.service";
import { User } from "@/database/entity/User.entity";
import { SafeUserDto, SuccessResponseDto } from "@/dtos/auth.dto"; // Adjust import if you have separate UserResponseDto

export const userController = {
    // Get all users
    getAll: async (req: Request, res: Response) => {
        try {
            const users = await userService.getAllUsers();
            const safeUsers = users.map(user => new SafeUserDto(user));
            const responseDto = new SuccessResponseDto("Users fetched successfully", safeUsers);
            res.status(200).json(responseDto);
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Failed to fetch users" });
        }
    },

    // Get user by ID
    getById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return
            }

            const responseDto = new SuccessResponseDto("User fetched successfully", new SafeUserDto(user));
            res.status(200).json(responseDto);
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Failed to fetch user" });
        }
    },

    // Create user
    create: async (req: Request, res: Response) => {
        try {
            const user = await userService.createUser(req.body);
            // Optionally: don't return password/hash fields in response
            const responseDto = new SuccessResponseDto("User Created successfully", new SafeUserDto(user));
            res.status(201).json(responseDto);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Failed to create user" });
        }
    },

    // Update user
    update: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return
            }
            // Merge and save new data
            Object.assign(user, req.body);
            await user.save();
            const responseDto = new SuccessResponseDto("User fetched successfully", new SafeUserDto(user));
            res.status(200).json(responseDto);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Failed to update user" });
        }
    },

    // Delete user
    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.params;
            const user = await userService.getUserByEmail(email);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return
            }
            await user.remove();
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Failed to delete user" });
        }
    }
};
