import React from 'react';
import { format } from 'date-fns';
import { EventType, CategoryType } from '../../types';

interface EventCardProps {
  event: EventType;
  category: CategoryType;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, category, onClick }) => {
  const startTime = format(new Date(event.start), 'h:mm a');
  const endTime = format(new Date(event.end), 'h:mm a');
  
  return (
    <div 
      onClick={onClick}
      className="rounded-md px-2 py-1 mb-1 cursor-pointer overflow-hidden text-white text-sm h-full flex flex-col"
      style={{ 
        backgroundColor: category.color,
        minHeight: '30px' // ensure the card is always visible even for very short events
      }}
    >
      <div className="font-medium truncate">
        {event.title}
      </div>
      <div className="text-xs opacity-90 truncate">
        {startTime} - {endTime}
      </div>
    </div>
  );
};

export default EventCard;
