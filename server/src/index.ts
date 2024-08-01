import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

import { addEmbedding, changeEmbedding, deleteUrl, search } from "./db";
// import { urlExists } from "./redis";
import { isValidUrl } from "./util";
import { ingest_url, ingest_md } from "./ingest";

const { API_TOKEN, OPENAI_API_KEY, OPENAI_EMBEDDING_MODEL } = process.env;

function checkAuth(req: Request) {
  const authorizationHeader = req.headers.get("Authorization");
  if (!authorizationHeader || authorizationHeader !== `${API_TOKEN}`) {
    return Response.json("Unauthorized", { status: 401 });
  }
}

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.post("/api/vector/search", async (req, res) => {
  const { query, userId } = await req.json();
    try {
      const result = await search(query, userId);
      return Response.json(result);
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
        return new Response(JSON.stringify([]), { status: 200 });
      }

      console.log("search", errorMessage || "unkown");
      if (errorMessage)
        return Response.json("Failed to search", { status: 500 });
    }
})

app.post("/api/vector/callback", async (req, res) => {
  const { url, userId } = await req.json();
    console.log("url", url, "userId", userId);
    try {
      if (!isValidUrl(url)) {
        return Response.json("Invalid URL format", { status: 400 });
      }
      // if (await urlExists(userId, url)) {
      //   console.log("url", url, "already exists for user", userId, "deleting");
      //   await deleteUrl(userId, url);
      //   console.log("url", url, "already exists for user", userId, "deleted");
      // }
      await ingest_url(url, userId);
      return Response.json("Success");
    } catch (error) {
      console.log("index", error as Error);
      return Response.json("Failed to search", { status: 500 });
    }
})

app.post("/api/index/md", async (req, res) => {
  const { url, userId, markdown, title } = await req.json();
    try {
      if (!isValidUrl(url)) {
        return Response.json("Invalid URL format", { status: 400 });
      }

      if (!userId || !markdown || !title) {
        return Response.json("Invalid parameters", { status: 400 });
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
      return Response.json("Success");
    } catch (error) {
      console.log("index-md", error as Error);
      return Response.json("Failed to index markdown", { status: 500 });
    }
})

app.post("/api/vector/embedding", async (req, res) => {
  const { properties } = await req.json();
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

        console.log(
          `A document was inserted with the _id: ${result.insertedId}`
        );
      } catch (error) {
        console.error("Error processing:", error);
      }
      return;
    });
})

app.post("/api/vector/change-embedding", async (req, res) => {
  const { userId } = await req.json();
    try {
      await changeEmbedding(userId);
      return Response.json("Success");
    } catch (error) {
      console.log("change-embedding", error as Error);
      return Response.json("Failed to change embedding", { status: 500 });
    }
})

// @ts-ignore
app.use((req, res, next) => {
  checkAuth(req);
  next()
});
// @ts-ignore
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`App listening at http://localhost:${port}`)
});
