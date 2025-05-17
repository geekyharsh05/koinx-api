import mongoose from "mongoose";
import { env } from "./env";

export class Database {
  private static instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      const uri = env.MONGODB.URI;

      await mongoose.connect(uri);

      console.log("Successfully connected to MongoDB");

      mongoose.connection.on("error", (err: any) => {
        console.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB connection disconnected");
      });
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }
}