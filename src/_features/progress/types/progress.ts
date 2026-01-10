export type ActivityType = 'training' | 'competition' | 'footage';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  title: string;
  date: string;
  duration?: string;
  location?: string;
  notes?: string;
  videoUrl?: string;
  details?: string;
}

export interface TrainingActivityLog extends ActivityLog {
  type: 'training';
  activities?: {
    type: string;
    duration?: string;
    notes?: string;
  }[];
}

export interface CompetitionDivisionSummary {
  divisionName: string;
  wins: number;
  losses: number;
  ties: number;
  rank?: number; // 1 = Gold, 2 = Silver, 3 = Bronze
}

export interface CompetitionActivityLog extends ActivityLog {
  type: 'competition';
  matches?: {
    name: string;
    opponent?: string;
    outcome: string;
    score?: string;
  }[];
  divisions?: CompetitionDivisionSummary[];
}

export interface FootageActivityLog extends ActivityLog {
  type: 'footage';
  skillName?: string;
  source?: string;
}

export type UnifiedActivityLog = TrainingActivityLog | CompetitionActivityLog | FootageActivityLog;

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasActivity: boolean;
  activities: ActivityType[];
}

export interface ProgressFilters {
  type: 'all' | ActivityType;
  dateRange?: {
    start: Date;
    end: Date;
  };
}