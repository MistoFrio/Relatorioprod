-- Script SQL ÚNICO para Sistema de Gratificações com Campo Nome
-- Execute este script completo no SQL Editor do Supabase

-- =====================================================
-- 1. LIMPEZA E PREPARAÇÃO
-- =====================================================

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Desabilitar RLS temporariamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. ESTRUTURA DA TABELA
-- =====================================================

-- Adicionar coluna nome se não existir
ALTER TABLE users ADD COLUMN IF NOT EXISTS nome VARCHAR(255);

-- Atualizar registros existentes que não têm nome
UPDATE users 
SET nome = CASE 
    WHEN cpf = '000.000.000-00' THEN 'Administrador'
    ELSE 'Usuário ' || SUBSTRING(cpf, 1, 3) || '***'
END
WHERE nome IS NULL OR nome = '';

-- Tornar a coluna nome obrigatória
ALTER TABLE users ALTER COLUMN nome SET NOT NULL;

-- =====================================================
-- 3. ÍNDICES E PERFORMANCE
-- =====================================================

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_nome ON users(nome);

-- =====================================================
-- 4. TRIGGERS E FUNÇÕES
-- =====================================================

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. FUNÇÃO DE AUTENTICAÇÃO
-- =====================================================

-- Criar função para autenticação personalizada com nome
CREATE OR REPLACE FUNCTION authenticate_user(user_cpf TEXT, user_password TEXT)
RETURNS TABLE (
    id UUID,
    nome VARCHAR(255),
    cpf VARCHAR(14),
    link_destino TEXT,
    is_admin BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.nome, u.cpf, u.link_destino, u.is_admin, u.created_at
    FROM users u
    WHERE u.cpf = user_cpf AND u.senha = user_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir execução da função de autenticação
GRANT EXECUTE ON FUNCTION authenticate_user TO anon, authenticated;

-- =====================================================
-- 6. DADOS INICIAIS
-- =====================================================

-- Inserir usuário administrador padrão
INSERT INTO users (nome, cpf, senha, link_destino, is_admin) 
VALUES ('Administrador', '000.000.000-00', 'admin123', '/admin', true)
ON CONFLICT (cpf) DO UPDATE SET 
    nome = EXCLUDED.nome,
    senha = EXCLUDED.senha,
    link_destino = EXCLUDED.link_destino,
    is_admin = EXCLUDED.is_admin;

-- =====================================================
-- 7. PERMISSÕES
-- =====================================================

-- Para desenvolvimento: permitir acesso público à tabela
-- ATENÇÃO: Em produção, configure RLS adequadamente
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON users TO public;

-- =====================================================
-- 8. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se a atualização foi bem-sucedida
SELECT 
    'Sistema atualizado com sucesso!' as status,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN is_admin = true THEN 1 END) as administradores,
    COUNT(CASE WHEN nome IS NOT NULL THEN 1 END) as usuarios_com_nome
FROM users;

-- Mostrar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
