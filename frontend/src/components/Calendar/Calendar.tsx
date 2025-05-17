import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CalendarHeader from './CalendarHeader';
import DayView from './DayView';

const Calendar: React.FC = () => {
  const view = useSelector((state: RootState) => state.calendar.view);

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
      <div className="flex-1 overflow-hidden">
        {renderCalendarBody()}
      </div>
    </div>
  );
};

export default Calendar;
