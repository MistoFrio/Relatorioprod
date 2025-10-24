-- Script SIMPLIFICADO para adicionar coluna cargo
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar coluna cargo
ALTER TABLE users ADD COLUMN IF NOT EXISTS cargo VARCHAR(50);

-- 2. Atualizar registros existentes
UPDATE users 
SET cargo = CASE 
    WHEN is_admin = true THEN 'Administrador'
    ELSE 'Operador'
END
WHERE cargo IS NULL OR cargo = '';

-- 3. Tornar coluna obrigatória
ALTER TABLE users ALTER COLUMN cargo SET NOT NULL;

-- 4. Criar índice
CREATE INDEX IF NOT EXISTS idx_users_cargo ON users(cargo);

-- 5. Remover função existente
DROP FUNCTION IF EXISTS authenticate_user(TEXT, TEXT);

-- 6. Recriar função com cargo
CREATE FUNCTION authenticate_user(user_cpf TEXT, user_password TEXT)
RETURNS TABLE (
    id UUID,
    nome VARCHAR(255),
    cpf VARCHAR(14),
    link_destino TEXT,
    is_admin BOOLEAN,
    cargo VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.nome, u.cpf, u.link_destino, u.is_admin, u.cargo, u.created_at
    FROM users u
    WHERE u.cpf = user_cpf AND u.senha = user_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Permitir execução
GRANT EXECUTE ON FUNCTION authenticate_user TO anon, authenticated;

-- 8. Verificar resultado
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'cargo';
