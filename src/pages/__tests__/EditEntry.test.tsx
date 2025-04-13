import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditEntry from '../EditEntry';

const mockNavigate = vi.fn();
const mockParams = { id: '1' };

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

describe('EditEntry Component', () => {
  const mockEntry = {
    id: 1,
    title: 'Test Entry',
    content: 'Test Content',
    tags: 'test,diary',
    created_at: '2024-03-20T12:00:00Z',
  };

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEntry),
      })
    ) as any;
  });

  it('loads and displays entry data', async () => {
    render(
      <BrowserRouter>
        <EditEntry />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('Test Entry');
      expect(screen.getByLabelText(/tags/i)).toHaveValue('test,diary');
    });
  });

  it('handles form submission', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
      })
    ) as any;

    render(
      <BrowserRouter>
        <EditEntry />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Updated Title' },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error when submission fails', async () => {
    render(
      <BrowserRouter>
        <EditEntry />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });

    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Failed to update'))
    ) as any;

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('handles cancel button click', async () => {
    render(
      <BrowserRouter>
        <EditEntry />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/cancel/i));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
}); 