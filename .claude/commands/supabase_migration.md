# Create Supabase Migration

Create a database migration for: $ARGUMENTS

Follow these steps in order:

## 1. Analyze Current Database Schema
- Use the Supabase MCP server to examine the current database structure
- Document existing tables, columns, indexes, and relationships
- Identify any constraints, triggers, or custom functions
- Take note of current RLS (Row Level Security) policies if relevant

## 2. Plan the Migration
- Based on the requested changes ($ARGUMENTS), determine what needs to be modified:
  - New tables to create
  - Existing tables to alter (add/remove/modify columns)
  - Indexes to add or remove  
  - Constraints to add or modify
  - RLS policies to update
  - Functions or triggers to create/modify
- Identify any potential data migration needs
- Consider rollback requirements

## 3. Create the Migration File
- Generate a new migration using Supabase CLI:
  ```bash
  npx supabase migration new [descriptive_migration_name]
  ```
- Write the SQL migration based on your analysis:
  - Use `CREATE TABLE` for new tables
  - Use `ALTER TABLE` for modifying existing tables
  - Include proper data types, constraints, and indexes
  - Add RLS policies if needed
  - Include any necessary data transformations
- Add comments explaining complex changes
- Ensure the migration is idempotent where possible

## 4. Generate Updated TypeScript Types
- Generate the latest TypeScript types from the updated schema:
  ```bash
  npx supabase gen types typescript --linked > src/supabase/types.ts
  ```
- Verify the types file was generated successfully
- Check that the new types reflect your schema changes
- Ensure no TypeScript compilation errors in the project

## 5. Test and Verify
- Run your application's test suite to ensure compatibility
- Check that existing queries still work with the new schema
- Verify any new database operations work as expected
- Test RLS policies if they were modified

## 6. Document the Changes
- Update any relevant documentation about the database schema
- Add comments to the migration file explaining the purpose
- Update API documentation if database changes affect endpoints
- Note any breaking changes that might affect other developers

## Important Guidelines:
- **Always backup**: Ensure you can rollback if something goes wrong
- **Incremental changes**: Keep migrations focused and atomic
- **Naming convention**: Use descriptive migration names (e.g., `add_user_preferences_table`)
- **Data safety**: Be careful with operations that might lose data (DROP, ALTER COLUMN type changes)
- **RLS policies**: Don't forget to set up appropriate security policies for new tables
- **Indexes**: Add indexes for columns that will be frequently queried
- **Foreign keys**: Maintain referential integrity with proper constraints

## Common Migration Patterns:
- **Adding a table**: Include primary key, timestamps, and RLS policies
- **Adding a column**: Consider default values and whether it should be nullable
- **Modifying a column**: Be careful about data type changes and existing data
- **Removing a column**: Consider deprecation period before actual removal
- **Adding relationships**: Use proper foreign key constraints

If you encounter any errors during the process, stop and ask for guidance before proceeding further.
