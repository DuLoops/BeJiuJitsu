# Project Context: DoJits
- **Tech Stack:** React Native, Supabase, Zustand, React Query.
- **Rules:**
  - When fetching data, strictly use React Query hooks.
  - If modifying state, check the Zustand store in `/src/store`.
  - **Auth:** Use `@authStore` for authentication state.
  - **Design & Components:**
    - Use `ThemedCard`, `ThemedText`, `ThemedButton` from `src/components/ui/atoms/*`
    - Use `Colors` constant from `src/constants/Colors.ts` for all colors.
    - Adhere to the design guide (`docs/design-guide.md`) and ensure a consistent look.
  - **Database:**
    - When modifying the database, use the `supabase-mcp-server` of project id: `ejzgwpqhsrnazpckndkb`.
    - Record all changes and queries in `docs/supabase-history.md`.
    - After modifying the database, update types by running: `npx --yes supabase gen types typescript --linked > src/supabase/types.ts`
    
## GUIDE
- Never git reverse without commiting current changes.