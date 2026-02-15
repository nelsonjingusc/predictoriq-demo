import { ENV, assertChaingptConfigured } from '@/src/chaingpt/config/env';

export type ChatHistoryMode = 'on' | 'off';

export interface ChaingptChatOptions {
  question: string;
  chatHistory?: ChatHistoryMode;
  sdkUniqueId?: string;
  useCustomContext?: boolean;
  contextInjection?: Record<string, unknown>;
}

type ChaingptBlobResponse =
  | { status: true; data: { bot?: string } }
  | { status: false; message?: string };

/**
 * Non-streaming wrapper around ChainGPT's single endpoint:
 * POST https://api.chaingpt.org/chat/stream
 *
 * Docs: https://docs.chaingpt.org/dev-docs-b2b-saas-api-and-sdk/
 */
export async function chaingptChatBlob(opts: ChaingptChatOptions): Promise<string> {
  assertChaingptConfigured();

  const res = await fetch('https://api.chaingpt.org/chat/stream', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ENV.CHAINGPT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: ENV.CHAINGPT_MODEL,
      question: opts.question,
      chatHistory: opts.chatHistory ?? 'off',
      sdkUniqueId: opts.sdkUniqueId,
      useCustomContext: opts.useCustomContext ?? false,
      contextInjection: opts.contextInjection,
    }),
  });

  const text = await safeReadText(res);

  if (!res.ok) {
    throw new Error(`ChainGPT request failed (${res.status}): ${text || res.statusText}`);
  }

  // Attempt to parse as JSON first (modern/SDK behavior)
  try {
    const json = JSON.parse(text) as ChaingptBlobResponse;
    if (json && typeof json === 'object' && 'status' in json) {
      if (json.status === true) {
        return (json.data?.bot ?? '').toString();
      } else {
        throw new Error(json.message || 'ChainGPT returned status: false');
      }
    }
  } catch (e) {
    // If not JSON or doesn't match expected structure, but request was OK,
    // assume the text itself is the response (simple/legacy behavior)
    if (text.trim()) {
      return text.trim();
    }
  }

  throw new Error('ChainGPT returned an empty or unexpected response');
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

