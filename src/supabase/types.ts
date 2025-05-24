
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      Category: {
        Row: {
          createdAt: string
          id: string
          isPredefined: boolean
          name: string
          updatedAt: string
          userId: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          isPredefined?: boolean
          name: string
          updatedAt?: string
          userId?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          isPredefined?: boolean
          name?: string
          updatedAt?: string
          userId?: string | null
        }
        Relationships: []
      }
      Competition: {
        Row: {
          createdAt: string
          date: string | null
          id: string
          location: string | null
          name: string | null
          notes: string | null
          tournamentBrandId: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          date?: string | null
          id?: string
          location?: string | null
          name?: string | null
          notes?: string | null
          tournamentBrandId?: string | null
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          date?: string | null
          id?: string
          location?: string | null
          name?: string | null
          notes?: string | null
          tournamentBrandId?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Competition_tournamentBrandId_fkey"
            columns: ["tournamentBrandId"]
            isOneToOne: false
            referencedRelation: "TournamentBrand"
            referencedColumns: ["id"]
          },
        ]
      }
      CompetitionDivision: {
        Row: {
          ageCategory: string | null
          beltRank: Database["public"]["Enums"]["Belts"]
          bjjType: Database["public"]["Enums"]["BjjType"]
          competitionId: string
          createdAt: string
          id: string
          overallResultInDivision: string | null
          updatedAt: string
          weightClass: string | null
        }
        Insert: {
          ageCategory?: string | null
          beltRank: Database["public"]["Enums"]["Belts"]
          bjjType: Database["public"]["Enums"]["BjjType"]
          competitionId: string
          createdAt?: string
          id?: string
          overallResultInDivision?: string | null
          updatedAt?: string
          weightClass?: string | null
        }
        Update: {
          ageCategory?: string | null
          beltRank?: Database["public"]["Enums"]["Belts"]
          bjjType?: Database["public"]["Enums"]["BjjType"]
          competitionId?: string
          createdAt?: string
          id?: string
          overallResultInDivision?: string | null
          updatedAt?: string
          weightClass?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "CompetitionDivision_competitionId_fkey"
            columns: ["competitionId"]
            isOneToOne: false
            referencedRelation: "Competition"
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
      Match: {
        Row: {
          competitionDivisionId: string
          createdAt: string
          endingMethod: Database["public"]["Enums"]["MatchMethodType"] | null
          endingMethodDetail: string | null
          id: string
          matchOrder: number | null
          notes: string | null
          opponentName: string | null
          result: Database["public"]["Enums"]["MatchOutcomeType"]
          updatedAt: string
          videoUrl: string | null
        }
        Insert: {
          competitionDivisionId: string
          createdAt?: string
          endingMethod?: Database["public"]["Enums"]["MatchMethodType"] | null
          endingMethodDetail?: string | null
          id?: string
          matchOrder?: number | null
          notes?: string | null
          opponentName?: string | null
          result: Database["public"]["Enums"]["MatchOutcomeType"]
          updatedAt?: string
          videoUrl?: string | null
        }
        Update: {
          competitionDivisionId?: string
          createdAt?: string
          endingMethod?: Database["public"]["Enums"]["MatchMethodType"] | null
          endingMethodDetail?: string | null
          id?: string
          matchOrder?: number | null
          notes?: string | null
          opponentName?: string | null
          result?: Database["public"]["Enums"]["MatchOutcomeType"]
          updatedAt?: string
          videoUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Match_competitionDivisionId_fkey"
            columns: ["competitionDivisionId"]
            isOneToOne: false
            referencedRelation: "CompetitionDivision"
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
          id: string
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
      SequenceDetail: {
        Row: {
          createdAt: string
          detail: string
          id: string
          sequenceId: string
        }
        Insert: {
          createdAt?: string
          detail: string
          id?: string
          sequenceId: string
        }
        Update: {
          createdAt?: string
          detail?: string
          id?: string
          sequenceId?: string
        }
        Relationships: [
          {
            foreignKeyName: "SequenceDetail_sequenceId_fkey"
            columns: ["sequenceId"]
            isOneToOne: false
            referencedRelation: "SkillSequence"
            referencedColumns: ["id"]
          },
        ]
      }
      Skill: {
        Row: {
          categoryId: string
          createdAt: string
          creatorId: string | null
          id: string
          isPublic: boolean
          name: string
        }
        Insert: {
          categoryId: string
          createdAt?: string
          creatorId?: string | null
          id?: string
          isPublic?: boolean
          name: string
        }
        Update: {
          categoryId?: string
          createdAt?: string
          creatorId?: string | null
          id?: string
          isPublic?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "Skill_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
        ]
      }
      SkillSequence: {
        Row: {
          createdAt: string
          id: string
          intention: string
          skillId: string
          stepNumber: number
        }
        Insert: {
          createdAt?: string
          id?: string
          intention: string
          skillId: string
          stepNumber: number
        }
        Update: {
          createdAt?: string
          id?: string
          intention?: string
          skillId?: string
          stepNumber?: number
        }
        Relationships: [
          {
            foreignKeyName: "SkillSequence_skillId_fkey"
            columns: ["skillId"]
            isOneToOne: false
            referencedRelation: "UserSkill"
            referencedColumns: ["id"]
          },
        ]
      }
      TournamentBrand: {
        Row: {
          createdAt: string
          creatorUserId: string | null
          id: string
          isPredefined: boolean
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          creatorUserId?: string | null
          id?: string
          isPredefined?: boolean
          name: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          creatorUserId?: string | null
          id?: string
          isPredefined?: boolean
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Training: {
        Row: {
          bjjType: Database["public"]["Enums"]["BjjType"]
          createdAt: string
          date: string
          duration: number
          id: string
          intensity: Database["public"]["Enums"]["TrainingIntensity"]
          note: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          bjjType: Database["public"]["Enums"]["BjjType"]
          createdAt?: string
          date: string
          duration: number
          id?: string
          intensity?: Database["public"]["Enums"]["TrainingIntensity"]
          note?: string | null
          updatedAt?: string
          userId: string
        }
        Update: {
          bjjType?: Database["public"]["Enums"]["BjjType"]
          createdAt?: string
          date?: string
          duration?: number
          id?: string
          intensity?: Database["public"]["Enums"]["TrainingIntensity"]
          note?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: []
      }
      UserFollows: {
        Row: {
          createdAt: string
          followerId: string
          followingId: string
        }
        Insert: {
          createdAt?: string
          followerId: string
          followingId: string
        }
        Update: {
          createdAt?: string
          followerId?: string
          followingId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserFollows_followerId_fkey"
            columns: ["followerId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserFollows_followingId_fkey"
            columns: ["followingId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      UserSkill: {
        Row: {
          competitionId: string | null
          createdAt: string
          id: string
          isFavorite: boolean | null
          note: string | null
          skillId: string
          source: Database["public"]["Enums"]["SkillSource"]
          trainingId: string | null
          updatedAt: string
          userId: string
          videoUrl: string | null
        }
        Insert: {
          competitionId?: string | null
          createdAt?: string
          id?: string
          isFavorite?: boolean | null
          note?: string | null
          skillId: string
          source?: Database["public"]["Enums"]["SkillSource"]
          trainingId?: string | null
          updatedAt?: string
          userId: string
          videoUrl?: string | null
        }
        Update: {
          competitionId?: string | null
          createdAt?: string
          id?: string
          isFavorite?: boolean | null
          note?: string | null
          skillId?: string
          source?: Database["public"]["Enums"]["SkillSource"]
          trainingId?: string | null
          updatedAt?: string
          userId?: string
          videoUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "UserSkill_competitionId_fkey"
            columns: ["competitionId"]
            isOneToOne: false
            referencedRelation: "Competition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserSkill_skillId_fkey"
            columns: ["skillId"]
            isOneToOne: false
            referencedRelation: "Skill"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserSkill_trainingId_fkey"
            columns: ["trainingId"]
            isOneToOne: false
            referencedRelation: "Training"
            referencedColumns: ["id"]
          },
        ]
      }
      UserSkillUsage: {
        Row: {
          competitionId: string | null
          createdAt: string
          id: string
          note: string | null
          quantity: number
          skillId: string
          success: boolean
          trainingId: string | null
          updatedAt: string
          usageType: Database["public"]["Enums"]["UsageType"]
        }
        Insert: {
          competitionId?: string | null
          createdAt?: string
          id?: string
          note?: string | null
          quantity?: number
          skillId: string
          success?: boolean
          trainingId?: string | null
          updatedAt?: string
          usageType: Database["public"]["Enums"]["UsageType"]
        }
        Update: {
          competitionId?: string | null
          createdAt?: string
          id?: string
          note?: string | null
          quantity?: number
          skillId?: string
          success?: boolean
          trainingId?: string | null
          updatedAt?: string
          usageType?: Database["public"]["Enums"]["UsageType"]
        }
        Relationships: [
          {
            foreignKeyName: "UserSkillUsage_competitionId_fkey"
            columns: ["competitionId"]
            isOneToOne: false
            referencedRelation: "Competition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserSkillUsage_skillId_fkey"
            columns: ["skillId"]
            isOneToOne: false
            referencedRelation: "UserSkill"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserSkillUsage_trainingId_fkey"
            columns: ["trainingId"]
            isOneToOne: false
            referencedRelation: "Training"
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
        | "White"
        | "Blue"
        | "Purple"
        | "Brown"
        | "Black"
        | "GRAY"
        | "YELLOW"
        | "ORANGE"
        | "GREEN"
      BjjType: "GI" | "NOGI" | "BOTH"
      MatchMethodType:
        | "SUBMISSION"
        | "POINTS"
        | "REFEREE_DECISION"
        | "DISQUALIFICATION"
        | "FORFEIT"
        | "OTHER"
      MatchOutcomeType: "WIN" | "LOSE" | "DRAW"
      SkillSource: "TRAINING" | "COMPETITION" | "INDEPENDENT"
      TrainingIntensity: "LIGHT" | "MEDIUM" | "HARD"
      UsageType: "TRAINING" | "COMPETITION"
      UserRole: "PRACTITIONER" | "INSTRUCTOR" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
        "White",
        "Blue",
        "Purple",
        "Brown",
        "Black",
        "GRAY",
        "YELLOW",
        "ORANGE",
        "GREEN",
      ],
      BjjType: ["GI", "NOGI", "BOTH"],
      MatchMethodType: [
        "SUBMISSION",
        "POINTS",
        "REFEREE_DECISION",
        "DISQUALIFICATION",
        "FORFEIT",
        "OTHER",
      ],
      MatchOutcomeType: ["WIN", "LOSE", "DRAW"],
      SkillSource: ["TRAINING", "COMPETITION", "INDEPENDENT"],
      TrainingIntensity: ["LIGHT", "MEDIUM", "HARD"],
      UsageType: ["TRAINING", "COMPETITION"],
      UserRole: ["PRACTITIONER", "INSTRUCTOR", "ADMIN"],
    },
  },
} as const
