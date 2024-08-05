import { type EmbeddingsInterface } from "@langchain/core/embeddings";
import { OpenAIEmbeddings } from "@langchain/openai";

const { OPENAI_API_KEY, OPENAI_EMBEDDING_MODEL } = process.env;

export function getEmbedding(): EmbeddingsInterface {
  return new OpenAIEmbeddings({
    apiKey: OPENAI_API_KEY,
    model: OPENAI_EMBEDDING_MODEL,
  });
}
