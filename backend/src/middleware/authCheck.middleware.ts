import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt.util";
import { userService } from "@/services/user.service";

// Reusable authCheck middleware that can also check for roles
export const authCheck = (requiredRole?: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }
            // Verify the token and extract the payload
            const payload = verifyToken(token);
            // Get the user using the userId from the token
            const user = await userService.getUserById(payload.userId);
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            // Attach user to the request object for use in downstream route handlers
            (req as any).user = user;
            // If a role is required, check if the user has the correct role
            if (requiredRole && user.role !== requiredRole) {
                return res.status(403).json({ message: `${requiredRole} authentication required` });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: "Unauthorized" });
        }
    };
};
