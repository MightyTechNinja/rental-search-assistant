import { type EmbeddingsInterface } from "@langchain/core/embeddings";
import { OpenAIEmbeddings } from "@langchain/openai";
import { DIMENSIONS, EMBEDDING_MODEL } from "./config";

export function getEmbedding(): EmbeddingsInterface {
  return new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: EMBEDDING_MODEL,
    dimensions: DIMENSIONS,
  });
}
