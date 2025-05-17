import React from 'react';
import Navigation from './Navigation';
import CategoryFilter from './CategoryFilter';
import MiniCalendar from './MiniCalendar';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white h-full border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Calendar</h1>
      </div>
      <div className="p-4 flex-1 overflow-auto">
        <Navigation />
        <CategoryFilter />
        <MiniCalendar />
      </div>
    </aside>
  );
};

export default Sidebar;
