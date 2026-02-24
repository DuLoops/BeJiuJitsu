import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/src/stores/authStore';
import {
  fetchAllActivities,
  getActivitySummaryByDate,
} from '../services/progressService';

export function useProgressData(
  startDate?: string,
  endDate?: string
) {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['progress-activities', userId, startDate, endDate],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchAllActivities(userId, startDate, endDate);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useActivitySummary(year: number, month: number) {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['activity-summary', userId, year, month],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return getActivitySummaryByDate(userId, year, month);
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useActivityCounts(activities: any[] = []) {
  const counts = activities.reduce(
    (acc, activity) => {
      acc.total++;
      if (activity.type === 'training') acc.training++;
      else if (activity.type === 'competition') acc.competition++;
      else if (activity.type === 'footage') acc.footage++;
      return acc;
    },
    { total: 0, training: 0, competition: 0, footage: 0 }
  );

  return counts;
}