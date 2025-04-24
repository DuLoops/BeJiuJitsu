import { NewUserSkillDataType, UserSkillType } from '@/src/types/skillType';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/context/AuthContext';
import { API_URL } from '@/src/config/env';

// Base API functions
export const fetchUserSkills = async (getAuthenticatedRequest: any): Promise<UserSkillType[]> => {
  const response = await getAuthenticatedRequest(`${API_URL}/api/user-skills`);
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch user skills: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const createUserSkill = async (
  getAuthenticatedRequest: any,
  data: NewUserSkillDataType
): Promise<UserSkillType> => {
  const response = await getAuthenticatedRequest(`${API_URL}/api/user-skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('createUserSkill response:', response);
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to create user skill: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const updateUserSkill = async (
  getAuthenticatedRequest: any,
  skillId: string,
  data: Partial<UserSkillType>
): Promise<UserSkillType> => {
  const response = await getAuthenticatedRequest(`${API_URL}/api/user-skills/${skillId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to update user skill: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const deleteUserSkill = async (
  getAuthenticatedRequest: any,
  skillId: string
): Promise<void> => {
  const response = await getAuthenticatedRequest(`${API_URL}/api/user-skills/${skillId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to delete user skill: ${response.status} - ${errorText}`);
  }
};

export const fetchUserSkill = async (
  getAuthenticatedRequest: any,
  userSkillId: string
): Promise<UserSkillType> => {
  const response = await getAuthenticatedRequest(`${API_URL}/api/user-skills/${userSkillId}`);
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch user skill: ${response.status} - ${errorText}`);
  }
  return response.json();
};

// React Query hooks
export const useUserSkills = () => {
  const { getAuthenticatedRequest } = useAuth();
  return useQuery({
    queryKey: ['userSkills'],
    queryFn: () => fetchUserSkills(getAuthenticatedRequest),
  });
};

export const useCreateUserSkill = () => {
  const queryClient = useQueryClient();
  const { getAuthenticatedRequest } = useAuth();

  return useMutation({
    mutationFn: (data: NewUserSkillDataType) => createUserSkill(getAuthenticatedRequest, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
    },
  });
};

export const useUpdateUserSkill = () => {
  const queryClient = useQueryClient();
  const { getAuthenticatedRequest } = useAuth();

  return useMutation({
    mutationFn: ({ skillId, data }: { skillId: string; data: Partial<UserSkillType> }) =>
      updateUserSkill(getAuthenticatedRequest, skillId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
    },
  });
};

export const useDeleteUserSkill = () => {
  const queryClient = useQueryClient();
  const { getAuthenticatedRequest } = useAuth();

  return useMutation({
    mutationFn: (skillId: string) => deleteUserSkill(getAuthenticatedRequest, skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
    },
  });
};

export const useGetUserSkill = (userSkillId: string) => {
  const { getAuthenticatedRequest } = useAuth();
  return useQuery({
    queryKey: ['userSkill', userSkillId],
    queryFn: () => fetchUserSkill(getAuthenticatedRequest, userSkillId),
    enabled: !!userSkillId,
  });
}; 