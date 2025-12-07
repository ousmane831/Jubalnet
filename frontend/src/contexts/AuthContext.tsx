import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAnonymous: () => void;
  logout: () => void;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    // Vérifier la session stockée
    const storedUser = localStorage.getItem('user');
    const storedAnonymous = localStorage.getItem('anonymous_session');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Restaurer le département depuis localStorage si disponible
      const savedAssignments = JSON.parse(localStorage.getItem('departmentAssignments') || '{}');
      if (savedAssignments[parsedUser.id] && !parsedUser.department) {
        parsedUser.department = savedAssignments[parsedUser.id];
        // Mettre à jour localStorage avec les données restaurées
        localStorage.setItem('user', JSON.stringify(parsedUser));
      }
      
      setUser(parsedUser);
    }
    if (storedAnonymous) {
      setIsAnonymous(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);

      // Sauvegarde du token
      localStorage.setItem('auth_token', response.token);

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        full_name: response.user.full_name,
        phone: response.user.phone,
        role: response.user.role as 'citizen' | 'authority' | 'admin' | 'moderator',
        is_anonymous: response.user.is_anonymous,
        preferred_language: response.user.preferred_language as 'fr' | 'wo',
        department: (response.user as any).department,
        badge_number: (response.user as any).badge_number,
        jurisdiction_region: (response.user as any).jurisdiction_region,
        jurisdiction_department: (response.user as any).jurisdiction_department,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Restaurer le département depuis localStorage si l'API ne le retourne pas
      const savedAssignments = JSON.parse(localStorage.getItem('departmentAssignments') || '{}');
      if (savedAssignments[user.id] && !user.department) {
        user.department = savedAssignments[user.id];
      }

      setUser(user);
      setIsAnonymous(false);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('anonymous_session');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Échec de la connexion');
    }
  };

  const loginAnonymous = () => {
    apiService.loginAnonymous('fr').then(response => {
      // Sauvegarde du token
      localStorage.setItem('auth_token', response.token);

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        full_name: response.user.full_name,
        phone: response.user.phone,
        role: response.user.role as 'citizen' | 'authority' | 'admin' | 'moderator',
        is_anonymous: response.user.is_anonymous,
        preferred_language: response.user.preferred_language as 'fr' | 'wo',
        department: (response.user as any).department,
        badge_number: (response.user as any).badge_number,
        jurisdiction_region: (response.user as any).jurisdiction_region,
        jurisdiction_department: (response.user as any).jurisdiction_department,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(user);
      setIsAnonymous(true);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('anonymous_session', 'true');
    }).catch(error => {
      console.error('Erreur lors de la connexion anonyme:', error);
    });
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setIsAnonymous(false);
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token'); // suppression du token
      localStorage.removeItem('anonymous_session');
    }
  };

  const register = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const response = await apiService.register({
        email,
        password,
        confirm_password: password,
        full_name: fullName,
        phone,
        preferred_language: 'fr',
      });

      // Sauvegarde du token
      localStorage.setItem('auth_token', response.token);

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        full_name: response.user.full_name,
        phone: response.user.phone,
        role: response.user.role as 'citizen' | 'authority' | 'admin' | 'moderator',
        is_anonymous: response.user.is_anonymous,
        preferred_language: response.user.preferred_language as 'fr' | 'wo',
        department: (response.user as any).department,
        badge_number: (response.user as any).badge_number,
        jurisdiction_region: (response.user as any).jurisdiction_region,
        jurisdiction_department: (response.user as any).jurisdiction_department,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(user);
      setIsAnonymous(false);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('anonymous_session');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Échec de l\'inscription');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAnonymous,
      login,
      loginAnonymous,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
