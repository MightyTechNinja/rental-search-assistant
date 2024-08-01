import axios from "axios";

import { addEmbedding, changeEmbedding, deleteUrl, search } from "./db";
// import { urlExists } from "./redis";
import { isValidUrl } from "./util";
import { ingest_url, ingest_md } from "./ingest";

const {
  API_TOKEN,
  OPENAI_API_KEY,
  OPENAI_EMBEDDING_MODEL,
} = process.env;

function checkAuth(req: Request) {
  const authorizationHeader = req.headers.get("Authorization");
  if (!authorizationHeader || authorizationHeader !== `${API_TOKEN}`) {
    return Response.json("Unauthorized", { status: 401 });
  }
}

export async function handleRequest(req: Request): Promise<Response> {
  const path = new URL(req.url).pathname;
  const { method } = req;

  let authResponse = checkAuth(req);
  if (authResponse) {
    return authResponse;
  }

  if (path === "/api/vector/search" && method === "POST") {
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
  }

  if (path === "/api/vector/callback" && method === "POST") {
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
  }

  if (path === "/api/index/md" && method === "POST") {
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
  }

  if (path === "/api/vector/change-embedding" && method === "POST") {
    const { userId } = await req.json();
    try {
      await changeEmbedding(userId);
      return Response.json("Success");
    } catch (error) {
      console.log("change-embedding", error as Error);
      return Response.json("Failed to change embedding", { status: 500 });
    }
  }

  if(path === "/api/vector/embedding" && method === "POST"){
    

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
        await addEmbedding({...property, embedding});
        
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
      } catch (error) {
        console.error("Error processing:", error);
      }
      return;
    });
  }

  if (path === "/") return Response.json("Welcome to memfree vector service!");
  return Response.json("Page not found", { status: 404 });
}
const server = Bun.serve({
  port: process.env.PORT || 3000,
  fetch: handleRequest,
});

console.log(`Listening on ${server.url}`);
