import * as dotenv from "dotenv";

export const envConfig = dotenv.config();

if (envConfig.error) {
    throw new Error("❌ Failed to load .env file");
}
