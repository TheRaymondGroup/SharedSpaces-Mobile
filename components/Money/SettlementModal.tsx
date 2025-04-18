import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import { styles } from './utils';
import { SegmentedControl } from './SegmentedControl';
import { Picker } from '@react-native-picker/picker';

interface SettlementModalProps {
  visible: boolean;
  onClose: () => void;
  onSettle: (from: string, to: string, amount: number) => void;
  participants: string[];
  balances: Array<{name: string, balance: number}>;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
  visible,
  onClose,
  onSettle,
  participants,
  balances
}) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  
  // Get settlement suggestions
  const getSuggestions = () => {
    const debtors = balances.filter(b => b.balance < 0);
    const creditors = balances.filter(b => b.balance > 0);
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
    onClose();
  };

  const resetForm = () => {
    setFrom('');
    setTo('');
    setAmount('');
    setError('');
  };

  const suggestions = getSuggestions();

  const renderContent = () => (
    <ScrollView style={styles.modalContent}>
      {suggestions.length > 0 && (
        <View style={styles.suggestionContainer}>
          <Text style={styles.inputLabel}>Suggested Settlements:</Text>
          {/* Replace FlatList with direct mapping */}
          {suggestions.map((item, index) => (
            <Pressable 
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setFrom(item.from);
                setTo(item.to);
                setAmount(item.amount);
              }}
            >
              <Text>
                {item.from} pays {item.to} ${item.amount}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text style={styles.inputLabel}>Who paid:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={from}
          onValueChange={(itemValue: React.SetStateAction<string>) => setFrom(itemValue)}
          style={styles.picker}
          mode="dropdown"
          itemStyle={{ textAlign: 'center' }}
        >
          <Picker.Item label="Select who paid" value="" />
          {participants.map((participant) => (
            <Picker.Item key={participant} label={participant} value={participant} />
          ))}
        </Picker>
      </View>

      <Text style={styles.inputLabel}>Who received payment:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={to}
          onValueChange={(itemValue) => setTo(itemValue)}
          style={styles.picker}
          mode="dropdown"
          itemStyle={{ textAlign: 'center' }}
        >
          <Picker.Item label="Select who received" value="" />
          {participants.map((participant) => (
            <Picker.Item key={participant} label={participant} value={participant} />
          ))}
        </Picker>
      </View>

      <Text style={styles.inputLabel}>Amount:</Text>
      <TextInput
        style={styles.modalInput}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={(text) => {
          if (/^\d*\.?\d{0,2}$/.test(text)) {
            setAmount(text);
          }
        }}
        placeholder="0.00"
      />

      {error ? (
        <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>
      ) : null}

      <View style={styles.modalButtonsRow}>
        <Pressable style={styles.saveButton} onPress={handleSettle}>
          <Text style={styles.saveButtonText}>Record Settlement</Text>
        </Pressable>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalHeader}>Record Settlement</Text>
        {renderContent()}
      </View>
    </Modal>
  );
};