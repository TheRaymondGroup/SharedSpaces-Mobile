// shared-event-list.tsx
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  Alert,
  Text as RNText,
} from "react-native";
import { Text } from "@/components/Themed";
import { EventListCard } from "../../components/Events/EventListCard";
import { EventDetailsModal } from "../../components/Events/EventDetailsModal";
import {
  Event,
  EventValidator,
  validateEventDateTime,
} from "../../components/Events/utils";
import { useSupabaseEvents } from "../../hooks/useSupabaseEvents";
import { useSpace } from "@/spaceContext";

export default function SharedEventListScreen() {
  const { currentSpace } = useSpace();
  const {
    lists,
    loading,
    error,
    addEvent,
    deleteEvent,
    toggleEvent,
    updateEvent,
    spaceSelected,
  } = useSupabaseEvents();

  // Keep text input for each list (only for event name)
  const [newEvents, setNewEvents] = useState<{ [key: string]: string }>({});

  // For displaying error messages for each list's input
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    {}
  );

  // For modal error messages when adding/editing event details
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  // For details modal
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedListTitle, setSelectedListTitle] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);

  // Show error from Supabase
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  // Instead of directly adding an event, start the process by opening the details modal.
  const handleStartAddEvent = (listTitle: string) => {
    const eventName = newEvents[listTitle] || "";
    if (eventName.trim() === "") {
      // Set error message for this list's input
      setErrorMessages((prev) => ({
        ...prev,
        [listTitle]: "Please enter a name for the event.",
      }));
      return;
    }
    // Clear error message if any
    setErrorMessages((prev) => ({ ...prev, [listTitle]: "" }));
    setModalErrorMessage("");

    // Initialize a new event with the name and empty details.
    const newEvent: Event = {
      id: Math.random().toString(36).substring(2), // Temporary ID, will be replaced by Supabase
      name: eventName,
      completed: false,
      Location: "",
      timeDeadline: "",
      Host: "",
      dateDeadline: "",
    };
    setSelectedListTitle(listTitle);
    setSelectedEvent(newEvent);
    setIsNewEvent(true);
    setDetailsModalVisible(true);
  };

  // Delete an event
  const handleDeleteEvent = (listTitle: string, eventId: string) => {
    deleteEvent(listTitle, eventId);
  };

  // Toggle completed
  const handleToggleEvent = (listTitle: string, eventId: string) => {
    toggleEvent(listTitle, eventId);
  };

  // Open details modal for editing an event
  const handleOpenDetails = (listTitle: string, event: Event) => {
    setSelectedListTitle(listTitle);
    setSelectedEvent({ ...event }); // clone so changes are local
    setIsNewEvent(false);
    setModalErrorMessage("");
    setDetailsModalVisible(true);
  };

  // Close details modal and reset selected event
  const handleCloseDetails = () => {
    setDetailsModalVisible(false);
    setSelectedEvent(null);
    setIsNewEvent(false);
    setModalErrorMessage("");
  };

  // Update the selected event in the modal
  const handleEventChange = (updatedEvent: Event) => {
    setSelectedEvent(updatedEvent);
  };

  // Save updates from the details modal (both for new and edited events)
  // In shared-event-list.tsx - Update the handleSaveDetails function
  const handleSaveDetails = async () => {
    if (!selectedEvent) {
      console.log("No selected event");
      return;
    }

    console.log("Validating event:", selectedEvent);

    // Use the EventValidator to validate required fields
    const validationError = EventValidator.validate(selectedEvent);
    if (validationError) {
      console.log("Validation error:", validationError);
      setModalErrorMessage(validationError);
      return;
    }

    // Validate date and time formats
    const errorMsg = validateEventDateTime(selectedEvent);
    if (errorMsg) {
      console.log("Date/time validation error:", errorMsg);
      setModalErrorMessage(errorMsg);
      return;
    }

    console.log("About to save event. isNewEvent:", isNewEvent);

    try {
      if (isNewEvent) {
        console.log("Adding new event to list:", selectedListTitle);
        await addEvent(selectedListTitle, selectedEvent);
        setNewEvents((prev) => ({ ...prev, [selectedListTitle]: "" }));
      } else {
        console.log("Updating existing event:", selectedEvent.id);
        await updateEvent(selectedListTitle, selectedEvent.id, selectedEvent);
      }

      console.log("Event saved successfully");
      handleCloseDetails();
    } catch (error) {
      console.error("Error saving event:", error);
      setModalErrorMessage(
        `Failed to save: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  if (!spaceSelected) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <RNText style={styles.noSpaceText}>
          No space selected. Please join or create a space first.
        </RNText>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text style={styles.spaceName}>
          {currentSpace?.name || "SHARED EVENTS LIST"}
        </Text>
      </View>

      {/* Event Lists */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <EventListCard
            list={item}
            newEventText={newEvents[item.title] || ""}
            errorMessage={errorMessages[item.title] || ""}
            onNewEventTextChange={(text) =>
              setNewEvents((prev) => ({ ...prev, [item.title]: text }))
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
    backgroundColor: "#D9D0CE",
  },
  header: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  spaceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
  },
  noSpaceText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
