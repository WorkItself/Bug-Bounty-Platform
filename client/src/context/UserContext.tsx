import React, { createContext, useContext, useState } from 'react';

export type UserType = 'guest' | 'hacker' | 'company' | 'admin';

interface User {
  id: string | null;
  type: UserType;
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

interface UserContextType {
  user: User;
  adminEnabled: boolean;
  setAdminEnabled: (enabled: boolean) => void;
  login: (type: UserType, name: string, email: string) => void;
  logout: () => void;
  switchUserType: (type: UserType) => void;
}

const defaultUser: User = {
  id: null,
  type: 'guest',
  name: null,
  email: null,
  isLoggedIn: false
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [adminEnabled, setAdminEnabled] = useState(false);

  const login = (type: UserType, name: string, email: string) => {
    const isAdmin = type === 'admin' || adminEnabled;
    if (isAdmin) {
      setAdminEnabled(true);
    }
    setUser({
      id: `user-${Date.now()}`,
      type: isAdmin ? 'admin' : type,
      name,
      email,
      isLoggedIn: true
    });
  };

  const logout = () => {
    setUser(defaultUser);
  };

  const switchUserType = (type: UserType) => {
    if (user.isLoggedIn) {
      setUser(prev => ({
        ...prev,
        type: type === 'admin' && !adminEnabled ? 'guest' : type
      }));
    }
  };

  return (
    <UserContext.Provider value={{ user, adminEnabled, setAdminEnabled, login, logout, switchUserType }}>
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
