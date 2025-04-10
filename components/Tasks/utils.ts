import { StyleSheet } from 'react-native';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  additionalNotes: string;
  assignedTo: string;
  assignedBy: string;
  dateDeadline: string;
}

export interface TaskList {
  title: string;
  tasks: Task[];
}

export const formatDateInput = (input: string): string => {
  const cleaned = input.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
  if (!match) return '';
  const mm = match[1];
  const dd = match[2] ? `/${match[2]}` : '';
  const yyyy = match[3] ? `/${match[3]}` : '';
  return `${mm}${dd}${yyyy}`.substring(0, 10);
};

export const styles = StyleSheet.create({
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
