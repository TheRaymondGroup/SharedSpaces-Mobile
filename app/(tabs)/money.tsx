// sharedspaces-mobile/app/(tabs)/money.tsx

import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Text } from '@/components/Themed';
import { ExpenseListCard } from "../../components/Money/ExpenseListCard";
import { ExpenseDetailsModal } from "../../components/Money/ExpenseDetailsModal";
import { Expense, ExpenseList } from "../../components/Money/utils";

export default function MoneyTab() {
  const [list, setList] = useState<ExpenseList>({
    title: "Reimbursements",
    expenses: [],
    balances: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [nextId, setNextId] = useState(1);
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  // Balance calculation
  useEffect(() => {
    const people = Array.from(new Set(list.expenses.map(e => e.paidBy)));
    const total = list.expenses.reduce((sum, e) => sum + e.amount, 0);
    const share = people.length ? total / people.length : 0;

    const balances = people.map(name => ({
      name,
      balance: list.expenses
        .filter(e => e.paidBy === name)
        .reduce((s, e) => s + e.amount, 0) - share
    }));

    setList(l => ({ ...l, balances }));
  }, [list.expenses]);

  const handleSaveExpense = () => {
    if (!currentExpense) return;
    
    // Basic validation
    if (currentExpense.amount <= 0) {
      setModalErrorMessage("Amount must be greater than 0");
      return;
    }

    setList(l => ({
      ...l,
      expenses: l.expenses.some(e => e.id === currentExpense.id)
        ? l.expenses.map(e => e.id === currentExpense.id ? currentExpense : e)
        : [...l.expenses, currentExpense]
    }));
    
    setModalVisible(false);
    setCurrentExpense(null);
    setModalErrorMessage('');
  };

  const handleDeleteExpense = (expenseId: string) => {
    setList(l => ({
      ...l,
      expenses: l.expenses.filter(e => e.id !== expenseId)
    }));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Money",
          headerShown: true,
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{list.title}</Text>
      </View>

      {/* Expense List */}
      <ExpenseListCard
        list={list}
        onAddExpense={() => {
          setCurrentExpense({
            id: nextId.toString(),
            description: "",
            amount: 0,
            paidBy: "",
            date: new Date().toISOString(),
          });
          setNextId(prev => prev + 1);
          setModalVisible(true);
        }}
        onSettleExpense={() => {
          setList({ ...list, expenses: [], balances: [] });
          setNextId(1);
        }}
        onViewExpense={(id) => {
          const expense = list.expenses.find(e => e.id === id);
          if (expense) {
            setCurrentExpense(expense);
            setModalVisible(true);
          }
        }}
        onDeleteExpense={handleDeleteExpense}
      />

      {/* Expense Details Modal */}
      <ExpenseDetailsModal
        visible={modalVisible}
        expense={currentExpense}
        errorMessage={modalErrorMessage}
        onClose={() => {
          setModalVisible(false);
          setCurrentExpense(null);
          setModalErrorMessage('');
        }}
        onSave={handleSaveExpense}
        onChange={(expense) => setCurrentExpense(expense)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#D9D0CE',
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
});