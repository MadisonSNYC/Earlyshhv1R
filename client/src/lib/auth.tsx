import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@shared/schema';
import { apiClient } from './api-client';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

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
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Handle Instagram OAuth callback
    if (location.startsWith('/auth/instagram/callback')) {
      const params = new URLSearchParams(location.split('?')[1]);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        toast({
          title: 'Instagram Login Failed',
          description: 'There was an error connecting to Instagram. Please try again.',
          variant: 'destructive'
        });
        setLocation('/onboarding');
        return;
      }

      if (code) {
        handleInstagramCallback(code);
      }
    }

    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('earlyshh_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        apiClient.setUser(userData);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('earlyshh_user');
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          variant: 'destructive'
        });
      }
    }
    setIsLoading(false);
  }, [location]);

  const handleInstagramCallback = async (code: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/instagram/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Instagram');
      }

      const data = await response.json();
      setUser(data.user);
      apiClient.setUser(data.user);
      localStorage.setItem('earlyshh_user', JSON.stringify(data.user));
      
      toast({
        title: 'Welcome!',
        description: 'Successfully connected with Instagram.',
      });
      
      setLocation('/');
    } catch (error) {
      console.error('Instagram callback failed:', error);
      toast({
        title: 'Authentication Failed',
        description: 'There was an error connecting to Instagram. Please try again.',
        variant: 'destructive'
      });
      setLocation('/onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (instagramData: InstagramLoginData) => {
    try {
      setIsLoading(true);
      const data = await apiClient.login(instagramData);

      if (!data.user || !data.user.id) {
        throw new Error('Invalid user data received from server');
      }

      setUser(data.user);
      apiClient.setUser(data.user);
      localStorage.setItem('earlyshh_user', JSON.stringify(data.user));
      
      toast({
        title: 'Welcome!',
        description: 'Successfully logged in.',
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login Failed',
        description: 'There was an error logging in. Please try again.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.setUser(null);
    localStorage.removeItem('earlyshh_user');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    setLocation('/onboarding');
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