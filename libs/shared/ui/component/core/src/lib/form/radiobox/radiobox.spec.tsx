import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import { Radiobox } from './radiobox';

describe('Radiobox component', () => {
  it('renders radiobox with label', () => {
    render(
      <Radiobox onChange={() => null} option={{ value: 'red', label: 'Red' }} />
    );

    const label = screen.getByText(/Red/i);
    const input = screen.getByRole('radio');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('renders radiobox with error', () => {
    render(
      <Radiobox
        option={{ value: 'red', label: 'Red' }}
        error
        onChange={() => null}
      />
    );

    const label = screen.getByText(/Red/i);

    expect(label.parentElement).toHaveClass('border-red-500');
  });

  it('renders radiobox with label style', () => {
    render(
      <Radiobox
        option={{ value: 'red', label: 'Red' }}
        labelStyle={{ color: 'red' }}
        onChange={() => null}
      />
    );

    const label = screen.getByText(/Red/i);

    expect(label.parentElement).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('calls onChange', async () => {
    const handleChange = fn();
    render(
      <Radiobox
        option={{ value: 'red', label: 'Red' }}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('radio');

    await userEvent.click(input);
    expect(handleChange).toHaveBeenCalled();
  });

  // radiobox should be checked/unchecked based on value
  it('renders radiobox checked', async () => {
    const color = {
      value: 'red',
    };

    const handleChange = fn((e: React.ChangeEvent<HTMLInputElement>) => {
      color.value = e.target.value;
    });

    const { rerender } = render(
      <div>
        <Radiobox
          option={{ value: 'red', label: 'Red' }}
          onChange={handleChange}
          value={color.value}
        />
        <Radiobox
          option={{ value: 'blue', label: 'Blue' }}
          onChange={handleChange}
          value={color.value}
        />
      </div>
    );

    const red = screen.getByLabelText(/Red/i);
    const blue = screen.getByLabelText(/Blue/i);

    expect(red).toHaveProperty('checked', true);
    expect(blue).toHaveProperty('checked', false);

    await userEvent.click(blue);
    expect(handleChange).toHaveBeenCalled();

    rerender(
      <div>
        <Radiobox
          option={{ value: 'red', label: 'Red' }}
          onChange={handleChange}
          value={color.value}
        />
        <Radiobox
          option={{ value: 'blue', label: 'Blue' }}
          onChange={handleChange}
          value={color.value}
        />
      </div>
    );

    expect(red).toHaveProperty('checked', false);
    expect(blue).toHaveProperty('checked', true);
  });
});
