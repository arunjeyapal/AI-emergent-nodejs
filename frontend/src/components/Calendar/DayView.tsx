import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  format, 
  startOfDay, 
  endOfDay, 
  eachHourOfInterval, 
  addHours,
  isWithinInterval, 
  differenceInMinutes,
  areIntervalsOverlapping
} from 'date-fns';
import { RootState } from '../../redux/store';
import { EventType } from '../../types';
import EventCard from './EventCard';
import EventDetailModal from './EventDetailModal';
import MultipleEventsModal from './MultipleEventsModal';

const DayView: React.FC = () => {
  const selectedDate = useSelector((state: RootState) => new Date(state.calendar.selectedDate));
  const events = useSelector((state: RootState) => state.events.events);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const selectedCategoryIds = useSelector((state: RootState) => state.categories.selectedCategories);
  
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [overlappingEvents, setOverlappingEvents] = useState<EventType[] | null>(null);
  
  // Get hours for the current day
  const dayStart = startOfDay(selectedDate);
  const dayEnd = endOfDay(selectedDate);
  const hours = eachHourOfInterval({ start: dayStart, end: addHours(dayEnd, 1) });
  
  // Filter events for the selected day and categories
  const dayEvents = events.filter(event => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    return (
      isWithinInterval(eventStart, { start: dayStart, end: dayEnd }) || 
      isWithinInterval(eventEnd, { start: dayStart, end: dayEnd }) ||
      (eventStart <= dayStart && eventEnd >= dayEnd)
    ) && selectedCategoryIds.includes(event.categoryId);
  });
  
  // Find current time indicator position
  const now = new Date();
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
  const currentTimePosition = isToday 
    ? (differenceInMinutes(now, dayStart) / (24 * 60)) * 100
    : -1;

  const handleEventClick = (clickedEvent: EventType) => {
    // Check if there are overlapping events
    const overlapping = dayEvents.filter(event => {
      if (event.id === clickedEvent.id) return false;
      
      return areIntervalsOverlapping(
        { start: new Date(clickedEvent.start), end: new Date(clickedEvent.end) },
        { start: new Date(event.start), end: new Date(event.end) }
      );
    });
    
    if (overlapping.length > 0) {
      setOverlappingEvents([clickedEvent, ...overlapping]);
    } else {
      setSelectedEvent(clickedEvent);
    }
  };
  
  // Calculate position and height for each event
  const getEventStyle = (event: EventType) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    // Clamp event to day boundaries if it extends beyond
    const clampedStart = eventStart < dayStart ? dayStart : eventStart;
    const clampedEnd = eventEnd > dayEnd ? dayEnd : eventEnd;
    
    const top = (differenceInMinutes(clampedStart, dayStart) / (24 * 60)) * 100;
    const height = (differenceInMinutes(clampedEnd, clampedStart) / (24 * 60)) * 100;
    
    return {
      top: `${top}%`,
      height: `${height}%`,
    };
  };
  
  return (
    <div className="flex flex-col h-full overflow-y-auto relative">
      <div className="grid grid-cols-[60px_1fr] flex-1">
        {/* Time labels */}
        <div className="border-r border-gray-200">
          {hours.map((hour, i) => (
            <div key={i} className="h-20 relative">
              <span className="absolute -top-2.5 left-2 text-xs text-gray-500">
                {format(hour, 'h a')}
              </span>
            </div>
          ))}
        </div>
        
        {/* Events grid */}
        <div className="relative">
          {/* Hour lines */}
          {hours.map((hour, i) => (
            <div key={i} className="h-20 border-b border-gray-200"></div>
          ))}
          
          {/* Current time indicator */}
          {isToday && currentTimePosition > 0 && (
            <div 
              className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
              style={{ top: `${currentTimePosition}%` }}
            >
              <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          )}
          
          {/* Events */}
          {dayEvents.map(event => {
            const category = categories.find(cat => cat.id === event.categoryId);
            if (!category) return null;
            
            return (
              <div 
                key={event.id}
                className="absolute left-2 right-2 z-0"
                style={getEventStyle(event)}
              >
                <EventCard 
                  event={event} 
                  category={category}
                  onClick={() => handleEventClick(event)}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Event detail modal */}
      {selectedEvent && (
        <EventDetailModal 
          event={selectedEvent}
          category={categories.find(cat => cat.id === selectedEvent.categoryId)!}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      
      {/* Multiple events modal */}
      {overlappingEvents && (
        <MultipleEventsModal 
          events={overlappingEvents}
          categories={categories}
          onSelectEvent={(event) => {
            setOverlappingEvents(null);
            setSelectedEvent(event);
          }}
          onClose={() => setOverlappingEvents(null)}
        />
      )}
    </div>
  );
};

export default DayView;
