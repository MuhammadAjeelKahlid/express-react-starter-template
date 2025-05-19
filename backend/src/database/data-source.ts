import "reflect-metadata";
import { DataSource } from "typeorm";
export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: ["src/database/entity/*.ts"],
    subscribers: ["src/database/subscriber/**/*.ts"],
    extra: {
        max: 10, // Max number of connections in the pool
        min: 2,  // Min number of connections in the pool
        idleTimeoutMillis: 30000, // Timeout for idle connections (30 seconds)
        connectionTimeoutMillis: 2000, // Timeout for establishing a connection (2 seconds)
    },
});
