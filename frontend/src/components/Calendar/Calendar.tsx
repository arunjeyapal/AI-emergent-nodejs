import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CalendarHeader from './CalendarHeader';
import DayView from './DayView';
import EventFormModal from './EventFormModal';

const Calendar: React.FC = () => {
  const view = useSelector((state: RootState) => state.calendar.view);
  const selectedDate = useSelector((state: RootState) => new Date(state.calendar.selectedDate));
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  const renderCalendarBody = () => {
    switch (view) {
      case 'day':
        return <DayView />;
      case 'week':
        return <div className="flex-1 p-4">Week view to be implemented</div>;
      case 'month':
        return <div className="flex-1 p-4">Month view to be implemented</div>;
      case 'year':
        return <div className="flex-1 p-4">Year view to be implemented</div>;
      default:
        return <DayView />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader />
      
      {/* Create Event Button */}
      <div className="px-4 py-2 bg-white border-b border-gray-200">
        <button
          onClick={() => setIsEventFormOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Event
          </div>
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {renderCalendarBody()}
      </div>
      
      {/* Event Form Modal */}
      {isEventFormOpen && (
        <EventFormModal 
          onClose={() => setIsEventFormOpen(false)}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Calendar;
