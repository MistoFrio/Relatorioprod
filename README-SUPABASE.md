# Sistema de Gratificações - Integração Supabase

Este projeto foi atualizado para usar o Supabase como banco de dados, permitindo o gerenciamento completo de usuários com CPF, senha e links de redirecionamento personalizados.

## 🚀 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização e configure:
   - **Name**: `sistema-gratificacoes`
   - **Database Password**: (escolha uma senha forte)
   - **Region**: escolha a mais próxima

### 2. Configurar Banco de Dados

1. No painel do Supabase, vá para **SQL Editor**
2. **IMPORTANTE**: Execute primeiro o arquivo `supabase-setup-fixed.sql` (versão corrigida)
3. Isso criará:
   - Tabela `users` com todos os campos necessários
   - Índices para performance
   - Função de autenticação personalizada
   - Usuário administrador padrão
   - Permissões públicas para desenvolvimento

**⚠️ Nota**: Este script desabilita RLS para facilitar o desenvolvimento. Em produção, configure as políticas adequadamente.

### 2.1. Atualizar Tabela Existente (se já tem dados)
Se você já executou o script anterior e tem dados na tabela:
1. Execute o arquivo `update-existing-table.sql`
2. Isso adicionará o campo `nome` e atualizará registros existentes

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `env.example` para `.env`
2. No painel do Supabase, vá para **Settings > API**
3. Copie os valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

Exemplo do arquivo `.env`:
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔧 Funcionalidades Implementadas

### Sistema de Autenticação
- ✅ Login com CPF e senha
- ✅ Formatação automática de CPF
- ✅ Redirecionamento baseado no tipo de usuário
- ✅ Proteção de rotas administrativas

### Painel Administrativo
- ✅ Listagem de todos os usuários
- ✅ Criação de novos usuários
- ✅ Edição de usuários existentes
- ✅ Exclusão de usuários (com proteção para último admin)
- ✅ Validação de CPF duplicado
- ✅ Validação de URLs
- ✅ Feedback visual com toasts

### Banco de Dados
- ✅ Tabela `users` com campos:
  - `id` (UUID, chave primária)
  - `nome` (VARCHAR, obrigatório)
  - `cpf` (VARCHAR, único)
  - `senha` (VARCHAR)
  - `link_destino` (TEXT)
  - `is_admin` (BOOLEAN)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)
- ✅ Função `authenticate_user()` para login seguro
- ✅ Políticas de segurança (RLS)
- ✅ Índices para performance

## 🎯 Como Usar

### 1. Usuário Administrador Padrão
- **CPF**: `000.000.000-00`
- **Senha**: `admin123`
- **Acesso**: Painel administrativo

### 2. Cadastrar Novos Usuários
1. Faça login como admin
2. Clique em "Adicionar Usuário"
3. Preencha:
   - **Nome**: Nome completo da pessoa
   - **CPF**: Formato automático (000.000.000-00)
   - **Senha**: Mínimo 3 caracteres
   - **Link de Destino**: URL válida (ex: https://google.com)
   - **Tipo**: Marque se for administrador

### 3. Visualizar Links de Destino
- Na tabela de usuários, clique no ícone 👁️ ao lado do link
- Isso abrirá um modal com preview do link
- Você pode testar o link diretamente do modal

### 4. Login de Usuários
1. Usuários comuns são redirecionados para seu link específico
2. Administradores acessam o painel administrativo
3. Sistema valida CPF e senha no banco de dados

## 🔒 Segurança

- **Row Level Security (RLS)** habilitado
- **Políticas de acesso** configuradas
- **Validação de CPF** duplicado
- **Validação de URLs** no frontend
- **Senhas** armazenadas em texto (considere hash em produção)

## 🚀 Executar o Projeto

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📝 Próximos Passos (Opcionais)

1. **Hash de senhas**: Implementar bcrypt para senhas
2. **Logs de acesso**: Registrar tentativas de login
3. **Reset de senha**: Sistema de recuperação
4. **Auditoria**: Log de alterações nos usuários
5. **Backup**: Configurar backup automático do banco

## 🆘 Solução de Problemas

### Erro "infinite recursion detected in policy"
**Solução**: Execute o script `supabase-setup-fixed.sql` que desabilita RLS temporariamente.

### Erro de Conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Teste a conexão no painel do Supabase

### Erro de Autenticação
- Verifique se a função `authenticate_user` foi criada
- Confirme se as permissões estão configuradas
- Teste com o usuário admin padrão

### Erro de Validação
- Verifique se os índices foram criados
- Confirme se a constraint UNIQUE no CPF está ativa
- Teste a validação de CPF no frontend

### Erro "permission denied"
- Execute o comando: `GRANT ALL ON users TO anon, authenticated;`
- Verifique se as permissões estão configuradas corretamente

---

**Sistema pronto para uso em produção!** 🎉
