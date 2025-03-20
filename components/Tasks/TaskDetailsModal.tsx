import React from 'react';
import { View, Text, TextInput, Modal, Pressable } from 'react-native';
import { styles, Task, formatDateInput } from '../Tasks/utils';

interface TaskDetailsModalProps {
  visible: boolean;
  task: Task | null;
  errorMessage: string;
  onClose: () => void;
  onSave: () => void;
  onTaskChange: (updatedTask: Task) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  visible,
  task,
  errorMessage,
  onClose,
  onSave,
  onTaskChange
}) => {
  if (!task) return null;

  const handleChange = (field: keyof Task, value: string) => {
    onTaskChange({ ...task, [field]: value });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalHeader}>DETAILS</Text>
        <View style={styles.modalContent}>
          {/* Task Name */}
          <Text style={styles.inputLabel}>Name of Task:</Text>
          <TextInput
            style={styles.modalInput}
            value={task.name}
            onChangeText={(text) => handleChange('name', text)}
          />

          {/* Additional Notes */}
          <Text style={styles.inputLabel}>Additional Notes:</Text>
          <TextInput
            style={styles.modalInput}
            value={task.additionalNotes}
            onChangeText={(text) => handleChange('additionalNotes', text)}
          />

          {/* Assigned To */}
          <Text style={styles.inputLabel}>Assigned To:</Text>
          <TextInput
            style={styles.modalInput}
            value={task.assignedTo}
            onChangeText={(text) => handleChange('assignedTo', text)}
          />

          {/* Assigned By */}
          <Text style={styles.inputLabel}>Assigned By:</Text>
          <TextInput
            style={styles.modalInput}
            value={task.assignedBy}
            onChangeText={(text) => handleChange('assignedBy', text)}
          />

          {/* Date Deadline */}
          <Text style={styles.inputLabel}>Date Deadline:</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="MM/DD/YYYY"
            value={task.dateDeadline}
            onChangeText={(text) => {
              const formatted = formatDateInput(text);
              handleChange('dateDeadline', formatted);
            }}
            keyboardType="numeric"
            maxLength={10}
          />

          {/* Modal error message */}
          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          {/* Save and Close Buttons */}
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
};
