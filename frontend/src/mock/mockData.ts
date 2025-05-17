import { CategoryType, EventType } from '../types';
import { addDays, addHours, startOfToday } from 'date-fns';

// Mock categories
export const mockCategories: CategoryType[] = [
  { id: 'work', name: 'Work', color: '#4F46E5' }, // Indigo
  { id: 'personal', name: 'Personal', color: '#10B981' }, // Emerald
  { id: 'family', name: 'Family', color: '#F59E0B' }, // Amber
  { id: 'academy', name: 'Academy', color: '#EF4444' }, // Red
  { id: 'events', name: 'Events', color: '#8B5CF6' }, // Purple
];

// Helper function to create mock events
const createMockEvents = (): EventType[] => {
  const today = startOfToday();
  
  return [
    {
      id: '1',
      title: 'Team Meeting',
      start: addHours(today, 9).toISOString(),
      end: addHours(today, 10).toISOString(),
      categoryId: 'work',
      description: 'Weekly team sync to discuss project progress',
    },
    {
      id: '2',
      title: 'Lunch with Alex',
      start: addHours(today, 12).toISOString(),
      end: addHours(today, 13).toISOString(),
      categoryId: 'personal',
      description: 'Catch up over lunch at the new cafe',
    },
    {
      id: '3',
      title: 'React Workshop',
      start: addHours(today, 14).toISOString(),
      end: addHours(today, 16).toISOString(),
      categoryId: 'academy',
      description: 'Advanced React patterns and performance optimizations',
    },
    {
      id: '4',
      title: 'Call with Client',
      start: addHours(today, 11).toISOString(),
      end: addHours(today, 11.5).toISOString(),
      categoryId: 'work',
      description: 'Discuss new project requirements',
    },
    {
      id: '5',
      title: 'Fitness Class',
      start: addHours(today, 18).toISOString(),
      end: addHours(today, 19).toISOString(),
      categoryId: 'personal',
      description: 'HIIT class at the gym',
    },
    {
      id: '6',
      title: 'Family Dinner',
      start: addHours(addDays(today, 1), 19).toISOString(),
      end: addHours(addDays(today, 1), 21).toISOString(),
      categoryId: 'family',
      description: 'Monthly family dinner at home',
    },
    {
      id: '7',
      title: 'Product Demo',
      start: addHours(addDays(today, 1), 15).toISOString(),
      end: addHours(addDays(today, 1), 16).toISOString(),
      categoryId: 'work',
      description: 'Demo the new features to the stakeholders',
    },
    {
      id: '8',
      title: 'Tech Conference',
      start: addHours(addDays(today, 3), 9).toISOString(),
      end: addHours(addDays(today, 3), 17).toISOString(),
      categoryId: 'events',
      description: 'Annual tech conference with workshops and networking',
    },
  ];
};

export const mockEvents = createMockEvents();
