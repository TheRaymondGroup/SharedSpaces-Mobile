// EventItem.tsx
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/Themed";
import { Event } from "./utils";

interface EventItemProps {
  event: Event;
  onToggle: () => void;
  onOpenDetails: () => void;
  onDelete: () => void;
}

export function EventItem({
  event,
  isDeleting = false,
  onToggle,
  onOpenDetails,
  onDelete,
}: EventItemProps & { isDeleting?: boolean }) {
  return (
    <View style={[styles.eventItem, isDeleting && styles.deletingItem]}>
      <TouchableOpacity
        style={[styles.checkbox, event.completed && styles.checkboxCompleted]}
        onPress={onToggle}
      />
      <Text
        style={[styles.eventText, event.completed && styles.eventTextCompleted]}
      >
        {event.name}
      </Text>
      <TouchableOpacity
        onPress={onOpenDetails}
        style={[styles.detailButton, { backgroundColor: "#2980b9" }]}
      >
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDelete}
        disabled={isDeleting}
        style={[
          styles.detailButton,
          { backgroundColor: isDeleting ? "#aaa" : "#e74c3c" },
        ]}
      >
        <Text style={styles.buttonText}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: "#26de81",
  },
  eventText: {
    fontSize: 14,
    color: "#34495e",
    flex: 1,
  },
  eventTextCompleted: {
    textDecorationLine: "line-through",
    color: "#95a5a6",
  },
  detailButton: {
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 12,
    color: "white",
  },
  deletingItem: {
    opacity: 0.5,
  },
});
