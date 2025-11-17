import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { API, demoStores, server } from '@/test/server';
import { renderWithClient } from '@/test/render';
import { StoreList } from '../StoreList';
import { CreateStoreModal } from '../CreateStoreModal';

describe('StoreList', () => {
  it('shows an empty state', () => {
    renderWithClient(<StoreList stores={[]} isLoading={false} />);
    expect(screen.getByText('No stores yet')).toBeInTheDocument();
  });

  it('shows an error state', () => {
    renderWithClient(<StoreList stores={undefined} isLoading={false} error={new Error('down')} />);
    expect(screen.getByRole('alert')).toHaveTextContent(/failed to load stores/i);
  });

  it('links each store to its search page', () => {
    renderWithClient(<StoreList stores={demoStores} isLoading={false} />);
    const links = screen.getAllByRole('link', { name: /search/i });
    expect(links[0]).toHaveAttribute(
      'href',
      `/search?store=${encodeURIComponent(demoStores[0].name)}`
    );
  });
});

describe('CreateStoreModal', () => {
  it('requires a display name', async () => {
    const user = userEvent.setup();
    renderWithClient(<CreateStoreModal open onOpenChange={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Create Store' }));
    expect(await screen.findByText('Display name is required')).toBeInTheDocument();
  });

  it('creates the store and closes', async () => {
    let body;
    server.use(
      http.post(`${API}/api/stores`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ name: 'fileSearchStores/new' });
      })
    );
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderWithClient(<CreateStoreModal open onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText('Display Name'), 'Board minutes');
    await user.click(screen.getByRole('button', { name: 'Create Store' }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(body).toEqual({ display_name: 'Board minutes' });
  });

  it('stays open when the backend rejects the store', async () => {
    server.use(
      http.post(`${API}/api/stores`, () =>
        HttpResponse.json({ detail: 'Gemini API key invalid' }, { status: 500 })
      )
    );
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderWithClient(<CreateStoreModal open onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText('Display Name'), 'Board minutes');
    await user.click(screen.getByRole('button', { name: 'Create Store' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Create Store' })).toBeEnabled());
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
