
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalState {
  // UI State
  isMapView: boolean;
  selectedCampaign: number | null;
  searchQuery: string;
  activeFilters: {
    category?: string;
    priceRange?: [number, number];
    radius?: number;
  };
  
  // User Preferences
  preferences: {
    notifications: boolean;
    location: boolean;
    darkMode: boolean;
  };

  // Actions
  setMapView: (isMap: boolean) => void;
  setSelectedCampaign: (id: number | null) => void;
  setSearchQuery: (query: string) => void;
  updateFilters: (filters: Partial<GlobalState['activeFilters']>) => void;
  updatePreferences: (prefs: Partial<GlobalState['preferences']>) => void;
  clearFilters: () => void;
}

export const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      // Initial state
      isMapView: false,
      selectedCampaign: null,
      searchQuery: '',
      activeFilters: {},
      preferences: {
        notifications: true,
        location: true,
        darkMode: true,
      },

      // Actions
      setMapView: (isMap) => set({ isMapView: isMap }),
      setSelectedCampaign: (id) => set({ selectedCampaign: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      updateFilters: (filters) => 
        set((state) => ({ 
          activeFilters: { ...state.activeFilters, ...filters } 
        })),
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs }
        })),
      clearFilters: () => set({ activeFilters: {}, searchQuery: '' }),
    }),
    {
      name: 'earlyshh-global-state',
      partialize: (state) => ({
        preferences: state.preferences,
        activeFilters: state.activeFilters,
      }),
    }
  )
);
