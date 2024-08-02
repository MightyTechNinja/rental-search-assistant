import type { Request } from "express";
import { rateLimit } from "express-rate-limit";

import {
  COMMON_RATE_LIMIT_MAX_REQUESTS,
  COMMON_RATE_LIMIT_WINDOW_MS,
} from "@/config";

const rateLimiter = rateLimit({
  legacyHeaders: true,
  limit: COMMON_RATE_LIMIT_MAX_REQUESTS,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  windowMs: 15 * 60 * COMMON_RATE_LIMIT_WINDOW_MS,
  keyGenerator: (req: Request) => req.ip as string,
});

export default rateLimiter;
