import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarViewType } from '../types';
import { startOfToday } from 'date-fns';

interface CalendarState {
  view: CalendarViewType;
  selectedDate: string; // ISO date string
}

const initialState: CalendarState = {
  view: 'day',
  selectedDate: startOfToday().toISOString(),
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<CalendarViewType>) => {
      state.view = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { setView, setSelectedDate } = calendarSlice.actions;
export default calendarSlice.reducer;
