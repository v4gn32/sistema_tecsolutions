import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials } from '../types/auth';
import { login as authLogin, logout as authLogout, getCurrentUser, initializeAuth } from '../utils/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    initializeAuth();
    const user = getCurrentUser();
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const user = await authLogin(credentials);
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    authLogout();
    setAuthState({
      user: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};