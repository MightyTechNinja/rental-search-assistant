import path from "path";
import fs from "fs";
import axios from "axios";
import { loadEnvVars } from "./loadEnvVars";
import { properties } from "./properties";

// Load project environment variables
const dotenvPath = path.join(__dirname, "..", "..", "..", ".env"); // .env at project root
const { OPENAI_API_KEY, OPENAI_EMBEDDING_MODEL } = loadEnvVars(dotenvPath);

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
  const propertiesWithEmbedding: any[] = [];
  properties.forEach(async (property, index) => {
    const { title, description, introduction, location, reviews } = property; // document

    const review = reviews.join("\n");

    // Prepare text for embedding (combine or process fields as needed)
    const textToEmbed = `Title: ${title}\nDescription: ${description}\nIntroduction: ${introduction}\nLocation: ${location}\nReview: ${review}`;

    try {
      const embedding = await generateEmbedding(textToEmbed);
      propertiesWithEmbedding.push({ ...property, embedding });
    } catch (error) {
      console.error("Error processing document:", error);
    }

    if (index === properties.length - 1) {
      fs.writeFile(
        "propertiesWithEmbedding.json",
        JSON.stringify(propertiesWithEmbedding),
        "utf8",
        () => {}
      );
    }
  });
}

// Run the script
processDocument(null);
