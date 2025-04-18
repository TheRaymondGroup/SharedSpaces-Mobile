// sharedspaces-mobile/app/components/Money/utils.ts

import { StyleSheet } from 'react-native';

// Money‑tab data models
export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string; // MM/DD/YYYY
  category?: string;  // New: categorize expenses (groceries, rent, etc.)
  splitMethod: 'equal' | 'custom'; // New: how the expense is split
  participants: Array<{name: string, share: number}>; // New: allows custom splits
  settled: boolean;  // New: track if this expense is settled
}

export interface Settlement {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: number;
}

export interface ExpenseList {
  title: string;
  expenses: Expense[];
  balances: Array<{name: string, balance: number}>;
  settlements: Settlement[]; // New: track settlement history
  participants: string[]; // New: explicitly track participants
}

// Date formatter (MMDDYYYY → MM/DD/YYYY)
export const formatDateInput = (input: string): string => {
  const numbers = input.replace(/\D/g, '');
  
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  }
};

export const styles = StyleSheet.create({
  // General container styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  
  // List card styles
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  
  // Task/expense item styles
  taskItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  
  // Buttons
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Picker styles
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  picker: {
    height: 40,
  },
  
  // Participant styles
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  shareInput: {
    width: 80,
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Balance styles
  balancePositive: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  balanceNegative: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },

  // Suggestion styles
  suggestionContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#e8f4f8',
    borderRadius: 4,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },

  // Expense card styles
  expenseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  expenseDetails: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 4,
  },
  expenseInfo: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  expenseParticipants: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#34495e',
  },
  participantInfo: {
    fontSize: 14,
    color: '#555',
    paddingLeft: 8,
    paddingVertical: 2,
  },
  cardButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  viewButton: {
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  expenseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  controlsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  balanceSection: {
    marginVertical: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  settlementSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  settlementInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  miniSuggestionContainer: {
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  miniSuggestionItem: {
    backgroundColor: '#e3f2fd',
    padding: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  miniInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  miniPickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  miniPicker: {
    height: 40,
    width: '100%',
    textAlign: 'center', 
  },
  miniInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  settlementButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  miniSaveButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  miniCancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  miniButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  suggestionText: {
    fontSize: 12,
  },
  settleButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },

  emptyStateCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 24,
    marginVertical: 16,
    alignItems: 'center',
  },
  settledNotice: {
    backgroundColor: '#e0f7fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  settledCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  settledText: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
  },

  // Modal Dropdown styles
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 16,
    height: 40,
    justifyContent: 'center',
  },
  dropdown: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  dropdownList: {
    width: 150,
    marginTop: -20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownListText: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  dropdownStyle: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    height: 40,
  },
  dropdownTextStyle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  dropdownContainerStyle: {
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  placeholderStyle: {
    color: '#999',
    textAlign: 'center',
  },
});
