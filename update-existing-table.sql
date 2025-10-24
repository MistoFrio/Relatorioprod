-- Script para atualizar tabela existente com campo nome
-- Execute este script se você já tem dados na tabela users

-- Adicionar coluna nome se não existir
ALTER TABLE users ADD COLUMN IF NOT EXISTS nome VARCHAR(255);

-- Atualizar registros existentes que não têm nome
UPDATE users 
SET nome = 'Usuário ' || SUBSTRING(cpf, 1, 3) || '***' 
WHERE nome IS NULL OR nome = '';

-- Tornar a coluna nome obrigatória
ALTER TABLE users ALTER COLUMN nome SET NOT NULL;

-- Atualizar usuário admin padrão se existir
UPDATE users 
SET nome = 'Administrador' 
WHERE cpf = '000.000.000-00' AND (nome IS NULL OR nome = '');

-- Recriar a função de autenticação com nome
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

-- Verificar se a atualização foi bem-sucedida
SELECT 'Atualização concluída!' as status, COUNT(*) as total_usuarios FROM users;
