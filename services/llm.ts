// ============== LLM CONFIGURATION ==============

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMConfig {
  maxTokens?: number;
  temperature?: number;
}

// Supported LLM providers
export type LLMProvider =
  | "ollama"
  | "openai"
  | "anthropic"
  | "groq"
  | "together"
  | "runpod"
  | "replicate";

// ============== LLM SERVICE ==============

/**
 * Detects the LLM provider based on the API URL
 */
function detectProvider(apiUrl: string): LLMProvider {
  if (apiUrl.includes("11434") || apiUrl.includes("ollama")) return "ollama";
  if (apiUrl.includes("anthropic")) return "anthropic";
  if (apiUrl.includes("groq")) return "groq";
  if (apiUrl.includes("together")) return "together";
  // RunPod with /openai/ path uses OpenAI-compatible format
  if (apiUrl.includes("runpod") && apiUrl.includes("/openai/")) return "openai";
  // RunPod without /openai/ uses native RunPod format
  if (apiUrl.includes("runpod")) return "runpod";
  if (apiUrl.includes("replicate")) return "replicate";
  return "openai"; // Default to OpenAI-compatible format
}

/**
 * Call Ollama API (local LLM)
 */
async function callOllama(
  apiUrl: string,
  model: string,
  messages: LLMMessage[],
  config: LLMConfig,
): Promise<string> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature: config.temperature ?? 0.7,
        num_predict: config.maxTokens ?? 1024,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.message?.content || "";
}

/**
 * Call Anthropic API (Claude)
 */
async function callAnthropic(
  apiUrl: string,
  apiKey: string,
  model: string,
  messages: LLMMessage[],
  config: LLMConfig,
): Promise<string> {
  // Extract system message
  const systemMessage = messages.find((m) => m.role === "system");
  const chatMessages = messages.filter((m) => m.role !== "system");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: config.maxTokens ?? 1024,
      system: systemMessage?.content || "",
      messages: chatMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || "";
}

/**
 * Call OpenAI-compatible API (OpenAI, Groq, Together, etc.)
 */
async function callOpenAICompatible(
  apiUrl: string,
  apiKey: string,
  model: string,
  messages: LLMMessage[],
  config: LLMConfig,
): Promise<string> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: config.maxTokens ?? 1024,
      temperature: config.temperature ?? 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Call RunPod Serverless API
 */
async function callRunPod(
  apiUrl: string,
  apiKey: string,
  model: string,
  messages: LLMMessage[],
  config: LLMConfig,
): Promise<string> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: {
        messages,
        model,
        max_tokens: config.maxTokens ?? 1024,
        temperature: config.temperature ?? 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RunPod API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Handle async job (cold start may cause IN_QUEUE status)
  if (data.status === "IN_QUEUE" || data.status === "IN_PROGRESS") {
    return await pollRunPodResult(data.id, apiKey);
  }

  return (
    data.output?.choices?.[0]?.message?.content ||
    data.output?.content ||
    data.output ||
    ""
  );
}

/**
 * Poll RunPod for async job result
 */
async function pollRunPodResult(
  jobId: string,
  apiKey: string,
): Promise<string> {
  const statusUrl = `https://api.runpod.ai/v2/status/${jobId}`;
  const maxAttempts = 60; // 60 seconds max wait

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(statusUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const data = await response.json();

    if (data.status === "COMPLETED") {
      return (
        data.output?.choices?.[0]?.message?.content ||
        data.output?.content ||
        data.output ||
        ""
      );
    }

    if (data.status === "FAILED") {
      throw new Error(`RunPod job failed: ${data.error}`);
    }
  }

  throw new Error("RunPod job timed out");
}

/**
 * Call Replicate API
 */
async function callReplicate(
  apiUrl: string,
  apiKey: string,
  model: string,
  messages: LLMMessage[],
  config: LLMConfig,
): Promise<string> {
  // Format messages into a prompt string for Replicate
  const prompt = messages
    .map((m) => {
      if (m.role === "system") return `System: ${m.content}`;
      if (m.role === "user") return `User: ${m.content}`;
      return `Assistant: ${m.content}`;
    })
    .join("\n\n");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      version: model, // Replicate uses version hash
      input: {
        prompt: prompt + "\n\nAssistant:",
        max_tokens: config.maxTokens ?? 1024,
        temperature: config.temperature ?? 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Replicate API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Replicate returns a prediction URL, need to poll for result
  if (data.urls?.get) {
    return await pollReplicateResult(data.urls.get, apiKey);
  }

  return data.output?.join("") || "";
}

/**
 * Poll Replicate for prediction result
 */
async function pollReplicateResult(
  url: string,
  apiKey: string,
): Promise<string> {
  const maxAttempts = 60;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(url, {
      headers: { Authorization: `Token ${apiKey}` },
    });

    const data = await response.json();

    if (data.status === "succeeded") {
      return Array.isArray(data.output)
        ? data.output.join("")
        : data.output || "";
    }

    if (data.status === "failed") {
      throw new Error(`Replicate prediction failed: ${data.error}`);
    }
  }

  throw new Error("Replicate prediction timed out");
}

/**
 * Main LLM call function - automatically detects provider and calls appropriate API
 */
export async function callLLM(
  messages: LLMMessage[],
  config: LLMConfig = {},
): Promise<string> {
  const apiUrl = process.env.LLM_API_URL || "http://localhost:11434/api/chat";
  const apiKey = process.env.LLM_API_KEY || "";
  const model = process.env.LLM_MODEL || "llama3.2";

  const provider = detectProvider(apiUrl);

  try {
    switch (provider) {
      case "ollama":
        return await callOllama(apiUrl, model, messages, config);

      case "anthropic":
        return await callAnthropic(apiUrl, apiKey, model, messages, config);

      case "runpod":
        return await callRunPod(apiUrl, apiKey, model, messages, config);

      case "replicate":
        return await callReplicate(apiUrl, apiKey, model, messages, config);

      case "openai":
      case "groq":

      case "together":
      default:
        return await callOpenAICompatible(
          apiUrl,
          apiKey,
          model,
          messages,
          config,
        );
    }
  } catch (error) {
    console.error(`LLM call failed (${provider}):`, error);
    throw error;
  }
}

/**
 * Parse JSON from LLM response, handling potential markdown formatting
 */
export function parseLLMJson<T>(response: string): T {
  // Remove markdown code blocks if present
  const cleaned = response
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  return JSON.parse(cleaned);
}
