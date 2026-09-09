## 1. Supabase Client & Dependency Setup

- [x] 1.1 Install `@supabase/supabase-js` dependency
- [x] 1.2 Create `src/lib/supabase.ts` with singleton client configuration and env validation
- [x] 1.3 Update `.env` with Supabase credentials template and create `.env.example`

## 2. Authentication Integration

- [x] 2.1 Update `src/components/MemberAccess.tsx` to use Supabase `signInWithOAuth` for Google sign-in
- [x] 2.2 Update `src/components/Dashboard.tsx` to use `supabase.auth.signOut()` and display Supabase user email
- [x] 2.3 Update `src/pages/Index.tsx` to manage Supabase `User` state, initial session retrieval, and auth change listener
- [x] 2.4 Update `src/components/HomeSection.tsx` to accept Supabase `User` type for dynamic CTA buttons

## 3. Firebase Decommissioning

- [x] 3.1 Delete `src/lib/firebase.ts`
- [x] 3.2 Delete `.firebaserc`
- [x] 3.3 Remove `firebase` from `package.json` and prune lockfile

## 4. Safe Codebase Cleanup (Extra Files Removal)

- [x] 4.1 Delete 36 unused Shadcn UI components in `src/components/ui/` (`alert-dialog.tsx`, `alert.tsx`, `aspect-ratio.tsx`, `avatar.tsx`, `breadcrumb.tsx`, `calendar.tsx`, `chart.tsx`, `checkbox.tsx`, `collapsible.tsx`, `command.tsx`, `context-menu.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `form.tsx`, `hover-card.tsx`, `input-otp.tsx`, `label.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `progress.tsx`, `radio-group.tsx`, `resizable.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`, `toggle-group.tsx`, `toggle.tsx`, and `src/components/ui/use-toast.ts`)
- [x] 4.2 Delete unused custom component `src/components/ClickSpark.tsx`
- [x] 4.3 Delete unused custom hook `src/hooks/useScrollAnimations.ts`
- [x] 4.4 Delete unused asset `public/placeholder.svg`
- [x] 4.5 Remove unused package `lenis` from `package.json`

## 5. Verification & Testing

- [x] 5.1 Run `npm run build` to verify zero TypeScript and bundling errors
- [x] 5.2 Run `npm run lint` and fix any linting warnings/errors
- [x] 5.3 Validate UI rendering and auth listener responsiveness on local dev server
