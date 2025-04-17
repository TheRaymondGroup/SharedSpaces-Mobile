// GroupCalendarScreen.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useEventsState } from '../../hooks/useEventsState';
import { useTasksState } from '../../hooks/useTasksState';

// Add this helper function after imports
const formatDateToYYYYMMDD = (date: Date | string | undefined): string | null => {
  if (!date) return null;
  
  try {
    // Check if date is in MM/DD/YYYY format
    if (typeof date === 'string' && date.includes('/')) {
      // Parse MM/DD/YYYY format
      const [month, day, year] = date.split('/').map(Number);
      // Create date using explicit parts to avoid timezone issues
      const d = new Date(year, month - 1, day);
      
      // Format to YYYY-MM-DD
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    
    // Handle other date formats
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn('Date formatting error:', error, date);
    return null;
  }
};

const GroupCalendarScreen: React.FC = () => {
  const { lists: eventLists } = useEventsState();
  const { lists: taskLists } = useTasksState();
  const today = new Date();
  const currentMonth = formatDateToYYYYMMDD(today) || '';
  const [selectedDate, setSelectedDate] = useState('');
  
  // Combine all events and tasks that have dates
  const allEvents = useMemo(() => eventLists.flatMap(list => list.events), [eventLists]);
  const allTasks = useMemo(() => taskLists.flatMap(list => list.tasks), [taskLists]);
  
  const markedDates = useMemo(() => {
    const marks: { [date: string]: { marked: boolean; dotColor?: string; selected?: boolean; selectedColor?: string } } = {};
    
    // Mark event dates
    allEvents.forEach(event => {
      if (event.dateDeadline) {
        const normalizedDate = formatDateToYYYYMMDD(event.dateDeadline);
        console.log('Event date:', event.dateDeadline, '→ normalized:', normalizedDate);
        if (normalizedDate && !marks[normalizedDate]) {
          marks[normalizedDate] = { marked: true, dotColor: 'blue' };
        }
      }
    });
    
    // Mark task dates
    allTasks.forEach(task => {
      if (task.dateDeadline) {
        const normalizedDate = formatDateToYYYYMMDD(task.dateDeadline);
        console.log('Task date:', task.dateDeadline, '→ normalized:', normalizedDate);
        if (normalizedDate) {
          if (marks[normalizedDate]) {
            // If date already marked by an event, change dot color to purple (event + task)
            marks[normalizedDate].dotColor = 'purple';  
          } else {
            // New task date
            marks[normalizedDate] = { marked: true, dotColor: 'red' };
          }
        }
      }
    });
    
    console.log('All marked dates:', Object.keys(marks));
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: 'blue'
      };
    }
    return marks;
  }, [allEvents, allTasks, selectedDate]);
  
  // Get both events and tasks for the selected date
  const itemsOnSelectedDate = useMemo(() => {
    const events = allEvents.filter(event => {
      if (!event.dateDeadline) return false;
      const normalized = formatDateToYYYYMMDD(event.dateDeadline);
      return normalized === selectedDate;
    }).map(event => ({
      ...event,
      type: 'event'
    }));
    
    const tasks = allTasks.filter(task => {
      if (!task.dateDeadline) return false;
      const normalized = formatDateToYYYYMMDD(task.dateDeadline);
      return normalized === selectedDate;
    }).map(task => ({
      ...task,
      type: 'task'
    }));
    
    return [...events, ...tasks];
  }, [allEvents, allTasks, selectedDate]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Calendar - {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </Text>
      <Calendar
        current={currentMonth}
        onDayPress={(day: { dateString: React.SetStateAction<string>; }) => setSelectedDate(day.dateString)}
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
              <View style={[styles.eventItem, item.type === 'task' ? styles.taskItem : {}]}>
                <Text style={styles.eventName}>{item.name}</Text>
                
                {item.type === 'event' ? (
                  // Event-specific details
                  <>
                    {'Location' in item && item.Location ? <Text style={styles.eventDetail}>📍 {item.Location}</Text> : null}
                    {'timeDeadline' in item && item.timeDeadline ? <Text style={styles.eventDetail}>🕒 {item.timeDeadline}</Text> : null}
                    {'Host' in item && item.Host ? <Text style={styles.eventDetail}>👤 {item.Host}</Text> : null}
                  </>
                ) : (
                  // Task-specific details
                  <>
                    {'assignedTo' in item && <Text style={styles.eventDetail}>✍️ Assigned to: {item.assignedTo}</Text>}
                    {'additionalNotes' in item && item.additionalNotes ? <Text style={styles.eventDetail}>📝 {item.additionalNotes}</Text> : null}
                  </>
                )}
              </View>
            )}
            ListEmptyComponent={<Text style={styles.noEventsText}>No items on this day.</Text>}
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
    backgroundColor: '#D9D0CE',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  eventsContainer: {
    marginTop: 20,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  eventItem: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  eventName: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 4,
  },
  eventDetail: {
    color: '#666',
    marginTop: 2,
  },
  noEventsText: {
    color: '#777',
    marginTop: 10,
    fontStyle: 'italic',
  },
  taskItem: {
    borderLeftWidth: 4,
    borderLeftColor: 'red',
  },
});

export default GroupCalendarScreen;