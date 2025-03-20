import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { styles, TaskList, Task } from '../Tasks/utils';
import { TaskItem } from './TaskItem';

interface TaskListCardProps {
  list: TaskList;
  inputValue: string;
  errorMessage: string;
  onInputChange: (text: string) => void;
  onAddTask: () => void;
  onToggleTask: (taskId: string) => void;
  onTaskDetails: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({
  list,
  inputValue,
  errorMessage,
  onInputChange,
  onAddTask,
  onToggleTask,
  onTaskDetails,
  onDeleteTask
}) => {
  return (
    <View style={styles.listCard}>
      <Text style={styles.listTitle}>{list.title}</Text>

      {/* Input to create new task */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add new task..."
          value={inputValue}
          onChangeText={onInputChange}
        />
        <Button title="Add" onPress={onAddTask} />
      </View>
      
      {/* Error message if exists */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* Render tasks */}
      {list.tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onDetails={() => onTaskDetails(task)}
          onDelete={() => onDeleteTask(task.id)}
        />
      ))}
    </View>
  );
};