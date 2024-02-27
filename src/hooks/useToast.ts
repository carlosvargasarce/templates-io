import { Bounce, ToastPosition, toast } from 'react-toastify';

const useToast = () => {
  const notifyErrorOptions = {
    position: 'top-right' as ToastPosition,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  };

  const notifyError = (message: string) => {
    toast.error(message, notifyErrorOptions);
  };

  const notifySuccess = (message: string) => {
    toast.success(message, {
      className: 'toast-success',
    });
  };

  return { notifySuccess, notifyError };
};

export default useToast;
