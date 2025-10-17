import { useState, useCallback } from "react";

interface ToastConfig {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface UseToastReturn {
  toast: (config: ToastConfig) => void;
  isVisible: boolean;
  currentToast: ToastConfig | null;
}

export const useToast = (): UseToastReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentToast, setCurrentToast] = useState<ToastConfig | null>(null);

  const toast = useCallback((config: ToastConfig) => {
    setCurrentToast(config);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setCurrentToast(null), 300); // Clear after transition
    }, config.duration || 3000);
  }, []);

  return { toast, isVisible, currentToast };
};
