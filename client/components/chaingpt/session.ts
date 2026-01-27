export function getOrCreateChatSessionId(storageKey: string): string {
  if (typeof window === 'undefined') return 'server';

  const existing = window.sessionStorage.getItem(storageKey);
  if (existing) return existing;

  // Use crypto.randomUUID if available; otherwise fallback.
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `sess_${Math.random().toString(16).slice(2)}_${Date.now()}`;

  window.sessionStorage.setItem(storageKey, id);
  return id;
}

