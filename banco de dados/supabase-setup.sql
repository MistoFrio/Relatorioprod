-- Configuração do banco de dados Supabase para o Sistema de Gratificações

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  link_destino TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário administrador padrão
INSERT INTO users (cpf, senha, link_destino, is_admin) 
VALUES ('000.000.000-00', 'admin123', '/admin', true)
ON CONFLICT (cpf) DO NOTHING;

-- Configurar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para permitir acesso público (temporária para desenvolvimento)
-- Em produção, você deve implementar autenticação adequada
CREATE POLICY "Allow all operations for authenticated users" ON users
    FOR ALL USING (true) WITH CHECK (true);

-- Criar função para autenticação personalizada
CREATE OR REPLACE FUNCTION authenticate_user(user_cpf TEXT, user_password TEXT)
RETURNS TABLE (
    id UUID,
    cpf VARCHAR(14),
    link_destino TEXT,
    is_admin BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.cpf, u.link_destino, u.is_admin, u.created_at
    FROM users u
    WHERE u.cpf = user_cpf AND u.senha = user_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir execução da função de autenticação
GRANT EXECUTE ON FUNCTION authenticate_user TO anon, authenticated;
