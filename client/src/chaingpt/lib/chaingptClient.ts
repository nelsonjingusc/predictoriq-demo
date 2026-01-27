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
 * Docs: https://docs.chaingpt.org/dev-docs-b2b-saas-api-and-sdk/web3-ai-chatbot-and-llm-api-and-sdk/javascript/quickstart-guide
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

  // Common failure modes:
  // 401 -> missing/bad key
  // 402/403 -> out of credits
  if (!res.ok) {
    const text = await safeReadText(res);
    throw new Error(`ChainGPT request failed (${res.status}): ${text || res.statusText}`);
  }

  const json = (await res.json()) as ChaingptBlobResponse;
  if (!('status' in json) || json.status !== true) {
    throw new Error('ChainGPT returned an unexpected response');
  }

  return (json.data?.bot ?? '').toString();
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

