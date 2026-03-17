import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useUser } from './UserContext';

export type SupportStatus = 'Open' | 'In Progress' | 'Resolved';

export interface SupportRequest {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  securityObjective?: string | null;
  message: string;
  status: SupportStatus;
  createdAt: string;
  source?: 'contact_form' | 'support_page';
}

export interface GuestContactInfo {
  name: string;
  email: string;
  company?: string;
  jobTitle?: string;
  securityObjective?: string;
}

interface SupportContextType {
  requests: SupportRequest[];
  submitRequest: (message: string, guest?: GuestContactInfo) => void;
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

  const submitRequest = (message: string, guest?: GuestContactInfo) => {
    const r: SupportRequest = {
      id: `sr_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      userId: guest ? null : user.id,
      userName: guest ? guest.name : user.name,
      userEmail: guest ? guest.email : (user as any).email ?? null,
      company: guest?.company ?? null,
      jobTitle: guest?.jobTitle ?? null,
      securityObjective: guest?.securityObjective ?? null,
      message,
      status: 'Open',
      createdAt: new Date().toISOString(),
      source: guest ? 'contact_form' : 'support_page',
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
