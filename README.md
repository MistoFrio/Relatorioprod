# Sistema de Gratificações

Sistema web para gerenciamento de usuários e gratificações, desenvolvido com React, TypeScript e Supabase.

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **Roteamento:** React Router DOM
- **Build Tool:** Vite

## 📋 Funcionalidades

### 🔐 Autenticação
- Login com CPF e senha
- Sistema de autenticação personalizado via Supabase
- Proteção de rotas administrativas

### 👥 Gerenciamento de Usuários
- Painel administrativo completo
- CRUD de usuários (Criar, Ler, Atualizar, Deletar)
- Validação de CPF
- Links de destino personalizados por usuário

### 🎨 Interface
- Design moderno e responsivo
- Componentes reutilizáveis com shadcn/ui
- Feedback visual com toasts e alerts
- Preview de links de destino

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone https://github.com/MistoFrio/Relatorioprod.git
cd Relatorioprod
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Configure o banco de dados
Execute o script SQL em `banco de dados/sistema-gratificacoes-completo.sql` no Supabase SQL Editor.

### 5. Execute o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 📊 Estrutura do Banco de Dados

### Tabela `users`
- `id` - UUID (chave primária)
- `nome` - VARCHAR(255) - Nome do usuário
- `cpf` - VARCHAR(14) - CPF formatado
- `senha` - TEXT - Senha do usuário
- `link_destino` - TEXT - URL de redirecionamento
- `is_admin` - BOOLEAN - Se é administrador
- `created_at` - TIMESTAMP - Data de criação
- `updated_at` - TIMESTAMP - Data de atualização

### Função `authenticate_user`
Função personalizada para autenticação via CPF e senha.

## 🔑 Credenciais Padrão

### Administrador
- **CPF:** `000.000.000-00`
- **Senha:** `admin123`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI (shadcn/ui)
│   ├── LinkPreview.tsx # Preview de links
│   ├── ProtectedRoute.tsx # Proteção de rotas
│   └── UserModal.tsx  # Modal de usuários
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e configurações
│   ├── supabaseClient.ts # Cliente Supabase
│   └── utils.ts        # Funções utilitárias
├── pages/              # Páginas da aplicação
│   ├── AdminPage.tsx   # Painel administrativo
│   ├── HomePage.tsx    # Página inicial
│   └── LoginPage.tsx   # Página de login
└── main.tsx           # Ponto de entrada
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify
1. Conecte o repositório à Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através dos issues do GitHub ou por email.

---

Desenvolvido com ❤️ usando React + Supabase
