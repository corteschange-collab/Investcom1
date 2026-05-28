import { SYSTEM_PROMPT } from "@/lib/ai-system-prompt";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-haiku-4.5";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AskAIOptions {
  model?: string;
  systemPrompt?: string;  // defaults to full InvestAI system prompt
  maxTokens?: number;
}

// Simple non-streaming call — returns the full text response.
export async function askAI(
  prompt: string,
  options: AskAIOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY não está definida no .env.local");

  const { model = DEFAULT_MODEL, systemPrompt = SYSTEM_PROMPT, maxTokens = 1024 } = options;

  const messages: Message[] = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter erro ${res.status}: ${text}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Resposta vazia da OpenRouter");

  return content as string;
}

// Multi-turn conversation — recebe array de mensagens.
export async function askAIWithHistory(
  messages: Message[],
  options: AskAIOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY não está definida no .env.local");

  const { model = DEFAULT_MODEL, systemPrompt, maxTokens = 1024 } = options;

  const fullMessages: Message[] = [];
  if (systemPrompt) fullMessages.push({ role: "system", content: systemPrompt });
  fullMessages.push(...messages);

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: fullMessages }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter erro ${res.status}: ${text}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Resposta vazia da OpenRouter");

  return content as string;
}
