import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@shared/schema';
import { apiRequest } from './api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (instagramData: InstagramLoginData) => Promise<void>;
  logout: () => void;
}

interface InstagramLoginData {
  instagramId: string;
  username: string;
  fullName: string;
  profilePicUrl?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('earlyshh_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('earlyshh_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (instagramData: InstagramLoginData) => {
    try {
      const response = await apiRequest('POST', '/api/auth/instagram', instagramData);
      const data = await response.json();
      
      setUser(data.user);
      localStorage.setItem('earlyshh_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('earlyshh_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
