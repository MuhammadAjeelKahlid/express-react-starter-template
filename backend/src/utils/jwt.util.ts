import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import ms, { StringValue } from "ms";
import { DeniedToken } from "@/database/entity/DeniedTokens.entity"; // Assuming DeniedToken entity is imported

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Helper function to ensure env var is a valid ms StringValue or fallback
function parseExpiry(value: string | undefined, fallback: StringValue): number {
    if (!value) return ms(fallback);
    try {
        return ms(value as StringValue);
    } catch {
        return ms(fallback);
    }
}

const ACCESS_TOKEN_EXPIRY_MS = parseExpiry(process.env.ACCESS_TOKEN_EXPIRY, "15m");
const REFRESH_TOKEN_EXPIRY_MS = parseExpiry(process.env.REFRESH_TOKEN_EXPIRY, "7d");

const accessTokenOptions: SignOptions = { expiresIn: Math.floor(ACCESS_TOKEN_EXPIRY_MS / 1000) };
const refreshTokenOptions: SignOptions = { expiresIn: Math.floor(REFRESH_TOKEN_EXPIRY_MS / 1000) };

// Function to generate the access token
export function generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, accessTokenOptions);
}

// Function to generate the refresh token (this does not add to Denial list yet)
export function generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, refreshTokenOptions);
}

// Function to verify the token (for both access and refresh tokens)
export function verifyToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
}

// Function to check if the refresh token has been denied
export async function isTokenDenied(token: string): Promise<boolean> {
    const deniedToken = await DeniedToken.findOne({ where: { token } });
    return deniedToken !== null;
}

// Function to add a refresh token to the Denial list after it's used for refreshing the access token
export async function denyToken(token: string): Promise<void> {
    // Add the refresh token to the DeniedToken table (marking it as used)
    await DeniedToken.create({ token, createdAt: new Date() }).save();
}
