import { render, screen, waitFor } from '@testing-library/react';
import Login from './login';
import { userEvent } from '@testing-library/user-event';
import { useAuth } from '@task-master/client/context';
import { Mock, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@task-master/client/context', () => ({
  useAuth: vi.fn(() => ({
    onLogin: vi.fn(),
    isLoggingIn: false,
  })),
}));

describe('Login test suite', () => {
  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Login' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('displays error messages when fields are empty', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('displays error message when email is invalid', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'invalid-email');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(
        screen.getByText('Entered value does not match an email format')
      ).toBeInTheDocument();
    });
  });

  it('calls onLogin with correct credentials', async () => {
    const mockOnLogin = vi.fn();
    (useAuth as Mock).mockImplementation(() => ({
      onLogin: mockOnLogin,
      isLoggingIn: false,
    }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });

  it('displays "Logging in..." when isLoggingIn is true', async () => {
    const mockOnLogin = vi.fn();
    (useAuth as Mock).mockImplementation(() => ({
      onLogin: mockOnLogin,
      isLoggingIn: true,
    }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', { name: 'Logging in...' })
    ).toBeInTheDocument();
  });
});
