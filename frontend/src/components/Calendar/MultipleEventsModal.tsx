import React from 'react';
import { format } from 'date-fns';
import { EventType, CategoryType } from '../../types';

interface MultipleEventsModalProps {
  events: EventType[];
  categories: CategoryType[];
  onSelectEvent: (event: EventType) => void;
  onClose: () => void;
}

const MultipleEventsModal: React.FC<MultipleEventsModalProps> = ({ 
  events, 
  categories, 
  onSelectEvent, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {events.length} overlapping events
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {events.map(event => {
            const category = categories.find(cat => cat.id === event.categoryId);
            if (!category) return null;
            
            const startTime = format(new Date(event.start), 'h:mm a');
            const endTime = format(new Date(event.end), 'h:mm a');
            
            return (
              <div 
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <span 
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                  style={{ backgroundColor: category.color }}
                ></span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{event.title}</div>
                  <div className="text-xs text-gray-500">{startTime} - {endTime}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleEventsModal;
