import { supabase } from '@/src/lib/supabase';

export type ProgressEvent = {
  id: string;
  date: string;
  type: 'TRAINING' | 'COMPETITION';
  name: string;
  notes?: string | null;
};

export const fetchProgressEvents = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<ProgressEvent[]> => {
  const { data: trainings, error: trainingError } = await supabase
    .from('Training')
    .select('id, date, note')
    .eq('userId', userId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (trainingError) {
    console.error('Error fetching training data:', trainingError);
    throw trainingError;
  }

  const { data: competitions, error: competitionError } = await supabase
    .from('Competition')
    .select('id, date, name, notes')
    .eq('userId', userId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (competitionError) {
    console.error('Error fetching competition data:', competitionError);
    throw competitionError;
  }

  const trainingEvents: ProgressEvent[] = trainings.map(t => ({
    id: t.id,
    date: t.date,
    type: 'TRAINING',
    name: 'Training Session',
    notes: t.note,
  }));

  const competitionEvents: ProgressEvent[] = competitions.map(c => ({
    id: c.id,
    date: c.date as string,
    type: 'COMPETITION',
    name: c.name || 'Competition',
    notes: c.notes,
  }));

  return [...trainingEvents, ...competitionEvents];
}; 