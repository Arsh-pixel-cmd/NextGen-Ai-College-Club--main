## ADDED Requirements

### Requirement: Supabase Client Initialization
The application SHALL initialize a singleton Supabase client using environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

#### Scenario: Missing environment variables
- **WHEN** the application boots and environment variables are undefined
- **THEN** an informative error or warning SHALL be logged to assist developers during setup

#### Scenario: Valid client initialization
- **WHEN** valid Supabase credentials are provided in `.env`
- **THEN** the client SHALL be exported from `src/lib/supabase.ts` and ready for auth operations

### Requirement: Google OAuth Sign-In via Supabase
The application SHALL allow users to sign in with their Google account through Supabase OAuth.

#### Scenario: Trigger Google Sign-In
- **WHEN** the user clicks "Sign In with Google" in the Member Access section
- **THEN** the application SHALL initiate `supabase.auth.signInWithOAuth({ provider: 'google' })`
- **THEN** on successful authentication, the user state SHALL update to authenticated

#### Scenario: Google Sign-In Failure
- **WHEN** an authentication error occurs during OAuth sign-in
- **THEN** an error notification toast SHALL be displayed to the user via Sonner
- **THEN** the error SHALL be logged to the console

### Requirement: Reactive Authentication State Subscription
The application SHALL reactively listen to authentication state changes (sign-in, sign-out, session restoration) across components.

#### Scenario: Initial Session Check
- **WHEN** the application mounts in `src/pages/Index.tsx`
- **THEN** the application SHALL retrieve the active session via `supabase.auth.getSession()` and update user state

#### Scenario: Auth State Change Event
- **WHEN** a user signs in, signs out, or token refreshes
- **THEN** `supabase.auth.onAuthStateChange` SHALL fire and synchronize the user state across `Index.tsx`, `Dashboard.tsx`, and `HomeSection.tsx`

### Requirement: User Sign-Out
The application SHALL provide a reliable sign-out mechanism from the member Dashboard.

#### Scenario: User clicks Sign Out
- **WHEN** an authenticated user clicks "Sign Out" in `Dashboard.tsx`
- **THEN** `supabase.auth.signOut()` SHALL be invoked
- **THEN** the session SHALL be invalidated and the application UI SHALL update to show the unauthenticated state (e.g. Member Access section)
