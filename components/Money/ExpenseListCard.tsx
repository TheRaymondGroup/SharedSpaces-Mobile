// sharedspaces-mobile/app/components/Money/ExpenseListCard.tsx

import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { styles, ExpenseList } from './utils';
import { ExpenseItem } from './ExpenseItem';

interface ExpenseListCardProps {
  list: ExpenseList;
  onAddExpense: () => void;
  onViewExpense: (expenseId: string) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseListCard: React.FC<ExpenseListCardProps> = ({
  list,
  onAddExpense,
  onViewExpense,
  onDeleteExpense
}) => (
  <View style={styles.listCard}>
    <Text style={styles.listTitle}>{list.title}</Text>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
      <Button title="Add Expense" onPress={onAddExpense} />
    </View>

    {list.expenses.length === 0 ? (
      <Text style={{ textAlign: 'center', marginTop: 12, color: '#666' }}>
        No expenses yet. Add your first expense to get started.
      </Text>
    ) : (
      <FlatList
        data={list.expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onPress={() => onViewExpense(item.id)}
          />
        )}
      />
    )}

    {/* Only show balances if all expenses are settled but some balances remain */}
    {list.expenses.length > 0 && 
     list.expenses.every(e => e.settled) && 
     list.balances.some(b => Math.abs(b.balance) > 0.01) && (
      <View style={styles.settledNotice}>
        <Text style={styles.settledText}>
          All expenses are settled, but some balances remain.
        </Text>
      </View>
    )}
  </View>
);
