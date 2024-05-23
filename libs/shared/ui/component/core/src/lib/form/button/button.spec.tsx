import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';
import { fn } from 'jest-mock';

describe('Button component', () => {
  it('renders button and calls onClick', async () => {
    const handleClick = fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /Click me/i });

    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
  it('renders disabled button and prevents click', async () => {
    const handleClick = fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );

    const button = screen.getByRole('button', { name: /Click me/i });

    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
