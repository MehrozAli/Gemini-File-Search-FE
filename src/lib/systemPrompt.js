'use client';

import { useSyncExternalStore } from 'react';

const SYSTEM_PROMPT_KEY = 'fileSearch_systemPrompt';
const listeners = new Set();

export function getSavedSystemPrompt() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(SYSTEM_PROMPT_KEY) ?? '';
}

export function saveSystemPrompt(value) {
  if (value) {
    window.localStorage.setItem(SYSTEM_PROMPT_KEY, value);
  } else {
    window.localStorage.removeItem(SYSTEM_PROMPT_KEY);
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  // Keeps other open tabs in sync with the saved prompt.
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

export function useSavedSystemPrompt() {
  return useSyncExternalStore(subscribe, getSavedSystemPrompt, () => '');
}
