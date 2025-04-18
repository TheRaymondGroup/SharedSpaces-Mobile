// EventListCard.tsx
import React from "react";
import { StyleSheet, TextInput, Button, View } from "react-native";
import { Text } from "@/components/Themed";
import { EventItem } from "./EventItem";
import { EventList } from "./utils";
import { Event } from "./utils";

interface EventListCardProps {
  list: EventList;
  newEventText: string;
  errorMessage: string;
  onNewEventTextChange: (text: string) => void;
  onAddEvent: () => void;
  onToggleEvent: (eventId: string) => void;
  onOpenDetails: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function EventListCard({
  list,
  newEventText,
  errorMessage,
  onNewEventTextChange,
  onAddEvent,
  onToggleEvent,
  onOpenDetails,
  onDeleteEvent,
}: EventListCardProps) {
  return (
    <View style={styles.listCard}>
      <Text style={styles.listTitle}>{list.title}</Text>

      {/* Input to create new event (only event name) */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add new event..."
          value={newEventText}
          onChangeText={onNewEventTextChange}
        />
        <Button title="Add" onPress={onAddEvent} />
      </View>

      {/* Display error message if exists */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* Render events */}
      {list.events.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          onToggle={() => onToggleEvent(event.id)}
          onOpenDetails={() => onOpenDetails(event)}
          onDelete={() => onDeleteEvent(event.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  input: {
    flex: 1,
    height: 36,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
  },
});
