// sharedspaces-mobile/app/components/Money/utils.ts

import { StyleSheet } from 'react-native';

// Money‑tab data models
export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string; // MM/DD/YYYY
  splitBetween?: string[]; // New field for names of members sharing the expense
}

export interface PersonBalance {
  name: string;
  balance: number; // positive => you are owed; negative => you owe
}

export interface ExpenseList {
  title: string;
  expenses: Expense[];
  balances: PersonBalance[];
}

// Date formatter (MMDDYYYY → MM/DD/YYYY)
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
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  taskText: {
    fontSize: 14,
    color: '#34495e',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
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
    backgroundColor: '#27ae60',
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
  balancePositive: {
    color: 'green',
    fontWeight: '600',
  },
  balanceNegative: {
    color: 'red',
    fontWeight: '600',
  },
});
