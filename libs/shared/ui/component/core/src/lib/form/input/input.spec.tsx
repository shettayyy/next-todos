import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';
import { fn } from 'jest-mock';

describe('Input component', () => {
  it('renders input with label', () => {
    render(<Input label="Name" />);

    const label = screen.getByText(/Name/i);
    const input = screen.getByRole('textbox');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter your name" />);

    const input = screen.getByPlaceholderText(/Enter your name/i);

    expect(input).toBeInTheDocument();
  });

  it('renders input with value', () => {
    render(<Input value="John Doe" onChange={() => null} />);

    const input = screen.getByDisplayValue(/John Doe/i);

    expect(input).toBeInTheDocument();
  });

  it('calls onChange', async () => {
    const handleChange = fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'John Doe');
    expect(handleChange).toHaveBeenCalled();
  });
});
