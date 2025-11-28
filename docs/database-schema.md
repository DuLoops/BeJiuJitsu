# BeJiuJitsu Database Schema Documentation

## Overview

BeJiuJitsu uses a PostgreSQL database hosted on Supabase. The schema is designed to support a comprehensive BJJ (Brazilian Jiu-Jitsu) training tracking application with the following core domains:

- **User Management**: Profiles, academies, and social connections
- **Skill Tracking**: Skills, user skills, notes, and videos
- **Training Logging**: Training sessions and activities
- **Competition Tracking**: Competitions, divisions, and matches
- **Social Features**: Posts, follows, and community engagement
- **Goal Management**: Personal goal setting and tracking

## Entity Relationship Overview

```
┌─────────────┐
│  profiles   │──┐
└─────────────┘  │
       │         │
       │has many │
       ▼         │
┌─────────────┐  │
│ user_skills │  │
└─────────────┘  │
       │         │
       │         │
       ▼         │
┌──────────────────┐
│ user_skill_notes │
│user_skill_videos │
└──────────────────┘
       │
       │linked via
       ▼
┌────────────────────┐
│skill_content_links │──┐
└────────────────────┘  │
                        │references
                        ├──► training_activities
                        ├──► competition_matches
                        └──► posts

┌─────────────┐
│  trainings  │──► training_activities ──► training_activity_values
└─────────────┘

┌──────────────┐
│ competitions │──► competition_divisions ──► competition_matches
└──────────────┘        └──► tournament_brands

┌─────────────┐
│user_follows │ (self-referencing profiles)
└─────────────┘
```

---

## Table Reference

### 1. profiles

**Purpose**: Core user profile information for BJJ practitioners.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | User ID (synced with Supabase Auth) |
| username | string | nullable, unique | User's display name |
| full_name | string | nullable | User's full name |
| avatar | string | nullable | URL to profile picture |
| belt | Belts enum | nullable | Current BJJ belt rank |
| stripes | number | nullable | Number of stripes on current belt (0-4) |
| academy_id | number | nullable, FK | Reference to academy |
| weight | number | nullable | User's weight (for competition tracking) |
| role | string | nullable | User role (practitioner, instructor, etc.) |
| created_at | timestamp | DEFAULT now() | Account creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last profile update |

**Relationships**:
- **belongs to** `academy` (via academy_id)
- **has many** `user_skills`
- **has many** `trainings` (via useId - note: typo in schema)
- **has many** `competitions`
- **has many** `posts`
- **has many** `goals`
- **has many** `user_follows` (as follower or following)

**Usage Example**:
```typescript
// Fetch profile with academy info
const { data } = await supabase
  .from('profiles')
  .select('*, academy:academy(*)')
  .eq('id', userId)
  .single();
```

**Business Logic**:
- Belt progression: WHITE → BLUE → PURPLE → BROWN → BLACK
- Kids belts: GRAY → YELLOW → ORANGE → GREEN
- Stripes range from 0-4 before promotion

---

### 2. academy

**Purpose**: Represents BJJ academies/gyms where users train.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | number | PRIMARY KEY, auto-increment | Academy unique identifier |
| name | string | required | Academy name |
| location | string | nullable | Physical location/address |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last update timestamp |

**Relationships**:
- **has many** `profiles`

**Usage Example**:
```typescript
// Create academy
const { data } = await supabase
  .from('academy')
  .insert({ name: 'Gracie Barra', location: 'Los Angeles, CA' })
  .select()
  .single();
```

---

### 3. skills

**Purpose**: Master list of BJJ techniques and skills (both predefined and user-created).

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Skill unique identifier |
| name | string | required | Technique name (e.g., "Triangle Choke") |
| category | Category enum | required | Skill category classification |
| is_public | boolean | DEFAULT false | Whether skill is available to all users |
| creator_id | string (UUID) | nullable | User who created custom skill |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |

**Relationships**:
- **has many** `user_skills`

**Usage Example**:
```typescript
// Fetch all public skills in Submission category
const { data } = await supabase
  .from('skills')
  .select('*')
  .eq('is_public', true)
  .eq('category', 'Submission')
  .order('name');
```

**Business Logic**:
- Public skills are created by admins and available to all users
- Users can create private custom skills specific to their training
- Skills cannot be deleted if referenced by user_skills

---

### 4. user_skills

**Purpose**: Junction table linking users to skills they've learned or are tracking.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | User skill unique identifier |
| user_id | string (UUID) | required, FK | Reference to profile |
| skill_id | string (UUID) | required, FK | Reference to skill |
| created_at | timestamp | DEFAULT now() | When user added this skill |
| updated_at | timestamp | nullable | Last modification timestamp |

**Relationships**:
- **belongs to** `profiles` (via user_id)
- **belongs to** `skills` (via skill_id)
- **has many** `user_skill_notes`
- **has many** `user_skill_videos`

**Constraints**:
- Unique constraint on (user_id, skill_id) to prevent duplicates

**Usage Example**:
```typescript
// Fetch user's skills with full details
const { data } = await supabase
  .from('user_skills')
  .select(`
    *,
    skill:skills(*),
    user_skill_notes(*),
    user_skill_videos(*)
  `)
  .eq('user_id', userId);
```

---

### 5. user_skill_notes

**Purpose**: Stores text notes/instructions for user skills (e.g., technique details, tips).

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Note unique identifier |
| user_skill_id | string (UUID) | required, FK | Reference to user_skill |
| note | string | required | Note content/text |
| note_order | number | DEFAULT 0 | Order for displaying multiple notes |
| source | SkillSource enum | nullable | Where/how skill was learned |
| created_at | timestamp | DEFAULT now() | Note creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **belongs to** `user_skills` (via user_skill_id)
- **can be linked to** training/competition/post via `skill_content_links`

**Usage Example**:
```typescript
// Add notes to a user skill
const notes = ['Step 1: Control posture', 'Step 2: Thread arm'];
const rows = notes.map((note, idx) => ({
  user_skill_id: userSkillId,
  note,
  note_order: idx,
  source: 'TRAINING'
}));
await supabase.from('user_skill_notes').insert(rows);
```

**Business Logic**:
- Notes are ordered by note_order for sequence-based techniques
- Can track source (TRAINING, COMPETITION, INDEPENDENT) for context
- CASCADE delete when parent user_skill is deleted

---

### 6. user_skill_videos

**Purpose**: Stores video URLs demonstrating user skills.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Video record unique identifier |
| user_skill_id | string (UUID) | required, FK | Reference to user_skill |
| video_url | string | required | URL to video (future: Cloudinary) |
| note | string | nullable | Optional note about the video |
| video_order | number | DEFAULT 0 | Order for displaying multiple videos |
| source | SkillSource enum | nullable | Where/how video was captured |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **belongs to** `user_skills` (via user_skill_id)
- **can be linked to** training/competition/post via `skill_content_links`

**Usage Example**:
```typescript
// Fetch videos for progress tracking
const { data } = await supabase
  .from('user_skill_videos')
  .select(`
    *,
    user_skill:user_skills(skill:skills(name, category)),
    skill_content_links(
      training_activity:training_activities(training:trainings(title))
    )
  `)
  .eq('user_skill.user_id', userId)
  .order('created_at', { ascending: false });
```

---

### 7. skill_content_links ⚠️

**Purpose**: Junction table linking skill content (notes/videos) to their context (training/competition/post).

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Link unique identifier |
| user_skill_note_id | string (UUID) | nullable, FK | Reference to note |
| user_skill_video_id | string (UUID) | nullable, FK | Reference to video |
| training_activity_id | string (UUID) | nullable, FK | Reference to training activity |
| match_id | string (UUID) | nullable, FK | Reference to competition match |
| post_id | string (UUID) | nullable, FK | Reference to social post |
| created_at | timestamp | DEFAULT now() | Link creation timestamp |

**Relationships**:
- **belongs to** `user_skill_notes` (via user_skill_note_id)
- **belongs to** `user_skill_videos` (via user_skill_video_id)
- **belongs to** `training_activities` (via training_activity_id)
- **belongs to** `competition_matches` (via match_id)
- **belongs to** `posts` (via post_id)

**⚠️ Design Issues**:

1. **Redundant with source field**: Both `user_skill_notes` and `user_skill_videos` already have a `source` enum field (TRAINING, COMPETITION, INDEPENDENT), making this table's primary purpose redundant.

2. **Nullable foreign keys without constraints**: All 5 foreign keys are nullable with no CHECK constraints to ensure:
   - Exactly one content FK is set (note OR video, not both)
   - Exactly one context FK is set (training OR match OR post, not both or none)

3. **Potential for orphaned/invalid records**: Nothing prevents creating a link with:
   - No content (both note_id and video_id null)
   - Multiple contexts (e.g., both training_activity_id and match_id set)
   - No context (all context FKs null)

**Usage Example**:
```typescript
// Current usage in skillService.ts
if (insertedNotes && trainingActivityId) {
  const linkRows = insertedNotes.map(note => ({
    user_skill_note_id: note.id,
    training_activity_id: trainingActivityId
  }));
  await supabase.from('skill_content_links').insert(linkRows);
}
```

**Recommended Solution**:
Remove this table and add direct foreign keys to `user_skill_notes` and `user_skill_videos`:
```sql
ALTER TABLE user_skill_notes
  ADD COLUMN training_activity_id UUID REFERENCES training_activities(id),
  ADD COLUMN match_id UUID REFERENCES competition_matches(id),
  ADD COLUMN post_id UUID REFERENCES posts(id),
  ADD CONSTRAINT check_one_context
    CHECK ((training_activity_id IS NOT NULL)::int +
           (match_id IS NOT NULL)::int +
           (post_id IS NOT NULL)::int <= 1);

-- Same for user_skill_videos
```

---

### 8. trainings

**Purpose**: Represents a training session (e.g., "Monday Morning Training").

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Training session unique identifier |
| title | string | required | Session title/name |
| useId | string (UUID) | nullable, ⚠️ TYPO | User ID (should be userId) |
| created_at | timestamp | DEFAULT now() | Session creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **has many** `training_activities`
- **belongs to** `profiles` (via useId - note: typo)

**⚠️ Schema Issue**:
- Column name `useId` should be `userId` for consistency
- Missing FK constraint to profiles table

**Usage Example**:
```typescript
// Create training session
const { data } = await supabase
  .from('trainings')
  .insert({
    title: 'Morning Training - Guard Work',
    useId: userId  // Note: typo in column name
  })
  .select()
  .single();
```

**Recommended Fix**:
```sql
ALTER TABLE trainings
  RENAME COLUMN useId TO user_id;

ALTER TABLE trainings
  ADD CONSTRAINT trainings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
```

---

### 9. training_activities

**Purpose**: Individual activities within a training session (e.g., drilling, rolling, warmup).

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Activity unique identifier |
| training_id | string (UUID) | required, FK | Reference to training session |
| type | TrainingType enum | required | Type of activity (Gi, NoGi, Roll, etc.) |
| activity_order | number | required | Order within training session |
| notes | string | nullable | Activity notes/details |
| video_url | string | nullable | Optional video reference |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **belongs to** `trainings` (via training_id)
- **has many** `training_activity_values`
- **can be linked to** skill notes/videos via `skill_content_links`

**Usage Example**:
```typescript
// Create activity with values
const activity = await supabase
  .from('training_activities')
  .insert({
    training_id: trainingId,
    type: 'Roll',
    activity_order: 1,
    notes: 'Focused on guard passing'
  })
  .select()
  .single();

// Add duration values
await supabase.from('training_activity_values').insert([
  { training_activity_id: activity.data.id, value: 30, unit: 'Minutes', value_order: 0 }
]);
```

---

### 10. training_activity_values

**Purpose**: Stores quantitative metrics for training activities (duration, rounds, reps, etc.).

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Value unique identifier |
| training_activity_id | string (UUID) | required, FK | Reference to training activity |
| value | number | required | Numeric value |
| unit | TrainingUnit enum | required | Unit of measurement |
| value_order | number | required | Order for multiple values |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **belongs to** `training_activities` (via training_activity_id)

**Usage Example**:
```typescript
// Record a 1.5 hour training session
await supabase.from('training_activity_values').insert([
  { training_activity_id: activityId, value: 1, unit: 'Hours', value_order: 0 },
  { training_activity_id: activityId, value: 30, unit: 'Minutes', value_order: 1 }
]);
```

**Business Logic**:
- Multiple values can represent complex measurements (e.g., 1h 30m)
- Units: Minutes, Hours, Rounds, Reps, Submissions
- Used for progress tracking and analytics

---

### 11. competitions

**Purpose**: Represents a BJJ competition/tournament event.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Competition unique identifier |
| user_id | string (UUID) | required | User who participated |
| title | string | nullable | Competition title/name |
| date | string (date) | nullable | Competition date |
| location | string | nullable | Venue location |
| competition_level | competition_level enum | nullable | Belt level of competition |
| tournament_brand_id | string (UUID) | nullable, FK | Reference to tournament brand |
| notes | string | nullable | General competition notes |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **belongs to** `profiles` (via user_id - missing FK)
- **belongs to** `tournament_brands` (via tournament_brand_id)
- **has many** `competition_divisions`
- **has many** `competition_matches`

**Usage Example**:
```typescript
// Create competition entry
const { data } = await supabase
  .from('competitions')
  .insert({
    user_id: userId,
    title: 'IBJJF Pan Championship 2024',
    date: '2024-03-15',
    location: 'Irvine, CA',
    competition_level: 'BLUE',
    tournament_brand_id: ibjjfBrandId
  })
  .select()
  .single();
```

---

### 12. tournament_brands

**Purpose**: Represents tournament organizations/brands (e.g., IBJJF, ADCC, local promotions).

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Brand unique identifier |
| name | string | required | Organization name (e.g., "IBJJF") |
| is_predefined | boolean | DEFAULT false | Whether it's a major organization |
| creator_user_id | string (UUID) | nullable | User who created custom brand |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **has many** `competitions`

**Usage Example**:
```typescript
// Fetch major tournament brands
const { data } = await supabase
  .from('tournament_brands')
  .select('*')
  .eq('is_predefined', true)
  .order('name');
```

**Business Logic**:
- Predefined brands: IBJJF, ADCC, NAGA, Grappling Industries, etc.
- Users can create custom brands for local tournaments
- Cannot delete brands with associated competitions

---

### 13. competition_divisions

**Purpose**: Represents divisions within a competition (by belt, weight, age, gi/nogi).

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Division unique identifier |
| competition_id | string (UUID) | required, FK | Reference to competition |
| bjj_type | BjjType enum | required | Gi, NoGi, or Both |
| division_weight_type | division_weight_type enum | nullable | Weight class type (kg_under, lbs_under, open) |
| division_weight_unit | number | nullable | Weight limit number |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **belongs to** `competitions` (via competition_id)
- **has many** `competition_matches`

**Usage Example**:
```typescript
// Create division
await supabase.from('competition_divisions').insert({
  competition_id: competitionId,
  bjj_type: 'GI',
  division_weight_type: 'lbs_under',
  division_weight_unit: 170
});
```

**Note**: Currently not heavily used in application - matches are primarily linked directly to competitions.

---

### 14. competition_matches

**Purpose**: Individual matches/bouts within a competition.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Match unique identifier |
| competition_id | string (UUID) | nullable, FK | Reference to competition |
| competition_division_id | string (UUID) | nullable, FK | Reference to division |
| name | string | required | Match identifier (e.g., "Finals", "Quarterfinal") |
| match_order | number | required | Order within competition |
| opponent_name | string | nullable | Opponent's name |
| outcome | MatchOutcome enum | required | WIN, LOSE, or DRAW |
| outcome_method | MatchOutcomeMethod enum | nullable | How the match ended |
| my_score | number | nullable | User's score/points |
| opponent_score | number | nullable | Opponent's score/points |
| note | string | nullable | Match notes/reflection |
| video_url | string | nullable | Match video reference |
| created_at | timestamp | DEFAULT now() | Record creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **belongs to** `competitions` (via competition_id)
- **belongs to** `competition_divisions` (via competition_division_id)
- **can be linked to** skill notes/videos via `skill_content_links`

**Usage Example**:
```typescript
// Create match record
await supabase.from('competition_matches').insert({
  competition_id: competitionId,
  name: 'Semifinal',
  match_order: 2,
  opponent_name: 'John Doe',
  outcome: 'WIN',
  outcome_method: 'SUBMISSION',
  my_score: 4,
  opponent_score: 0,
  note: 'Triangle from guard'
});
```

---

### 15. posts

**Purpose**: Social posts shared by users (training updates, techniques, achievements).

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Post unique identifier |
| user_id | string (UUID) | required, FK | Post author |
| category | post_category enum | required | Post type classification |
| content | string | nullable | Post text content |
| image_url | string | nullable | Optional image |
| created_at | timestamp | DEFAULT now() | Post creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **belongs to** `profiles` (via user_id)
- **can be linked to** skill notes/videos via `skill_content_links`

**Usage Example**:
```typescript
// Create post
await supabase.from('posts').insert({
  user_id: userId,
  category: 'Technique',
  content: 'Finally hit my first triangle from closed guard!',
  image_url: 'https://...'
});
```

**Business Logic**:
- Categories: Training, Technique, Competition, General, Achievement, Question
- Future: Comments, likes, sharing functionality

---

### 16. user_follows

**Purpose**: Social following relationships between users.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| follower_id | string (UUID) | PRIMARY KEY (composite), FK | User who is following |
| following_id | string (UUID) | PRIMARY KEY (composite), FK | User being followed |
| created_at | timestamp | DEFAULT now() | Follow timestamp |

**Relationships**:
- **belongs to** `profiles` (via follower_id)
- **belongs to** `profiles` (via following_id)

**Constraints**:
- Composite primary key on (follower_id, following_id)
- Cannot follow yourself (enforced in application logic)

**Usage Example**:
```typescript
// Follow a user
await supabase.from('user_follows').insert({
  follower_id: currentUserId,
  following_id: targetUserId
});

// Get followers count
const { count } = await supabase
  .from('user_follows')
  .select('*', { count: 'exact', head: true })
  .eq('following_id', userId);
```

---

### 17. goals

**Purpose**: User-defined training goals and objectives.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | number | PRIMARY KEY, auto-increment | Goal unique identifier |
| profile_id | string (UUID) | required, FK | Reference to user profile |
| description | string | required | Goal description |
| due_date | string (date) | nullable | Target completion date |
| completed | boolean | DEFAULT false | Whether goal is achieved |
| created_at | timestamp | DEFAULT now() | Goal creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last modification timestamp |

**Relationships**:
- **belongs to** `profiles` (via profile_id)

**Usage Example**:
```typescript
// Create goal
await supabase.from('goals').insert({
  profile_id: userId,
  description: 'Get blue belt',
  due_date: '2024-12-31',
  completed: false
});
```

---

## Enums Reference

### Belts
Adult and kids belt ranks in BJJ.

**Values**:
- Adults: `WHITE`, `BLUE`, `PURPLE`, `BROWN`, `BLACK`
- Kids: `GRAY`, `YELLOW`, `ORANGE`, `GREEN`

**Usage**: Profile belt rank, competition level

---

### BjjType
Whether training/competition is with or without the gi (traditional uniform).

**Values**: `GI`, `NOGI`, `BOTH`

**Usage**: Competition divisions, future training activities

---

### Category
Classification system for BJJ techniques.

**Values**:
- `Submission` - Finishing techniques (chokes, joint locks)
- `Takedown` - Standing to ground techniques
- `Pass` - Guard passing techniques
- `Control` - Positional control techniques
- `Escape` - Escaping bad positions
- `Guard` - Guard playing techniques
- `Sweep` - Reversing from bottom position
- `System` - Conceptual frameworks/strategies

**Usage**: Skill categorization

---

### competition_level
Belt level divisions in competitions.

**Values**: Same as `Belts` enum + `ABSOLUTE` (open weight/belt division)

**Usage**: Competition tracking

---

### division_weight_type
Weight class classification system.

**Values**:
- `kg_under` - Weight limit in kilograms
- `lbs_under` - Weight limit in pounds
- `open` - No weight restriction (absolute division)

**Usage**: Competition divisions

---

### MatchOutcome
Result of a competition match.

**Values**: `WIN`, `LOSE`, `DRAW`

**Usage**: Competition match tracking

---

### MatchOutcomeMethod
How a match was decided.

**Values**:
- `SUBMISSION` - Tap out (choke, joint lock)
- `POINTS` - Won by point advantage
- `REFEREE_DECISION` - Referee's call (in case of tie)
- `DISQUALIFICATION` - Opponent disqualified
- `FORFEIT` - Opponent didn't show or withdrew
- `OTHER` - Other circumstances

**Usage**: Competition match details

---

### post_category
Classification for social posts.

**Values**:
- `Training` - Training session updates
- `Technique` - Technique tips/discoveries
- `Competition` - Competition results/stories
- `General` - General BJJ discussion
- `Achievement` - Milestones and achievements
- `Question` - Questions to community

**Usage**: Social feed categorization

---

### SkillSource
Context where a skill was learned or used.

**Values**:
- `TRAINING` - Learned during training session
- `COMPETITION` - Used in competition
- `INDEPENDENT` - Self-study or other source

**Usage**: Skill notes and videos metadata

**⚠️ Note**: Redundant with `skill_content_links` table functionality.

---

### TrainingType
Types of training activities.

**Values**:
- `Gi` - Training in gi
- `NoGi` - No-gi training
- `Wrestling` - Wrestling practice
- `Roll` - Live sparring/rolling
- `Drill` - Technique drilling
- `Skill Learning` - Learning new techniques
- `Game` - Specific training games
- `Strength training` - Strength and conditioning
- `Cardio training` - Cardiovascular conditioning
- `Stretching` - Flexibility work

**Usage**: Training activity classification

---

### TrainingUnit
Units of measurement for training metrics.

**Values**: `Minutes`, `Hours`, `Rounds`, `Reps`, `Submissions`

**Usage**: Training activity values

---

### UserRole
User role in the application.

**Values**: `PRACTITIONER`, `INSTRUCTOR`, `ADMIN`

**Usage**: Future role-based access control (currently not enforced)

---

## Common Query Patterns

### 1. Fetch User Skills with Full Details
```typescript
const { data } = await supabase
  .from('user_skills')
  .select(`
    *,
    skill:skills(*),
    user_skill_notes(*, note_order),
    user_skill_videos(*, video_order)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### 2. Fetch Training History with Activities
```typescript
const { data } = await supabase
  .from('trainings')
  .select(`
    *,
    training_activities(
      type,
      notes,
      training_activity_values(value, unit)
    )
  `)
  .eq('useId', userId)  // Note: typo in schema
  .order('created_at', { ascending: false });
```

### 3. Fetch Competition Results
```typescript
const { data } = await supabase
  .from('competitions')
  .select(`
    *,
    tournament_brand:tournament_brands(name),
    competition_matches(
      name,
      opponent_name,
      outcome,
      outcome_method,
      my_score,
      opponent_score
    )
  `)
  .eq('user_id', userId)
  .order('date', { ascending: false });
```

### 4. Progress Timeline (Unified Activities)
```typescript
// Fetch trainings, competitions, and footage
const [trainings, competitions, footage] = await Promise.all([
  fetchTrainingActivities(userId, startDate, endDate),
  fetchCompetitionActivities(userId, startDate, endDate),
  fetchFootageActivities(userId, startDate, endDate),
]);

// Merge and sort by date
const timeline = [...trainings, ...competitions, ...footage]
  .sort((a, b) => new Date(b.date) - new Date(a.date));
```

### 5. Social Following
```typescript
// Get users I'm following
const { data } = await supabase
  .from('user_follows')
  .select('profile_being_followed:profiles!UserFollows_followingId_fkey(*)')
  .eq('follower_id', userId);

// Get my followers
const { data } = await supabase
  .from('user_follows')
  .select('follower_profile:profiles!UserFollows_followerId_fkey(*)')
  .eq('following_id', userId);
```

---

## Schema Issues & Recommendations

### Critical Issues

#### 1. ⚠️ `trainings.useId` Typo
**Issue**: Column should be `user_id` for consistency with other tables.

**Impact**:
- Confusing for developers
- No foreign key constraint to enforce referential integrity
- Potential for orphaned training records

**Fix**:
```sql
-- Rename column
ALTER TABLE trainings RENAME COLUMN useId TO user_id;

-- Add foreign key constraint
ALTER TABLE trainings
  ADD CONSTRAINT trainings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
```

#### 2. ⚠️ `skill_content_links` Table Design
**Issue**: Redundant junction table with unclear constraints.

**Problems**:
- All 5 foreign keys are nullable without CHECK constraints
- Overlaps with `source` field in `user_skill_notes` and `user_skill_videos`
- No enforcement that exactly one content FK and one context FK are set
- Complex queries required to determine link context

**Current Usage**:
```typescript
// In skillService.ts - only sets ONE content FK and ONE context FK
const linkRows = insertedNotes.map(note => ({
  user_skill_note_id: note.id,
  training_activity_id: trainingActivityId  // Only one context
}));
```

**Recommended Solution**:
Remove `skill_content_links` and add direct foreign keys with constraints:

```sql
-- Add columns to user_skill_notes
ALTER TABLE user_skill_notes
  ADD COLUMN training_activity_id UUID REFERENCES training_activities(id) ON DELETE SET NULL,
  ADD COLUMN match_id UUID REFERENCES competition_matches(id) ON DELETE SET NULL,
  ADD COLUMN post_id UUID REFERENCES posts(id) ON DELETE SET NULL;

-- Ensure only one context is set
ALTER TABLE user_skill_notes
  ADD CONSTRAINT check_one_context
  CHECK (
    (training_activity_id IS NOT NULL)::int +
    (match_id IS NOT NULL)::int +
    (post_id IS NOT NULL)::int <= 1
  );

-- Repeat for user_skill_videos
ALTER TABLE user_skill_videos
  ADD COLUMN training_activity_id UUID REFERENCES training_activities(id) ON DELETE SET NULL,
  ADD COLUMN match_id UUID REFERENCES competition_matches(id) ON DELETE SET NULL,
  ADD COLUMN post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  ADD CONSTRAINT check_one_context
  CHECK (
    (training_activity_id IS NOT NULL)::int +
    (match_id IS NOT NULL)::int +
    (post_id IS NOT NULL)::int <= 1
  );

-- Migrate existing data
INSERT INTO user_skill_notes (training_activity_id, match_id, post_id)
SELECT training_activity_id, match_id, post_id
FROM skill_content_links
WHERE user_skill_note_id = user_skill_notes.id;

-- Drop junction table
DROP TABLE skill_content_links;
```

**Benefits**:
- Simpler queries (no junction table join)
- Data integrity enforced at database level
- Eliminates redundancy with `source` field
- Better performance (fewer joins)

#### 3. ⚠️ Missing Foreign Key Constraints
**Issue**: Several tables lack proper foreign key constraints.

**Missing Constraints**:
- `competitions.user_id` → `profiles.id`
- `trainings.useId` → `profiles.id` (after renaming to user_id)

**Fix**:
```sql
ALTER TABLE competitions
  ADD CONSTRAINT competitions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
```

### Enhancement Recommendations

#### 1. Add Indexes for Performance
```sql
-- Improve query performance for common access patterns
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_trainings_user_id ON trainings(user_id); -- after renaming
CREATE INDEX idx_competitions_user_id ON competitions(user_id);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

#### 2. Add Unique Constraints
```sql
-- Prevent duplicate user skills
ALTER TABLE user_skills
  ADD CONSTRAINT unique_user_skill
  UNIQUE (user_id, skill_id);

-- Prevent duplicate follows
ALTER TABLE user_follows
  ADD CONSTRAINT unique_follow
  UNIQUE (follower_id, following_id);

-- Prevent self-follows
ALTER TABLE user_follows
  ADD CONSTRAINT no_self_follow
  CHECK (follower_id != following_id);
```

#### 3. Consider Adding Soft Deletes
For audit trail and data recovery:
```sql
-- Add deleted_at column to critical tables
ALTER TABLE user_skills ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE trainings ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE competitions ADD COLUMN deleted_at TIMESTAMP;

-- Update queries to exclude soft-deleted records
WHERE deleted_at IS NULL
```

#### 4. Add RLS (Row Level Security) Policies
Implement Supabase RLS for data access control:
```sql
-- Example: Users can only see their own trainings
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trainings"
  ON trainings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trainings"
  ON trainings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## Migration Guide

### Updating TypeScript Types After Schema Changes

After making database changes via Supabase dashboard or migrations:

```bash
# Generate new types
npx supabase gen types typescript --linked > src/supabase/types.ts
```

### Example Migration: Remove skill_content_links

```sql
-- migration_001_remove_skill_content_links.sql

-- 1. Add new columns to user_skill_notes
ALTER TABLE user_skill_notes
  ADD COLUMN training_activity_id UUID,
  ADD COLUMN match_id UUID,
  ADD COLUMN post_id UUID;

-- 2. Add foreign keys
ALTER TABLE user_skill_notes
  ADD CONSTRAINT fk_training_activity
    FOREIGN KEY (training_activity_id)
    REFERENCES training_activities(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_match
    FOREIGN KEY (match_id)
    REFERENCES competition_matches(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_post
    FOREIGN KEY (post_id)
    REFERENCES posts(id) ON DELETE SET NULL;

-- 3. Add constraint
ALTER TABLE user_skill_notes
  ADD CONSTRAINT check_one_context
  CHECK (
    (training_activity_id IS NOT NULL)::int +
    (match_id IS NOT NULL)::int +
    (post_id IS NOT NULL)::int <= 1
  );

-- 4. Migrate data from skill_content_links
UPDATE user_skill_notes usn
SET
  training_activity_id = scl.training_activity_id,
  match_id = scl.match_id,
  post_id = scl.post_id
FROM skill_content_links scl
WHERE scl.user_skill_note_id = usn.id;

-- 5. Repeat for user_skill_videos
-- (similar steps)

-- 6. Drop old table
DROP TABLE skill_content_links;
```

---

## Data Flow Examples

### Creating a Training Session with Skill Tracking

```typescript
// 1. Create training session
const training = await supabase
  .from('trainings')
  .insert({ title: 'Morning Training', useId: userId })
  .select()
  .single();

// 2. Create training activity
const activity = await supabase
  .from('training_activities')
  .insert({
    training_id: training.data.id,
    type: 'Roll',
    activity_order: 1
  })
  .select()
  .single();

// 3. Add activity values
await supabase.from('training_activity_values').insert({
  training_activity_id: activity.data.id,
  value: 30,
  unit: 'Minutes',
  value_order: 0
});

// 4. Link skill (if applicable)
const userSkill = await addOrUpdateUserSkill({
  userId,
  skillName: 'Triangle Choke',
  category: 'Submission'
});

// 5. Add skill notes with training context
await replaceUserSkillNotesAndVideos({
  userSkillId: userSkill.id,
  notes: ['Hit it from closed guard'],
  source: 'TRAINING',
  trainingActivityId: activity.data.id  // Links to this training
});
```

### Competition Recording Flow

```typescript
// 1. Create competition
const competition = await supabase
  .from('competitions')
  .insert({
    user_id: userId,
    title: 'IBJJF Pan 2024',
    date: '2024-03-15',
    tournament_brand_id: ibjjfId
  })
  .select()
  .single();

// 2. Create match
const match = await supabase
  .from('competition_matches')
  .insert({
    competition_id: competition.data.id,
    name: 'Finals',
    match_order: 1,
    opponent_name: 'John Doe',
    outcome: 'WIN',
    outcome_method: 'SUBMISSION',
    my_score: 4,
    opponent_score: 0
  })
  .select()
  .single();

// 3. Link skill used in match
await replaceUserSkillNotesAndVideos({
  userSkillId: triangleSkillId,
  notes: ['Set up from failed armbar attempt'],
  source: 'COMPETITION',
  matchId: match.data.id
});
```

---

## Maintenance

### Regular Tasks

1. **Monitor Query Performance**
   - Check slow query logs in Supabase dashboard
   - Add indexes as needed based on usage patterns

2. **Data Cleanup**
   - Remove orphaned records (if any FK constraints missing)
   - Archive old data if needed

3. **Type Generation**
   - Regenerate types after any schema changes
   - Update this documentation

### Version History

- **v1.0** (Current) - Initial schema with identified issues
- **v2.0** (Planned) - Fix `skill_content_links`, rename `useId`, add missing FKs

---

## Summary

The BeJiuJitsu database schema provides a solid foundation for tracking BJJ training, competition, and skill development. Key strengths include:

- ✅ Comprehensive skill tracking system
- ✅ Flexible training activity logging
- ✅ Detailed competition recording
- ✅ Social features foundation
- ✅ Extensible design for future features

Priority improvements needed:
1. Fix `trainings.useId` typo and add FK constraint
2. Refactor or remove `skill_content_links` table
3. Add missing FK constraints for data integrity
4. Implement database-level uniqueness constraints
5. Add performance indexes

This schema supports the PRD requirements and provides room for future enhancements like video uploads, advanced analytics, and expanded social features.
