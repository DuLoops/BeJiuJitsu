import { supabase } from '@/src/lib/supabase';
import { UnifiedActivityLog, TrainingActivityLog, CompetitionActivityLog, FootageActivityLog } from '../types/progress';

// Fetch all training sessions for a user within a date range
export const fetchTrainingActivities = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<TrainingActivityLog[]> => {
  let query = supabase
    .from('trainings')
    .select(`
      *,
      training_activities(
        type,
        notes,
        video_url,
        training_activity_values(value, unit)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  if (endDate) {
    // Use lt (less than) with next day to include all of endDate
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query = query.lt('created_at', nextDay.toISOString().split('T')[0]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching training activities:', error);
    throw error;
  }

  const result = (data || []).map(training => {
    const activities = training.training_activities?.map(activity => {
      const totalDuration = activity.training_activity_values
        ?.filter(val => val.unit === 'Minutes' || val.unit === 'Hours')
        ?.reduce((sum, val) => sum + val.value, 0) || 0;

      const durationText = totalDuration > 0
        ? totalDuration >= 60
          ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`
          : `${totalDuration} min`
        : undefined;

      return {
        type: activity.type,
        duration: durationText,
        notes: activity.notes || undefined,
      };
    }) || [];

    const totalDuration = activities
      .map(a => a.duration)
      .filter(Boolean)
      .reduce((total, duration) => {
        const match = duration?.match(/(\d+)h?\s?(\d*)\s?(min|m)?/);
        if (match) {
          const hours = parseInt(match[1]) || 0;
          const mins = parseInt(match[2]) || 0;
          return total + (hours * 60) + mins;
        }
        return total;
      }, 0);

    const durationDisplay = totalDuration > 0
      ? totalDuration >= 60
        ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`
        : `${totalDuration} min`
      : undefined;

    return {
      id: training.id,
      type: 'training' as const,
      title: training.title,
      date: training.created_at,
      duration: durationDisplay,
      activities,
    };
  });

  return result;
};

// Fetch all competitions for a user within a date range
// Fetch all competitions for a user within a date range
export const fetchCompetitionActivities = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<CompetitionActivityLog[]> => {
  let query = supabase
    .from('competitions')
    .select(`
      *,
      tournament_brand:tournament_brands(name),
      competition_matches(
        name,
        opponent_name,
        outcome,
        my_score,
        opponent_score,
        outcome_method,
        competition_division_id
      ),
      competition_divisions(
        id,
        bjj_type,
        division_weight_type,
        division_weight_unit
      ),
      competition_results(
        rank,
        competition_division_id
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    // Use lt (less than) with next day to include all of endDate
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query = query.lt('date', nextDay.toISOString().split('T')[0]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching competition activities:', error);
    throw error;
  }

  return (data || []).map((competition: any) => {
    // Map divisions
    const divisionsMap = new Map<string, {
      divisionName: string;
      wins: number;
      losses: number;
      ties: number;
      rank?: number;
    }>();

    // Initialize divisions
    competition.competition_divisions?.forEach((div: any) => {
      // Construct division name
      const type = div.bjj_type === 'BOTH' ? 'Gi & NoGi' : (div.bjj_type === 'GI' ? 'Gi' : 'NoGi');
      const weight = div.division_weight_type === 'open'
        ? 'Absolute'
        : `${div.division_weight_unit || ''}${div.division_weight_type === 'kg_under' ? 'kg' : 'lbs'}`;

      divisionsMap.set(div.id, {
        divisionName: `${type} - ${weight}`,
        wins: 0,
        losses: 0,
        ties: 0
      });
    });

    // Add match stats
    competition.competition_matches?.forEach((match: any) => {
      if (match.competition_division_id && divisionsMap.has(match.competition_division_id)) {
        const stats = divisionsMap.get(match.competition_division_id)!;
        if (match.outcome === 'WIN') stats.wins++;
        else if (match.outcome === 'LOSE') stats.losses++;
        else if (match.outcome === 'DRAW') stats.ties++;
      }
    });

    // Add results (rank)
    competition.competition_results?.forEach((result: any) => {
      if (result.competition_division_id && divisionsMap.has(result.competition_division_id)) {
        const stats = divisionsMap.get(result.competition_division_id)!;
        stats.rank = result.rank;
      }
    });

    // If no divisions found but matches exist (legacy or unified view), create a default summary
    if (divisionsMap.size === 0 && (competition.competition_matches?.length || 0) > 0) {
      let wins = 0, losses = 0, ties = 0;
      competition.competition_matches?.forEach((match: any) => {
        if (match.outcome === 'WIN') wins++;
        else if (match.outcome === 'LOSE') losses++;
        else if (match.outcome === 'DRAW') ties++;
      });
      divisionsMap.set('default', {
        divisionName: 'All Matches',
        wins,
        losses,
        ties
      });
    }

    const matches = competition.competition_matches?.map((match: any) => ({
      name: match.name,
      opponent: match.opponent_name || undefined,
      outcome: match.outcome,
      score: match.my_score && match.opponent_score
        ? `${match.my_score}-${match.opponent_score}`
        : undefined,
    })) || [];

    return {
      id: competition.id,
      type: 'competition' as const,
      title: competition.title || 'Competition',
      date: competition.date || competition.created_at,
      location: competition.location || undefined,
      notes: competition.notes || undefined,
      details: competition.tournament_brand?.name || undefined,
      matches,
      divisions: Array.from(divisionsMap.values())
    };
  });
};

// Fetch skill videos as footage activities
export const fetchFootageActivities = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<FootageActivityLog[]> => {
  let query = supabase
    .from('user_skill_videos')
    .select(`
      *,
      user_skill:user_skills!inner(
        skill:skills(name, category)
      )
    `)
    .eq('user_skill.user_id', userId)
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  if (endDate) {
    // Use lt (less than) with next day to include all of endDate
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query = query.lt('created_at', nextDay.toISOString().split('T')[0]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching footage activities:', error);
    throw error;
  }

  return (data || []).map(video => {
    const skillName = video.user_skill?.skill?.name || 'Skill Video';
    const source = 'Independent';

    return {
      id: video.id,
      type: 'footage' as const,
      title: skillName,
      date: video.created_at || new Date().toISOString(),
      videoUrl: video.video_url,
      notes: video.note || undefined,
      skillName,
      source,
    };
  });
};

// Fetch all activities (unified)
export const fetchAllActivities = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<UnifiedActivityLog[]> => {
  const [trainings, competitions, footage] = await Promise.all([
    fetchTrainingActivities(userId, startDate, endDate).catch(err => {
      console.error('Failed to fetch training activities:', err);
      return [];
    }),
    fetchCompetitionActivities(userId, startDate, endDate).catch(err => {
      console.error('Failed to fetch competition activities:', err);
      return [];
    }),
    fetchFootageActivities(userId, startDate, endDate).catch(err => {
      console.error('Failed to fetch footage activities:', err);
      return [];
    }),
  ]);

  const allActivities = [...trainings, ...competitions, ...footage];

  // Sort by date (most recent first)
  return allActivities.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Get activity summary for calendar
export const getActivitySummaryByDate = async (
  userId: string,
  year: number,
  month: number
) => {
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const activities = await fetchAllActivities(userId, startDate, endDate);

  const summary: Record<string, { count: number; types: Set<string> }> = {};

  activities.forEach(activity => {
    const date = activity.date.split('T')[0];
    if (!summary[date]) {
      summary[date] = { count: 0, types: new Set() };
    }
    summary[date].count++;
    summary[date].types.add(activity.type);
  });

  return Object.entries(summary).reduce((acc, [date, info]) => {
    acc[date] = {
      count: info.count,
      types: Array.from(info.types),
    };
    return acc;
  }, {} as Record<string, { count: number; types: string[] }>);
};