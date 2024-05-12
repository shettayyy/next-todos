import 'react-toastify/dist/ReactToastify.css';
import { Slide, toast, ToastContent, ToastOptions } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
} from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

interface ToastProviderProps {
  showToast: (
    type: ToastType,
    content: ToastContent,
    options?: Partial<ToastOptions>
  ) => void;
}

const ToastContext = createContext<ToastProviderProps>({
  showToast: () => null,
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
      }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
