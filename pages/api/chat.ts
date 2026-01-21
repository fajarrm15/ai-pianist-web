import type { NextApiRequest, NextApiResponse } from "next";
import { CHAT_SYSTEM_PROMPT } from "@/const";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  warmup?: boolean;
}

export const config = {
  runtime: "nodejs",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, warmup } = req.body as RequestBody;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const apiUrl = process.env.LLM_API_URL;
    const apiKey = process.env.LLM_API_KEY;
    const model = process.env.LLM_MODEL || "llama-3.3-70b-versatile";

    if (!apiUrl || !apiKey) {
      return res.status(500).json({ error: "LLM not configured" });
    }

    // Format messages for the LLM API
    const llmMessages = [
      { role: "system", content: CHAT_SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // For warmup requests, use minimal tokens
    if (warmup) {
      const warmupResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: llmMessages,
          max_tokens: 1,
        }),
      });

      if (warmupResponse.ok) {
        return res.status(200).json({ message: "ready", warmedUp: true });
      }
      return res.status(500).json({ error: "Warmup failed" });
    }

    // Streaming request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: llmMessages,
        max_tokens: 1024,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("LLM Error:", error);
      return res.status(500).json({ error: "Failed to get response" });
    }

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      return res.status(500).json({ error: "No response body" });
    }

    // Read and forward the stream
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        res.write("data: [DONE]\n\n");
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);

          if (data === "[DONE]") {
            res.write("data: [DONE]\n\n");
            break;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;

            if (content) {
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
    }

    res.end();
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Failed to get response" });
  }
}
