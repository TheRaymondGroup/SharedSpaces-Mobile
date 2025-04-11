// GroupCalendarScreen.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useEventsState } from '../../hooks/useEventsState';

const GroupCalendarScreen: React.FC = () => {
  const { lists } = useEventsState();
  const today = new Date();
  const currentMonth = today.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState('');
  
  const allEvents = useMemo(() => lists.flatMap(list => list.events), [lists]);
  
  const markedDates = useMemo(() => {
    const marks: { [date: string]: { marked: boolean; dotColor?: string; selected?: boolean; selectedColor?: string } } = {};
    allEvents.forEach(event => {
      if (event.dateDeadline) {
        const normalizedDate = new Date(event.dateDeadline).toISOString().split('T')[0];
        if (!marks[normalizedDate]) {
          marks[normalizedDate] = { marked: true, dotColor: 'blue' };
        }
      }
    });
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: 'blue'
      };
    }
    return marks;
  }, [allEvents, selectedDate]);
  
  const eventsOnSelectedDate = useMemo(() => {
    return allEvents.filter(event => {
      if (!event.dateDeadline) return false;
      const normalized = new Date(event.dateDeadline).toISOString().split('T')[0];
      return normalized === selectedDate;
    });
  }, [allEvents, selectedDate]);
  
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
          <Text style={styles.eventsTitle}>Events on {selectedDate}</Text>
          <FlatList
            data={eventsOnSelectedDate}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <Text style={styles.eventName}>{item.name}</Text>
                {item.Location ? <Text style={styles.eventDetail}>📍 {item.Location}</Text> : null}
                {item.timeDeadline ? <Text style={styles.eventDetail}>🕒 {item.timeDeadline}</Text> : null}
                {item.Host ? <Text style={styles.eventDetail}>👤 {item.Host}</Text> : null}
              </View>
            )}
            ListEmptyComponent={<Text style={styles.noEventsText}>No events on this day.</Text>}
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
});

export default GroupCalendarScreen;