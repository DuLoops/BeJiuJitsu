import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UIState {
    isCalendarCollapsed: boolean;
    setCalendarCollapsed: (collapsed: boolean) => void;
    toggleCalendarCollapsed: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            isCalendarCollapsed: false,
            setCalendarCollapsed: (collapsed) => set({ isCalendarCollapsed: collapsed }),
            toggleCalendarCollapsed: () => set((state) => ({ isCalendarCollapsed: !state.isCalendarCollapsed })),
        }),
        {
            name: 'ui-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
