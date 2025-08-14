# 🏥 DeMarco Frontend

Sistema de Gestão de Atestados Médicos - Interface Frontend

## 📋 Sobre o Projeto

O DeMarco Frontend é uma aplicação web feita em processo para o consumo da api local de atestados médicos.

### ✨ Funcionalidades Principais

- 👥 **Gestão de Colaboradores** - Cadastro, edição e controle de status
- 🏥 **Busca de CID** - Integração com API para consulta de códigos CID
- 🔐 **Sistema de Autenticação** - Login e gestão de sessões
- 📱 **Design Responsivo** - Design desktop e mobile

## 🚀 Tecnologias Utilizadas

### Core

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite 7** - Ferramenta de build ultra-rápida

### UI/UX

- **Tailwind CSS 4** - Framework CSS utility-first
- **shadcn/ui** - Componentes reutilizáveis baseados em Radix UI
- **Lucide React** - Ícones SVG modernos
- **Sonner** - Notificações toast elegantes

### Estado e Dados

- **TanStack Query** - Gerenciamento de estado do servidor
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de esquemas TypeScript
- **Axios** - Cliente HTTP

### Roteamento e Navegação

- **React Router DOM 7** - Roteamento declarativo

### Utilitários

- **Day.js** - Manipulação de datas
- **clsx** - Utilitário para classes condicionais
- **class-variance-authority** - Variantes de componentes

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/demarco-frontend.git
cd demarco-frontend
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3333
```

### 4. Execute o projeto

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Visualiza o build de produção

# Qualidade de Código
npm run lint         # Executa o ESLint
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── collaborator-card.tsx
│   ├── collaborator-filters-card.tsx
│   ├── collaborators-combobox.tsx
│   └── cid-combobox.tsx
├── hooks/              # Hooks customizados
│   ├── use-error-handler.ts
│   ├── use-mobile.ts
│   └── use-page-title.ts
├── interface/          # Tipos TypeScript
│   └── colaborator.ts
├── lib/               # Utilitários
│   └── utils.ts
├── pages/             # Páginas da aplicação
│   ├── colaborators.tsx
│   ├── login.tsx
│   └── not-found.tsx
├── services/          # Serviços de API
│   └── api.ts
├── App.tsx            # Componente raiz
├── main.tsx           # Ponto de entrada
└── index.css          # Estilos globais
```

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

- **Cores**: Palette moderna com suporte a tema claro/escuro
- **Tipografia**: Sistema escalável e legível
- **Espaçamento**: Grid system baseado em 4px
- **Componentes**: Biblioteca de componentes reutilizáveis
- **Animações**: Transições suaves e microinterações

### Componentes Principais

- `CollaboratorCard` - Card de exibição de colaborador
- `CollaboratorFiltersCard` - Filtros de busca e status
- `CollaboratorCombobox` - Seleção de colaboradores
- `CidCombobox` - Busca e seleção de códigos CID

## 🔧 Configuração de Desenvolvimento

### ESLint

O projeto utiliza ESLint com regras personalizadas para:

- TypeScript
- React
- React Hooks
- Imports

### TypeScript

Configuração TypeScript rigorosa com:

- Verificação de tipos estrita
- Path mapping configurado (`@/` aponta para `src/`)
- Suporte completo para JSX

## 🌐 Integração com API

O frontend se comunica com a API backend através de:

- **Base URL**: Configurável via variável de ambiente
- **Autenticação**: Headers automáticos
- **Error Handling**: Tratamento centralizado de erros
- **Loading States**: Estados de carregamento integrados

### Endpoints Utilizados

```typescript
GET /colaborators/all           # Lista colaboradores
PUT /colaborators/toggle-status/:id  # Altera status
DELETE /colaborators/:id        # Remove colaborador
GET /cids/:id                   # Busca código CID
```

## 📱 Responsividade

A aplicação é totalmente responsiva com breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deploy

### Build de Produção

```bash
npm run build
```

### Variáveis de Ambiente

Para produção, configure:

```env
VITE_API_URL=https://api.demarco.com
VITE_APP_NAME=DeMarco
```

⚡ **Desenvolvido com React + Vite + TypeScript**
