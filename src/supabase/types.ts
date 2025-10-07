export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      academy: {
        Row: {
          created_at: string
          id: number
          location: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          location?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          location?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      competition_divisions: {
        Row: {
          bjj_type: Database["public"]["Enums"]["BjjType"]
          competition_id: string
          created_at: string
          division_weight_type:
            | Database["public"]["Enums"]["division_weight_type"]
            | null
          division_weight_unit: number | null
          id: string
          updated_at: string
        }
        Insert: {
          bjj_type: Database["public"]["Enums"]["BjjType"]
          competition_id: string
          created_at?: string
          division_weight_type?:
            | Database["public"]["Enums"]["division_weight_type"]
            | null
          division_weight_unit?: number | null
          id?: string
          updated_at?: string
        }
        Update: {
          bjj_type?: Database["public"]["Enums"]["BjjType"]
          competition_id?: string
          created_at?: string
          division_weight_type?:
            | Database["public"]["Enums"]["division_weight_type"]
            | null
          division_weight_unit?: number | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "CompetitionDivision_competitionId_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_matches: {
        Row: {
          competition_division_id: string | null
          competition_id: string | null
          created_at: string
          id: string
          match_order: number
          my_score: number | null
          name: string
          note: string | null
          opponent_name: string | null
          opponent_score: number | null
          outcome: Database["public"]["Enums"]["MatchOutcome"]
          outcome_method:
            | Database["public"]["Enums"]["MatchOutcomeMethod"]
            | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          competition_division_id?: string | null
          competition_id?: string | null
          created_at?: string
          id?: string
          match_order: number
          my_score?: number | null
          name: string
          note?: string | null
          opponent_name?: string | null
          opponent_score?: number | null
          outcome: Database["public"]["Enums"]["MatchOutcome"]
          outcome_method?:
            | Database["public"]["Enums"]["MatchOutcomeMethod"]
            | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          competition_division_id?: string | null
          competition_id?: string | null
          created_at?: string
          id?: string
          match_order?: number
          my_score?: number | null
          name?: string
          note?: string | null
          opponent_name?: string | null
          opponent_score?: number | null
          outcome?: Database["public"]["Enums"]["MatchOutcome"]
          outcome_method?:
            | Database["public"]["Enums"]["MatchOutcomeMethod"]
            | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "CompetitionMatch_competitionId_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Match_competitionDivisionId_fkey"
            columns: ["competition_division_id"]
            isOneToOne: false
            referencedRelation: "competition_divisions"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          competition_level:
            | Database["public"]["Enums"]["competition_level"]
            | null
          created_at: string
          date: string | null
          id: string
          location: string | null
          notes: string | null
          title: string | null
          tournament_brand_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          competition_level?:
            | Database["public"]["Enums"]["competition_level"]
            | null
          created_at?: string
          date?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          title?: string | null
          tournament_brand_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          competition_level?:
            | Database["public"]["Enums"]["competition_level"]
            | null
          created_at?: string
          date?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          title?: string | null
          tournament_brand_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Competition_tournamentBrandId_fkey"
            columns: ["tournament_brand_id"]
            isOneToOne: false
            referencedRelation: "tournament_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          completed: boolean
          created_at: string
          description: string
          due_date: string | null
          id: number
          profile_id: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description: string
          due_date?: string | null
          id?: never
          profile_id: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string
          due_date?: string | null
          id?: never
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: Database["public"]["Enums"]["post_category"]
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["post_category"]
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["post_category"]
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academy_id: number | null
          avatar: string | null
          belt: Database["public"]["Enums"]["Belts"] | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          stripes: number | null
          updated_at: string | null
          username: string | null
          weight: number | null
        }
        Insert: {
          academy_id?: number | null
          avatar?: string | null
          belt?: Database["public"]["Enums"]["Belts"] | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          stripes?: number | null
          updated_at?: string | null
          username?: string | null
          weight?: number | null
        }
        Update: {
          academy_id?: number | null
          avatar?: string | null
          belt?: Database["public"]["Enums"]["Belts"] | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          stripes?: number | null
          updated_at?: string | null
          username?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academy"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_content_links: {
        Row: {
          created_at: string | null
          id: string
          match_id: string | null
          post_id: string | null
          training_activity_id: string | null
          user_skill_note_id: string | null
          user_skill_video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          post_id?: string | null
          training_activity_id?: string | null
          user_skill_note_id?: string | null
          user_skill_video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          post_id?: string | null
          training_activity_id?: string | null
          user_skill_note_id?: string | null
          user_skill_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_content_links_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "competition_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_content_links_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_content_links_training_activity_id_fkey"
            columns: ["training_activity_id"]
            isOneToOne: false
            referencedRelation: "training_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_content_links_user_skill_note_id_fkey"
            columns: ["user_skill_note_id"]
            isOneToOne: false
            referencedRelation: "user_skill_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_content_links_user_skill_video_id_fkey"
            columns: ["user_skill_video_id"]
            isOneToOne: false
            referencedRelation: "user_skill_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: Database["public"]["Enums"]["Category"]
          created_at: string
          creator_id: string | null
          id: string
          is_public: boolean
          name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["Category"]
          created_at?: string
          creator_id?: string | null
          id?: string
          is_public?: boolean
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["Category"]
          created_at?: string
          creator_id?: string | null
          id?: string
          is_public?: boolean
          name?: string
        }
        Relationships: []
      }
      tournament_brands: {
        Row: {
          created_at: string
          creator_user_id: string | null
          id: string
          is_predefined: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_user_id?: string | null
          id?: string
          is_predefined?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_user_id?: string | null
          id?: string
          is_predefined?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_activities: {
        Row: {
          activity_order: number
          created_at: string
          id: string
          notes: string | null
          training_id: string
          type: Database["public"]["Enums"]["TrainingType"]
          updated_at: string
          video_url: string | null
        }
        Insert: {
          activity_order: number
          created_at?: string
          id?: string
          notes?: string | null
          training_id: string
          type: Database["public"]["Enums"]["TrainingType"]
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          activity_order?: number
          created_at?: string
          id?: string
          notes?: string | null
          training_id?: string
          type?: Database["public"]["Enums"]["TrainingType"]
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_activity_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      training_activity_values: {
        Row: {
          created_at: string
          id: string
          training_activity_id: string
          unit: Database["public"]["Enums"]["TrainingUnit"]
          updated_at: string
          value: number
          value_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          training_activity_id: string
          unit: Database["public"]["Enums"]["TrainingUnit"]
          updated_at?: string
          value: number
          value_order: number
        }
        Update: {
          created_at?: string
          id?: string
          training_activity_id?: string
          unit?: Database["public"]["Enums"]["TrainingUnit"]
          updated_at?: string
          value?: number
          value_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_activity_value_training_activity_id_fkey"
            columns: ["training_activity_id"]
            isOneToOne: false
            referencedRelation: "training_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          useId: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          useId?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          useId?: string | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserFollows_followerId_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserFollows_followingId_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skill_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          note_order: number
          source: Database["public"]["Enums"]["SkillSource"] | null
          updated_at: string
          user_skill_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          note_order?: number
          source?: Database["public"]["Enums"]["SkillSource"] | null
          updated_at?: string
          user_skill_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          note_order?: number
          source?: Database["public"]["Enums"]["SkillSource"] | null
          updated_at?: string
          user_skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skill_notes_user_skill_id_fkey"
            columns: ["user_skill_id"]
            isOneToOne: false
            referencedRelation: "user_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skill_videos: {
        Row: {
          created_at: string
          id: string
          note: string | null
          source: Database["public"]["Enums"]["SkillSource"] | null
          updated_at: string
          user_skill_id: string
          video_order: number
          video_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          source?: Database["public"]["Enums"]["SkillSource"] | null
          updated_at?: string
          user_skill_id: string
          video_order?: number
          video_url: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          source?: Database["public"]["Enums"]["SkillSource"] | null
          updated_at?: string
          user_skill_id?: string
          video_order?: number
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skill_videos_user_skill_id_fkey"
            columns: ["user_skill_id"]
            isOneToOne: false
            referencedRelation: "user_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          skill_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          skill_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          skill_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserSkill_skillId_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Belts:
        | "WHITE"
        | "BLUE"
        | "PURPLE"
        | "BROWN"
        | "BLACK"
        | "GRAY"
        | "YELLOW"
        | "ORANGE"
        | "GREEN"
      BjjType: "GI" | "NOGI" | "BOTH"
      Category:
        | "Submission"
        | "Takedown"
        | "Pass"
        | "Control"
        | "Escape"
        | "Guard"
        | "Sweep"
        | "System"
      competition_level:
        | "WHITE"
        | "BLUE"
        | "PURPLE"
        | "BROWN"
        | "BLACK"
        | "GRAY"
        | "YELLOW"
        | "ORANGE"
        | "GREEN"
        | "ABSOLUTE"
      division_weight_type: "kg_under" | "lbs_under" | "open"
      MatchOutcome: "WIN" | "LOSE" | "DRAW"
      MatchOutcomeMethod:
        | "SUBMISSION"
        | "POINTS"
        | "REFEREE_DECISION"
        | "DISQUALIFICATION"
        | "FORFEIT"
        | "OTHER"
      post_category:
        | "Training"
        | "Technique"
        | "Competition"
        | "General"
        | "Achievement"
        | "Question"
      SkillSource: "TRAINING" | "COMPETITION" | "INDEPENDENT"
      TrainingType:
        | "Gi"
        | "NoGi"
        | "Wrestling"
        | "Roll"
        | "Drill"
        | "Skill Learning"
        | "Game"
        | "Strength training"
        | "Cardio training"
        | "Stretching"
      TrainingUnit: "Minutes" | "Hours" | "Rounds" | "Reps" | "Submissions"
      UserRole: "PRACTITIONER" | "INSTRUCTOR" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      Belts: [
        "WHITE",
        "BLUE",
        "PURPLE",
        "BROWN",
        "BLACK",
        "GRAY",
        "YELLOW",
        "ORANGE",
        "GREEN",
      ],
      BjjType: ["GI", "NOGI", "BOTH"],
      Category: [
        "Submission",
        "Takedown",
        "Pass",
        "Control",
        "Escape",
        "Guard",
        "Sweep",
        "System",
      ],
      competition_level: [
        "WHITE",
        "BLUE",
        "PURPLE",
        "BROWN",
        "BLACK",
        "GRAY",
        "YELLOW",
        "ORANGE",
        "GREEN",
        "ABSOLUTE",
      ],
      division_weight_type: ["kg_under", "lbs_under", "open"],
      MatchOutcome: ["WIN", "LOSE", "DRAW"],
      MatchOutcomeMethod: [
        "SUBMISSION",
        "POINTS",
        "REFEREE_DECISION",
        "DISQUALIFICATION",
        "FORFEIT",
        "OTHER",
      ],
      post_category: [
        "Training",
        "Technique",
        "Competition",
        "General",
        "Achievement",
        "Question",
      ],
      SkillSource: ["TRAINING", "COMPETITION", "INDEPENDENT"],
      TrainingType: [
        "Gi",
        "NoGi",
        "Wrestling",
        "Roll",
        "Drill",
        "Skill Learning",
        "Game",
        "Strength training",
        "Cardio training",
        "Stretching",
      ],
      TrainingUnit: ["Minutes", "Hours", "Rounds", "Reps", "Submissions"],
      UserRole: ["PRACTITIONER", "INSTRUCTOR", "ADMIN"],
    },
  },
} as const
