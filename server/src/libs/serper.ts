import { WebSource, ImageSource, HybridSearchResult } from "./types";
import { getLLMAnswer, getRelatedQuestions } from "./util";

const { SERPER_API_KEY } = process.env;

export const search = async (query: string): Promise<HybridSearchResult> => {
  if (!SERPER_API_KEY) {
    return { question: query, answer: "", webs: [], images: [], related: "" };
  }

  let webs: WebSource[] = [];
  let images: ImageSource[] = [];

  const url = "https://google.serper.dev/search";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query }),
    });

    const jsonResponse = await response.json();

    if (jsonResponse.knowledgeGraph) {
      const url =
        jsonResponse.knowledgeGraph.descriptionLink ||
        jsonResponse.knowledgeGraph.website;
      const snippet = jsonResponse.knowledgeGraph.description;
      if (url && snippet) {
        webs.push({
          title: jsonResponse.knowledgeGraph.title || "",
          url: url,
          content: snippet,
        });
      }
    }

    if (jsonResponse.answerBox) {
      const url = jsonResponse.answerBox.link;
      const snippet =
        jsonResponse.answerBox.snippet || jsonResponse.answerBox.answer;
      if (url && snippet) {
        webs.push({
          title: jsonResponse.answerBox.title || "",
          url: url,
          content: snippet,
        });
      }
    }

    if (jsonResponse.images) {
      images = jsonResponse.images
        .map((i: any) => ({
          title: i.title,
          url: i.link,
          image: i.imageUrl,
        }))
        .slice(0, 4);
    }

    webs = webs
      .concat(
        jsonResponse.organic.map((c: any) => ({
          title: c.title,
          url: c.link,
          content: c.snippet || "",
        }))
      )
      .slice(0, 6);
  } catch (error) {
    throw new Error("Error making the request");
  }

  let fullAnswer = "";
  console.time("llmanswer");
  await getLLMAnswer(query, webs, (msg: any) => {
    fullAnswer += msg;
  });
  console.timeEnd("llmanswer");
  console.log('full answer=', fullAnswer);

  let fullRelated = "";
  console.time("relatedquestion");
  await getRelatedQuestions(query, webs, (msg: any) => {
    fullRelated += msg;
  });
  console.timeEnd("relatedquestion");
  console.log('full related=', fullRelated);

  return {
    question: query,
    answer: fullAnswer,
    webs: webs,
    images: images,
    related: fullRelated,
  };
};
