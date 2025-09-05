import { User, LoginCredentials } from '../types/auth';

const AUTH_STORAGE_KEY = 'tecsolutions_auth';
const TOKEN_STORAGE_KEY = 'token';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Default admin user for fallback
const defaultAdmin: User = {
  id: 'admin-1',
  name: 'Administrador',
  email: 'admin@tecsolutions.com.br',
  role: 'admin',
  createdAt: new Date('2024-01-01')
};

// Default password for demo (in production, use proper hashing)
const defaultPasswords: Record<string, string> = {
  'admin@tecsolutions.com.br': 'admin123'
};

// Check if we should use API backend
const useAPI = () => {
  return true; // Always try API first
};

export const initializeAuth = (): void => {
  const users = getUsers();
  if (users.length === 0) {
    localStorage.setItem('tecsolutions_users', JSON.stringify([defaultAdmin]));
    localStorage.setItem('tecsolutions_passwords', JSON.stringify(defaultPasswords));
  }
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem('tecsolutions_users');
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User, password: string): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem('tecsolutions_users', JSON.stringify(users));
  
  // Save password (in production, hash this!)
  const passwords = getPasswords();
  passwords[user.email] = password;
  localStorage.setItem('tecsolutions_passwords', JSON.stringify(passwords));
};

export const deleteUser = (id: string): void => {
  const users = getUsers().filter(u => u.id !== id);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const login = async (credentials: LoginCredentials): Promise<User | null> => {
  if (useAPI()) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Resposta da API:', data);
        
        // A API retorna { success: true, data: { user, token }, message }
        if (data.success && data.data) {
          const { token, user } = data.data;
          
          // Store token and user data
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          
          return user;
        }
      } else {
        const errorData = await response.json();
        console.error('Erro na resposta da API:', errorData);
      }
    } catch (error) {
      console.error('Erro ao fazer login na API:', error);
    }
  }
  
  // Fallback to localStorage authentication
  const users = getUsers();
  const passwords = getPasswords();
  
  const user = users.find(u => u.email === credentials.email);
  if (user && passwords[credentials.email] === credentials.password) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!data || data === 'undefined' || data === 'null') {
    return null;
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao fazer parse dos dados do usuário:', error);
    // Limpa dados corrompidos
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

const getPasswords = (): Record<string, string> => {
  const data = localStorage.getItem('tecsolutions_passwords');
  return data ? JSON.parse(data) : {};
};