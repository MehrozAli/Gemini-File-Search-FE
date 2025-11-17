import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { API, demoStores, server } from '@/test/server';
import { createStore, getStores, syncStore } from './stores';
import { queryStore } from './queries';
import { uploadFile } from './files';

describe('stores API', () => {
  it('unwraps the stores array', async () => {
    await expect(getStores()).resolves.toEqual(demoStores);
  });

  it('returns an empty list when the backend omits stores', async () => {
    server.use(http.get(`${API}/api/stores`, () => HttpResponse.json({})));
    await expect(getStores()).resolves.toEqual([]);
  });

  it('posts the display name when creating a store', async () => {
    let body;
    server.use(
      http.post(`${API}/api/stores`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ name: 'fileSearchStores/new', display_name: body.display_name });
      })
    );
    await createStore({ display_name: 'Board minutes' });
    expect(body).toEqual({ display_name: 'Board minutes' });
  });

  it('sends the sync body the backend expects', async () => {
    let body;
    server.use(
      http.post(`${API}/api/stores/fileSearchStores/abc/sync`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ ok: true });
      })
    );
    await syncStore('fileSearchStores/abc', 'Handbook');
    expect(body).toEqual({ document_name: '', display_name: 'Handbook' });
  });
});

describe('query API', () => {
  it('posts the prompt and returns the answer', async () => {
    server.use(
      http.post(`${API}/api/stores/fileSearchStores/abc/query`, async ({ request }) => {
        const { prompt } = await request.json();
        return HttpResponse.json({ text: `echo: ${prompt}`, sources: [] });
      })
    );
    await expect(queryStore('fileSearchStores/abc', { prompt: 'hi' })).resolves.toEqual({
      text: 'echo: hi',
      sources: [],
    });
  });
});

describe('upload API', () => {
  it('sends the file as multipart form data', async () => {
    let fileName;
    server.use(
      http.post(`${API}/api/stores/fileSearchStores/abc/files`, async ({ request }) => {
        const form = await request.formData();
        fileName = form.get('file').name;
        return HttpResponse.json({ status: 'uploaded' });
      })
    );
    const file = new File(['leave policy'], 'policy.txt', { type: 'text/plain' });
    await expect(uploadFile('fileSearchStores/abc', file)).resolves.toEqual({ status: 'uploaded' });
    expect(fileName).toBe('policy.txt');
  });
});
