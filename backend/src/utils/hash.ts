import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const PEPPER = process.env.PEPPER_SECRET || "default_pepper"; // load from env

/**
 * Hashes a plain string (e.g., password) with pepper
 */
export async function hashString(plain: string): Promise<string> {
    const peppered = plain + PEPPER;
    return bcrypt.hash(peppered, SALT_ROUNDS);
}

/**
 * Compares a plain string with a hashed string, using pepper
 */
export async function compareHash(plain: string, hash: string): Promise<boolean> {
    const peppered = plain + PEPPER;
    return bcrypt.compare(peppered, hash);
}
