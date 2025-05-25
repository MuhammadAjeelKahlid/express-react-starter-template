import { User } from "@/database/entity/User.entity";
import { CreateUserInput } from "@/types/user";
import { sendVerificationEmail } from "@/utils/email.util";
import { compareHash, hashString } from "@/utils/hash";
import { v4 as uuidv4 } from "uuid";

export const userService = {
    async getAllUsers(): Promise<User[]> {
        return User.find();
    },

    async getUserByEmail(email: string): Promise<User | null> {
        return User.findOneBy({ email });
    },

    async getUserById(id: string): Promise<User | null> {
        return User.findOneBy({ id });
    },

    async createUser(data: CreateUserInput): Promise<User> {
        const existing = await User.findOneBy({ email: data.email });

        if (existing) throw new Error("User already exists");

        const hashedPassword = await hashString(data.password);

        const user = User.create({
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            profileIcon: data.profileIcon,
            dob: data.dob,
            city: data.city,
            state: data.state,
            country: data.country,
            ipAddress: data.ipAddress,
            verificationToken: uuidv4(),
            verificationTokenExpires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        });

        sendVerificationEmail(user.email, user.verificationToken!, "verify-email").catch(console.error);
        await user.save();
        return user;
    },
    async login(email: string, password: string): Promise<User> {
        const user = await User.findOneBy({ email });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isValidPassword = await compareHash(password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid email or password");
        }

        if (!user.emailVerified) {
            throw new Error("Email not verified");
        }

        return user;
    },

    async verifyEmail(token: string): Promise<User> {
        if (!token) {
            throw new Error("Invalid or expired verification token");
        }
        const user = await User.findOneBy({ verificationToken: token });
        if (!user) {
            throw new Error("Invalid or expired verification token");
        }
        if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
            throw new Error("Verification token expired");
        }
        user.emailVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;
        await user.save();

        return user;
    },

    async regenerateVerificationToken(email: string): Promise<User> {
        const user = await User.findOneBy({ email });
        if (!user) throw new Error("User not found");

        user.verificationToken = uuidv4();
        user.verificationTokenExpires = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
        user.emailVerified = false; // optionally reset emailVerified if you want

        await user.save();


        sendVerificationEmail(user.email, user.verificationToken!, "verify-email").catch(console.error);

        return user;
    },

    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const user = await User.findOneBy({ id: userId });
        if (!user) {
            throw new Error("User not found");
        }

        // Compare the current password with the stored hash
        const isMatch = await compareHash(currentPassword, user.password);
        if (!isMatch) {
            throw new Error("Current password is incorrect");
        }

        // Hash the new password
        const newHashedPassword = await hashString(newPassword);

        user.password = newHashedPassword;
        await user.save();
    },
    async requestPasswordReset(email: string): Promise<void> {
        const user = await User.findOneBy({ email });
        if (!user) throw new Error("User not found");

        const token = uuidv4();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        await user.save();
        sendVerificationEmail(user.email, user.verificationToken!, "reset-password").catch(console.error);
    },

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await User.findOneBy({ resetPasswordToken: token });

        if (
            !user ||
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < new Date()
        ) {
            throw new Error("Invalid or expired reset token");
        }

        user.password = await hashString(newPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
    },

};
