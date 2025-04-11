// TabthreeScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Text } from '@/components/Themed';
import { EventListCard } from '../../components/Events/EventListCard';
import { EventDetailsModal } from '../../components/Events/EventDetailsModal';
import { Event, EventList, EventValidator, validateEventDateTime } from '../../components/Events/utils';

export default function TabthreeScreen() {
  const [lists, setLists] = useState<EventList[]>([
    { title: 'Parties', events: [] },
    { title: 'Interviews', events: [] },
    { title: 'Outings', events: [] }
  ]);

  // Keep text input for each list (only for event name)
  const [newEvents, setNewEvents] = useState<{ [key: string]: string }>({});

  // For displaying error messages for each list's input
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  // For modal error messages when adding/editing event details
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  // For details modal
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedListTitle, setSelectedListTitle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);

  // Instead of directly adding an event, start the process by opening the details modal.
  const handleStartAddEvent = (listTitle: string) => {
    const eventName = newEvents[listTitle] || "";
    if (eventName.trim() === '') {
      // Set error message for this list's input
      setErrorMessages(prev => ({ ...prev, [listTitle]: 'Please enter a name for the event.' }));
      return;
    }
    // Clear error message if any
    setErrorMessages(prev => ({ ...prev, [listTitle]: '' }));
    setModalErrorMessage('');

    // Initialize a new event with the name and empty details.
    const newEvent: Event = {
      id: Math.random().toString(36).substring(2),
      name: eventName,
      completed: false,
      Location: '',
      timeDeadline: '',
      Host: '',
      dateDeadline: ''
    };
    setSelectedListTitle(listTitle);
    setSelectedEvent(newEvent);
    setIsNewEvent(true);
    setDetailsModalVisible(true);
  };

  // Delete an event
  const handleDeleteEvent = (listTitle: string, eventId: string) => {
    setLists(prevLists =>
      prevLists.map(list => {
        if (list.title === listTitle) {
          return {
            ...list,
            events: list.events.filter(event => event.id !== eventId)
          };
        }
        return list;
      })
    );
  };

  // Toggle completed
  const handleToggleEvent = (listTitle: string, eventId: string) => {
    setLists(prevLists =>
      prevLists.map(list => {
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
      })
    );
  };

  // Open details modal for editing an event
  const handleOpenDetails = (listTitle: string, event: Event) => {
    setSelectedListTitle(listTitle);
    setSelectedEvent({ ...event }); // clone so changes are local
    setIsNewEvent(false);
    setModalErrorMessage('');
    setDetailsModalVisible(true);
  };

  // Close details modal and reset selected event
  const handleCloseDetails = () => {
    setDetailsModalVisible(false);
    setSelectedEvent(null);
    setIsNewEvent(false);
    setModalErrorMessage('');
  };

  // Update the selected event in the modal
  const handleEventChange = (updatedEvent: Event) => {
    setSelectedEvent(updatedEvent);
  };

  // Save updates from the details modal (both for new and edited events)
  const handleSaveDetails = () => {
    if (!selectedEvent) return;

    // Use the EventValidator to validate required fields
    const validationError = EventValidator.validate(selectedEvent);
    if (validationError) {
      setModalErrorMessage(validationError);
      return;
    }

    // Validate date and time formats
    const errorMsg = validateEventDateTime(selectedEvent);
    if (errorMsg) {
      setModalErrorMessage(errorMsg);
      return;
    }
  
    if (isNewEvent) {
      setLists(prevLists => {
        const updatedLists = prevLists.map(list => {
          if (list.title === selectedListTitle) {
            return { ...list, events: [...list.events, selectedEvent] };
          }
          return list;
        });
        setTimeout(() => {
          console.log('Updated event lists (new):', updatedLists);
        }, 0);
        return updatedLists;
      });
  
      setNewEvents(prev => ({ ...prev, [selectedListTitle]: '' }));
    } else {
      setLists(prevLists => {
        const updatedLists = prevLists.map(list => {
          if (list.title === selectedListTitle) {
            const updatedEvents = list.events.map(event =>
              event.id === selectedEvent.id ? { ...selectedEvent } : event
            );
            return { ...list, events: updatedEvents };
          }
          return list;
        });
        setTimeout(() => {
          console.log('Updated event lists (edited):', updatedLists);
        }, 0);
        return updatedLists;
      });
    }
  
    handleCloseDetails();
  };  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.spaceName}>SHARED EVENTS LIST</Text>
      </View>

      {/* Event Lists */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <EventListCard
            list={item}
            newEventText={newEvents[item.title] || ''}
            errorMessage={errorMessages[item.title] || ''}
            onNewEventTextChange={(text) => 
              setNewEvents(prev => ({ ...prev, [item.title]: text }))
            }
            onAddEvent={() => handleStartAddEvent(item.title)}
            onToggleEvent={(eventId) => handleToggleEvent(item.title, eventId)}
            onOpenDetails={(event) => handleOpenDetails(item.title, event)}
            onDeleteEvent={(eventId) => handleDeleteEvent(item.title, eventId)}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Details Modal for Adding/Editing */}
      <EventDetailsModal
        visible={detailsModalVisible}
        event={selectedEvent}
        errorMessage={modalErrorMessage}
        onClose={handleCloseDetails}
        onSave={handleSaveDetails}
        onEventChange={handleEventChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#D9D0CE',
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  spaceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  listContainer: {
    paddingBottom: 20,
  },
});