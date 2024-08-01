import path from "path";
import axios from "axios";
import { MongoClient } from "mongodb";
import { loadEnvVars } from "./loadEnvVars";
import { properties } from "./properties";

// Load project environment variables
const dotenvPath = path.join(__dirname, "..", "..", "..", ".env"); // .env at project root
const {
  MONGODB_CONNECTION_URI,
  MONGODB_DATABASE_NAME,
  OPENAI_API_KEY,
  OPENAI_EMBEDDING_MODEL,
} = loadEnvVars(dotenvPath);

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      `https://api.openai.com/v1/embeddings`,
      {
        input: text,
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
    console.log("Generated embedding:", embedding);
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

async function processDocument(document: any) {
  const client = new MongoClient(MONGODB_CONNECTION_URI);
  const database = client.db(MONGODB_DATABASE_NAME);

  properties.forEach(async (property, index) => {
    const { title, description, introduction, location, review } = property; // document

    // Prepare text for embedding (combine or process fields as needed)
    const textToEmbed = `Title: ${title}\nDescription: ${description}\nIntroduction: ${introduction}\nLocation: ${location}\nReview: ${review}`;

    try {
      const embedding = await generateEmbedding(textToEmbed);

      const collection = database.collection<any>("embedded_content");
      const result = await collection.insertOne({
        ...property,
        embedding,
      });
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } catch (error) {
      console.error("Error processing document:", error);
    }
    return;
  });
}

// Run the script
processDocument(null);
