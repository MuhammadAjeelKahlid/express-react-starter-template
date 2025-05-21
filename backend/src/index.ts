//NodeModules Imports
import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import "@/config/config";
import { AppDataSource } from "@/database/data-source";

//Routes Imports
import authRoutes from "@/routes/auth.route"
import userRoutes from "@/routes/user.route"
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Health check route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "API is running 🚀" });
});

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1", userRoutes)

// Initialize DB & start server
const startServer = async () => {
    try {
        console.log("Initializing database connection...");
        await AppDataSource.initialize();
        console.log("✅ Database connected successfully.");

        app.listen(PORT, () => {
            console.log(`✅ Server is up and running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to initialize data source:", error);
        process.exit(1);
    }
};

startServer();
