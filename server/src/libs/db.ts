import dotenv from "dotenv";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import {
  Schema,
  Field,
  Float32,
  FixedSizeList,
  Utf8,
  Float64,
} from "apache-arrow";
// import { DIMENSIONS } from "../config";
import { getEmbedding } from "./util";

dotenv.config({ path: resolve(`${__dirname}/../../.env`) });

const {
  API_TOKEN,
  MONGODB_CONNECTION_URI = "",
  MONGODB_DATABASE_NAME,
  VECTOR_SEARCH_INDEX_NAME,
  VECTOR_SEARCH_PATH,
  OPENAI_API_KEY,
  OPENAI_EMBEDDING_MODEL,
} = process.env;

const client = new MongoClient(MONGODB_CONNECTION_URI);
const database = client.db(MONGODB_DATABASE_NAME);

// const schema = new Schema([
//   new Field("create_time", new Float64(), true),
//   new Field("title", new Utf8(), true),
//   new Field("url", new Utf8(), true),
//   new Field("image", new Utf8(), true),
//   new Field("text", new Utf8(), true),
//   new Field(
//     "vector",
//     new FixedSizeList(DIMENSIONS, new Field("item", new Float32())),
//     true
//   ),
// ]);

export async function deleteUrl(tableName: string, url: string) {
  // const db = await getConnection();
  // const table = await getTable(db, tableName);
  // await table.delete(`url == "${url}"`);
}

// export async function append(tableName: string, data: lancedb.Data) {
//   const db = await getConnection();
//   const table = await getTable(db, tableName);
//   await table.add(data);
//   return table;
// }

export async function search(query: string) {
  console.time("embedding");
  const queryEmbedding = await getEmbedding().embedQuery(query);
  console.timeEnd("embedding");

  const collection = database.collection("embedded_content");
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

interface Document {
  title: string;
  url: string;
  image: string;
  create_time: number;
  text: string;
}

export async function addEmbedding(property: any) {
  const collection = database.collection<any>("embedded_content");
  return await collection.insertOne(property);
}

export async function changeEmbedding(tableName: string) {
  // const db = await getConnection();
  // const table = await getTable(db, tableName);
  // console.time("select-text");
  // const documents: Document[] = (await table
  //   .query()
  //   .select(["title", "url", "image", "create_time", "text"])
  //   .toArray()) as Document[];
  // console.timeEnd("select-text");
  // console.log("Embedding", documents.length);
  // const texts = documents.map((item) => item.text);
  // console.time("embedding");
  // const embeddings = await getEmbedding().embedDocuments(texts);
  // console.timeEnd("embedding");
  // const documentsWithVectors = documents.map((doc, i) => ({
  //   ...doc,
  //   vector: embeddings[i] as number[],
  // }));
  // console.time("createTable");
  // const newTable = await db.createTable(tableName, documentsWithVectors, {
  //   mode: "overwrite",
  //   schema: schema,
  // });
  // console.timeEnd("createTable");
  // console.log("Table size", await newTable.countRows());
  // await newTable.optimize({ cleanupOlderThan: new Date() });
  // return newTable;
}
