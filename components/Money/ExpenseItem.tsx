// sharedspaces-mobile/app/components/Money/ExpenseItem.tsx

import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles, Expense } from './utils';

interface ExpenseItemProps {
  expense: Expense;
  onPress: () => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onPress }) => (
  <TouchableOpacity
    style={[styles.taskItem, { justifyContent: 'space-between' }]}
    onPress={onPress}
  >
    <View>
      <Text style={styles.taskText}>{expense.description}</Text>
      <Text style={{ fontSize: 12, color: '#666' }}>{expense.date}</Text>
      {expense.splitBetween && expense.splitBetween.length > 0 && (
        <Text style={{ fontSize: 12, color: '#666' }}>
          Split: {expense.splitBetween.join(", ")}
        </Text>
      )}
    </View>
    <Text style={styles.taskText}>${expense.amount.toFixed(2)}</Text>
  </TouchableOpacity>
);
