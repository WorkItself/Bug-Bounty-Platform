import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AxiosInstance } from 'axios';
import axiosInstance from '../utils/axiosInstance';

interface AxiosContextType {
  axios: AxiosInstance;
  serverError: string | null;
  clearServerError: () => void;
}

const AxiosContext = createContext<AxiosContextType | null>(null);

interface AxiosProviderProps {
  children: ReactNode;
}

export function AxiosProvider({ children }: AxiosProviderProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const handleServerError = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setServerError(detail?.message ?? 'A apărut o eroare pe server. Încearcă din nou.');
    };

    window.addEventListener('server-error', handleServerError);
    return () => window.removeEventListener('server-error', handleServerError);
  }, []);

  const clearServerError = () => setServerError(null);

  return (
    <AxiosContext.Provider value={{ axios: axiosInstance, serverError, clearServerError }}>
      {serverError && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          background: '#dc2626', color: '#fff',
          padding: '12px 24px', zIndex: 9999,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span>⚠ Eroare server (500): {serverError}</span>
          <button onClick={clearServerError} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}>×</button>
        </div>
      )}
      {children}
    </AxiosContext.Provider>
  );
}

export function useAxios(): AxiosContextType {
  const ctx = useContext(AxiosContext);
  if (!ctx) {
    throw new Error('useAxios must be used inside <AxiosProvider>');
  }
  return ctx;
}
