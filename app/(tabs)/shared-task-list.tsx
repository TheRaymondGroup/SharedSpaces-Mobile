import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { styles, Task, TaskList, TaskValidator } from '../../components/Tasks/utils';
import { TaskListCard } from '../../components/Tasks/TaskListCard';
import { TaskDetailsModal } from '../../components/Tasks/TaskDetailsModal';

export default function TabTwoScreen() {
  const [lists, setLists] = useState<TaskList[]>([
    { title: 'Chores List', tasks: [] },
    { title: 'Groceries List', tasks: [] },
    { title: 'General Errands List', tasks: [] }
  ]);

  // Keep text input for each list
  const [newTasks, setNewTasks] = useState<{ [key: string]: string }>({});

  // For inline error messages in the main list inputs
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  // For modal error messages when adding/editing task details
  const [modalErrorMessage, setModalErrorMessage] = useState<string>('');

  // For details modal
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedListTitle, setSelectedListTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // Flag to know if we're adding a new task or editing an existing one
  const [isNewTask, setIsNewTask] = useState(false);

  // Start the process of adding a new task by opening the details modal
  const handleStartAddTask = (listTitle: string) => {
    const taskName = newTasks[listTitle] || "";
    if (taskName.trim() === '') {
      setErrorMessages(prev => ({ ...prev, [listTitle]: 'Please enter a name for the task.' }));
      return;
    }
    // Clear any previous error for this list
    setErrorMessages(prev => ({ ...prev, [listTitle]: '' }));
    // Clear any modal error message
    setModalErrorMessage('');

    // Initialize a new task with the name and empty details.
    const newTask: Task = {
      id: Math.random().toString(36).substring(2),
      name: taskName,
      completed: false,
      additionalNotes: '',
      assignedTo: '',
      assignedBy: '',
      dateDeadline: ''
    };
    setSelectedListTitle(listTitle);
    setSelectedTask(newTask);
    setIsNewTask(true);
    setDetailsModalVisible(true);
  };

  // Delete a task
  const handleDeleteTask = (listTitle: string, taskId: string) => {
    setLists(prevLists =>
      prevLists.map(list => {
        if (list.title === listTitle) {
          return { ...list, tasks: list.tasks.filter(task => task.id !== taskId) };
        }
        return list;
      })
    );
  };

  // Toggle completed
  const handleToggleTask = (listTitle: string, taskId: string) => {
    setLists(prevLists =>
      prevLists.map(list => {
        if (list.title === listTitle) {
          const updatedTasks = list.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, completed: !task.completed };
            }
            return task;
          });
          return { ...list, tasks: updatedTasks };
        }
        return list;
      })
    );
  };

  // Open details modal for editing an existing task
  const handleOpenDetails = (listTitle: string, task: Task) => {
    setSelectedListTitle(listTitle);
    setSelectedTask({ ...task }); // clone to keep changes local
    setIsNewTask(false);
    setModalErrorMessage('');
    setDetailsModalVisible(true);
  };

  // Close details modal and reset selected task
  const handleCloseDetails = () => {
    setDetailsModalVisible(false);
    setSelectedTask(null);
    setIsNewTask(false);
    setModalErrorMessage('');
  };

  // Save updates from the details modal (for both new and edited tasks)
  const handleSaveDetails = () => {
    if (!selectedTask) return;

    // Use the TaskValidator to validate required fields
    const validationError = TaskValidator.validate(selectedTask);
    if (validationError) {
      setModalErrorMessage(validationError);
      return;
    }

    // Validate that the dateDeadline is in MM/DD/YYYY format and not in the past.
    const dateParts = selectedTask.dateDeadline.split('/');
    if (dateParts.length !== 3) {
      setModalErrorMessage('Please enter a valid date in MM/DD/YYYY format.');
      return;
    }
    
    const month = Number(dateParts[0]);
    const day = Number(dateParts[1]);
    const year = Number(dateParts[2]);
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      setModalErrorMessage('Invalid date.');
      return;
    }
    
    const inputDate = new Date(year, month - 1, day);
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      setModalErrorMessage('Invalid date.');
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate < today) {
      setModalErrorMessage('The date cannot be in the past.');
      return;
    }

    if (isNewTask) {
      // Add the new task to the appropriate list.
      setLists(prevLists =>
        prevLists.map(list => {
          if (list.title === selectedListTitle) {
            return { ...list, tasks: [...list.tasks, selectedTask] };
          }
          return list;
        })
      );
      // Clear the newTasks input for that list.
      setNewTasks(prev => ({ ...prev, [selectedListTitle]: '' }));
    } else {
      // Update an existing task.
      setLists(prevLists =>
        prevLists.map(list => {
          if (list.title === selectedListTitle) {
            const updatedTasks = list.tasks.map(task => {
              if (task.id === selectedTask.id) {
                return { ...selectedTask };
              }
              return task;
            });
            return { ...list, tasks: updatedTasks };
          }
          return list;
        })
      );
    }

    handleCloseDetails();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.spaceName}>SHARED TASKS LIST</Text>
      </View>

      {/* Task Lists */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TaskListCard
            list={item}
            inputValue={newTasks[item.title] || ''}
            errorMessage={errorMessages[item.title] || ''}
            onInputChange={(text) => setNewTasks(prev => ({ ...prev, [item.title]: text }))}
            onAddTask={() => handleStartAddTask(item.title)}
            onToggleTask={(taskId) => handleToggleTask(item.title, taskId)}
            onTaskDetails={(task) => handleOpenDetails(item.title, task)}
            onDeleteTask={(taskId) => handleDeleteTask(item.title, taskId)}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Details Modal for Adding/Editing Tasks */}
      <TaskDetailsModal
        visible={detailsModalVisible}
        task={selectedTask}
        errorMessage={modalErrorMessage}
        onClose={handleCloseDetails}
        onSave={handleSaveDetails}
        onTaskChange={setSelectedTask}
      />
    </View>
  );
}