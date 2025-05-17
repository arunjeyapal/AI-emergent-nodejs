import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventType } from '../types';
import { mockEvents } from '../mock/mockData';

const STORAGE_KEY = 'calendar_events';

// Load events from localStorage if available
const loadEventsFromStorage = (): EventType[] => {
  if (typeof window === 'undefined') return mockEvents;
  
  const storedEvents = localStorage.getItem(STORAGE_KEY);
  return storedEvents ? JSON.parse(storedEvents) : mockEvents;
};

const initialState: { events: EventType[] } = {
  events: loadEventsFromStorage(),
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<EventType>) => {
      state.events.push(action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
      }
    },
    updateEvent: (state, action: PayloadAction<EventType>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
        }
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
      }
    },
  },
});

export const { addEvent, updateEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
