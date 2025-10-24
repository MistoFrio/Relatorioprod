-- Script SQL MÍNIMO - Apenas para adicionar campo NOME
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar coluna nome se não existir
ALTER TABLE users ADD COLUMN IF NOT EXISTS nome VARCHAR(255);

-- 2. Atualizar registros existentes que não têm nome
UPDATE users 
SET nome = CASE 
    WHEN cpf = '000.000.000-00' THEN 'Administrador'
    ELSE 'Usuário ' || SUBSTRING(cpf, 1, 3) || '***'
END
WHERE nome IS NULL OR nome = '';

-- 3. Tornar a coluna nome obrigatória
ALTER TABLE users ALTER COLUMN nome SET NOT NULL;

-- 4. Remover função existente e recriar com nome
DROP FUNCTION IF EXISTS authenticate_user(TEXT, TEXT);

-- 5. Criar nova função de autenticação com nome
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

-- 6. Verificar se funcionou
SELECT 'Campo nome adicionado com sucesso!' as status, COUNT(*) as total_usuarios FROM users;
