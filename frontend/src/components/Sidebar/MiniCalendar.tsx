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
  subMonths
} from 'date-fns';
import { setSelectedDate } from '../../redux/calendarSlice';
import { RootState } from '../../redux/store';

const MiniCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: RootState) => new Date(state.calendar.selectedDate));
  
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

  // Create an array to represent the first week with empty cells for days not in this month
  const startDayOfWeek = days[0].getDay();
  const daysGrid = [
    ...Array(startDayOfWeek).fill(null),
    ...days
  ];

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
        {daysGrid.map((day, i) => (
          <div key={i} className="text-center">
            {day ? (
              <button
                onClick={() => handleSelectDate(day)}
                className={`
                  w-6 h-6 text-xs rounded-full flex items-center justify-center
                  ${isSameDay(day, selectedDate) ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                  ${isToday(day) ? 'border border-blue-500' : ''}
                  ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : 'text-gray-700'}
                  hover:bg-gray-100
                `}
              >
                {format(day, 'd')}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
