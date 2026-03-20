import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  showToast: ({ message, type = 'info', duration = 3000 }) => {
    set({ visible: true, message, type });
    
    // Auto hide
    setTimeout(() => {
      set({ visible: false });
    }, duration);
  },
  hideToast: () => set({ visible: false }),
}));
