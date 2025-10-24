import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAuth, userService } from '@/lib/supabaseClient';

interface AuthContextType {
  currentUser: UserAuth | null;
  login: (cpf: string, senha: string) => Promise<UserAuth | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Erro ao recuperar usuário do localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (cpf: string, senha: string): Promise<UserAuth | null> => {
    try {
      setIsLoading(true);
      console.log('AuthContext - Iniciando login para CPF:', cpf);
      
      // Autenticar usando Supabase
      const user = await userService.authenticate(cpf, senha);
      console.log('AuthContext - Resultado da autenticação:', user);
      
      if (user) {
        console.log('AuthContext - Usuário autenticado com sucesso:', user);
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
      
      console.log('AuthContext - Falha na autenticação');
      return null;
    } catch (error) {
      console.error('AuthContext - Erro no login:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
