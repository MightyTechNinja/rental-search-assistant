import express, { type Router, Request, Response } from "express";
import { changeEmbedding } from "../../libs/db";

export const changeEmbeddingRouter: Router = express.Router();

changeEmbeddingRouter.post("/", async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    await changeEmbedding(userId);
    return res.json("Success");
  } catch (error) {
    console.log("change-embedding", error as Error);
    return res.status(500).json("Failed to change embedding");
  }
});
