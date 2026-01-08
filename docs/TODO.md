# Sprint 3: Explore page
To-Do list required to make the Explore and Profile pages operational in Expo, Supabase, React Query, and Zustand.

### **Phase 1: Database & Backend Logic (Supabase)**

* [ ] **Fix Schema Integrity:** Rename `trainings.useId` to `trainings.user_id` and add a foreign key constraint linking to `profiles.id` to ensure training logs are correctly associated with users[cite: 2908, 2913].
* [ ] **Consolidate Linking Logic:** Remove the `skill_content_links` table and add nullable `post_id` and `training_activity_id` columns directly to `user_skill_notes` and `user_skill_videos` to simplify querying[cite: 2933].
* [ ] **Add Voting Columns:** Add `upvotes` (int), `downvotes` (int), and `hot_score` (float) columns to both the `posts` table and `user_skills` table[cite: 70].
* [ ] **Implement Hot Algorithm Trigger:** Create a PostgreSQL function and trigger that runs on insert/update of votes to calculate `hot_score` using the formula: `sign(score) × log10(max(|score|, 1)) + (time - epoch) / 45000`[cite: 25].
* [ ] **Create Unified Feed Function:** Write a PostgreSQL RPC function (e.g., `get_explore_feed`) that performs a `UNION ALL` query to combine:
    1.  **Logs** (from `activities`/`trainings`).
    2.  **Discussions** (from `posts`).
    3.  **SkillTree Posts** (from `user_skills` where `is_public = true`).
    * **Requirement:** The function must return a standardized object (id, type, content, created_at, author, hot_score) for the frontend to consume[cite: 69].
* [ ] **Enable Search:** Enable the `pg_trgm` extension in Supabase and create indices on `posts.content`, `skills.name`, and `profiles.username` to support the search bar functionality[cite: 44].
    
### **Phase 2: Explore Screen Functionality (React Native)**

* [ ] **Fetch Unified Data:** Implement `useInfiniteQuery` (React Query) to call the `get_explore_feed` RPC function, handling pagination[cite: 3801].
* [ ] **Build Feed List Container:** Create a `FlatList` that renders the unified data array.
* [ ] **Implement Post Type Rendering:** Create a switch/conditional inside the list's `renderItem` to display different layouts based on the data type:
    * **Activity Item:** Displays User + "Logged [Activity Type]" + Date[cite: 22].
    * **Discussion Item:** Displays Title + Body + Vote Counter + "Oss" (Upvote) Button[cite: 31].
    * **SkillTree Item:** Displays Note/Video + "Linked Skill: [Skill Name]" Badge + Vote Counter[cite: 40].
* [ ] **Implement Voting Logic:** Create a `toggleVote` function that calls Supabase to increment/decrement the vote count on the specific `post_id` or `user_skill_id`.
* [ ] **Implement Filtering:** Add a horizontal ScrollView with filter chips ("Logs", "Discussions", "Skills"). Pass the selected filter value as a parameter to the `get_explore_feed` RPC function to refine results server-side[cite: 45].
* [ ] **Implement Search:** Create a text input that passes a search string to the Supabase query to filter results by text content or skill name[cite: 43].

### **Phase 3: Post Creation**

* [ ] **Create Post Modal:** Build a simple modal with a form to create a new entry in the `posts` table.
* [ ] **Implement Skill Tagging:** Add a dropdown in the creation modal that queries the `skills` table, allowing users to select a `skill_id` if they are posting a SkillTree item[cite: 37].
* [ ] **Handle Media Upload:** Implement functionality to pick an image/video, upload it to Supabase Storage, and save the returned URL to the `posts.media_url` or `user_skill_videos` table[cite: 31, 2337].

### **Phase 4: Profile Page Logic**

* [ ] **Fetch Profile Data:** Query the `profiles` table to display `username`, `belt`, and `bio`[cite: 50].
* [ ] **Calculate Stats:** Write a SQL query to count `competition_matches` where `outcome = 'WIN'` vs `outcome = 'LOSE'` for the specific `user_id` and display the ratio[cite: 52].
* [ ] **Fetch User History:** Re-use the `get_explore_feed` logic/component but apply a `WHERE user_id = [current_profile_id]` filter to show only that user's history[cite: 54].
* [ ] **Edit Profile:** Create a form to update `bio` and `belt` rank in the `profiles` table[cite: 2188].