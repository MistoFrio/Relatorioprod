-- Script para atualizar regras de senha automática
-- Execute este script no SQL Editor do Supabase

-- Criar função para gerar senha baseada no cargo e CPF (regras corrigidas)
CREATE OR REPLACE FUNCTION generate_password_by_cargo(user_cpf TEXT, user_cargo TEXT)
RETURNS TEXT AS $$
DECLARE
    cpf_numbers TEXT;
    generated_password TEXT;
BEGIN
    -- Remover formatação do CPF (pontos e hífens)
    cpf_numbers := REGEXP_REPLACE(user_cpf, '[^0-9]', '', 'g');
    
    -- Gerar senha baseada no cargo (REGRAS CORRIGIDAS)
    IF user_cargo = 'Ajudante' THEN
        -- Senha = 4 últimos dígitos do CPF
        generated_password := SUBSTRING(cpf_numbers, LENGTH(cpf_numbers) - 3, 4);
    ELSIF user_cargo = 'Operador' THEN
        -- Senha = 4 primeiros dígitos do CPF
        generated_password := SUBSTRING(cpf_numbers, 1, 4);
    ELSE
        -- Para outros cargos, usar CPF completo sem formatação
        generated_password := cpf_numbers;
    END IF;
    
    RETURN generated_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir execução da função de geração de senha
GRANT EXECUTE ON FUNCTION generate_password_by_cargo TO anon, authenticated;

-- Exemplo de uso:
-- SELECT generate_password_by_cargo('096.533.446-40', 'Ajudante'); -- Retorna: 4640
-- SELECT generate_password_by_cargo('096.533.446-40', 'Operador'); -- Retorna: 0965
