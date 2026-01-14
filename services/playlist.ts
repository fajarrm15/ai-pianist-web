import type { NextApiRequest, NextApiResponse } from "next";

const SYSTEM_PROMPT = `You are a knowledgeable piano music curator. When given a mood and optional situation, recommend 4-5 piano pieces that perfectly match.

For each piece, provide:
- title: The piece name
- composer: The composer's name
- why: A short, warm explanation of why this piece fits the mood (1-2 sentences, be specific about the music)
- difficulty: One of "Beginner", "Intermediate", "Advanced" (optional, include for well-known pieces)
- youtubeSearch: A search query to find this piece on YouTube (e.g., "Debussy Clair de Lune piano")

Guidelines:
- Mix well-known classics with some lesser-known gems
- Include a variety of eras and styles when possible
- Keep the "why" explanations personal and evocative, not clinical
- Consider the situation context if provided
- Be encouraging—these recommendations should feel like a friend sharing their favorites

Respond in JSON format only, no markdown or explanation:
{
  "intro": "A brief, warm intro message about the playlist (1 sentence)",
  "pieces": [
    {
      "title": "...",
      "composer": "...",
      "why": "...",
      "difficulty": "...",
      "youtubeSearch": "..."
    }
  ]
}`;

interface RequestBody {
  mood: string;
  situation?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { mood, situation } = req.body as RequestBody;

    if (!mood) {
      return res.status(400).json({ error: "Mood is required" });
    }

    let userMessage = `I'm feeling ${mood}`;
    if (situation) {
      userMessage += ` and I'm ${situation}`;
    }
    userMessage += ". What piano pieces would you recommend?";

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];

    const response = await callLLM(messages);

    // Parse the JSON response
    let parsed;
    try {
      // Clean up potential markdown formatting
      const cleaned = response
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse LLM response:", response);
      console.error("Error Code: ", parseError);
      throw new Error("Invalid response format");
    }

    return res.status(200).json({
      mood,
      situation,
      intro: parsed.intro,
      pieces: parsed.pieces,
    });
  } catch (error) {
    console.error("Playlist API error:", error);
    return res.status(500).json({ error: "Failed to generate playlist" });
  }
}

async function callLLM(
  messages: { role: string; content: string }[]
): Promise<string> {
  const LLM_API_URL =
    process.env.LLM_API_URL || "http://localhost:11434/api/chat";
  const LLM_MODEL = process.env.LLM_MODEL || "llama3.2";

  const isOllama =
    LLM_API_URL.includes("11434") || LLM_API_URL.includes("ollama");

  if (isOllama) {
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
    return data.message?.content || "";
  } else {
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
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }
}
