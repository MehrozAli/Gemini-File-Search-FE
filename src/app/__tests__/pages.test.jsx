import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { API, demoStores, server } from '@/test/server';
import { renderWithClient } from '@/test/render';
import UploadPage from '../upload/page';
import SearchPage from '../search/page';
import StoreDetailPage from '../stores/[storeId]/page';

const navigation = vi.hoisted(() => ({ search: '', params: {} }));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(navigation.search),
  useParams: () => navigation.params,
  usePathname: () => '/',
}));

const [handbook] = demoStores;

function answerWith(text, sources = []) {
  server.use(
    http.post(`${API}/api/stores/${handbook.name}/query`, () => HttpResponse.json({ text, sources }))
  );
}

beforeEach(() => {
  navigation.search = '';
  navigation.params = {};
});

describe('upload page', () => {
  it('lets the user pick a store before showing the drop zone', async () => {
    const user = userEvent.setup();
    renderWithClient(<UploadPage />);

    const picker = await screen.findByRole('combobox', { name: 'Upload to store' });
    expect(screen.queryByText(/drag and drop/i)).not.toBeInTheDocument();

    await user.click(picker);
    await user.click(await screen.findByRole('option', { name: 'Supplier contracts' }));

    expect(await screen.findByText(/drag and drop/i)).toBeInTheDocument();
  });

  it('preselects the store from ?store=', async () => {
    navigation.search = `store=${encodeURIComponent(handbook.name)}`;
    renderWithClient(<UploadPage />);

    const picker = await screen.findByRole('combobox', { name: 'Upload to store' });
    expect(picker).toHaveTextContent('Employee handbook');
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });

  it('explains what to do when there are no stores', async () => {
    server.use(http.get(`${API}/api/stores`, () => HttpResponse.json({ stores: [] })));
    renderWithClient(<UploadPage />);
    expect(await screen.findByText(/create a store first/i)).toBeInTheDocument();
  });
});

describe('search page', () => {
  it('asks a question and renders the Markdown answer with its sources', async () => {
    navigation.search = `store=${encodeURIComponent(handbook.name)}`;
    answerWith('Full-time staff get **25 days** of annual leave.', [
      { title: 'handbook-2026.pdf' },
    ]);
    const user = userEvent.setup();
    renderWithClient(<SearchPage />);

    const input = await screen.findByRole('textbox', { name: /question/i });
    await user.type(input, 'How many leave days do I get?{Enter}');

    const conversation = await screen.findByRole('list', { name: 'Conversation' });
    expect(await within(conversation).findByText('25 days')).toHaveProperty('tagName', 'STRONG');
    expect(within(conversation).getByText('How many leave days do I get?')).toBeInTheDocument();
    expect(within(conversation).getByRole('button', { name: /sources/i })).toBeInTheDocument();
  });

  it('shows model output containing HTML as text, not markup', async () => {
    navigation.search = `store=${encodeURIComponent(handbook.name)}`;
    answerWith('Here: <img src="x" onerror="alert(1)">');
    const user = userEvent.setup();
    const { container } = renderWithClient(<SearchPage />);

    await user.type(await screen.findByRole('textbox', { name: /question/i }), 'hi{Enter}');
    await screen.findByText(/Here:/);
    expect(container.querySelector('img')).toBeNull();
  });

  it('shows the backend error under the question that failed', async () => {
    navigation.search = `store=${encodeURIComponent(handbook.name)}`;
    server.use(
      http.post(`${API}/api/stores/${handbook.name}/query`, () =>
        HttpResponse.json({ detail: [{ msg: 'prompt must not be empty' }] }, { status: 422 })
      )
    );
    const user = userEvent.setup();
    renderWithClient(<SearchPage />);

    await user.type(await screen.findByRole('textbox', { name: /question/i }), 'why?{Enter}');
    expect(await screen.findByRole('alert')).toHaveTextContent('prompt must not be empty');
    expect(screen.getByText('why?')).toBeInTheDocument();
  });

  it('asks the user to choose a store first', async () => {
    renderWithClient(<SearchPage />);
    expect(await screen.findByText(/select a store to search/i)).toBeInTheDocument();
  });
});

describe('store detail page', () => {
  it('renders answers in the query tab', async () => {
    navigation.params = { storeId: encodeURIComponent(handbook.name) };
    answerWith('Remote work needs manager approval.');
    const user = userEvent.setup();
    renderWithClient(<StoreDetailPage />);

    await user.click(await screen.findByRole('tab', { name: /query documents/i }));
    await user.type(screen.getByRole('textbox', { name: /question/i }), 'Can I work remotely?{Enter}');

    expect(await screen.findByText('Remote work needs manager approval.')).toBeInTheDocument();
  });

  it('reports an unknown store', async () => {
    navigation.params = { storeId: 'fileSearchStores%2Fmissing' };
    renderWithClient(<StoreDetailPage />);
    expect(await screen.findByText('Store not found')).toBeInTheDocument();
  });
});
