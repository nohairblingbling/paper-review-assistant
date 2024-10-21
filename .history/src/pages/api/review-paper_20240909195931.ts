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
    const {
      pdfText,
      field,
      reviewFocus,
      paperType,
      detailedReview,
      outputLanguage,
      strictnessLevel,
      additionalRequirements,
      apiConfig,
    } = req.body;

    const prompt = `As an experienced academic paper reviewer, please carefully review the following paper and provide detailed feedback. Consider the following aspects:

1. Field: ${field}
2. Focus: ${reviewFocus}
3. Paper Type: ${paperType}
4. Detail Level: ${detailedReview}
5. Output Language: ${outputLanguage}
6. Strictness Level: ${strictnessLevel}
7. Additional Requirements: ${additionalRequirements}

Please structure your review as follows:

# Overall Evaluation: Briefly assess the paper's overall quality and contribution.
# Major Strengths: List the main strengths and innovative aspects of the paper.
# Major Weaknesses: Point out the main issues and shortcomings of the paper.
# Specific Comments:
   ## Introduction: Evaluate the clarity and relevance of the research background, problem statement, and research objectives.
   ## Methodology: Assess the appropriateness, innovation, and rigor of the research methods.
   ## Results: Evaluate the reliability, validity, and presentation of the results.
   ## Discussion: Assess the author's interpretation of results, comparison with existing literature, and recognition of research limitations.
   ## Conclusion: Evaluate the reasonableness of the conclusion and its contribution to the field.
   ## Detailed Revision Suggestions: Provide specific revision suggestions, including language expression and formatting.
# Final Recommendation: Give your final recommendation for this paper (Accept, Minor Revision, Major Revision, or Reject).

Please provide your professional review based on the above information.`;

    try {
      const reviewContent = await callAI(apiConfig, prompt);

      if (!reviewContent) {
        throw new Error("Failed to generate review content");
      }

      res.status(200).json({ review: reviewContent });
    } catch (error) {
      console.error("Review failed:", error);
      res.status(500).json({ error: "Failed to generate review" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
