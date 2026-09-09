## Context

The NEXTGENXAI club web application is a Vite + React 18 single-page application styled with Tailwind CSS, Framer Motion, GSAP, and Shadcn UI. Currently, the application uses Firebase exclusively for Google OAuth sign-in (`signInWithPopup`) and auth state listening (`onAuthStateChanged`) across four components:
- `src/pages/Index.tsx`: Listens for auth changes, gates `<NewsSection />`, `<EventsSection />`, `<ContactSection />`, `<Dashboard />`, and `<MemberAccess />`.
- `src/components/MemberAccess.tsx`: Triggers Google Sign-In.
- `src/components/Dashboard.tsx`: Displays current member email and handles sign-out.
- `src/components/HomeSection.tsx`: Adjusts CTA target based on whether user is logged in.

No database (Firestore/Realtime Database) or storage is currently queried in the codebase; all sections (projects, events, news, team members) are static in code.

Furthermore, a comprehensive audit revealed 36 unused Shadcn UI components in `src/components/ui/`, 1 unused custom component (`src/components/ClickSpark.tsx`), 1 unused hook (`src/hooks/useScrollAnimations.ts`), 1 redundant file (`src/components/ui/use-toast.ts`), and legacy Firebase configuration files (`.firebaserc`).

## Goals / Non-Goals

**Goals:**
- Seamlessly replace Firebase Auth with Supabase Auth using `@supabase/supabase-js`.
- Retain identical UI/UX for member sign-in via Google, sign-out, and auth-gated sections.
- Safely prune all 36 unused Shadcn UI components and orphaned files without breaking imports or styles.
- Completely remove Firebase dependencies and configuration files.
- Ensure `npm run build` succeeds cleanly with zero TypeScript or bundle resolution errors.

**Non-Goals:**
- Transforming static sections (events, news, projects) into Supabase DB tables in this phase (this can follow as a separate database integration task).
- Altering any animations, visual styling, or layout.

## Decisions

### 1. Supabase Client Architecture
- Implement a singleton Supabase client in `src/lib/supabase.ts` configured via Vite environment variables:
  ```ts
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  ```
- *Rationale*: Simple, standard, and directly replaces `src/lib/firebase.ts`.

### 2. Authentication Flow (Google OAuth)
- Use `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })`.
- Listen to state via `supabase.auth.onAuthStateChange` and initialize using `supabase.auth.getSession()`.
- Export and use `User` from `@supabase/supabase-js`.
- *Rationale*: Standard Supabase browser OAuth pattern. Provides persistence across reloads and automatic token refresh.

### 3. Step-by-Step Pruning Strategy (Zero-Risk Cleanup)
- Keep only used UI primitives:
  - `button.tsx`
  - `sonner.tsx`
  - `toast.tsx`
  - `accordion.tsx`
  - `badge.tsx`
  - `card.tsx`
  - `carousel.tsx`
  - `dialog.tsx`
  - `input.tsx`
  - `popover.tsx`
  - `textarea.tsx`
  - `toaster.tsx`
  - `tooltip.tsx`
- Delete the 36 unreferenced UI components (`alert-dialog.tsx`, `alert.tsx`, `aspect-ratio.tsx`, `avatar.tsx`, `breadcrumb.tsx`, `calendar.tsx`, `chart.tsx`, `checkbox.tsx`, `collapsible.tsx`, `command.tsx`, `context-menu.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `form.tsx`, `hover-card.tsx`, `input-otp.tsx`, `label.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `progress.tsx`, `radio-group.tsx`, `resizable.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`, `toggle-group.tsx`, `toggle.tsx`, and `src/components/ui/use-toast.ts`).
- Delete unused custom component: `src/components/ClickSpark.tsx`.
- Delete unused hook: `src/hooks/useScrollAnimations.ts`.
- Delete unused asset: `public/placeholder.svg`.
- Remove legacy file: `.firebaserc`.

## Risks / Trade-offs

- **[Risk] Supabase Environment Variables Missing in Dev/Preview**:
  - *Mitigation*: Provide graceful fallback check in `src/lib/supabase.ts` with developer console warning, and provide `.env.example` with clear instructions.
- **[Risk] OAuth Redirect URL Configuration in Supabase Dashboard**:
  - *Mitigation*: Document that `http://localhost:8080` (and production domain) must be added under Supabase Project Settings -> Authentication -> URL Configuration.
- **[Risk] Accidental deletion of transitively required components**:
  - *Mitigation*: Our audit confirmed all 13 preserved UI components only depend on each other (`carousel` -> `button`, `toaster` -> `toast`), so removing the remaining 36 has zero risk.

## Migration Plan

1. Install `@supabase/supabase-js`.
2. Create `src/lib/supabase.ts`.
3. Update `src/pages/Index.tsx`, `src/components/MemberAccess.tsx`, `src/components/Dashboard.tsx`, and `src/components/HomeSection.tsx`.
4. Verify application build and OAuth logic.
5. Remove `src/lib/firebase.ts`, `.firebaserc`, and uninstall `firebase`.
6. Remove 36 unused UI files and orphaned components/hooks.
7. Run `npm run build` and `npm run lint` to validate zero breakage.
