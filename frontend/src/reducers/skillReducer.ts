import { SkillInput, SequenceStep, SkillType } from '@/src/types/skill';

export type SkillAction =
  | { type: 'SET_NOTE'; payload: string }
  | { type: 'SET_VIDEO'; payload: string | null }
  | { type: 'SET_SEQUENCE'; payload: SequenceStep[] }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_SKILL'; payload: string }
  | { type: 'ADD_SEQUENCE_STEP' }
  | { type: 'REMOVE_SEQUENCE_STEP'; payload: number }
  | { type: 'UPDATE_SEQUENCE_STEP'; payload: { index: number; field: string; value: any } }
  | { type: 'ADD_STEP_DETAIL'; payload: number }
  | { type: 'REMOVE_STEP_DETAIL'; payload: { stepIndex: number; detailIndex: number } }
  | { type: 'UPDATE_STEP_DETAIL'; payload: { stepIndex: number; detailIndex: number; value: string } }
  | { type: 'CLEAR_SEQUENCE' }
  | { type: 'RESET_SKILL' };  // Added for resetting the form after successful creation

export const initialSkillState: SkillInput = {
  note: '',
  video: null,
  sequence: [] as SequenceStep[],
  selectedCategory: null,
  selectedSkill: '',
};

export const skillReducer = (state: SkillInput, action: SkillAction): SkillInput => {
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
export const createSkillFromInput = (input: SkillInput): SkillType => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: input.selectedSkill,
    category: input.selectedCategory || 'none',
    note: input.note,
    video: input.video,
    sequence: input.sequence,
  };
};