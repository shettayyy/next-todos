import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';

export interface ModalProps extends PropsWithChildren {
  title: string;
  isOpen: boolean;
  onClose?: () => void;
}

export const Modal: FC<ModalProps> = (props) => {
  const { isOpen, onClose = () => null, children, title } = props;

  return (
    <Transition
      show={isOpen}
      enter="duration-200 ease-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="duration-300 ease-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Dialog onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

        <div className="fixed inset-0 flex w-screen overflow-y-auto p-4">
          <DialogPanel className="space-y-4 m-auto bg-neutral-700 text-slate-100 p-8">
            <DialogTitle className="font-raleway font-bold tracking-wide text-3xl text-center mb-6">
              {title}
            </DialogTitle>

            {children}
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
};
