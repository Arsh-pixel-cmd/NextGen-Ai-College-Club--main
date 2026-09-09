## ADDED Requirements

### Requirement: Safe Removal of Unused UI Boilerplate
The codebase SHALL remove unused Shadcn UI component files from `src/components/ui/` that have zero inbound references across the codebase.

#### Scenario: Verify component safety before deletion
- **WHEN** analyzing component files in `src/components/ui/`
- **THEN** only files with 0 imports from other components, pages, or routes SHALL be removed
- **THEN** essential components (`button.tsx`, `sonner.tsx`, `toast.tsx`, `accordion.tsx`, `badge.tsx`, `card.tsx`, `carousel.tsx`, `dialog.tsx`, `input.tsx`, `popover.tsx`, `textarea.tsx`, `toaster.tsx`, `tooltip.tsx`) SHALL remain intact

#### Scenario: Build verification post-cleanup
- **WHEN** unused UI components are deleted
- **THEN** running `npm run build` SHALL succeed with zero TypeScript or module resolution errors

### Requirement: Safe Removal of Unused Custom Components and Hooks
The codebase SHALL remove obsolete/unused custom components and hooks.

#### Scenario: Removal of unreferenced components
- **WHEN** `ClickSpark.tsx` is determined to have 0 usages across the project
- **THEN** `src/components/ClickSpark.tsx` SHALL be removed cleanly

#### Scenario: Removal of unreferenced hooks
- **WHEN** `useScrollAnimations.ts` is determined to have 0 usages across the project
- **THEN** `src/hooks/useScrollAnimations.ts` SHALL be removed cleanly

### Requirement: Firebase Decommissioning
The codebase SHALL remove all Firebase artifacts, configs, and dependencies once Supabase is integrated.

#### Scenario: Delete legacy Firebase files
- **WHEN** Supabase client and auth integration are verified
- **THEN** `src/lib/firebase.ts` and `.firebaserc` SHALL be deleted
- **THEN** `firebase` SHALL be removed from `package.json` dependencies
