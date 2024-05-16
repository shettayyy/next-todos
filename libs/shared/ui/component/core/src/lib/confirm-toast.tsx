import { FC } from 'react';
import { Button } from './form';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

export interface ConfirmToastProps {
  onYes: () => void;
  onNo: () => void;
}

export const ConfirmToast: FC<ConfirmToastProps> = ({ onYes, onNo }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="flex items-center gap-2">
      <ExclamationTriangleIcon className="w-12 h-12 text-white" />

      <p className="text-sm text-black">
        You have unsaved changes. Are you sure you want to close?
      </p>
    </div>

    <div className="flex justify-end w-full gap-2">
      <Button onClick={onYes} variant="danger" className="min-w-20">
        Yes
      </Button>

      <Button onClick={onNo} className="min-w-20" variant="default">
        No
      </Button>
    </div>
  </div>
);
