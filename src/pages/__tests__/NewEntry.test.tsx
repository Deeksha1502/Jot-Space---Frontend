import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewEntry from '../NewEntry';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('NewEntry Component', () => {
  it('renders the form elements', () => {
    render(
      <BrowserRouter>
        <NewEntry />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
      })
    ) as any;

    render(
      <BrowserRouter>
        <NewEntry />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' },
    });

    fireEvent.change(screen.getByLabelText(/tags/i), {
      target: { value: 'test,diary' },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error when submission fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Failed to save'))
    ) as any;

    render(
      <BrowserRouter>
        <NewEntry />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
}); 