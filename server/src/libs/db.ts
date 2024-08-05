import dotenv from "dotenv";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import { getEmbedding } from "./util";

dotenv.config({ path: resolve(`${__dirname}/../../.env`) });

const {
  MONGODB_CONNECTION_URI = "",
  MONGODB_DATABASE_NAME,
  MONGODB_EMBEDDED_COLLECTION_NAME = "",
  VECTOR_SEARCH_INDEX_NAME,
  VECTOR_SEARCH_PATH,
} = process.env;

const client = new MongoClient(MONGODB_CONNECTION_URI);
const database = client.db(MONGODB_DATABASE_NAME);
const collection = database.collection(MONGODB_EMBEDDED_COLLECTION_NAME);

export async function search(query: string) {
  console.time("embedding");
  const queryEmbedding = await getEmbedding().embedQuery(query);
  console.timeEnd("embedding");

  const agg = [
    {
      $vectorSearch: {
        index: VECTOR_SEARCH_INDEX_NAME,
        path: VECTOR_SEARCH_PATH,
        queryVector: queryEmbedding,
        numCandidates: 150,
        limit: 5,
      },
    },
    {
      $project: {
        embedding: 0,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ];

  const result = collection.aggregate(agg).toArray();
  return result;
}

export async function addEmbedding(property: any) {
  return await collection.insertOne(property);
}
