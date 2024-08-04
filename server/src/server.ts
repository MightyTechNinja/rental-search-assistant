import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import authCheck from "@/middleware/authHandler";
import rateLimiter from "@/middleware/rateLimiter";
import requestLogger from "@/middleware/requestLogger";
import errorHandler from "@/middleware/errorHandler";
import { searchRouter } from "@/api/vector/search";
import { embeddingRouter } from "@/api/vector/embedding";
import { changeEmbeddingRouter } from "@/api/vector/changeEmbedding";
import { CORS_ORIGIN } from "./config";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(authCheck);
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/api/vector/search", searchRouter);
app.use("/api/vector/embedding", embeddingRouter);
app.use("/api/vector/change-embedding", changeEmbeddingRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
