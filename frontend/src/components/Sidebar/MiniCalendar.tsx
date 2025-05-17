import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths,
  getDay
} from 'date-fns';
import { setSelectedDate } from '../../redux/calendarSlice';
import { RootState } from '../../redux/store';

const MiniCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: RootState) => new Date(state.calendar.selectedDate));
  const events = useSelector((state: RootState) => state.events.events);
  const selectedCategoryIds = useSelector((state: RootState) => state.categories.selectedCategories);
  
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(selectedDate));
  
  // Update the month when selected date changes
  React.useEffect(() => {
    if (!isSameMonth(selectedDate, currentMonth)) {
      setCurrentMonth(startOfMonth(selectedDate));
    }
  }, [selectedDate, currentMonth]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const handleSelectDate = (date: Date) => {
    dispatch(setSelectedDate(date.toISOString()));
  };

  // Check if a date has events
  const hasEvents = (date: Date): boolean => {
    return events.some(event => {
      const eventStart = new Date(event.start);
      return (
        isSameDay(date, eventStart) && 
        selectedCategoryIds.includes(event.categoryId)
      );
    });
  };

  // Create a calendar grid with proper day alignment
  const createCalendarGrid = () => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const firstDayOfWeek = getDay(firstDayOfMonth); // 0 = Sunday, 1 = Monday, etc.
    
    // Create empty cells for days before the first day of month
    const leadingEmptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => (
      <div key={`empty-start-${i}`} className="text-center"></div>
    ));
    
    // Create cells for each day of the month
    const dayCells = days.map(day => (
      <div key={day.getTime()} className="text-center">
        <button
          onClick={() => handleSelectDate(day)}
          className={`
            w-6 h-6 text-xs rounded-full flex items-center justify-center relative
            ${isSameDay(day, selectedDate) ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
            ${isToday(day) ? 'border border-blue-500' : ''}
            ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : 'text-gray-700'}
            hover:bg-gray-100
          `}
        >
          {format(day, 'd')}
          {hasEvents(day) && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
          )}
        </button>
      </div>
    ));
    
    return [...leadingEmptyCells, ...dayCells];
  };

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h3 className="text-sm font-medium text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button 
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((day, i) => (
          <div key={i} className="text-center text-xs text-gray-500 font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {createCalendarGrid()}
      </div>
    </div>
  );
};

export default MiniCalendar;
