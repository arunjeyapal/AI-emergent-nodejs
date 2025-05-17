// Types for our application
export interface CategoryType {
  id: string;
  name: string;
  color: string;
}

export interface EventType {
  id: string;
  title: string;
  start: string; // ISO date string
  end: string; // ISO date string
  categoryId: string;
  description?: string;
}

// Calendar view types
export type CalendarViewType = 'day' | 'week' | 'month' | 'year';
