import React, { createContext, useContext, useState } from 'react';

export type UserType = 'guest' | 'hacker' | 'company' | 'admin';

interface User {
  id: string | null;
  type: UserType;
  name: string | null;
  email?: string | null;
  isLoggedIn: boolean;
}

interface UserContextType {
  user: User;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, userType: UserType) => void;
}

const mockUsers: Record<string, string> = {
  hacker: 'hacker',
  company: 'company',
  admin: 'admin',
};

const defaultUser: User = {
  id: null,
  type: 'guest',
  name: null,
  isLoggedIn: false
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);

  const login = (username: string, password: string) => {
    const expectedPassword = mockUsers[username];
    if (expectedPassword && expectedPassword === password) {
      setUser({
        id: `user-${Date.now()}`,
        type: username as UserType,
        name: username,
        email: `${username}@example.com`,
        isLoggedIn: true
      });
      return true;
    }
    return false;
  };

  const register = (name: string, userType: UserType) => {
    setUser({
      id: `user-${Date.now()}`,
      type: userType,
      name: name,
      email: null,
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUser(defaultUser);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};