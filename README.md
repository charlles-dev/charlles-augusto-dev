# Charlles Augusto - Portfólio Pessoal

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Este é o repositório do meu portfólio pessoal, desenvolvido para apresentar meus projetos, experiência profissional e habilidades como Desenvolvedor Full-Stack com foco em Cybersecurity.

### [➡️ Acesse a versão ao vivo](https://SEU_DOMINIO_AQUI.com)

---

## ✨ Recursos

- **Design Responsivo:** Totalmente adaptado para desktops, tablets e dispositivos móveis.
- **Conteúdo Dinâmico:** Projetos, experiências e formação acadêmica são gerenciados via Supabase.
- **Painel Administrativo:** Uma área segura (`/admin`) para gerenciar todo o conteúdo do portfólio de forma intuitiva.
- **Animações Modernas:** Animações sutis com `Framer Motion` para uma experiência de usuário mais fluida e agradável.
- **Tema Dark:** Interface elegante com um tema escuro como padrão.
- **Internacionalização:** Suporte para múltiplos idiomas (Português e Inglês).

---

## 🛠️ Stack de Tecnologia

| Categoria              | Tecnologia                                                              |
| ---------------------- | ----------------------------------------------------------------------- |
| **Frontend**           | [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Estilização**        | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| **Animações**          | [Framer Motion](https://www.framer.com/motion/)                         |
| **Backend & Database** | [Supabase](https://supabase.io/) (PostgreSQL, Auth, Storage)            |
| **Gerenciamento de Estado** | [TanStack Query](https://tanstack.com/query/latest) (React Query)       |
| **Roteamento**         | [React Router](https://reactrouter.com/)                                |
| **Deploy**             | [Vercel](https://vercel.com/)                                           |

---

## 🚀 Como Executar Localmente

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/en) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
      ```bash
      cp .env.example .env
      ```
    - Abra o arquivo `.env` e adicione suas credenciais do Supabase. Você pode encontrá-las no painel do seu projeto em **Settings > API**.

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

O projeto estará disponível em `http://localhost:8080`.

---

## 🔐 Painel Administrativo

O portfólio possui uma área de administração para gerenciar o conteúdo dinâmico.

- **Acesso:** Navegue para `/auth` para criar uma conta ou fazer login.
- **Gerenciamento:** Após o login, você será redirecionado para `/admin`, onde poderá adicionar, editar, reordenar e excluir projetos, experiências e formações.

---

## 🚀 Deploy

Este projeto está configurado para deploy contínuo na [Vercel](https://vercel.com/). Qualquer push para a branch `main` acionará um novo build e deploy automaticamente.