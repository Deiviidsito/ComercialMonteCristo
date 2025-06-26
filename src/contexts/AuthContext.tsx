import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de usuario desde localStorage
    const savedUser = localStorage.getItem('montecristo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulación de autenticación
    const mockUsers = [
      {
        id: '1',
        email: 'admin@montecristo.com',
        name: 'Administrador',
        role: 'admin' as const,
        createdAt: new Date(),
      },
      {
        id: '2',
        email: 'vendedor@montecristo.com',
        name: 'Juan Pérez',
        role: 'vendedor' as const,
        createdAt: new Date(),
      },
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('montecristo_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('montecristo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};