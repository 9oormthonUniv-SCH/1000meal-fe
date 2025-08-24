'use client';

import { useCallback } from "react";

const KEY = "signup_draft_v1";

export type SignupDraft = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  agreeTos?: boolean;
  agreePrivacy?: boolean;
};

export function useSignupDraft() {
  const get = useCallback((): SignupDraft => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as SignupDraft) : {};
    } catch {
      return {};
    }
  }, []);

  const set = useCallback((patch: Partial<SignupDraft>) => {
    const cur = get();
    const next = { ...cur, ...patch };
    localStorage.setItem(KEY, JSON.stringify(next));
  }, [get]);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
  }, []);

  return { get, set, clear };
}