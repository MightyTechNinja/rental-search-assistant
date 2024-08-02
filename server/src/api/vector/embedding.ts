import express, { type Router, Request, Response } from "express";
import axios from "axios";
import { addEmbedding } from "../../libs/db";

export const embeddingRouter: Router = express.Router();

embeddingRouter.post("/", async (req: Request, res: Response) => {
  const { API_TOKEN, OPENAI_API_KEY, OPENAI_EMBEDDING_MODEL } = process.env;
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
