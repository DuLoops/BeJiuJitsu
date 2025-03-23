import { SkillType } from '@/src/types/skill';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/context/AuthContext';
import { API_URL } from '@/src/config/env';

// Base API functions
export const fetchSkills = async (getAuthenticatedRequest: any): Promise<SkillType[]> => {
  console.log('Fetching skills from:', `${API_URL}/api/skills`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await getAuthenticatedRequest(`${API_URL}/api/skills`);
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error('Error response:', errorText);
    throw new Error(`Failed to fetch skills: ${response.status}`);
  }
  return response.json();
};

export const addSkill = async (skill: SkillType, getAuthenticatedRequest: any): Promise<SkillType> => {

  try {
    const response = await getAuthenticatedRequest(`${API_URL}/api/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skill),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Error response:', errorText);
      throw new Error(`Failed to add skill: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('AddSkill error:', error);
    throw error;
  }
};

export const updateSkill = async (skill: SkillType, getAuthenticatedRequest: any): Promise<SkillType> => {
  const response = await getAuthenticatedRequest(`${API_URL}/api/skills/${skill.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skill),
  });
  if (!response.ok) {
    console.error('Failed to update skill:', response);
    throw new Error('Failed to update skill');
  }
  return response.json();
};

export const deleteSkill = async (skillId: string, getAuthenticatedRequest: any): Promise<void> => {
  const response = await getAuthenticatedRequest(`${API_URL}/api/skills/${skillId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    console.error('Failed to delete skill:', response);
    throw new Error('Failed to delete skill');
  }
};

// React Query hooks
export const useSkills = () => {
  const { getAuthenticatedRequest } = useAuth();
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => fetchSkills(getAuthenticatedRequest),
  });
};

export const useAddSkill = () => {
  const queryClient = useQueryClient();
  const { getAuthenticatedRequest } = useAuth();
  
  return useMutation({
    mutationFn: (skill: SkillType) => addSkill(skill, getAuthenticatedRequest),
    onSuccess: () => {
      // Invalidate and refetch skills when a new skill is added
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  const { getAuthenticatedRequest } = useAuth();
  
  return useMutation({
    mutationFn: (skill: SkillType) => updateSkill(skill, getAuthenticatedRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  const { getAuthenticatedRequest } = useAuth();
  
  return useMutation({
    mutationFn: (skillId: string) => deleteSkill(skillId, getAuthenticatedRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};
