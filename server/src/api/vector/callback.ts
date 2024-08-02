import express, { type Router, Request, Response } from "express";
import { isValidUrl } from "../../libs/util";
import { ingest_url, ingest_md } from "../../libs/ingest";

export const callbackRouter: Router = express.Router();

callbackRouter.post("/", async (req: Request, res: Response) => {
  const { url, userId } = req.body;
  console.log("url", url, "userId", userId);
  try {
    if (!isValidUrl(url)) {
      return res.status(400).json("Invalid URL format");
    }
    // if (await urlExists(userId, url)) {
    //   console.log("url", url, "already exists for user", userId, "deleting");
    //   await deleteUrl(userId, url);
    //   console.log("url", url, "already exists for user", userId, "deleted");
    // }
    await ingest_url(url, userId);
    return res.json("Success");
  } catch (error) {
    console.log("index", error as Error);
    return res.status(500).json("Failed to search");
  }
});
