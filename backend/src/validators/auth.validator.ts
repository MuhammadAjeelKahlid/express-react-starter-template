import { z } from "zod";

export const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    profileIcon: z.string().url().optional(),
    dob: z.coerce.date().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    ipAddress: z.string().optional(),
}).strict();

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
}).strict();

export const tokenVerificationSchema = z.object({
    token: z.string()
}).strict();

export const idSchema = z.object({
    id: z.string()
}).strict();

export const refreshTokenVerificationSchema = z.object({
    refreshToken: z.string()
}).strict();

export const emailSchema = z.object({
    email: z.string().email(),

});