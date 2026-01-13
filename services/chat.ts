import type { NextApiRequest, NextApiResponse } from "next";

const SYSTEM_PROMPT = `You are Piano Buddy, a friendly and encouraging AI companion for piano players. Your personality is warm, supportive, and enthusiastic about piano.

Guidelines:
- Keep responses concise but helpful (2-4 paragraphs max unless they ask for detailed routines)
- Use a casual, friendly tone—like a supportive friend who happens to know a lot about piano
- Include occasional emojis but don't overdo it (1-2 per response max)
- When giving practice tips or routines, be specific and actionable
- Encourage and motivate, especially if they seem frustrated or unmotivated
- If they ask about something outside piano/music, gently redirect back to piano topics
- For warm-ups and exercises, break them into clear steps with time estimates
- Acknowledge that learning piano takes time and celebrate small wins

You're here to make piano practice feel less lonely and more fun!`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body as RequestBody;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Format messages for the LLM API
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    // TODO: Replace with your actual LLM API call
    // This is a placeholder that shows how to integrate with different providers

    // Option 1: OpenAI-compatible API (works with many providers)
    const response = await callLLM(formattedMessages);

    return res.status(200).json({ message: response });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Failed to get response" });
  }
}

async function callLLM(
  messages: { role: string; content: string }[]
): Promise<string> {
  const LLM_API_URL =
    process.env.LLM_API_URL || "http://localhost:11434/api/chat";
  const LLM_MODEL = process.env.LLM_MODEL || "llama3.2";

  // Check if we're using Ollama (local) or OpenAI-compatible API
  const isOllama =
    LLM_API_URL.includes("11434") || LLM_API_URL.includes("ollama");

  if (isOllama) {
    // Ollama format
    const response = await fetch(LLM_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.message?.content || "I couldn't generate a response.";
  } else {
    // OpenAI-compatible format (works with OpenAI, Groq, Together, etc.)
    const response = await fetch(LLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LLM_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content || "I couldn't generate a response."
    );
  }
}
