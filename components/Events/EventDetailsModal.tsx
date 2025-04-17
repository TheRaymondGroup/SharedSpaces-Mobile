// EventDetailsModal.tsx
import React from 'react';
import { StyleSheet, TextInput, Modal, Pressable, View } from 'react-native';
import { Text } from '@/components/Themed';
import { formatDateInput, formatTimeInput } from './utils';
import { Event } from './utils';

interface EventDetailsModalProps {
  visible: boolean;
  event: Event | null;
  errorMessage: string;
  onClose: () => void;
  onSave: () => void;
  onEventChange: (updatedEvent: Event) => void;
}

export function EventDetailsModal({
  visible,
  event,
  errorMessage,
  onClose,
  onSave,
  onEventChange
}: EventDetailsModalProps) {
  if (!event) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalHeader}>DETAILS</Text>
        <View style={styles.modalContent}>
          {/* Name */}
          <Text style={styles.inputLabel}>Name of Event: <Text style={styles.requiredField}>*</Text></Text>
          <TextInput
            style={styles.modalInput}
            value={event.name}
            onChangeText={(text) =>
              onEventChange({ ...event, name: text })
            }
          />

          {/* Location */}
          <Text style={styles.inputLabel}>Location: <Text style={styles.requiredField}>*</Text></Text>
          <TextInput
            style={styles.modalInput}
            value={event.Location}
            onChangeText={(text) =>
              onEventChange({ ...event, Location: text })
            }
          />

          {/* Host */}
          <Text style={styles.inputLabel}>Host:</Text>
          <TextInput
            style={styles.modalInput}
            value={event.Host}
            onChangeText={(text) =>
              onEventChange({ ...event, Host: text })
            }
          />

          {/* Time Deadline */}
          <Text style={styles.inputLabel}>Time of Event: <Text style={styles.requiredField}>*</Text></Text>
          <TextInput
            style={styles.modalInput}
            placeholder="HH:MM-XX:XX"
            value={event.timeDeadline}
            onChangeText={(text) => {
              const formatted = formatTimeInput(text);
              onEventChange({ ...event, timeDeadline: formatted });
            }}
            keyboardType="numeric"
            maxLength={11}
          />

          {/* Date Deadline */}
          <Text style={styles.inputLabel}>Day of Event: <Text style={styles.requiredField}>*</Text></Text>
          <TextInput
            style={styles.modalInput}
            placeholder="MM/DD/YYYY"
            value={event.dateDeadline}
            onChangeText={(text) => {
              const formatted = formatDateInput(text);
              onEventChange({ ...event, dateDeadline: formatted });
            }}
            keyboardType="numeric"
            maxLength={10}
          />

          {/* Required fields note */}
          <Text style={styles.requiredFieldNote}><Text style={styles.requiredField}>*</Text> Required fields</Text>

          {/* Display modal error message if any */}
          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          {/* Save and Close */}
          <View style={styles.modalButtonsRow}>
            <Pressable style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#D9D0CE',
    padding: 16,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    alignSelf: 'center',
    color: '#333',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
    color: '#302c2c',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 36,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#2980b9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#7f8c8d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  requiredField: {
    color: 'red',
    fontWeight: 'bold',
  },
  requiredFieldNote: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 5,
    fontStyle: 'italic',
    color: '302c2c',
  },
});