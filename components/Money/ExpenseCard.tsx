import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles, Expense } from './utils';

interface ExpenseCardProps {
  expense: Expense;
  onView: () => void;
  onDelete: () => void;
  balances: Array<{name: string, balance: number}>;
  onSettle: (from: string, to: string, amount: number) => void;
  participants: string[];
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onView,
  onDelete,
  balances,
  onSettle,
  participants
}) => {
  const [settleMode, setSettleMode] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Format participants for the dropdown
  const dropdownItems = participants.map(name => ({
    label: name,
    value: name
  }));

  // Get settlement suggestions for this expense's participants
  const getSuggestions = () => {
    // Get only balances for participants in this expense
    const relevantParticipants = new Set([
      expense.paidBy,
      ...(expense.participants?.map(p => p.name) || [])
    ]);
    
    const relevantBalances = balances.filter(b => 
      relevantParticipants.has(b.name)
    );
    
    const debtors = relevantBalances.filter(b => b.balance < 0);
    const creditors = relevantBalances.filter(b => b.balance > 0);
    const suggestions: { from: string; to: string; amount: string; }[] = [];

    debtors.forEach(debtor => {
      creditors.forEach(creditor => {
        const suggestedAmount = Math.min(Math.abs(debtor.balance), creditor.balance);
        
        if (suggestedAmount > 0.01) {
          suggestions.push({
            from: debtor.name,
            to: creditor.name,
            amount: suggestedAmount.toFixed(2)
          });
        }
      });
    });

    return suggestions;
  };

  const handleSettle = () => {
    if (!from) {
      setError('Please select who is paying');
      return;
    }
    if (!to) {
      setError('Please select who is receiving payment');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    onSettle(from, to, parseFloat(amount));
    resetForm();
  };

  const resetForm = () => {
    setFrom('');
    setTo('');
    setAmount('');
    setError('');
    setSettleMode(false);
  };

  const suggestions = getSuggestions();

  return (
    <View style={styles.expenseCard}>
      <Text style={styles.expenseTitle}>{expense.description}</Text>
      
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
        <Text style={styles.expenseInfo}>Paid by: {expense.paidBy}</Text>
        <Text style={styles.expenseInfo}>Date: {expense.date}</Text>
        {expense.category && <Text style={styles.expenseInfo}>Category: {expense.category}</Text>}
      </View>
      
      <View style={styles.expenseParticipants}>
        <Text style={styles.sectionLabel}>Participants:</Text>
        {expense.participants && expense.participants.map((participant, index) => (
          <Text key={index} style={styles.participantInfo}>
            {participant.name}: ${expense.splitMethod === 'equal' 
              ? (expense.amount / expense.participants.length).toFixed(2)
              : participant.share.toFixed(2)}
          </Text>
        ))}
      </View>

      {/* Balances related to this expense */}
      {balances.length > 0 && (
        <View style={styles.balanceSection}>
          <Text style={styles.sectionLabel}>Current Balances:</Text>
          {balances.map((balance) => (
            <View key={balance.name} style={styles.balanceRow}>
              <Text>{balance.name}:</Text>
              <Text style={balance.balance >= 0 ? styles.balancePositive : styles.balanceNegative}>
                ${balance.balance.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {/* Settlement section */}
      {!settleMode ? (
        <View style={styles.cardButtonRow}>
          <Pressable style={styles.settleButton} onPress={() => setSettleMode(true)}>
            <Text style={styles.buttonText}>Settle</Text>
          </Pressable>
          <Pressable style={styles.viewButton} onPress={onView}>
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.settlementSection}>
          <Text style={styles.sectionLabel}>Settle This Expense</Text>
          
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <View style={styles.miniSuggestionContainer}>
              <Text style={styles.miniInputLabel}>Suggested:</Text>
              {suggestions.map((suggestion, index) => (
                <Pressable 
                  key={index}
                  style={styles.miniSuggestionItem}
                  onPress={() => {
                    setFrom(suggestion.from);
                    setTo(suggestion.to);
                    setAmount(suggestion.amount);
                  }}
                >
                  <Text style={styles.suggestionText}>
                    {suggestion.from} → {suggestion.to}: ${suggestion.amount}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.settlementInputRow}>
            {/* The zIndex is important for proper stacking of multiple dropdowns */}
            <View style={{ flex: 2, marginRight: 4, zIndex: 3000 }}>
              <DropDownPicker
                open={fromOpen}
                value={from}
                items={[
                  { label: 'Who paid', value: '' }, 
                  ...dropdownItems
                ]}
                setOpen={setFromOpen}
                setValue={setFrom}
                placeholder="Who paid"
                style={styles.dropdownStyle}
                textStyle={styles.dropdownTextStyle}
                dropDownContainerStyle={styles.dropdownContainerStyle}
                placeholderStyle={styles.placeholderStyle}
              />
            </View>
            
            <View style={{ flex: 2, marginRight: 4, zIndex: 2000 }}>
              <DropDownPicker
                open={toOpen}
                value={to}
                items={[
                  { label: 'Who received', value: '' },
                  ...dropdownItems
                ]}
                setOpen={setToOpen}
                setValue={setTo}
                placeholder="Who received"
                style={styles.dropdownStyle}
                textStyle={styles.dropdownTextStyle}
                dropDownContainerStyle={styles.dropdownContainerStyle}
                placeholderStyle={styles.placeholderStyle}
              />
            </View>
            
            <TextInput
              style={[styles.miniInput, { flex: 1 }]}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={(text) => {
                if (/^\d*\.?\d{0,2}$/.test(text)) {
                  setAmount(text);
                }
              }}
              placeholder="0.00"
            />
          </View>

          {error ? (
            <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>{error}</Text>
          ) : null}

          <View style={styles.settlementButtonRow}>
            <Pressable style={styles.miniSaveButton} onPress={handleSettle}>
              <Text style={styles.miniButtonText}>Save</Text>
            </Pressable>
            <Pressable style={styles.miniCancelButton} onPress={resetForm}>
              <Text style={styles.miniButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};