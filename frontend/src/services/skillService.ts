import { SkillType } from '@/src/types/skill';

const API_URL = 'https://your-api-url.com';

export const fetchSkills = async (): Promise<SkillType[]> => {
  const response = await fetch(`${API_URL}/skills`);
  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }
  return response.json();
};

export const addSkill = async (skill: SkillType): Promise<void> => {
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
};
