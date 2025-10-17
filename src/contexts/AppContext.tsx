import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  isLoading: boolean;
  error: string | null;
  user: any | null;
}

interface AppContextType extends AppState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: any | null) => void;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState<AppState>({
    isLoading: false,
    error: null,
    user: null,
  });

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const setUser = (user: any | null) => {
    setState((prev) => ({ ...prev, user }));
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLoading,
        setError,
        setUser,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
