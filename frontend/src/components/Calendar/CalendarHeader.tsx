import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  format, 
  addDays, 
  subDays, 
  startOfToday, 
  addWeeks, 
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears
} from 'date-fns';
import { RootState } from '../../redux/store';
import { setView, setSelectedDate } from '../../redux/calendarSlice';
import { CalendarViewType } from '../../types';
import PeriodSelectorModal from './PeriodSelectorModal';

const CalendarHeader: React.FC = () => {
  const dispatch = useDispatch();
  const { view, selectedDate } = useSelector((state: RootState) => state.calendar);
  const date = new Date(selectedDate);

  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);

  // Format the date based on the current view
  const formatPeriod = (): string => {
    switch (view) {
      case 'day':
        return format(date, 'MMMM d, yyyy');
      case 'week':
        return `Week of ${format(date, 'MMMM d, yyyy')}`;
      case 'month':
        return format(date, 'MMMM yyyy');
      case 'year':
        return format(date, 'yyyy');
      default:
        return format(date, 'MMMM d, yyyy');
    }
  };

  // Handle navigation
  const handleNext = () => {
    switch (view) {
      case 'day':
        dispatch(setSelectedDate(addDays(date, 1).toISOString()));
        break;
      case 'week':
        dispatch(setSelectedDate(addWeeks(date, 1).toISOString()));
        break;
      case 'month':
        dispatch(setSelectedDate(addMonths(date, 1).toISOString()));
        break;
      case 'year':
        dispatch(setSelectedDate(addYears(date, 1).toISOString()));
        break;
    }
  };

  const handlePrevious = () => {
    switch (view) {
      case 'day':
        dispatch(setSelectedDate(subDays(date, 1).toISOString()));
        break;
      case 'week':
        dispatch(setSelectedDate(subWeeks(date, 1).toISOString()));
        break;
      case 'month':
        dispatch(setSelectedDate(subMonths(date, 1).toISOString()));
        break;
      case 'year':
        dispatch(setSelectedDate(subYears(date, 1).toISOString()));
        break;
    }
  };

  const handleToday = () => {
    dispatch(setSelectedDate(startOfToday().toISOString()));
    dispatch(setView('day'));
  };

  const handleViewChange = (newView: CalendarViewType) => {
    dispatch(setView(newView));
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={() => setIsPeriodModalOpen(true)}
          className="text-xl font-semibold text-gray-900 hover:text-blue-600 focus:outline-none"
        >
          {formatPeriod()}
        </button>
        {isPeriodModalOpen && (
          <PeriodSelectorModal 
            onClose={() => setIsPeriodModalOpen(false)}
            onSelectDate={(date) => {
              dispatch(setSelectedDate(date.toISOString()));
              setIsPeriodModalOpen(false);
            }}
            currentDate={date}
          />
        )}
        <div className="ml-4 flex space-x-2">
          <button 
            onClick={handlePrevious}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <button 
          onClick={handleToday}
          className="ml-4 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
        >
          Today
        </button>
      </div>
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
        <button 
          onClick={() => handleViewChange('day')}
          className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Day
        </button>
        <button 
          onClick={() => handleViewChange('week')}
          className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Week
        </button>
        <button 
          onClick={() => handleViewChange('month')}
          className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Month
        </button>
        <button 
          onClick={() => handleViewChange('year')}
          className={`px-3 py-1 text-sm rounded-md ${view === 'year' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Year
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
