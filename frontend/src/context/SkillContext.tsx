import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { SkillType, CategoryType, UserSkillType, SequenceStep } from '@/src/types/skillType';
import * as userSkillService from '../services/userSkillService';
import { useSkills, useAddSkill as useAddSkillMutation } from '../services/skillService';
import { useAuth } from './AuthContext';
import { NewUserSkillDataType } from '@/src/types/skillType';


export type SkillAction =
  | { type: 'SET_NOTE'; payload: string }
  | { type: 'SET_VIDEO'; payload: string | null }
  | { type: 'SET_SEQUENCE'; payload: SequenceStep[] }
  | { type: 'SET_CATEGORY_ID'; payload: string | null }
  | { type: 'SET_SKILL_NAME'; payload: string }
  | { type: 'SET_SKILL_ID'; payload: string }
  | { type: 'ADD_SEQUENCE_STEP' }
  | { type: 'REMOVE_SEQUENCE_STEP'; payload: number }
  | { type: 'UPDATE_SEQUENCE_STEP'; payload: { index: number; field: string; value: any } }
  | { type: 'ADD_STEP_DETAIL'; payload: number }
  | { type: 'REMOVE_STEP_DETAIL'; payload: { stepIndex: number; detailIndex: number } }
  | { type: 'UPDATE_STEP_DETAIL'; payload: { stepIndex: number; detailIndex: number; value: string } }
  | { type: 'CLEAR_SEQUENCE' }
  | { type: 'RESET_SKILL' }
  | { type: 'SET_SKILL_TO_EDIT'; payload: NewUserSkillDataType };

export const initialSkillState: NewUserSkillDataType = {
  skill: {
    name: '',
    categoryId: '',
    id: ''
  },
  userSkill: {
    note: '',
    videoUrl: null,
    sequence: []
  }
};

export const skillReducer = (state: NewUserSkillDataType, action: SkillAction): NewUserSkillDataType => {
  switch (action.type) {
    case 'SET_NOTE':
      return {
        ...state,
        userSkill: { ...state.userSkill, note: action.payload }
      };
    case 'SET_VIDEO':
      return {
        ...state,
        userSkill: { ...state.userSkill, videoUrl: action.payload }
      };
    case 'SET_SEQUENCE':
      return {
        ...state,
        userSkill: { ...state.userSkill, sequence: action.payload }
      };
    case 'SET_CATEGORY_ID':
      return {
        ...state,
        skill: { ...state.skill, categoryId: action.payload || '' }
      };
    case 'SET_SKILL_NAME':
      return {
        ...state,
        skill: { ...state.skill, name: action.payload }
      };
    case 'SET_SKILL_ID':
      console.log('Setting skill ID:', action.payload);
      return {
        ...state,
        skill: { ...state.skill, id: action.payload }
      };
    case 'ADD_SEQUENCE_STEP':
      return {
        ...state,
        userSkill: {
          ...state.userSkill,
          sequence: [
            ...state.userSkill.sequence,
            {
              stepNumber: state.userSkill.sequence.length + 1,
              intention: '',
              details: []
            }
          ]
        }
      };
    case 'REMOVE_SEQUENCE_STEP':
      return {
        ...state,
        userSkill: {
          ...state.userSkill,
          sequence: state.userSkill.sequence.filter((_, index) => index !== action.payload)
        }
      };
    case 'UPDATE_SEQUENCE_STEP':
      return {
        ...state,
        userSkill: {
          ...state.userSkill,
          sequence: state.userSkill.sequence.map((step, index) =>
            index === action.payload.index
              ? { ...step, [action.payload.field]: action.payload.value }
              : step
          )
        }
      };
    case 'ADD_STEP_DETAIL':
      return {
        ...state,
        userSkill: {
          ...state.userSkill,
          sequence: state.userSkill.sequence.map((step, index) =>
            index === action.payload
              ? { ...step, details: [...step.details, ''] }
              : step
          )
        }
      };
    case 'REMOVE_STEP_DETAIL':
      return {
        ...state,
        userSkill: {
          ...state.userSkill,
          sequence: state.userSkill.sequence.map((step, stepIndex) =>
            stepIndex === action.payload.stepIndex
              ? {
                ...step,
                details: step.details.filter((_, detailIndex) => detailIndex !== action.payload.detailIndex)
              }
              : step
          )
        }
      };
    case 'UPDATE_STEP_DETAIL':
      return {
        ...state,
        userSkill: {
          ...state.userSkill,
          sequence: state.userSkill.sequence.map((step, stepIndex) =>
            stepIndex === action.payload.stepIndex
              ? {
                ...step,
                details: step.details.map((detail, detailIndex) =>
                  detailIndex === action.payload.detailIndex ? action.payload.value : detail
                )
              }
              : step
          )
        }
      };
    case 'CLEAR_SEQUENCE':
      return {
        ...state,
        userSkill: {
          ...state.userSkill,
          sequence: []
        }
      };
    case 'RESET_SKILL':
      return initialSkillState;
    case 'SET_SKILL_TO_EDIT':
      return {
        ...state,
        skill: action.payload.skill,
        userSkill: action.payload.userSkill
      };
    default:
      return state;
  }
};

type SkillContextType = {
  skills: SkillType[];
  recentlyCreatedSkills: UserSkillType[];
  addSkill: (saveToRecentlyCreatedSkills?: boolean) => Promise<void>;
    updateSkill: (skillId: string) => Promise<void>;
  newSkillState: NewUserSkillDataType;
  newSkillDispatch: React.Dispatch<SkillAction>;
  clearRecentlyCreatedSkills: () => void;
  isAddingSkill: boolean;
  isUpdatingSkill: boolean;
  addSkillError: Error | null;
  updateSkillError: Error | null;
};

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const SkillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyCreatedSkills, setRecentlyCreatedSkills] = useState<UserSkillType[]>([]);
  const [newSkillState, newSkillDispatch] = useReducer(skillReducer, initialSkillState);
  const { getAuthenticatedRequest } = useAuth();
  
  const { data: querySkills = [], isLoading, isError } = useSkills();
  const { mutateAsync, isPending: isAddingSkill, error: addSkillError } = useAddSkillMutation();
  const { mutateAsync: updateUserSkillMutation, isPending: isUpdatingSkill, error: updateSkillError } = userSkillService.useUpdateUserSkill();
  
  const skills = querySkills;

  const addSkill = async (saveToRecentlyCreatedSkills: boolean = false) => {
    try {
      console.log('Adding user skill:', newSkillState);
      const result = await userSkillService.createUserSkill(getAuthenticatedRequest, newSkillState);
      
      if (saveToRecentlyCreatedSkills) {
        setRecentlyCreatedSkills(prev => [...prev, result]);
      }
      
      newSkillDispatch({ type: 'RESET_SKILL' });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to add skill', error);
      return Promise.reject(error);
    }
  };
  
  const updateSkill = async (skillId: string) => {
    try {
      console.log('Updating user skill:', newSkillState);
      await updateUserSkillMutation({ 
        skillId, 
        data: {
          note: newSkillState.userSkill.note,
          videoUrl: newSkillState.userSkill.videoUrl,
          sequence: newSkillState.userSkill.sequence
        }
      });
      
      newSkillDispatch({ type: 'RESET_SKILL' });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update skill', error);
      return Promise.reject(error);
    }
  };
  
  const clearRecentlyCreatedSkills = () => {
    setRecentlyCreatedSkills([]);
  };

  return (
    <SkillContext.Provider 
      value={{ 
        skills, 
        recentlyCreatedSkills,
        addSkill,
        updateSkill,
        newSkillState,
        newSkillDispatch,
        clearRecentlyCreatedSkills,
        isAddingSkill,
        isUpdatingSkill,
        addSkillError: addSkillError as Error | null,
        updateSkillError: updateSkillError as Error | null
      }}
    >
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
