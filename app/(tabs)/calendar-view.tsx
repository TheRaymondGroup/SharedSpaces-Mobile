// GroupCalendarScreen.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSpace } from "@/spaceContext";
import { useTasksState } from "../../hooks/useTasksState";
import { supabase } from "../../supabaseClient";
import { Event } from "../../components/Events/utils";

// Helper function to format dates
const formatDateToYYYYMMDD = (
  date: Date | string | undefined
): string | null => {
  if (!date) return null;

  try {
    // Check if date is in MM/DD/YYYY format
    if (typeof date === "string" && date.includes("/")) {
      // Parse MM/DD/YYYY format
      const [month, day, year] = date.split("/").map(Number);
      // Create date using explicit parts to avoid timezone issues
      const d = new Date(year, month - 1, day);

      // Format to YYYY-MM-DD
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
    }

    // Handle other date formats
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn("Date formatting error:", error, date);
    return null;
  }
};

const GroupCalendarScreen: React.FC = () => {
  const { currentSpace } = useSpace();
  const { lists: taskLists } = useTasksState();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const currentMonth = formatDateToYYYYMMDD(today) || "";
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch events from Supabase when currentSpace changes
  useEffect(() => {
    if (!currentSpace) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("space_id", currentSpace.id);

        if (error) throw error;

        // Transform data to match the Event interface
        const transformedEvents = data.map((item) => ({
          id: item.id,
          name: item.name,
          completed: item.completed,
          Location: item.location,
          timeDeadline: item.time_deadline,
          Host: item.host,
          dateDeadline: item.date_deadline,
        })) as Event[];

        setEvents(transformedEvents);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`events:space=${currentSpace.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `space_id=eq.${currentSpace.id}`,
        },
        () => {
          // Refetch events when any change happens
          fetchEvents();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [currentSpace]);

  // Get all tasks
  const allTasks = useMemo(
    () => taskLists.flatMap((list) => list.tasks),
    [taskLists]
  );

  // Create marked dates for calendar
  const markedDates = useMemo(() => {
    const marks: {
      [date: string]: {
        marked: boolean;
        dotColor?: string;
        selected?: boolean;
        selectedColor?: string;
      };
    } = {};

    // Mark event dates
    events.forEach((event) => {
      if (event.dateDeadline) {
        const normalizedDate = formatDateToYYYYMMDD(event.dateDeadline);
        if (normalizedDate && !marks[normalizedDate]) {
          marks[normalizedDate] = { marked: true, dotColor: "blue" };
        }
      }
    });

    // Mark task dates
    allTasks.forEach((task) => {
      if (task.dateDeadline) {
        const normalizedDate = formatDateToYYYYMMDD(task.dateDeadline);
        if (normalizedDate) {
          if (marks[normalizedDate]) {
            // If date already marked by an event, change dot color to purple (event + task)
            marks[normalizedDate].dotColor = "purple";
          } else {
            // New task date
            marks[normalizedDate] = { marked: true, dotColor: "red" };
          }
        }
      }
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: "blue",
      };
    }
    return marks;
  }, [events, allTasks, selectedDate]);

  // Get both events and tasks for the selected date
  const itemsOnSelectedDate = useMemo(() => {
    const filteredEvents = events
      .filter((event) => {
        if (!event.dateDeadline) return false;
        const normalized = formatDateToYYYYMMDD(event.dateDeadline);
        return normalized === selectedDate;
      })
      .map((event) => ({
        ...event,
        type: "event",
      }));

    const tasks = allTasks
      .filter((task) => {
        if (!task.dateDeadline) return false;
        const normalized = formatDateToYYYYMMDD(task.dateDeadline);
        return normalized === selectedDate;
      })
      .map((task) => ({
        ...task,
        type: "task",
      }));

    return [...filteredEvents, ...tasks];
  }, [events, allTasks, selectedDate]);

  // Display loading state
  if (loading && !events.length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading calendar...</Text>
      </View>
    );
  }

  // Display error state
  if (error && !events.length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // If no space selected
  if (!currentSpace) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.noSpaceText}>
          Please join or create a space to view the calendar.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Calendar -{" "}
        {today.toLocaleString("default", { month: "long", year: "numeric" })}
      </Text>
      <Calendar
        current={currentMonth}
        onDayPress={(day: { dateString: React.SetStateAction<string> }) =>
          setSelectedDate(day.dateString)
        }
        hideExtraDays={true}
        markedDates={markedDates}
      />

      {selectedDate ? (
        <View style={styles.eventsContainer}>
          <Text style={styles.eventsTitle}>Items on {selectedDate}</Text>
          <FlatList
            data={itemsOnSelectedDate}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.eventItem,
                  item.type === "task"
                    ? styles.taskItem
                    : styles.eventItemStyle,
                ]}
              >
                <Text style={styles.eventName}>{item.name}</Text>

                {item.type === "event" ? (
                  // Event-specific details
                  <>
                    {"Location" in item && item.Location ? (
                      <Text style={styles.eventDetail}>📍 {item.Location}</Text>
                    ) : null}
                    {"timeDeadline" in item && item.timeDeadline ? (
                      <Text style={styles.eventDetail}>
                        🕒 {item.timeDeadline}
                      </Text>
                    ) : null}
                    {"Host" in item && item.Host ? (
                      <Text style={styles.eventDetail}>👤 {item.Host}</Text>
                    ) : null}
                  </>
                ) : (
                  // Task-specific details
                  <>
                    {"assignedTo" in item && (
                      <Text style={styles.eventDetail}>
                        ✍️ Assigned to: {item.assignedTo}
                      </Text>
                    )}
                    {"additionalNotes" in item && item.additionalNotes ? (
                      <Text style={styles.eventDetail}>
                        📝 {item.additionalNotes}
                      </Text>
                    ) : null}
                  </>
                )}

                {item.completed && (
                  <Text style={styles.completedText}>✓ Completed</Text>
                )}
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.noEventsText}>No items on this day.</Text>
            }
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#D9D0CE",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  eventsContainer: {
    marginTop: 20,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  eventItem: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  eventItemStyle: {
    borderLeftWidth: 4,
    borderLeftColor: "blue",
  },
  eventName: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 4,
  },
  eventDetail: {
    color: "#666",
    marginTop: 2,
  },
  noEventsText: {
    color: "#777",
    marginTop: 10,
    fontStyle: "italic",
  },
  taskItem: {
    borderLeftWidth: 4,
    borderLeftColor: "red",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  noSpaceText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  completedText: {
    color: "green",
    fontStyle: "italic",
    marginTop: 4,
  },
});

export default GroupCalendarScreen;
