import 'react-toastify/dist/ReactToastify.css';
import {
  Slide,
  toast as toastify,
  ToastContent,
  ToastOptions,
  toast,
} from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
} from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

interface ToastProviderProps {
  showToast: (
    type: ToastType,
    content: ToastContent,
    options?: Partial<ToastOptions>
  ) => void;
  toast: typeof toastify;
}

const ToastContext = createContext<ToastProviderProps>({
  showToast: () => null,
  toast: toastify,
});

export const defaultToastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
  transition: Slide,
};

const toastRoot = document.getElementById('toast-root');

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  /**
   * Display toast
   *
   * @param {ToastType} type
   * @param {ToastContent} content
   * @param {ToastOptions} [options=defaultToastOption]
   * @return {Id}
   */
  const showToast = useCallback(
    (
      type: ToastType,
      content: ToastContent,
      options: Partial<ToastOptions> = {}
    ) => {
      switch (type) {
        case 'info':
          return toast.info(content, { ...defaultToastOptions, ...options });
        case 'success':
          return toast.success(content, { ...defaultToastOptions, ...options });
        case 'warning':
          return toast.warning(content, { ...defaultToastOptions, ...options });
        case 'error':
          return toast.error(content, { ...defaultToastOptions, ...options });
        default:
          return toast(content, { ...defaultToastOptions, ...options });
      }
    },
    []
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        toast: toastify,
      }}
    >
      {children}
      {toastRoot &&
        createPortal(
          <ToastContainer
            limit={3}
            className="z-50"
            {...defaultToastOptions}
          />,
          toastRoot
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
