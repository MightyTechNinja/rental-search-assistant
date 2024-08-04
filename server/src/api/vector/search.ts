import express, { type Router, Request, Response } from "express";
import { search } from "../../libs/db";

export const searchRouter: Router = express.Router();

searchRouter.post("/", async (req: Request, res: Response) => {
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

    if (
      errorMessage &&
      errorMessage.includes("Table") &&
      errorMessage.includes("was not found")
    ) {
      return res.status(200).json(JSON.stringify([]));
    }

    console.log("search", errorMessage || "unkown");
    if (errorMessage) return res.status(500).json("Failed to search");
  }
});
