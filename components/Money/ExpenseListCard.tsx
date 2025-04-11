// sharedspaces-mobile/app/components/Money/ExpenseListCard.tsx

import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { styles, ExpenseList } from './utils';

interface ExpenseListCardProps {
  list: ExpenseList;
  onAddExpense: () => void;
  onSettleExpense: () => void;
  onViewExpense: (expenseId: string) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseListCard: React.FC<ExpenseListCardProps> = ({
  list,
  onAddExpense,
  onSettleExpense,
  onViewExpense,

}) => (
  <View style={styles.listCard}>
    <Text style={styles.listTitle}>{list.title}</Text>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
      <Button title="Add Expense" onPress={onAddExpense} />
      <Button title="Settle Expense" onPress={onSettleExpense} />
    </View>

    <FlatList
      data={list.balances}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
          <Text>{item.name}</Text>
          <Text style={item.balance >= 0 ? styles.balancePositive : styles.balanceNegative}>
            {item.balance >= 0
              ? `You are owed: $${item.balance.toFixed(2)}`
              : `You owe: $${Math.abs(item.balance).toFixed(2)}`}
          </Text>
        </View>
      )}
    />
  </View>
);
