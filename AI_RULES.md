# AI Development Rules

This document outlines the technology stack and best practices for AI-assisted development of this application.

## Technology Stack

- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/) for a fast development experience.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for static typing and improved code quality.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) for accessible and reusable components.
- **Backend & Database**: [Supabase](https://supabase.io/) for database, authentication, and storage.
- **State Management**: [React Query (`@tanstack/react-query`)](https://tanstack.com/query/latest) for managing server state, caching, and data fetching.
- **Routing**: [React Router](https://reactrouter.com/) for client-side routing.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for declarative animations.
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.

## Library Usage Rules

- **UI Components**:
  - **ALWAYS** use components from `shadcn/ui` when available (`@/components/ui/*`).
  - For custom components, follow the structure and styling conventions of `shadcn/ui`.
  - Use `lucide-react` for icons.

- **Styling**:
  - **ALWAYS** use Tailwind CSS utility classes for styling. Avoid writing custom CSS files.
  - Use the `cn` utility from `@/lib/utils` to merge Tailwind classes conditionally.
  - Colors, fonts, and spacing are defined in `tailwind.config.ts` and `src/index.css`. Adhere to this design system.

- **Data Fetching**:
  - **ALWAYS** use `@tanstack/react-query` (`useQuery`, `useMutation`) for all interactions with the Supabase API.
  - Use the Supabase client from `@/integrations/supabase/client.ts` for all database calls.

- **State Management**:
  - Use React Query for server state.
  - For simple client-side state, use React's built-in `useState` and `useReducer` hooks. Avoid complex state management libraries like Redux unless absolutely necessary.

- **Forms**:
  - **ALWAYS** use `react-hook-form` for managing forms.
  - **ALWAYS** use `zod` for schema validation, integrated with `react-hook-form` via `@hookform/resolvers`.

- **Routing**:
  - All routes should be defined in `src/App.tsx`.
  - Pages should be located in `src/pages/`.

- **Animations**:
  - Use `framer-motion` for all UI animations to ensure consistency and performance.
  - Respect user's motion preferences using the `useReducedMotion` hook.