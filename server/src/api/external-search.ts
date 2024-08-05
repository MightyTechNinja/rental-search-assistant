import express, { type Router, Request, Response } from "express";
import { search } from "../libs/serper";

export const externalSearchRouter: Router = express.Router();

externalSearchRouter.post("/", async (req: Request, res: Response) => {
  const { query } = req.body;
  try {
    const result = await search(query);
    return res.json(result);
  } catch (unknownError) {
    let errorMessage: string | null = null;

    if (unknownError instanceof Error) {
      errorMessage = unknownError.message;
    } else if (typeof unknownError === "string") {
      errorMessage = unknownError;
    }

    console.log("search", errorMessage || "unkown");
    if (errorMessage) return res.status(500).json("Failed to search");
  }
});
