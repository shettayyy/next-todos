import { FC } from 'react';
import { Modal } from './modal';
import { Button } from '../form';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmBtnLabel?: string;
  pending?: boolean;
}

export const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    confirmBtnLabel = 'Confirm',
    pending = false,
  } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🗑️ Delete Task">
      <p>Are you sure you want to delete this task?</p>
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onClose}>Cancel</Button>

        <Button disabled={pending} onClick={onConfirm} variant="danger">
          {confirmBtnLabel}
        </Button>
      </div>
    </Modal>
  );
};
