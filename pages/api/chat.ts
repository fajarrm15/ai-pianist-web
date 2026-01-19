import type { NextApiRequest, NextApiResponse } from "next";
import { callLLM, type LLMMessage } from "@/services";
import { CHAT_SYSTEM_PROMPT } from "@/const";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  warmup?: boolean;
}

interface SuccessResponse {
  message: string;
  warmedUp?: boolean;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, warmup } = req.body as RequestBody;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Format messages for the LLM API
    const llmMessages: LLMMessage[] = [
      { role: "system", content: CHAT_SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // For warmup requests, use minimal tokens to just wake up the GPU
    const response = await callLLM(llmMessages, {
      temperature: 0.7,
      maxTokens: warmup ? 1 : 1024,
    });

    // For warmup, return early with minimal response
    if (warmup) {
      return res.status(200).json({ message: "ready", warmedUp: true });
    }

    return res.status(200).json({ message: response });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Failed to get response" });
  }
}
