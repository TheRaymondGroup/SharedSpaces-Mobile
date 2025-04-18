import { supabase } from '@/supabaseClient';
import { Event } from '@/components/Events/utils';

export interface EventWithSpaceId extends Omit<Event, 'id'> {
  id?: string;
  space_id: string;
}

// Fetch events for a specific space
export const fetchEventsForSpace = async (spaceId: string) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('space_id', spaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map database fields to our frontend Event model
    return data.map(item => ({
      id: item.id,
      name: item.name,
      completed: item.completed,
      Location: item.location,
      timeDeadline: item.time_deadline,
      Host: item.host,
      dateDeadline: item.date_deadline
    })) as Event[];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Add a new event
export const addEventToSpace = async (event: EventWithSpaceId) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        name: event.name,
        completed: event.completed,
        location: event.Location, // Convert to snake_case for DB
        time_deadline: event.timeDeadline,
        host: event.Host, // Convert to snake_case for DB
        date_deadline: event.dateDeadline,
        space_id: event.space_id,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      completed: data.completed,
      Location: data.location,
      timeDeadline: data.time_deadline,
      Host: data.host,
      dateDeadline: data.date_deadline
    } as Event;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

// Update an event
export const updateEvent = async (eventId: string, updates: Partial<Event>) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({
        name: updates.name,
        completed: updates.completed,
        location: updates.Location,
        time_deadline: updates.timeDeadline,
        host: updates.Host,
        date_deadline: updates.dateDeadline
      })
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      completed: data.completed,
      Location: data.location,
      timeDeadline: data.time_deadline,
      Host: data.host,
      dateDeadline: data.date_deadline
    } as Event;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Toggle event completion status
export const toggleEventCompletion = async (eventId: string, completed: boolean) => {
  try {
    const { error } = await supabase
      .from('events')
      .update({ completed })
      .eq('id', eventId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error toggling event completion:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId: string) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// In services/eventService.ts - Update the subscribeToSpaceEvents function
export const subscribeToSpaceEvents = (
    spaceId: string,
    onEventsChange: (events: Event[]) => void
  ) => {
    console.log("Setting up subscription for space:", spaceId);
    
    // First fetch all events
    fetchEventsForSpace(spaceId)
      .then(events => {
        console.log(`Initial fetch complete: ${events.length} events`);
        onEventsChange(events);
      })
      .catch(error => {
        console.error("Error in initial events fetch:", error);
      });
    
    // Then subscribe to changes with detailed handlers for each event type
    const subscription = supabase
      .channel(`events:space:${spaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
          filter: `space_id=eq.${spaceId}`
        },
        (payload) => {
          console.log("INSERT event received:", payload);
          fetchEventsForSpace(spaceId)
            .then(onEventsChange)
            .catch(console.error);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'events',
          filter: `space_id=eq.${spaceId}`
        },
        (payload) => {
          console.log("UPDATE event received:", payload);
          fetchEventsForSpace(spaceId)
            .then(onEventsChange)
            .catch(console.error);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'events',
          filter: `space_id=eq.${spaceId}`
        },
        (payload) => {
          console.log("DELETE event received:", payload);
          fetchEventsForSpace(spaceId)
            .then(onEventsChange)
            .catch(console.error);
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });
    
    // Return unsubscribe function
    return () => {
      console.log("Unsubscribing from space events:", spaceId);
      subscription.unsubscribe();
    };
  };