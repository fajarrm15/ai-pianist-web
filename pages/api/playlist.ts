import type { NextApiRequest, NextApiResponse } from "next";
import { callLLM, parseLLMJson, type LLMMessage } from "@/services";
import { PLAYLIST_SYSTEM_PROMPT } from "@/const";

interface RequestBody {
  mood: string;
  situation?: string;
  warmup?: boolean;
}

interface PieceRecommendation {
  title: string;
  composer: string;
  why: string;
  difficulty?: string;
  youtubeSearch?: string;
}

interface LLMPlaylistResponse {
  intro: string;
  pieces: PieceRecommendation[];
}

interface SuccessResponse {
  mood: string;
  situation?: string;
  intro: string;
  pieces: PieceRecommendation[];
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
    const { mood, situation, warmup } = req.body as RequestBody;

    if (!mood) {
      return res.status(400).json({ error: "Mood is required" });
    }

    // Build user message
    let userMessage = `I'm feeling ${mood}`;
    if (situation) {
      userMessage += ` and I'm ${situation}`;
    }
    userMessage += ". What piano pieces would you recommend?";

    const messages: LLMMessage[] = [
      { role: "system", content: PLAYLIST_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];

    // For warmup, use minimal tokens to just wake up the GPU
    const response = await callLLM(messages, {
      temperature: 0.8,
      maxTokens: warmup ? 1 : 1024,
    });

    // For warmup, return early with minimal response
    if (warmup) {
      return res.status(200).json({
        mood,
        intro: "ready",
        pieces: [],
        warmedUp: true,
      });
    }

    // Parse the JSON response
    let parsed: LLMPlaylistResponse;
    try {
      parsed = parseLLMJson<LLMPlaylistResponse>(response);
    } catch (parseError) {
      console.error("Failed to parse LLM response:", response);
      throw new Error("Invalid response format from LLM");
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
