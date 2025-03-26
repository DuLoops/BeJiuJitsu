import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { SkillType,  SequenceStep } from '@/src/types/skill';
import * as skillService from '../services/skillService';
import { useSkills, useAddSkill as useAddSkillMutation } from '../services/skillService';

// Types and reducer moved from skillReducer.ts
export type SkillAction =
  | { type: 'SET_NOTE'; payload: string }
  | { type: 'SET_VIDEO'; payload: string | null }
  | { type: 'SET_SEQUENCE'; payload: SequenceStep[] }
  | { type: 'SET_CATEGORY'; payload: {id:string, name:string} | null }
  | { type: 'SET_SKILL'; payload: string }
  | { type: 'ADD_SEQUENCE_STEP' }
  | { type: 'REMOVE_SEQUENCE_STEP'; payload: number }
  | { type: 'UPDATE_SEQUENCE_STEP'; payload: { index: number; field: string; value: any } }
  | { type: 'ADD_STEP_DETAIL'; payload: number }
  | { type: 'REMOVE_STEP_DETAIL'; payload: { stepIndex: number; detailIndex: number } }
  | { type: 'UPDATE_STEP_DETAIL'; payload: { stepIndex: number; detailIndex: number; value: string } }
  | { type: 'CLEAR_SEQUENCE' }
  | { type: 'RESET_SKILL' };

export const initialSkillState: SkillType = {
  note: '',
  video: null,
  sequence: [] as SequenceStep[],
  category: null,
  name: '',
  id: ''
};

export const skillReducer = (state: SkillType, action: SkillAction) => {
  switch (action.type) {
    case 'SET_NOTE':
      return { ...state, note: action.payload };
    case 'SET_VIDEO':
      return { ...state, video: action.payload };
    case 'SET_SEQUENCE':
      return { ...state, sequence: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_SKILL':
      return { ...state, selectedSkill: action.payload };
    case 'ADD_SEQUENCE_STEP':
      return {
        ...state,
        sequence: [
          ...state.sequence,
          {
            stepNumber: state.sequence.length + 1,
            intention: '',
            details: []
          }
        ]
      };
    case 'REMOVE_SEQUENCE_STEP':
      return {
        ...state,
        sequence: state.sequence.filter((_, index) => index !== action.payload)
      };
    case 'UPDATE_SEQUENCE_STEP':
      return {
        ...state,
        sequence: state.sequence.map((step, index) =>
          index === action.payload.index
            ? { ...step, [action.payload.field]: action.payload.value }
            : step
        )
      };
    case 'ADD_STEP_DETAIL':
      return {
        ...state,
        sequence: state.sequence.map((step, index) =>
          index === action.payload
            ? { ...step, details: [...step.details, ''] }
            : step
        )
      };
    case 'REMOVE_STEP_DETAIL':
      return {
        ...state,
        sequence: state.sequence.map((step, stepIndex) =>
          stepIndex === action.payload.stepIndex
            ? {
              ...step,
              details: step.details.filter((_, detailIndex) => detailIndex !== action.payload.detailIndex)
            }
            : step
        )
      };
    case 'UPDATE_STEP_DETAIL':
      return {
        ...state,
        sequence: state.sequence.map((step, stepIndex) =>
          stepIndex === action.payload.stepIndex
            ? {
              ...step,
              details: step.details.map((detail, detailIndex) =>
                detailIndex === action.payload.detailIndex ? action.payload.value : detail
              )
            }
            : step
        )
      };
    case 'CLEAR_SEQUENCE':
      return {
        ...state,
        sequence: []
      };
    case 'RESET_SKILL':
      return initialSkillState;
    default:
      return state;
  }
};

// Helper function to convert SkillInput to SkillType
export const createSkillFromInput = (input: SkillType): SkillType => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: input.name,
    category: input.category || null,
    note: input.note,
    video: input.video,
    sequence: input.sequence,
  };
};

type SkillContextType = {
  skills: SkillType[];
  recentlyCreatedSkills: SkillType[];
  addSkill: (skill: SkillType) => Promise<void>;
  newSkillState: typeof initialSkillState;
  newSkillDispatch: React.Dispatch<SkillAction>;
  clearRecentlyCreatedSkills: () => void;
  isAddingSkill: boolean;
  addSkillError: Error | null;
};

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const SkillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyCreatedSkills, setRecentlyCreatedSkills] = useState<SkillType[]>([]);
  const [newSkillState, newSkillDispatch] = useReducer(skillReducer, initialSkillState);
  
  // Use React Query hooks for data fetching and mutations
  const { data: querySkills = [], isLoading, isError } = useSkills();
  const { mutateAsync, isPending: isAddingSkill, error: addSkillError } = useAddSkillMutation();
  
  // Fix: Use querySkills directly instead of maintaining a separate state
  // This eliminates the need for the useEffect that was causing the infinite loop
  const skills = querySkills;

  const addSkill = async (skill: SkillType) => {
    try {
      // Use the React Query mutation to add the skill to the backend
      await mutateAsync(skill);
      
      // Update the recently created skills list
      setRecentlyCreatedSkills(prev => [...prev, skill]);
      
      // Reset the form state
      newSkillDispatch({ type: 'RESET_SKILL' });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to add skill', error);
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
        newSkillState,
        newSkillDispatch,
        clearRecentlyCreatedSkills,
        isAddingSkill,
        addSkillError: addSkillError as Error | null
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
