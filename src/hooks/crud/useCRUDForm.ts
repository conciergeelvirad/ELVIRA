import { useState, useCallback } from "react";

export interface FormFieldConfig {
  key: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "select"
    | "textarea"
    | "number"
    | "date"
    | "file";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: unknown) => string | null;
  gridColumn?: "full" | "half"; // For layout control
  maxLength?: number; // For input length restriction
  showGenerateButton?: boolean; // For showing generate button (e.g., access code)
  accept?: string; // For file input accept attribute
  storageFolder?:
    | "AMENITIES"
    | "PRODUCTS"
    | "MENU_ITEMS"
    | "HOTEL_GALLERY"
    | "MESSAGES"
    | "USERS_AVATAR"; // For file uploads
}

export interface CRUDFormState {
  formData: Record<string, unknown>;
  formErrors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface CRUDFormActions {
  updateField: (key: string, value: unknown) => void;
  updateFormData: (data: Record<string, unknown>) => void;
  setFormData: (data: Record<string, unknown>) => void;
  setError: (key: string, error: string) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  validateForm: () => boolean;
  validateField: (key: string) => boolean;
}

export type UseCRUDFormReturn = [CRUDFormState, CRUDFormActions];

export const useCRUDForm = (
  formFields: FormFieldConfig[],
  customValidator?: (data: Record<string, unknown>) => Record<string, string>
): UseCRUDFormReturn => {
  // Initialize form data
  const initializeFormData = useCallback((): Record<string, unknown> => {
    const initialData: Record<string, unknown> = {};
    formFields.forEach((field) => {
      initialData[field.key] = "";
    });
    return initialData;
  }, [formFields]);

  const [formData, setFormDataState] =
    useState<Record<string, unknown>>(initializeFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFormData = useCallback((data: Record<string, unknown>) => {
    console.log("📝 [useCRUDForm] setFormData called with data:", data);
    setFormDataState(data);
    console.log("📝 [useCRUDForm] formData state updated");
  }, []);

  const updateField = useCallback(
    (key: string, value: unknown) => {
      console.log(`📝 [useCRUDForm] updateField called: ${key} =`, value);
      setFormDataState((prev) => ({ ...prev, [key]: value }));
      // Clear error when user starts typing
      if (formErrors[key]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    },
    [formErrors]
  );

  const updateFormData = useCallback((data: Record<string, unknown>) => {
    console.log("📝 [useCRUDForm] updateFormData called with data:", data);
    setFormDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const setError = useCallback((key: string, error: string) => {
    setFormErrors((prev) => ({ ...prev, [key]: error }));
  }, []);

  const clearError = useCallback((key: string) => {
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormDataState(initializeFormData());
    setFormErrors({});
    setIsSubmitting(false);
  }, [initializeFormData]);

  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting);
  }, []);

  const validateField = useCallback(
    (key: string): boolean => {
      const field = formFields.find((f) => f.key === key);
      if (!field) return true;

      const value = formData[key];

      // Required validation
      if (
        field.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        setError(key, `${field.label} is required`);
        return false;
      }

      // Custom field validation
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          setError(key, error);
          return false;
        }
      }

      clearError(key);
      return true;
    },
    [formFields, formData, setError, clearError]
  );

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    // Validate each field
    formFields.forEach((field) => {
      const fieldValid = validateField(field.key);
      if (!fieldValid) {
        isValid = false;
      }
    });

    // Custom form validation
    if (customValidator) {
      const customErrors = customValidator(formData);
      Object.entries(customErrors).forEach(([key, error]) => {
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      });
      setFormErrors((prev) => ({ ...prev, ...newErrors }));
    }

    return isValid;
  }, [formFields, formData, customValidator, validateField]);

  const isValid = Object.keys(formErrors).length === 0;

  const state: CRUDFormState = {
    formData,
    formErrors,
    isSubmitting,
    isValid,
  };

  const actions: CRUDFormActions = {
    updateField,
    updateFormData,
    setFormData,
    setError,
    clearError,
    clearAllErrors,
    resetForm,
    setSubmitting,
    validateForm,
    validateField,
  };

  return [state, actions];
};
