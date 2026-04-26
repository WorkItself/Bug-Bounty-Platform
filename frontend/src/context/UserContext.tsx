import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

export type UserType = 'guest' | 'user' | 'company' | 'admin';

interface User {
  id: string | null;
  type: UserType;
  name: string | null;
  email?: string | null;
  isLoggedIn: boolean;
  avatar?: string | null;
}

interface UserContextType {
  user: User;
  login: (credential: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userName: string, email: string, password: string, role: string) => Promise<{ success: boolean; message: string }>;
  getAllUsers: () => any[];
  searchUsers: (query: string) => any[];
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  warnUser: (userId: string, reason: string) => void;
}

const defaultUser: User = { id: null, type: 'guest', name: null, isLoggedIn: false };

function parseJwt(token: string) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function userFromToken(token: string): User | null {
  const payload = parseJwt(token);
  if (!payload) return null;

  const role = (
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? ''
  ).toLowerCase() as UserType;

  const name =
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
    payload['name'] ??
    null;

  return {
    id: payload['sub'] ?? null,
    type: role || 'user',
    name,
    email: payload['email'] ?? null,
    isLoggedIn: true,
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const restored = userFromToken(token);
      if (restored) return restored;
    }
    return defaultUser;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const payload = parseJwt(token);
    if (!payload) return;
    const exp = payload['exp'];
    if (exp && Date.now() / 1000 > exp) {
      localStorage.removeItem('token');
      setUser(defaultUser);
    }
  }, []);

  const login = async (credential: string, password: string): Promise<boolean> => {
    try {
      const res = await axiosInstance.post('/session/auth', { credential, password });
      const token = res.data?.token;
      if (!token) return false;
      localStorage.setItem('token', token);
      const parsed = userFromToken(token);
      if (!parsed) return false;
      setUser(parsed);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(defaultUser);
  };

  const register = async (
    userName: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await axiosInstance.post('/reg', { userName, email, password, role });
      return { success: true, message: res.data?.message ?? 'Registration successful.' };
    } catch (err: any) {
      const d = err.response?.data;
      const msg = d?.message ?? (typeof d === 'string' ? d : null) ?? 'Registration failed.';
      return { success: false, message: msg };
    }
  };

  // Stubs — wired in AdminPanel step
  const getAllUsers = () => [];
  const searchUsers = (_query: string) => [];
  const banUser = (_userId: string) => {};
  const unbanUser = (_userId: string) => {};
  const warnUser = (_userId: string, _reason: string) => {};

  return (
    <UserContext.Provider value={{ user, login, logout, register, getAllUsers, searchUsers, banUser, unbanUser, warnUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
