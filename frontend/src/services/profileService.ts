import { API_URL } from '@/src/config/env';
import { Profile, Belt } from '@/src/types/user';
import { useApi } from '@/src/hooks/useApi';

interface CreateProfileData {
  userName: string;
  belt: Belt;
  stripes: number;
  weight?: number;
  academy?: string;
  avatar?: string;
  goals?: string[];
}

export const useProfileService = () => {
  const { request } = useApi<any>();
  const baseUrl = `${API_URL}/api/profile`;

  const checkUserNameAvailability = async (userName: string) => {
    const { data, error } = await request(
      `${baseUrl}/check-username?userName=${encodeURIComponent(userName)}`,
      {requireAuth: false}
      
    );
    console.log(data, error)
    if (error) throw new Error(error);
    return data.isAvailable;
  };

  const createProfile = async (profileData: CreateProfileData) => {
    const { data, error } = await request(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (error) throw new Error(error);
    return data.profile;
  };

  const updateProfile = async (userId: number, profileData: Partial<CreateProfileData>) => {
    const { data, error } = await request(`${baseUrl}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (error) throw new Error(error);
    return data.profile;
  };

  return {
    checkUserNameAvailability,
    createProfile,
    updateProfile,
  };
};
