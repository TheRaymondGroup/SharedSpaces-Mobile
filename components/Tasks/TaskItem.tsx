import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../Tasks/utils';
import { Task } from '../Tasks/utils';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDetails: () => void;
  onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDetails,
  onDelete
}) => {
  return (
    <View style={styles.taskItem}>
      {/* Checkbox */}
      <TouchableOpacity
        style={[
          styles.checkbox,
          task.completed && styles.checkboxCompleted
        ]}
        onPress={onToggle}
      />
      
      {/* Task Name */}
      <Text
        style={[
          styles.taskText,
          task.completed && styles.taskTextCompleted
        ]}
      >
        {task.name}
      </Text>
      
      {/* Action Buttons */}
      <TouchableOpacity
        onPress={onDetails}
        style={[styles.detailButton, { backgroundColor: '#2980b9' }]}
      >
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={onDelete}
        style={[styles.detailButton, { backgroundColor: '#e74c3c' }]}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};