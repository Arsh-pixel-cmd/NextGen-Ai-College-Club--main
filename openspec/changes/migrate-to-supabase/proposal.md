## Why

The NEXTGENXAI club web application currently relies on Firebase strictly for Google OAuth authentication and project configuration. Transitioning to Supabase provides a unified backend architecture with PostgreSQL, Row Level Security (RLS), and native SQL/Auth capabilities for upcoming club features (e.g. member profiles, event registration, news CMS) while reducing bundle size. Simultaneously, the codebase contains extensive dead boilerplate—including 36 unimported Shadcn UI components, an unused particle click spark component, unused hooks, and obsolete Firebase configs—which should be safely pruned without breaking any current application functionality.

## What Changes

- **Replace Firebase with Supabase Auth**: Initialize `@supabase/supabase-js` in `src/lib/supabase.ts` with Google OAuth support (`signInWithOAuth`, `signOut`, and `onAuthStateChange`).
- **Update Components & State**: Update `src/pages/Index.tsx`, `src/components/MemberAccess.tsx`, `src/components/Dashboard.tsx`, and `src/components/HomeSection.tsx` to subscribe to Supabase authentication state and consume Supabase `User` / `Session` objects without altering the user experience.
- **Remove Firebase Configuration & Dependencies**: Remove `src/lib/firebase.ts`, `.firebaserc`, and `firebase` package from `package.json`.
- **Update Environment Variables**: Replace `VITE_FIREBASE_*` variables with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` and provide a clean `.env.example`.
- **Safely Prune Redundant / Extra Files**:
  - Remove 36 unused Shadcn UI components in `src/components/ui/` (e.g., `alert-dialog.tsx`, `sidebar.tsx`, `context-menu.tsx`, `chart.tsx`, `table.tsx`, etc.).
  - Remove unused component `src/components/ClickSpark.tsx`.
  - Remove unused hook `src/hooks/useScrollAnimations.ts`.
  - Remove duplicate pointer `src/components/ui/use-toast.ts` (standardized on `src/hooks/use-toast.ts`).
  - Remove unused public asset `public/placeholder.svg`.
  - Prune unused packages from `package.json` (`lenis`, `firebase`, and unused UI primitives if desired).

## Capabilities

### New Capabilities
- `supabase-auth`: Supabase authentication service providing Google OAuth login, signout, and reactive auth state listening.
- `codebase-cleanup`: Systematic removal of unused UI components, hooks, unused assets, and legacy Firebase configurations while guaranteeing zero regression.

### Modified Capabilities
<!-- None: No existing specs defined -->

## Impact

- **Affected Code**: `src/pages/Index.tsx`, `src/components/MemberAccess.tsx`, `src/components/Dashboard.tsx`, `src/components/HomeSection.tsx`, `src/lib/`.
- **Dependencies**: Remove `firebase`, install `@supabase/supabase-js`.
- **Environment**: Update `.env` with Supabase project credentials.
- **Breaking Changes**: None to end users. Club members can continue signing in via Google seamlessly.
