// sharedspaces-mobile/app/(tabs)/money.tsx

import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet, FlatList, Button } from "react-native";
import { Text } from '@/components/Themed';
import { ExpenseCard } from "../../components/Money/ExpenseCard";
import { ExpenseDetailsModal } from "../../components/Money/ExpenseDetailsModal";
import { SettlementModal } from "../../components/Money/SettlementModal";
import { Expense, ExpenseList, Settlement } from "../../components/Money/utils";

export default function MoneyTab() {
  const [list, setList] = useState<ExpenseList>({
    title: "Reimbursements",
    expenses: [],
    balances: [],
    settlements: [], 
    participants: [], 
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [nextId, setNextId] = useState(1);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [categories, setCategories] = useState<string[]>([
    'Groceries', 'Rent', 'Utilities', 'Entertainment', 'Other'
  ]);
  const [settlementModalVisible, setSettlementModalVisible] = useState(false);

  useEffect(() => {
    // Extract all unique participants from expenses and the participants list
    const people = Array.from(new Set([
      ...list.participants,
      ...list.expenses.map(e => e.paidBy),
      ...list.expenses.flatMap(e => e.participants?.map(p => p.name) || [])
    ]));
    
    // Initialize balances for each person
    const balanceMap = new Map<string, number>();
    people.forEach(person => balanceMap.set(person, 0));
    
    // Process each expense
    list.expenses.forEach(expense => {
      if (expense.settled) return; // Skip settled expenses
      
      // Credit the payer for the full amount
      balanceMap.set(expense.paidBy, (balanceMap.get(expense.paidBy) || 0) + expense.amount);
      
      // Debit each participant based on their share
      if (expense.splitMethod === 'equal') {
        const activeParticipants = expense.participants?.length || people.length;
        const share = expense.amount / activeParticipants;
        
        // If participants explicitly defined, use those
        if (expense.participants?.length) {
          expense.participants.forEach(p => {
            balanceMap.set(p.name, (balanceMap.get(p.name) || 0) - share);
          });
        } else {
          // Otherwise split among all people
          people.forEach(person => {
            balanceMap.set(person, (balanceMap.get(person) || 0) - share);
          });
        }
      } else if (expense.splitMethod === 'custom' && expense.participants) {
        // For custom splits, use the specified shares
        expense.participants.forEach(p => {
          balanceMap.set(p.name, (balanceMap.get(p.name) || 0) - p.share);
        });
      }
    });
    
    list.settlements.forEach(settlement => {
      balanceMap.set(settlement.from, (balanceMap.get(settlement.from) || 0) + settlement.amount);
      balanceMap.set(settlement.to, (balanceMap.get(settlement.to) || 0) - settlement.amount);
    });
    
    // Convert Map to array of balance objects - REMOVE ZERO BALANCES
    const balances = Array.from(balanceMap.entries())
      .map(([name, balance]) => ({ name, balance }))
      .filter(b => Math.abs(b.balance) > 0.01); // Only include non-zero balances
    
    setList(l => ({ ...l, balances }));
  }, [list.expenses, list.settlements, list.participants]);

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

  const handleSettlement = (expenseId: string, from: string, to: string, amount: number) => {
    if (!from || !to || amount <= 0) {
      setModalErrorMessage("Please provide all settlement details");
      return;
    }

    const expenseIndex = list.expenses.findIndex(e => e.id === expenseId);
    if (expenseIndex === -1) return;

    // Create a new settlement record associated with this expense
    const newSettlement = {
      id: `s${Date.now()}`,
      expenseId,
      date: new Date().toLocaleDateString("en-US"),
      from,
      to,
      amount
    };

    // Add the settlement record
    const updatedSettlements = [...list.settlements, newSettlement];
    
    // Mark the expense as settled if all balances are resolved
    const updatedExpenses = list.expenses.map((expense, index) => {
      if (index === expenseIndex) {
        // Check if the settlement would fully resolve this expense
        // For simplicity, we'll just mark it settled
        return {
          ...expense,
          settled: true
        };
      }
      return expense;
    });
    
    // Update the list with new settlements and updated expenses
    setList({
      ...list,
      expenses: updatedExpenses,
      settlements: updatedSettlements
    });
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

      {/* Add Expense Button */}
      <View style={styles.controlsCard}>
        <Button title="Add Expense" onPress={() => {
          setCurrentExpense({
            id: nextId.toString(),
            description: "",
            amount: 0,
            paidBy: "",
            date: new Date().toLocaleDateString("en-US"),
            category: "Other",
            splitMethod: "equal",
            participants: [],
            settled: false,
          });
          setNextId(prev => prev + 1);
          setModalVisible(true);
        }} />
      </View>

      {/* Expense Cards */}
      {list.expenses.length === 0 ? (
        // Empty state
        <View style={styles.emptyStateCard}>
          <Text style={styles.emptyStateText}>
            No expenses yet. Click "Add Expense" to get started.
          </Text>
        </View>
      ) : (
        // FlatList with expense data only
        <FlatList
          data={list.expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseCard
              key={item.id}
              expense={item}
              onView={() => {
                setCurrentExpense({
                  ...item,
                  date: item.date.includes("T") 
                    ? new Date(item.date).toLocaleDateString("en-US")
                    : item.date,
                });
                setModalVisible(true);
              }}
              onDelete={() => handleDeleteExpense(item.id)}
              onSettle={(from, to, amount) => handleSettlement(item.id, from, to, amount)}
              balances={list.balances.filter(balance => {
                const participants = new Set([
                  item.paidBy,
                  ...(item.participants?.map(p => p.name) || [])
                ]);
                return participants.has(balance.name);
              })}
              participants={Array.from(new Set([
                ...list.participants,
                ...list.expenses.map(e => e.paidBy),
                ...list.expenses.flatMap(e => e.participants?.map(p => p.name) || [])
              ]))}
            />
          )}
          ListFooterComponent={() => (
            list.expenses.every(e => e.settled) && 
            list.balances.every(b => Math.abs(b.balance) <= 0.01) ? (
              <View style={styles.settledCard}>
                <Text style={styles.settledText}>
                  All expenses are settled. Everyone is square!
                </Text>
              </View>
            ) : null
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

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
  controlsCard: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balancePositive: {
    color: 'green',
  },
  balanceNegative: {
    color: 'red',
  },
  emptyStateCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    textAlign: 'center',
  },
  settledCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  settledText: {
    color: '#666',
    textAlign: 'center',
  },
});