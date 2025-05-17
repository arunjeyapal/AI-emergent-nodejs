import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryType } from '../types';
import { mockCategories } from '../mock/mockData';

const STORAGE_KEY = 'calendar_categories';

// Load categories from localStorage if available
const loadCategoriesFromStorage = (): CategoryType[] => {
  if (typeof window === 'undefined') return mockCategories;
  
  const storedCategories = localStorage.getItem(STORAGE_KEY);
  return storedCategories ? JSON.parse(storedCategories) : mockCategories;
};

interface CategoryState {
  categories: CategoryType[];
  selectedCategories: string[]; // Array of category IDs
}

const initialState: CategoryState = {
  categories: loadCategoriesFromStorage(),
  selectedCategories: loadCategoriesFromStorage().map(cat => cat.id), // Initially all categories are selected
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      if (state.selectedCategories.includes(categoryId)) {
        state.selectedCategories = state.selectedCategories.filter(id => id !== categoryId);
      } else {
        state.selectedCategories.push(categoryId);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('calendar_selected_categories', JSON.stringify(state.selectedCategories));
      }
    },
    selectAllCategories: (state) => {
      state.selectedCategories = state.categories.map(cat => cat.id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('calendar_selected_categories', JSON.stringify(state.selectedCategories));
      }
    },
    deselectAllCategories: (state) => {
      state.selectedCategories = [];
      if (typeof window !== 'undefined') {
        localStorage.setItem('calendar_selected_categories', JSON.stringify(state.selectedCategories));
      }
    },
  },
});

export const { toggleCategory, selectAllCategories, deselectAllCategories } = categorySlice.actions;
export default categorySlice.reducer;
