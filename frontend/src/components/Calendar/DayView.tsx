import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  format, 
  startOfDay, 
  endOfDay, 
  eachHourOfInterval, 
  addHours,
  isWithinInterval, 
  differenceInMinutes,
  areIntervalsOverlapping,
  isSameDay
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
  
  // Ref for scrolling to current time
  const timeGridRef = useRef<HTMLDivElement>(null);
  
  // Get hours for the current day
  const dayStart = startOfDay(selectedDate);
  const dayEnd = endOfDay(selectedDate);
  const hours = eachHourOfInterval({ start: dayStart, end: addHours(dayEnd, 1) });
  
  // Filter events for the selected day and categories
  const dayEvents = events.filter(event => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    return (
      (isWithinInterval(eventStart, { start: dayStart, end: dayEnd }) || 
      isWithinInterval(eventEnd, { start: dayStart, end: dayEnd }) ||
      (eventStart <= dayStart && eventEnd >= dayEnd)) &&
      selectedCategoryIds.includes(event.categoryId)
    );
  });
  
  // Find current time indicator position
  const now = new Date();
  const isToday = isSameDay(selectedDate, now);
  const currentTimePosition = isToday 
    ? (differenceInMinutes(now, dayStart) / (24 * 60)) * 100
    : -1;

  // Group events that overlap to position them side by side
  interface EventWithPosition extends EventType {
    position: number;
    width: number;
  }

  const positionEvents = (): EventWithPosition[] => {
    if (dayEvents.length === 0) return [];
    
    // Sort events by start time
    const sortedEvents = [...dayEvents].sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    
    const eventsWithPosition: EventWithPosition[] = [];
    const groups: { [key: string]: EventWithPosition[] } = {};
    
    // Create groups of overlapping events
    sortedEvents.forEach(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // Find which group this event belongs to
      let foundGroup = false;
      
      Object.keys(groups).forEach(groupId => {
        const group = groups[groupId];
        const overlapsWithGroup = group.some(groupEvent => 
          areIntervalsOverlapping(
            { start: eventStart, end: eventEnd },
            { start: new Date(groupEvent.start), end: new Date(groupEvent.end) }
          )
        );
        
        if (overlapsWithGroup) {
          // Add to existing group
          const positions = group.map(e => e.position);
          // Find the first available position
          let pos = 0;
          while (positions.includes(pos)) pos++;
          
          const eventWithPos: EventWithPosition = {
            ...event,
            position: pos,
            width: 0  // Will be calculated later
          };
          
          group.push(eventWithPos);
          eventsWithPosition.push(eventWithPos);
          foundGroup = true;
        }
      });
      
      if (!foundGroup) {
        // Create a new group
        const groupId = `group_${Object.keys(groups).length}`;
        const eventWithPos: EventWithPosition = {
          ...event,
          position: 0,
          width: 0  // Will be calculated later
        };
        
        groups[groupId] = [eventWithPos];
        eventsWithPosition.push(eventWithPos);
      }
    });
    
    // Calculate width based on max position in each group
    Object.values(groups).forEach(group => {
      const maxPosition = Math.max(...group.map(e => e.position));
      const width = 1 / (maxPosition + 1);
      
      group.forEach(event => {
        event.width = width;
      });
    });
    
    return eventsWithPosition;
  };
  
  const positionedEvents = positionEvents();

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
  const getEventStyle = (event: EventWithPosition) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    // Clamp event to day boundaries if it extends beyond
    const clampedStart = eventStart < dayStart ? dayStart : eventStart;
    const clampedEnd = eventEnd > dayEnd ? dayEnd : eventEnd;
    
    const top = (differenceInMinutes(clampedStart, dayStart) / (24 * 60)) * 100;
    const height = (differenceInMinutes(clampedEnd, clampedStart) / (24 * 60)) * 100;
    
    // Calculate left position and width based on the event's position
    const left = event.position * (event.width * 100);
    const width = event.width * 100;
    
    return {
      top: `${top}%`,
      height: `${height}%`,
      left: `${left}%`,
      width: `${width}%`,
    };
  };
  
  // Scroll to current time when view loads or date changes
  useEffect(() => {
    if (isToday && timeGridRef.current) {
      const scrollPosition = (currentTimePosition / 100) * timeGridRef.current.scrollHeight;
      timeGridRef.current.scrollTop = scrollPosition - timeGridRef.current.clientHeight / 2;
    } else if (timeGridRef.current) {
      // If not today, scroll to 8 AM (typical start of workday)
      const businessHoursStart = 8; // 8 AM
      const scrollPosition = (businessHoursStart / 24) * timeGridRef.current.scrollHeight;
      timeGridRef.current.scrollTop = scrollPosition;
    }
  }, [selectedDate, isToday]);
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Date header with day of week */}
      <div className="bg-white px-4 py-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(selectedDate, 'EEEE')} {/* Day of week */}
        </h2>
      </div>
      
      <div ref={timeGridRef} className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[60px_1fr] h-full">
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
                className="absolute left-0 right-0 border-t-2 border-red-500 z-10 pointer-events-none"
                style={{ top: `${currentTimePosition}%` }}
              >
                <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            )}
            
            {/* Events */}
            {positionedEvents.map(event => {
              const category = categories.find(cat => cat.id === event.categoryId);
              if (!category) return null;
              
              return (
                <div 
                  key={event.id}
                  className="absolute z-0"
                  style={{
                    ...getEventStyle(event),
                    padding: '0 2px'
                  }}
                >
                  <EventCard 
                    event={event} 
                    category={category}
                    onClick={() => handleEventClick(event)}
                  />
                </div>
              );
            })}
            
            {/* Background for click-to-create (future enhancement) */}
            <div className="absolute inset-0 pointer-events-none"></div>
          </div>
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
