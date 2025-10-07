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

export interface CompetitionActivityLog extends ActivityLog {
  type: 'competition';
  matches?: {
    name: string;
    opponent?: string;
    outcome: string;
    score?: string;
  }[];
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