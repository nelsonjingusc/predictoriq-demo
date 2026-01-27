export const ENV = {
  CHAINGPT_API_KEY: process.env.CHAINGPT_API_KEY ?? '',
  CHAINGPT_MODEL: process.env.CHAINGPT_MODEL ?? 'general_assistant',
} as const;

export function assertChaingptConfigured() {
  if (!ENV.CHAINGPT_API_KEY) {
    throw new Error('CHAINGPT_API_KEY is not set');
  }
}

