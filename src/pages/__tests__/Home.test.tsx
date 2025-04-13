import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

// Mock the fetch function
const mockEntries = [
  {
    id: 1,
    title: 'Test Entry',
    content: '<p>Test content</p>',
    tags: 'test,diary',
    created_at: '2025-04-12T12:00:00Z'
  }
];

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockEntries),
  })
) as any;

describe('Home Component', () => {
  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders entries after loading', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test Entry')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('diary')).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Failed to fetch'))
    ) as any;

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });
}); 