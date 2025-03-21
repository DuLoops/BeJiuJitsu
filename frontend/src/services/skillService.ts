import { SkillType } from '@/src/types/skill';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL = 'https://your-api-url.com';

// Base API functions
export const fetchSkills = async (): Promise<SkillType[]> => {
  const response = await fetch(`${API_URL}/skills`);
  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }
  return response.json();
};

export const addSkill = async (skill: SkillType): Promise<SkillType> => {
  const response = await fetch(`${API_URL}/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skill),
  });
  if (!response.ok) {
    throw new Error('Failed to add skill');
  }
  return response.json();
};

// React Query hooks
export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  });
};

export const useAddSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addSkill,
    onSuccess: () => {
      // Invalidate and refetch skills when a new skill is added
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};
