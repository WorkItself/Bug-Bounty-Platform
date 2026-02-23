import React, { createContext, useContext, useState } from 'react';
import { getDefaultAvatarUrl } from '../utils/avatarUtils';

export type UserType = 'guest' | 'hacker' | 'company' | 'admin';

interface User {
  id: string | null;
  type: UserType;
  name: string | null;
  email?: string | null;
  isLoggedIn: boolean;
  avatar?: string | null;
  companyDetails?: CompanyDetails | null;
}

export interface CompanyDetails {
  companyName: string;
  registrationNumber: string;
  taxId: string;
  address: string;
  country: string;
  contactPerson: string;
  phone: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  type: UserType;
  avatar: string;
  status: 'active' | 'warned' | 'banned';
  warnings: number;
}

interface UserContextType {
  user: User;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, userType: UserType, companyDetails?: CompanyDetails) => void;
  getAllUsers: () => RegisteredUser[];
  updateUserStatus: (userId: string, status: 'active' | 'warned' | 'banned', warnings?: number) => void;
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

const initialRegisteredUsers: RegisteredUser[] = [
  { id: 'user-1', name: 'CyberWraith', email: 'cyber@example.com', type: 'hacker', avatar: 'https://i.pravatar.cc/150?u=CyberWraith', status: 'active', warnings: 0 },
  { id: 'user-2', name: 'DataDragon', email: 'dragon@example.com', type: 'hacker', avatar: 'https://i.pravatar.cc/150?u=DataDragon', status: 'active', warnings: 0 },
  { id: 'user-3', name: 'TechCorp', email: 'tech@corp.com', type: 'company', avatar: 'https://ui-avatars.com/api/?name=TechCorp&background=0d9488&color=ffffff&size=150', status: 'active', warnings: 0 },
  { id: 'user-4', name: 'HexHammer', email: 'hex@example.com', type: 'hacker', avatar: 'https://i.pravatar.cc/150?u=HexHammer', status: 'warned', warnings: 1 },
  { id: 'user-5', name: 'SecureInc', email: 'secure@inc.com', type: 'company', avatar: 'https://ui-avatars.com/api/?name=SecureInc&background=0d9488&color=ffffff&size=150', status: 'active', warnings: 0 },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(initialRegisteredUsers);

  const login = (username: string, password: string) => {
    const expectedPassword = mockUsers[username];
    if (expectedPassword && expectedPassword === password) {
      const avatarUrl = username === 'admin' 
        ? 'https://i.pravatar.cc/150?img=33'
        : getDefaultAvatarUrl(true, username);
      
      setUser({
        id: `user-${Date.now()}`,
        type: username as UserType,
        name: username,
        email: `${username}@example.com`,
        avatar: avatarUrl,
        isLoggedIn: true
      });
      return true;
    }
    return false;
  };

  const register = (name: string, userType: UserType, companyDetails?: CompanyDetails) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      type: userType,
      name: name,
      email: null,
      avatar: getDefaultAvatarUrl(true, name),
      isLoggedIn: true,
      companyDetails: companyDetails || null,
    };
    
    setUser(newUser);
    
    // Add to registered users list
    const registeredUser: RegisteredUser = {
      id: newUser.id!,
      name: name,
      email: companyDetails?.contactPerson || name,
      type: userType,
      avatar: newUser.avatar!,
      status: 'active',
      warnings: 0
    };
    setRegisteredUsers([...registeredUsers, registeredUser]);
  };

  const logout = () => {
    setUser(defaultUser);
  };

  const getAllUsers = () => {
    return registeredUsers;
  };

  const updateUserStatus = (userId: string, status: 'active' | 'warned' | 'banned', warnings = 0) => {
    setRegisteredUsers(registeredUsers.map(u => 
      u.id === userId ? { ...u, status, warnings } : u
    ));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register, getAllUsers, updateUserStatus }}>
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