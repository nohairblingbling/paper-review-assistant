import type { NextApiRequest, NextApiResponse } from "next";
import { callAI } from "../../utils/ai";

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

