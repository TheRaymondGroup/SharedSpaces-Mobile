import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  Modal,
  Pressable
} from 'react-native';
import { Text, View } from '@/components/Themed';

interface Task {
  id: string;          // For unique key
  name: string;        // Main text/title of the task
  completed: boolean;
  additionalNotes: string;
  assignedTo: string;
  assignedBy: string;
  dateDeadline: string; // Could store as string or Date object
}

interface TaskList {
  title: string;
  tasks: Task[];
}

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

    // Validate that all required fields are filled.
    if (
      !selectedTask.name.trim() ||
      !selectedTask.additionalNotes.trim() ||
      !selectedTask.assignedTo.trim() ||
      !selectedTask.assignedBy.trim() ||
      !selectedTask.dateDeadline.trim()
    ) {
      setModalErrorMessage('Please fill in all required details.');
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
    if ( day < 1 || day > 31 || month < 1 || month > 12) 
    { setModalErrorMessage('Invalid date.');
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
          <View style={styles.listCard}>
            <Text style={styles.listTitle}>{item.title}</Text>

            {/* Input to create new task */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Add new task..."
                value={newTasks[item.title] || ''}
                onChangeText={(text) =>
                  setNewTasks(prev => ({ ...prev, [item.title]: text }))
                }
              />
              <Button title="Add" onPress={() => handleStartAddTask(item.title)} />
            </View>
            {/* Display error message if exists */}
            {errorMessages[item.title] ? (
              <Text style={styles.errorText}>{errorMessages[item.title]}</Text>
            ) : null}

            {/* Render tasks */}
            {item.tasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                {/* Checkbox */}
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    task.completed && styles.checkboxCompleted
                  ]}
                  onPress={() => handleToggleTask(item.title, task.id)}
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
                {/* Buttons */}
                <TouchableOpacity
                  onPress={() => handleOpenDetails(item.title, task)}
                  style={[styles.detailButton, { backgroundColor: '#2980b9' }]}
                >
                  <Text style={styles.buttonText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteTask(item.title, task.id)}
                  style={[styles.detailButton, { backgroundColor: '#e74c3c' }]}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Details Modal for Adding/Editing Tasks */}
      <Modal
        visible={detailsModalVisible}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>DETAILS</Text>
          {selectedTask && (
            <View style={styles.modalContent}>
              {/* Task Name */}
              <Text style={styles.inputLabel}>Name of Task:</Text>
              <TextInput
                style={styles.modalInput}
                value={selectedTask.name}
                onChangeText={(text) =>
                  setSelectedTask({ ...selectedTask, name: text })
                }
              />

              {/* Additional Notes */}
              <Text style={styles.inputLabel}>Additional Notes:</Text>
              <TextInput
                style={styles.modalInput}
                value={selectedTask.additionalNotes}
                onChangeText={(text) =>
                  setSelectedTask({ ...selectedTask, additionalNotes: text })
                }
              />

              {/* Assigned To */}
              <Text style={styles.inputLabel}>Assigned To:</Text>
              <TextInput
                style={styles.modalInput}
                value={selectedTask.assignedTo}
                onChangeText={(text) =>
                  setSelectedTask({ ...selectedTask, assignedTo: text })
                }
              />

              {/* Assigned By */}
              <Text style={styles.inputLabel}>Assigned By:</Text>
              <TextInput
                style={styles.modalInput}
                value={selectedTask.assignedBy}
                onChangeText={(text) =>
                  setSelectedTask({ ...selectedTask, assignedBy: text })
                }
              />

              {/* Date Deadline */}
              <Text style={styles.inputLabel}>Date Deadline:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="MM/DD/YYYY"
                value={selectedTask.dateDeadline}
                onChangeText={(text) => {
                  const formatted = formatDateInput(text);
                  setSelectedTask({ ...selectedTask, dateDeadline: formatted });
                }}
                keyboardType="numeric"
                maxLength={10}
              />

              {/* Modal error message */}
              {modalErrorMessage !== '' && (
                <Text style={styles.errorText}>{modalErrorMessage}</Text>
              )}

              {/* Save and Close Buttons */}
              <View style={styles.modalButtonsRow}>
                <Pressable style={styles.saveButton} onPress={handleSaveDetails}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable style={styles.closeButton} onPress={handleCloseDetails}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

// Utility function for formatting date input as MM/DD/YYYY
const formatDateInput = (input: string) => {
  const cleaned = input.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
  if (!match) return '';
  const mm = match[1];
  const dd = match[2] ? `/${match[2]}` : '';
  const yyyy = match[3] ? `/${match[3]}` : '';
  return `${mm}${dd}${yyyy}`.substring(0, 10);
};

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#D9D0CE',
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  spaceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666'
  },
  listContainer: {
    paddingBottom: 20,
  },
  listCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 36,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: '#fff'
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#26de81',
  },
  taskText: {
    fontSize: 14,
    color: '#34495e',
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  detailButton: {
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 12,
    color: 'white',
  },
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
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 36,
    backgroundColor: '#fff',
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
});
