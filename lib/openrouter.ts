/**
 * OpenRouter API client for WinTech AI Agency
 * Uses free models for zero-cost AI inference
 */

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

// Free models available on OpenRouter
export const FREE_MODELS = {
  // Fast & capable
  HERMES_3: 'nousresearch/hermes-3-llama-3.1-405b:free',
  // Lightweight
  PHI_3: 'microsoft/phi-3-medium-128k-instruct:free',
  // Code
  CODELLAMA: 'meta-llama/llama-3.1-70b-instruct:free',
  // Default for WinTech
  DEFAULT: 'nousresearch/hermes-3-llama-3.1-405b:free',
} as const;

export async function chatCompletion(options: ChatOptions) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const {
    messages,
    model = FREE_MODELS.DEFAULT,
    maxTokens = 1000,
    temperature = 0.7,
    stream = true,
  } = options;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://wintech.agency',
      'X-Title': 'WinTech AI Agency',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${errorText}`);
  }

  return response;
}

export async function chatCompletionJSON(options: Omit<ChatOptions, 'stream'>) {
  const response = await chatCompletion({ ...options, stream: false });
  return response.json();
}
