// Configure environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Set's our port to the PORT environment variable, or 3000 by default if the env is not configured.
const PORT = process.env.PORT ?? 3000;

// Creates the express server
const app = express();

// Configure middleware (CORS support, JSON parsing support)
app.use(cors());
app.use(express.json());

// Import and use our application routes.
import routes from "./routes/routes.js";
app.use("/", routes);

// Start the DB running. Then, once it's connected, start the server.
await mongoose.connect(process.env.DB_URL);
app.listen(PORT, () => console.log(`App server listening on port ${PORT}!`));
