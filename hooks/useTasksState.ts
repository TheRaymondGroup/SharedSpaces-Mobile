import { useState, useEffect } from 'react';
import { Task, TaskList } from '../components/Tasks/utils';

// Create a singleton pattern to ensure the same state is shared
let listeners: Function[] = [];
let taskLists: TaskList[] = [
  { title: 'Chores List', tasks: [] },
  { title: 'Groceries List', tasks: [] },
  { title: 'General Errands List', tasks: [] }
];

// Function to notify all listeners of state changes
const notifyListeners = () => {
  listeners.forEach(listener => listener(taskLists));
};

export const useTasksState = () => {
  // This local state will be updated whenever the shared state changes
  const [lists, setLists] = useState<TaskList[]>(taskLists);

  // Add this component as a listener when mounted
  useEffect(() => {
    const handleChange = (newLists: TaskList[]) => {
      setLists([...newLists]); // Create a new array reference to trigger re-render
    };
    
    listeners.push(handleChange);
    
    // Clean up when component unmounts
    return () => {
      listeners = listeners.filter(listener => listener !== handleChange);
    };
  }, []);

  // Function to update the shared state
  const updateLists = (newLists: TaskList[]) => {
    taskLists = [...newLists];
    notifyListeners();
  };

  // Function to add a task to a specific list
  const addTask = (listTitle: string, task: Task) => {
    const updatedLists = taskLists.map(list => {
      if (list.title === listTitle) {
        return { ...list, tasks: [...list.tasks, task] };
      }
      return list;
    });
    
    taskLists = updatedLists;
    notifyListeners();
  };

  // Function to delete a task
  const deleteTask = (listTitle: string, taskId: string) => {
    const updatedLists = taskLists.map(list => {
      if (list.title === listTitle) {
        return {
          ...list,
          tasks: list.tasks.filter(task => task.id !== taskId)
        };
      }
      return list;
    });
    
    taskLists = updatedLists;
    notifyListeners();
  };

  // Function to toggle task completion
  const toggleTask = (listTitle: string, taskId: string) => {
    const updatedLists = taskLists.map(list => {
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
    });
    
    taskLists = updatedLists;
    notifyListeners();
  };

  // Function to update an existing task
  const updateTask = (listTitle: string, taskId: string, updatedTask: Task) => {
    const updatedLists = taskLists.map(list => {
      if (list.title === listTitle) {
        const updatedTasks = list.tasks.map(task => {
          if (task.id === taskId) {
            return updatedTask;
          }
          return task;
        });
        return { ...list, tasks: updatedTasks };
      }
      return list;
    });

    taskLists = updatedLists;
    notifyListeners();
  };

  return {
    lists,
    updateLists,
    addTask,
    deleteTask,
    toggleTask,
    updateTask
  };
};