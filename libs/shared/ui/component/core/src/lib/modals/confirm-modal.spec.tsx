import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import { ConfirmModal } from './confirm-modal';

describe('ConfirmModal component', () => {
  it('renders confirm modal with title and message', () => {
    render(
      <ConfirmModal
        message="Message"
        isOpen
        onClose={() => null}
        onConfirm={() => null}
      />
    );

    const message = screen.getByText(/Message/i);

    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent('Message');
  });

  it('calls onClose', async () => {
    const handleClose = fn();
    render(
      <ConfirmModal
        message="Message"
        isOpen
        onClose={handleClose}
        onConfirm={() => null}
      />
    );

    const cancelBtn = screen.getByText(/Cancel/i);

    await userEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onConfirm', async () => {
    const handleConfirm = fn();
    render(
      <ConfirmModal
        message="Message"
        isOpen
        onClose={() => null}
        onConfirm={handleConfirm}
      />
    );

    const confirmBtn = screen.getByText(/Confirm/i);

    await userEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalled();
  });

  it('disables confirm button when pending', () => {
    render(
      <ConfirmModal
        message="Message"
        isOpen
        onClose={() => null}
        onConfirm={() => null}
        pending
      />
    );

    const confirmBtn = screen.getByText(/Confirm/i);

    expect(confirmBtn).toBeDisabled();
  });
});
