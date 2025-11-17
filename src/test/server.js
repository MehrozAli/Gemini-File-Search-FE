import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const API = 'http://127.0.0.1:8000';

export const demoStores = [
  {
    name: 'fileSearchStores/handbook-7f3a',
    display_name: 'Employee handbook',
    create_time: '2026-03-02T09:15:00Z',
    state: 'ACTIVE',
  },
  {
    name: 'fileSearchStores/contracts-91bc',
    display_name: 'Supplier contracts',
    create_time: '2026-04-18T14:40:00Z',
    state: 'ACTIVE',
  },
];

export const handlers = [
  http.get(`${API}/api/stores`, () => HttpResponse.json({ stores: demoStores })),
];

export const server = setupServer(...handlers);
