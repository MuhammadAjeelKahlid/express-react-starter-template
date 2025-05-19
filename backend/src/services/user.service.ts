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

        // sendVerificationEmail(user.email, user.verificationToken!).catch(console.error);
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

        // sendVerificationEmail(user.email, user.verificationToken!).catch(console.error);

        return user;
    },

    async regenerateVerificationToken(email: string): Promise<User> {
        const user = await User.findOneBy({ email });
        if (!user) throw new Error("User not found");

        user.verificationToken = uuidv4();
        user.verificationTokenExpires = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
        user.emailVerified = false; // optionally reset emailVerified if you want

        await user.save();


        // sendVerificationEmail(user.email, user.verificationToken!).catch(console.error);

        return user;
    },

};
