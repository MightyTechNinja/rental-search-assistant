import express, { type Router, Request, Response } from "express";
import { isValidUrl } from "../libs/util";
import { ingest_md } from "../libs/ingest";

export const indexingRouter: Router = express.Router();

indexingRouter.post("/", async (req: Request, res: Response) => {
  const { url, userId, markdown, title } = req.body;
  try {
    if (!isValidUrl(url)) {
      return res.status(400).json("Invalid URL format");
    }

    if (!userId || !markdown || !title) {
      return res.status(400).json("Invalid parameters");
    }

    console.log(
      "url",
      url,
      "userId",
      userId,
      "markdown",
      markdown.length,
      "title",
      title
    );

    await ingest_md(url, userId, markdown, title);
    return res.json("Success");
  } catch (error) {
    console.log("index-md", error as Error);
    return res.status(500).json("Failed to index markdown");
  }
});
