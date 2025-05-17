import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  format,
  startOfWeek,
  endOfWeek, 
  eachDayOfInterval,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  addHours,
  isWithinInterval,
  areIntervalsOverlapping,
  differenceInMinutes,
  isSameDay,
  parseISO
} from 'date-fns';
import { RootState } from '../../redux/store';
import { EventType } from '../../types';
import EventCard from './EventCard';
import EventDetailModal from './EventDetailModal';
import MultipleEventsModal from './MultipleEventsModal';

const WeekView: React.FC = () => {
  const selectedDate = useSelector((state: RootState) => new Date(state.calendar.selectedDate));
  const events = useSelector((state: RootState) => state.events.events);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const selectedCategoryIds = useSelector((state: RootState) => state.categories.selectedCategories);
  
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [overlappingEvents, setOverlappingEvents] = useState<EventType[] | null>(null);
  
  // Ref for scrolling to current time
  const timeGridRef = useRef<HTMLDivElement>(null);
  
  // Get the week boundaries
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  
  // Get days in week
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Get hours for each day
  const hours = eachHourOfInterval({ 
    start: startOfDay(weekStart),
    end: addHours(endOfDay(weekStart), 1) 
  });

  // Get current time for indicator
  const now = new Date();
  const today = startOfDay(now);
  const currentDayIndex = days.findIndex(day => isSameDay(day, today));
  const isCurrentWeek = currentDayIndex !== -1;
  const currentTimePosition = isCurrentWeek
    ? (differenceInMinutes(now, startOfDay(now)) / (24 * 60)) * 100
    : -1;

  // Filter events for the selected week and categories
  const weekEvents = events.filter(event => {
    const eventStart = parseISO(event.start);
    const eventEnd = parseISO(event.end);
    
    return (
      isWithinInterval(eventStart, { start: weekStart, end: weekEnd }) || 
      isWithinInterval(eventEnd, { start: weekStart, end: weekEnd }) ||
      (eventStart <= weekStart && eventEnd >= weekEnd)
    ) && selectedCategoryIds.includes(event.categoryId);
  });

  // Handle event click
  const handleEventClick = (clickedEvent: EventType) => {
    // Check if there are overlapping events
    const overlapping = weekEvents.filter(event => {
      if (event.id === clickedEvent.id) return false;
      
      const clickedStart = parseISO(clickedEvent.start);
      const clickedEnd = parseISO(clickedEvent.end);
      const eventStart = parseISO(event.start);
      const eventEnd = parseISO(event.end);
      
      return areIntervalsOverlapping(
        { start: clickedStart, end: clickedEnd },
        { start: eventStart, end: eventEnd }
      ) && isSameDay(clickedStart, eventStart); // Only count as overlapping if on same day
    });
    
    if (overlapping.length > 0) {
      setOverlappingEvents([clickedEvent, ...overlapping]);
    } else {
      setSelectedEvent(clickedEvent);
    }
  };

  // Group and position events for a specific day
  interface EventWithPosition extends EventType {
    position: number;
    width: number;
  }

  const positionEventsForDay = (dayDate: Date): EventWithPosition[] => {
    // Filter events for this specific day
    const dayEvents = weekEvents.filter(event => {
      const eventStart = parseISO(event.start);
      const eventEnd = parseISO(event.end);
      
      return (
        isWithinInterval(eventStart, { start: startOfDay(dayDate), end: endOfDay(dayDate) }) || 
        isWithinInterval(eventEnd, { start: startOfDay(dayDate), end: endOfDay(dayDate) }) ||
        (eventStart <= startOfDay(dayDate) && eventEnd >= endOfDay(dayDate))
      );
    });
    
    if (dayEvents.length === 0) return [];
    
    // Sort events by start time
    const sortedEvents = [...dayEvents].sort((a, b) => 
      parseISO(a.start).getTime() - parseISO(b.start).getTime()
    );
    
    const eventsWithPosition: EventWithPosition[] = [];
    const groups: { [key: string]: EventWithPosition[] } = {};
    
    // Create groups of overlapping events
    sortedEvents.forEach(event => {
      const eventStart = parseISO(event.start);
      const eventEnd = parseISO(event.end);
      
      let foundGroup = false;
      
      Object.keys(groups).forEach(groupId => {
        const group = groups[groupId];
        const overlapsWithGroup = group.some(groupEvent => 
          areIntervalsOverlapping(
            { start: eventStart, end: eventEnd },
            { start: parseISO(groupEvent.start), end: parseISO(groupEvent.end) }
          )
        );
        
        if (overlapsWithGroup) {
          const positions = group.map(e => e.position);
          let pos = 0;
          while (positions.includes(pos)) pos++;
          
          const eventWithPos: EventWithPosition = {
            ...event,
            position: pos,
            width: 0
          };
          
          group.push(eventWithPos);
          eventsWithPosition.push(eventWithPos);
          foundGroup = true;
        }
      });
      
      if (!foundGroup) {
        const groupId = `group_${Object.keys(groups).length}`;
        const eventWithPos: EventWithPosition = {
          ...event,
          position: 0,
          width: 0
        };
        
        groups[groupId] = [eventWithPos];
        eventsWithPosition.push(eventWithPos);
      }
    });
    
    // Calculate width for each event in groups
    Object.values(groups).forEach(group => {
      const maxPosition = Math.max(...group.map(e => e.position));
      const width = 1 / (maxPosition + 1);
      
      group.forEach(event => {
        event.width = width;
      });
    });
    
    return eventsWithPosition;
  };

  // Calculate position and styles for each event
  const getEventStyle = (event: EventWithPosition, dayDate: Date) => {
    const eventStart = parseISO(event.start);
    const eventEnd = parseISO(event.end);
    
    // Clamp event to day boundaries
    const dayStart = startOfDay(dayDate);
    const dayEnd = endOfDay(dayDate);
    
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

  // Scroll to current time when week view loads
  useEffect(() => {
    if (isCurrentWeek && timeGridRef.current) {
      const scrollPosition = (currentTimePosition / 100) * timeGridRef.current.scrollHeight;
      timeGridRef.current.scrollTop = scrollPosition - timeGridRef.current.clientHeight / 2;
    } else if (timeGridRef.current) {
      // If not current week, scroll to 8 AM
      const businessHoursStart = 8; // 8 AM
      const scrollPosition = (businessHoursStart / 24) * timeGridRef.current.scrollHeight;
      timeGridRef.current.scrollTop = scrollPosition;
    }
  }, [selectedDate, isCurrentWeek, currentTimePosition]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Days header */}
      <div className="grid grid-cols-7 bg-white border-b border-gray-200">
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`px-2 py-2 text-center border-r border-gray-200 ${
              isSameDay(day, today) ? 'bg-blue-50 font-semibold' : ''
            }`}
          >
            <div className="text-sm text-gray-500">{format(day, 'EEE')}</div>
            <div className="text-lg">{format(day, 'd')}</div>
          </div>
        ))}
      </div>
      
      {/* Time grid */}
      <div 
        ref={timeGridRef} 
        className="flex-1 overflow-y-auto"
      >
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
          
          {/* Days columns with events */}
          <div className="grid grid-cols-7 relative">
            {/* Day columns */}
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="relative border-r border-gray-200">
                {/* Hour lines */}
                {hours.map((hour, hourIndex) => (
                  <div key={hourIndex} className="h-20 border-b border-gray-200"></div>
                ))}
                
                {/* Events for this day */}
                {positionEventsForDay(day).map(event => {
                  const category = categories.find(cat => cat.id === event.categoryId);
                  if (!category) return null;
                  
                  return (
                    <div 
                      key={event.id}
                      className="absolute z-10"
                      style={{
                        ...getEventStyle(event, day),
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
              </div>
            ))}
            
            {/* Current time indicator */}
            {isCurrentWeek && currentTimePosition > 0 && (
              <div 
                className="absolute h-0 z-20 border-t-2 border-red-500 pointer-events-none"
                style={{ 
                  top: `${currentTimePosition}%`,
                  left: `${(currentDayIndex / 7) * 100}%`,
                  width: `${100 / 7}%`
                }}
              >
                <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            )}
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

export default WeekView;
