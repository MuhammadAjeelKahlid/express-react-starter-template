import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt.util";
import { userService } from "@/services/user.service";

// Reusable authCheck middleware that can also check for roles
export const authCheck = (requiredRole?: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(401).json({ message: "Authorization token is required" });
                return; // <-- Add return!
            }
            // Verify the token and extract the payload
            const payload = verifyToken(token);
            // Get the user using the userId from the token
            if (payload.tokenType && payload.tokenType !== "accessToken") {
                res.status(401).json({ message: "Invalid token type for resource access" });
                return;
            }

            // Attach user to the request object for use in downstream route handlers from payload
            (req as any).user = payload;
            // If a role is required, check if the user has the correct role
            if (requiredRole && payload.role !== requiredRole) {
                res.status(403).json({ message: `${requiredRole} authentication required` });
                return; // <-- Add return!
            }
            next();
        } catch (error) {
            res.status(401).json({ message: "Unauthorized" });
            return; // <-- Add return!
        }
    };
};
