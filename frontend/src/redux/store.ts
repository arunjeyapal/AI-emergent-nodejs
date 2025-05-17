import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './calendarSlice';
import eventReducer from './eventSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    events: eventReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
