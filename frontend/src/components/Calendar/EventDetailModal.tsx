import React from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { EventType, CategoryType } from '../../types';
import { deleteEvent } from '../../redux/eventSlice';

interface EventDetailModalProps {
  event: EventType;
  category: CategoryType;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, category, onClose }) => {
  const dispatch = useDispatch();
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this event?')) {
      dispatch(deleteEvent(event.id));
      onClose();
    }
  };

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  
  const startDateStr = format(startDate, 'MMMM d, yyyy');
  const startTimeStr = format(startDate, 'h:mm a');
  const endTimeStr = format(endDate, 'h:mm a');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
            <div className="flex items-center mt-1">
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: category.color }}
              ></span>
              <span className="text-sm text-gray-600">{category.name}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">{startDateStr}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">{startTimeStr} - {endTimeStr}</span>
          </div>
        </div>
        
        {event.description && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
            <p className="text-gray-600 text-sm">{event.description}</p>
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none"
          >
            Remove
          </button>
          
          {category.id === 'academy' && (
            <button
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Enroll
            </button>
          )}
          
          {category.id === 'work' && (
            <button
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Join
            </button>
          )}
          
          {(category.id === 'events' || category.id === 'personal' || category.id === 'family') && (
            <button
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
