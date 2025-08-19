// src/lib/useSignupDraft.ts
'use client';

import { useCallback } from 'react';

const KEY = 'signup_draft_v1';

export type SignupDraft = {
  id?: string;
  password?: string;
  email?: string;
  agreeTos?: boolean;       // [필수] 이용약관 동의
  agreePrivacy?: boolean;   // [필수] 개인정보 수집/이용 동의
};

export function readDraft(): SignupDraft {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function writeDraft(next: SignupDraft) {
  sessionStorage.setItem(KEY, JSON.stringify(next));
}

export function clearDraft() {
  sessionStorage.removeItem(KEY);
}

export function useSignupDraft() {
  const set = useCallback((patch: Partial<SignupDraft>) => {
    const cur = readDraft();
    writeDraft({ ...cur, ...patch });
  }, []);

  const get = useCallback(() => readDraft(), []);
  const clear = useCallback(() => clearDraft(), []);

  return { set, get, clear };
}