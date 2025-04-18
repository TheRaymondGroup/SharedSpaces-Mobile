// hooks/useSupabaseEvents.ts
import { useState, useEffect } from 'react';
import { Event } from '../components/Events/utils';
import { EventList } from '../components/Events/utils';
import { useSpace } from '@/spaceContext';
import {
  fetchEventsForSpace,
  addEventToSpace,
  updateEvent as updateSupabaseEvent,
  toggleEventCompletion,
  deleteEvent as deleteSupabaseEvent,
  subscribeToSpaceEvents
} from '@/eventService';

export function useSupabaseEvents() {
  const { currentSpace, loading: spaceLoading } = useSpace();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load events and subscribe to changes when currentSpace changes
  useEffect(() => {
    if (!currentSpace) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToSpaceEvents(currentSpace.id, (updatedEvents) => {
      setEvents(updatedEvents);
      setLoading(false);
    });

    // Cleanup function to unsubscribe when component unmounts or space changes
    return () => {
      unsubscribe();
    };
  }, [currentSpace]);

  // Format events into event lists
  const lists: EventList[] = currentSpace ? [
    {
      title: currentSpace.name || 'Shared Events',
      events: events
    }
  ] : [];

  // Add an event
  const addEvent = async (listTitle: string, event: Event) => {
    if (!currentSpace) {
      setError('No space selected');
      return;
    }

    try {
      await addEventToSpace({
        ...event,
        space_id: currentSpace.id
      });
      // No need to update local state as the subscription will handle this
    } catch (err: any) {
      setError(err.message || 'Failed to add event');
    }
  };

  // Delete an event
  // In hooks/useSupabaseEvents.ts - Update the deleteEvent function
    const deleteEvent = async (listTitle: string, eventId: string) => {
    try {
      console.log("Deleting event from hook:", eventId);
      await deleteSupabaseEvent(eventId);
      console.log("Event deleted successfully in hook");
      
      // Optimistic update - immediately remove from local state
      // This provides immediate feedback even if realtime is delayed
      setEvents(currentEvents => currentEvents.filter(e => e.id !== eventId));
    } catch (err: any) {
      console.error("Error in hook while deleting event:", err);
      setError(err.message || 'Failed to delete event');
      throw err;
    }
  };

  // Toggle event completion
  const toggleEvent = async (listTitle: string, eventId: string) => {
    try {
      const eventToUpdate = events.find(e => e.id === eventId);
      if (eventToUpdate) {
        await toggleEventCompletion(eventId, !eventToUpdate.completed);
      }
      // No need to update local state as the subscription will handle this
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    }
  };

  // Update an event
  const updateEvent = async (listTitle: string, eventId: string, updatedEvent: Event) => {
    try {
      await updateSupabaseEvent(eventId, updatedEvent);
      // No need to update local state as the subscription will handle this
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    }
  };

  return {
    lists,
    loading: loading || spaceLoading,
    error,
    addEvent,
    deleteEvent,
    toggleEvent,
    updateEvent,
    spaceSelected: !!currentSpace
  };
}