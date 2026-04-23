import React, { createContext, useContext, useState } from 'react';
import { getDefaultAvatarUrl } from '../utils/avatarUtils';

export type UserType = 'guest' | 'user' | 'company' | 'admin';

interface CompanyDetails {
  legalName: string;
  registrationNumber: string;
  jurisdiction: string;
  taxId: string;
}

interface Warning {
  id: string;
  reason: string;
  date: string;
}

interface PlatformUser {
  id: string;
  name: string;
  type: UserType;
  email: string;
  avatar: string;
  isBanned: boolean;
  warnings: Warning[];
  dateJoined: string;
  companyDetails?: CompanyDetails;
}

interface User {
  id: string | null;
  type: UserType;
  name: string | null;
  email?: string | null;
  isLoggedIn: boolean;
  avatar?: string | null;
  companyDetails?: CompanyDetails | null;
  warnings?: Warning[];
  isBanned?: boolean;
}

interface UserContextType {
  user: User;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, userType: UserType, companyDetails?: CompanyDetails) => void;
  getAllUsers: () => PlatformUser[];
  searchUsers: (query: string) => PlatformUser[];
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  warnUser: (userId: string, reason: string) => void;
}

const mockUsers: Record<string, string> = {
  user: 'user',
  company: 'company',
  admin: 'admin',
};

// Mock user database
const mockUserDatabase: PlatformUser[] = [
  {
    id: 'user-admin',
    name: 'admin',
    type: 'admin',
    email: 'admin@platform.com',
    avatar: '/fsociety.jpg',
    isBanned: false,
    warnings: [],
    dateJoined: '2025-01-01'
  },
  {
    id: 'user-hacker',
    name: 'user',
    type: 'user',
    email: 'hacker@exploit.com',
    avatar: 'https://i.pravatar.cc/150?u=hacker',
    isBanned: false,
    warnings: [],
    dateJoined: '2025-01-15'
  },
  {
    id: 'user-company',
    name: 'company',
    type: 'company',
    email: 'security@company.com',
    avatar: 'https://i.pravatar.cc/150?u=company',
    isBanned: false,
    warnings: [],
    dateJoined: '2025-01-10',
    companyDetails: {
      legalName: 'TechCorp Inc.',
      registrationNumber: 'TC-2025-001',
      jurisdiction: 'US',
      taxId: '12-3456789'
    }
  }
];

const defaultUser: User = {
  id: null,
  type: 'guest',
  name: null,
  isLoggedIn: false
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [allUsers, setAllUsers] = useState<PlatformUser[]>(mockUserDatabase);

  const login = (username: string, password: string) => {
    const expectedPassword = mockUsers[username];
    if (expectedPassword && expectedPassword === password) {
      const dbUser = allUsers.find(u => u.name === username);
      const avatarUrl = username === 'admin' 
        ? '/fsociety.jpg'
        : (dbUser?.avatar || getDefaultAvatarUrl(true, username));
      
      if (dbUser?.isBanned) {
        return false; // User is banned
      }
      
      setUser({
        id: `user-${Date.now()}`,
        type: username as UserType,
        name: username,
        email: dbUser?.email || `${username}@example.com`,
        avatar: avatarUrl,
        companyDetails: dbUser?.companyDetails,
        warnings: dbUser?.warnings,
        isBanned: dbUser?.isBanned,
        isLoggedIn: true
      });
      return true;
    }
    return false;
  };

  const register = (name: string, userType: UserType, companyDetails?: CompanyDetails) => {
    const newPlatformUser: PlatformUser = {
      id: `user-${Date.now()}`,
      name,
      type: userType,
      email: `${name}@example.com`,
      avatar: getDefaultAvatarUrl(true, name),
      isBanned: false,
      warnings: [],
      dateJoined: new Date().toISOString().split('T')[0],
      companyDetails
    };
    
    setAllUsers([...allUsers, newPlatformUser]);
    
    const newUser: User = {
      id: newPlatformUser.id,
      type: userType,
      name: name,
      email: newPlatformUser.email,
      avatar: newPlatformUser.avatar,
      companyDetails: companyDetails,
      warnings: [],
      isBanned: false,
      isLoggedIn: true,
    };
    
    setUser(newUser);
  };

  const logout = () => {
    setUser(defaultUser);
  };

  const getAllUsers = (): PlatformUser[] => {
    return allUsers;
  };

  const searchUsers = (query: string): PlatformUser[] => {
    const lowerQuery = query.toLowerCase();
    return allUsers.filter(u => 
      u.name.toLowerCase().includes(lowerQuery) || 
      u.email.toLowerCase().includes(lowerQuery) ||
      u.id.toLowerCase().includes(lowerQuery)
    );
  };

  const banUser = (userId: string) => {
    setAllUsers(allUsers.map(u => 
      u.id === userId ? { ...u, isBanned: true } : u
    ));
  };

  const unbanUser = (userId: string) => {
    setAllUsers(allUsers.map(u => 
      u.id === userId ? { ...u, isBanned: false } : u
    ));
  };

  const warnUser = (userId: string, reason: string) => {
    setAllUsers(allUsers.map(u => 
      u.id === userId 
        ? { 
            ...u, 
            warnings: [...u.warnings, {
              id: `warn-${Date.now()}`,
              reason,
              date: new Date().toISOString().split('T')[0]
            }]
          } 
        : u
    ));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register,
      getAllUsers,
      searchUsers,
      banUser,
      unbanUser,
      warnUser
    }}>
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