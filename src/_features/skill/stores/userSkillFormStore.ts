import { UserSkillWithDetails } from '@/src/_features/skill/components/UserSkillList';
import { Database, Tables } from '@/src/supabase/types';
import { CategoryEnum, SkillNameEnum } from '@/src/types/skills';
import { create } from 'zustand';

// Define the structure for a sequence step
export interface SequenceStep {
  intention: string;
  detailsArray: Array<{ detail: string }>;
}

// Simpler type for category selection if CategoryPicker provides this
interface SimpleCategory {
  id: string;
  name: string;
}

// Define the state interface for the skill form store
interface UserSkillFormState {
  // Form data
  editingUserSkill: UserSkillWithDetails | null;
  userSkillId: string | null;
  selectedCategory: Tables<'categories'> | null; 
  newCategoryName: string;
  selectedSkillName: string; 
  newSkillName: string;      
  note: string;
  source: Database["public"]["Enums"]["SkillSource"] | string;
  isFavorite: boolean;
  videoUrl: string;
  sequences: SequenceStep[];

  // Actions
  initializeForEdit: (skillToEdit: UserSkillWithDetails, categories?: Tables<'categories'>[]) => void;
  resetForm: () => void;
  
  setEditingUserSkill: (skill: UserSkillWithDetails | null) => void;
  setUserSkillId: (id: string | null) => void;
  setSelectedCategoryDirectly: (category: Tables<'categories'> | null) => void; 
  setNewCategoryName: (name: string) => void;
  setSelectedSkillName: (name: string) => void;
  setNewSkillName: (name: string) => void;
  setNote: (note: string) => void;
  setSource: (source: Database["public"]["Enums"]["SkillSource"] | string) => void;
  setIsFavorite: (isFavorite: boolean) => void;
  setVideoUrl: (url: string) => void;
  setSequences: (sequences: SequenceStep[]) => void;

  handleCategorySelection: (category: SimpleCategory | null) => void;
  handleSkillInput: (skillName: string) => void; 
}

const initialState: Omit<UserSkillFormState, 'initializeForEdit' | 'resetForm' | 'setEditingUserSkill' | 'setUserSkillId' | 'setSelectedCategoryDirectly' | 'setNewCategoryName' | 'setSelectedSkillName' | 'setNewSkillName' | 'setNote' | 'setSource' | 'setIsFavorite' | 'setVideoUrl' | 'setSequences' | 'handleCategorySelection' | 'handleSkillInput'> = {
  editingUserSkill: null,
  userSkillId: null,
  selectedCategory: null,
  newCategoryName: '',
  selectedSkillName: '',
  newSkillName: '',
  note: '',
  source: 'INDEPENDENT',
  isFavorite: false,
  videoUrl: '',
  sequences: [],
};

export const useUserSkillFormStore = create<UserSkillFormState>((set, get) => ({
  ...initialState,

  initializeForEdit: (skillToEdit, categories) => {
    let categoryObjectToSet: Tables<'categories'> | null = null;
    if (categories) {
        categoryObjectToSet = categories.find(c => c.id === skillToEdit.skill.categoryId) || null;
    }

    set({
      editingUserSkill: skillToEdit,
      userSkillId: skillToEdit.id,
      selectedCategory: categoryObjectToSet, 
      newCategoryName: '', 
      selectedSkillName: skillToEdit.skill.name, 
      newSkillName: skillToEdit.skill.name,      
      note: skillToEdit.note || '',
      source: skillToEdit.source || 'INDEPENDENT',
      isFavorite: skillToEdit.isFavorite || false,
      videoUrl: skillToEdit.videoUrl || '',
      sequences: skillToEdit.sequences?.map(seq => ({
        intention: seq.intention || '',
        detailsArray: seq.details?.map(d => ({ detail: d.detail })) || [{ detail: '' }]
      })) || [],
    });
  },

  resetForm: () => set(initialState),

  setEditingUserSkill: (skill) => set({ editingUserSkill: skill }),
  setUserSkillId: (id) => set({ userSkillId: id }),
  setSelectedCategoryDirectly: (category) => set({ selectedCategory: category }),
  setNewCategoryName: (name) => set({ newCategoryName: name }),
  setSelectedSkillName: (name) => set({ selectedSkillName: name }),
  setNewSkillName: (name) => set({ newSkillName: name }),
  setNote: (note) => set({ note: note }),
  setSource: (source) => set({ source: source }),
  setIsFavorite: (isFavorite) => set({ isFavorite: isFavorite }),
  setVideoUrl: (url) => set({ videoUrl: url }),
  setSequences: (sequences) => set({ sequences: sequences }),

  handleCategorySelection: (category) => {
    const categoryToStore = category ? ({ 
      ...category, 
      is_predefined: false, // Default to false for new categories
      user_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Tables<'categories'>) : null;
    set({
      selectedCategory: categoryToStore,
      newCategoryName: '',
      selectedSkillName: '',
      newSkillName: '',      
    });
  },
  
  handleSkillInput: (skillName) => {
    set({ newSkillName: skillName, selectedSkillName: skillName });
  },
}));

export const getSkillFormDataForSubmission = (state: UserSkillFormState): any => {
    let skillNameToSubmit = state.newSkillName.trim();
    if (!skillNameToSubmit && state.selectedSkillName.trim()) {
        skillNameToSubmit = state.selectedSkillName.trim();
    } else if (!skillNameToSubmit && state.editingUserSkill && !state.selectedSkillName.trim()) {
        skillNameToSubmit = state.editingUserSkill.skill.name;
    }

    let categoryIdToSubmit: string | null | undefined = state.selectedCategory?.id;
    let categoryNameToSubmit = '';

    if (state.selectedCategory && state.selectedCategory.id === 'new_category_marker') {
        categoryIdToSubmit = null;
        categoryNameToSubmit = state.newCategoryName.trim();
    } else if (!state.selectedCategory && state.newCategoryName.trim()) {
        categoryIdToSubmit = null;
        categoryNameToSubmit = state.newCategoryName.trim();
    } else if (state.editingUserSkill && !state.selectedCategory && !state.newCategoryName.trim()) {
        categoryIdToSubmit = state.editingUserSkill.skill.categoryId;
    }
    
    return {
        userSkillId: state.userSkillId,
        skillName: skillNameToSubmit as SkillNameEnum | string,
        categoryId: categoryIdToSubmit,
        categoryName: categoryNameToSubmit as CategoryEnum | string,
        note: state.note,
        source: state.source,
        isFavorite: state.isFavorite,
        videoUrl: state.videoUrl,
        sequences: state.sequences.filter(s => s.intention?.trim() || s.detailsArray.some(d => d.detail.trim())),
    };
}; 