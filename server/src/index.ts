import axios from "axios";
import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { addEmbedding, changeEmbedding, deleteUrl, search } from "./db";
// import { urlExists } from "./redis";
import { isValidUrl } from "./util";
import { ingest_url, ingest_md } from "./ingest";

const { API_TOKEN, OPENAI_API_KEY, OPENAI_EMBEDDING_MODEL } = process.env;

const app: Express = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.post("/api/vector/search", async (req: Request, res: Response) => {
  const { query, userId } = req.body;
  try {
    const result = await search(query, userId);
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

app.post("/api/vector/callback", async (req: Request, res: Response) => {
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

app.post("/api/index/md", async (req: Request, res: Response) => {
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

app.post("/api/vector/embedding", async (req: Request, res: Response) => {
  const { properties } = req.body;
  properties.forEach(async (property: any) => {
    const { title, description, introduction, location, review } = property; // document

    // Prepare text for embedding (combine or process fields as needed)
    const textToEmbed = `Title: ${title}\nDescription: ${description}\nIntroduction: ${introduction}\nLocation: ${location}\nReview: ${review}`;

    try {
      const response = await axios.post(
        `https://api.openai.com/v1/embeddings`,
        {
          input: textToEmbed,
          model: OPENAI_EMBEDDING_MODEL,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const embedding = response.data.data[0].embedding;
      const result = await addEmbedding({ ...property, embedding });
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json("Success");
    } catch (error) {
      console.error("Error processing:", error);
    }
    return;
  });
});

app.post(
  "/api/vector/change-embedding",
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
      await changeEmbedding(userId);
      return res.json("Success");
    } catch (error) {
      console.log("change-embedding", error as Error);
      return res.status(500).json("Failed to change embedding");
    }
  }
);

// middlewares
app.use((req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers["Authorization"];
  if (!authorizationHeader || authorizationHeader !== `${API_TOKEN}`) {
    return Response.json("Unauthorized", { status: 401 });
  }
  next();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

// app listening
const port = 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`App listening at http://localhost:${port}`);
});
