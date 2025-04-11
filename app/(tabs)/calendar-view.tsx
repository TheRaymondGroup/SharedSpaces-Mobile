import React, { useState, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { EventList } from '../../components/Events/utils';

interface GroupCalendarScreenProps {
  lists?: EventList[];
}

const GroupCalendarScreen: React.FC<GroupCalendarScreenProps> = ({ lists = [] }) => {
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
        Calendar - {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </Text>
      <Calendar
        current={currentMonth}
        onDayPress={(day: { dateString: React.SetStateAction<string>; }) => setSelectedDate(day.dateString)}
        hideExtraDays={true}
        markedDates={markedDates}
      />

      {selectedDate ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>Events on {selectedDate}</Text>
          <FlatList
            data={eventsOnSelectedDate}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 6 }}>
                <Text style={{ fontWeight: '500' }}>{item.name}</Text>
                {item.Location ? <Text style={{ color: '#666' }}>📍 {item.Location}</Text> : null}
                {item.timeDeadline ? <Text style={{ color: '#666' }}>🕒 {item.timeDeadline}</Text> : null}
              </View>
            )}
            ListEmptyComponent={<Text style={{ color: '#777', marginTop: 10 }}>No events on this day.</Text>}
          />
        </View>
      ) : null}
    </View>
  );
};

export default GroupCalendarScreen;
