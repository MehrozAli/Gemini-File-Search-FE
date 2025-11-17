import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { API, server } from '@/test/server';
import { clientWrapper } from '@/test/render';
import { saveSystemPrompt } from '@/lib/systemPrompt';
import { MAX_HISTORY_MESSAGES, useStoreConversation } from './useQueryStore';

const STORE = 'fileSearchStores/handbook-7f3a';

function captureQueries() {
  const bodies = [];
  server.use(
    http.post(`${API}/api/stores/${STORE}/query`, async ({ request }) => {
      const body = await request.json();
      bodies.push(body);
      return HttpResponse.json({
        text: `answer ${bodies.length}`,
        sources: [{ title: 'handbook.pdf' }],
      });
    })
  );
  return bodies;
}

async function ask(result, prompt) {
  act(() => result.current.sendPrompt(prompt));
  await waitFor(() => expect(result.current.isPending).toBe(false));
}

describe('useStoreConversation', () => {
  it('records the exchange and sends earlier turns as history', async () => {
    const bodies = captureQueries();
    const { result } = renderHook(() => useStoreConversation(STORE), { wrapper: clientWrapper() });

    await ask(result, 'How many leave days?');
    await ask(result, 'And for part-time staff?');

    expect(bodies[0]).toEqual({ prompt: 'How many leave days?' });
    expect(bodies[1].conversation_history).toEqual([
      { role: 'user', content: 'How many leave days?' },
      { role: 'model', content: 'answer 1' },
    ]);
    expect(result.current.messages.at(-1)).toEqual({
      role: 'model',
      content: 'answer 2',
      sources: [{ title: 'handbook.pdf' }],
    });
  });

  it(`sends at most ${MAX_HISTORY_MESSAGES} history messages`, async () => {
    const bodies = captureQueries();
    const { result } = renderHook(() => useStoreConversation(STORE), { wrapper: clientWrapper() });

    for (let i = 1; i <= 7; i += 1) {
      await ask(result, `question ${i}`);
    }

    const history = bodies.at(-1).conversation_history;
    expect(history).toHaveLength(MAX_HISTORY_MESSAGES);
    expect(history[0]).toEqual({ role: 'user', content: 'question 2' });
  });

  it('includes the saved system prompt', async () => {
    const bodies = captureQueries();
    saveSystemPrompt('Answer in one sentence.');
    const { result } = renderHook(() => useStoreConversation(STORE), { wrapper: clientWrapper() });

    await ask(result, 'Summarise the policy');
    expect(bodies[0].system_prompt).toBe('Answer in one sentence.');
  });

  it('keeps the question visible when the request fails', async () => {
    server.use(
      http.post(`${API}/api/stores/${STORE}/query`, () =>
        HttpResponse.json({ detail: 'Gemini quota exceeded' }, { status: 429 })
      )
    );
    const { result } = renderHook(() => useStoreConversation(STORE), { wrapper: clientWrapper() });

    await ask(result, 'Will this fail?');
    expect(result.current.messages).toEqual([]);
    expect(result.current.pendingPrompt).toBe('Will this fail?');
    expect(result.current.error).toBeTruthy();

    act(() => result.current.clearConversation());
    expect(result.current.pendingPrompt).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('ignores blank prompts and missing stores', () => {
    const { result } = renderHook(() => useStoreConversation(''), { wrapper: clientWrapper() });
    act(() => result.current.sendPrompt('hello'));
    expect(result.current.isPending).toBe(false);
  });
});
