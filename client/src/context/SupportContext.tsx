import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useUser } from './UserContext';

export type SupportStatus = 'Open' | 'In Progress' | 'Resolved';

export interface SupportRequest {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail?: string | null;
  message: string;
  status: SupportStatus;
  createdAt: string;
}

interface SupportContextType {
  requests: SupportRequest[];
  submitRequest: (message: string) => void;
  updateStatus: (id: string, status: SupportStatus) => void;
  clearAll?: () => void;
}

const KEY = 'bbp_support_requests_v1';

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const { user } = useUser();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setRequests(JSON.parse(raw));
    } catch (e) {
      setRequests([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(requests));
    } catch (e) {
      // ignore
    }
  }, [requests]);

  const submitRequest = (message: string) => {
    const r: SupportRequest = {
      id: `sr_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      userId: user.id,
      userName: user.name,
      userEmail: (user as any).email ?? null,
      message,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    setRequests((prev) => [r, ...prev]);
  };

  const updateStatus = (id: string, status: SupportStatus) => {
    setRequests((prev) => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const clearAll = () => setRequests([]);

  return (
    <SupportContext.Provider value={{ requests, submitRequest, updateStatus, clearAll }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error('useSupport must be used within SupportProvider');
  return ctx;
};

export default SupportContext;
