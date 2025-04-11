// hooks/useEventsState.ts
import { useState, useEffect } from 'react';
import { Event, EventList } from '../components/Events/utils';

// We'll create a singleton pattern to ensure the same state is shared
let listeners: Function[] = [];
let eventLists: EventList[] = [
  { title: 'Parties', events: [] },
  { title: 'Interviews', events: [] },
  { title: 'Outings', events: [] }
];

// Function to notify all listeners of state changes
const notifyListeners = () => {
  listeners.forEach(listener => listener(eventLists));
};

export const useEventsState = () => {
  // This local state will be updated whenever the shared state changes
  const [lists, setLists] = useState<EventList[]>(eventLists);

  // Add this component as a listener when mounted
  useEffect(() => {
    const handleChange = (newLists: EventList[]) => {
      setLists([...newLists]); // Create a new array reference to trigger re-render
    };
    
    listeners.push(handleChange);
    
    // Clean up when component unmounts
    return () => {
      listeners = listeners.filter(listener => listener !== handleChange);
    };
  }, []);

  // Function to update the shared state
  const updateLists = (newLists: EventList[]) => {
    eventLists = [...newLists];
    notifyListeners();
  };

  // Function to add an event to a specific list
  const addEvent = (listTitle: string, event: Event) => {
    const updatedLists = eventLists.map(list => {
      if (list.title === listTitle) {
        return { ...list, events: [...list.events, event] };
      }
      return list;
    });
    
    eventLists = updatedLists;
    notifyListeners();
  };

  // Function to delete an event
  const deleteEvent = (listTitle: string, eventId: string) => {
    const updatedLists = eventLists.map(list => {
      if (list.title === listTitle) {
        return {
          ...list,
          events: list.events.filter(event => event.id !== eventId)
        };
      }
      return list;
    });
    
    eventLists = updatedLists;
    notifyListeners();
  };

  // Function to toggle event completion
  const toggleEvent = (listTitle: string, eventId: string) => {
    const updatedLists = eventLists.map(list => {
      if (list.title === listTitle) {
        const updatedEvents = list.events.map(event => {
          if (event.id === eventId) {
            return { ...event, completed: !event.completed };
          }
          return event;
        });
        return { ...list, events: updatedEvents };
      }
      return list;
    });
    
    eventLists = updatedLists;
    notifyListeners();
  };

  // Function to update an existing event
  const updateEvent = (listTitle: string, eventId: string, updatedEvent: Event) => {
    const updatedLists = eventLists.map(list => {
      if (list.title === listTitle) {
        const updatedEvents = list.events.map(event => {
          if (event.id === eventId) {
            return updatedEvent;
          }
          return event;
        });
        return { ...list, events: updatedEvents };
      }
      return list;
    });

    eventLists = updatedLists;
    notifyListeners();
  };

  return {
    lists,
    updateLists,
    addEvent,
    deleteEvent,
    toggleEvent,
    updateEvent
  };
};