import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

async function callAI(apiConfig: any, prompt: string) {
  const { provider, apiKey, apiBase, apiModel } = apiConfig;
  let apiUrl = "";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };

  if (apiBase) {
    apiUrl = `${apiBase}/v1/${provider === "openai" ? "chat/completions" : "messages"}`;
  } else {
    apiUrl = provider === "openai"
      ? "https://api.openai.com/v1/chat/completions"
      : "https://api.anthropic.com/v1/messages";
  }

  const body = {
    model: apiModel || (provider === "openai" ? "gpt-3.5-turbo" : "claude-3-opus-20240229"),
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(apiUrl, body, { headers });
    return provider === "openai" 
      ? response.data.choices[0]?.message?.content
      : response.data.completion;
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { text, apiConfig } = req.body;

    const prompt = `Please polish the following text to improve its clarity, coherence, and academic style:

${text}

Please provide the polished version of the text.`;

    try {
      const polishedText = await callAI(apiConfig, prompt);

      if (!polishedText) {
        throw new Error("Failed to generate polished text");
      }

      res.status(200).json({ polishedText });
    } catch (error) {
      console.error("Text polishing failed:", error);
      res.status(500).json({ error: "Failed to polish text" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
