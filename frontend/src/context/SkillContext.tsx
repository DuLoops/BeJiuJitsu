import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SkillType } from '@/src/types/skill';
import * as skillService from '@/src/services/skillService';

interface SkillContextProps {
  skills: Skill[];
  addSkill: (skill: Skill) => void;
}

const SkillContext = createContext<SkillContextProps | undefined>(undefined);

export const SkillProvider = ({ children }: { children: ReactNode }) => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const fetchedSkills = await skillService.fetchSkills();
        setSkills(fetchedSkills);
      } catch (error) {
        console.error('Failed to fetch skills', error);
      }
    };
    loadSkills();
  }, []);

  const addSkill = async (skill: Skill) => {
    try {
      await skillService.addSkill(skill);
      setSkills([...skills, skill]);
    } catch (error) {
      console.error('Failed to add skill', error);
    }
  };

  return (
    <SkillContext.Provider value={{ skills, addSkill }}>
      {children}
    </SkillContext.Provider>
  );
};

export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error('useSkillContext must be used within a SkillProvider');
  }
  return context;
};
