import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id?: string;
  nome: string;
  cpf: string;
  senha: string;
  link_destino: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserAuth {
  id: string;
  nome: string;
  cpf: string;
  link_destino: string;
  is_admin: boolean;
  created_at: string;
}

// Funções para operações com usuários
export const userService = {
  // Autenticar usuário
  async authenticate(cpf: string, senha: string): Promise<UserAuth | null> {
    try {
      const { data, error } = await supabase.rpc('authenticate_user', {
        user_cpf: cpf,
        user_password: senha
      });

      if (error) {
        console.error('Erro na autenticação:', error);
        return null;
      }

      if (data && data.length > 0) {
        return data[0];
      }

      return null;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return null;
    }
  },

  // Buscar todos os usuários (apenas para admins)
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  },

  // Criar novo usuário
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar usuário:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return null;
    }
  },

  // Atualizar usuário
  async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return null;
    }
  },

  // Deletar usuário
  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar usuário:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return false;
    }
  },

  // Verificar se existe usuário com CPF
  async checkCPFExists(cpf: string, excludeId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('users')
        .select('id')
        .eq('cpf', cpf);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao verificar CPF:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      return false;
    }
  }
};
