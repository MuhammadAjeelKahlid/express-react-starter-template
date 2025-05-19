import { z } from "zod";

export const signUpSchema = z.object({
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
});


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export const tokenVerificationSchema = z.object({
    token: z.string()
});

export const refreshTokenVerificationSchema = z.object({
    refreshToken: z.string()
});

export const emailSchema = z.object({
    email: z.string().email(),

});