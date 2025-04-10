import React from 'react';
import { View, Text, TextInput, Modal, Pressable } from 'react-native';
import { styles, Expense, formatDateInput } from './utils';

interface ExpenseDetailsModalProps {
  visible: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (updated: Expense) => void;
}

export const ExpenseDetailsModal: React.FC<ExpenseDetailsModalProps> = ({
  visible,
  expense,
  onClose,
  onSave,
  onChange,
}) => {
  if (!expense) return null;

  const handleChange = (field: keyof Expense, value: string) => {
    const updated = { ...expense } as any;
    if (field === 'amount') {
      updated.amount = parseFloat(value) || 0;
    } else if (field === 'date') {
      updated.date = formatDateInput(value);
    } else if (field === 'splitBetween') {
      // Split the comma-separated input into an array of trimmed names.
      updated.splitBetween = value.split(',')
        .map(name => name.trim())
        .filter(Boolean);
    } else {
      updated[field] = value;
    }
    onChange(updated);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalHeader}>Expense Details</Text>
        <View style={styles.modalContent}>
          <Text style={styles.inputLabel}>Description:</Text>
          <TextInput
            style={styles.modalInput}
            value={expense.description}
            onChangeText={(t) => handleChange('description', t)}
          />

          <Text style={styles.inputLabel}>Amount:</Text>
          <TextInput
            style={styles.modalInput}
            keyboardType="numeric"
            value={expense.amount.toString()}
            onChangeText={(t) => handleChange('amount', t)}
          />

          <Text style={styles.inputLabel}>Paid By:</Text>
          <TextInput
            style={styles.modalInput}
            value={expense.paidBy}
            onChangeText={(t) => handleChange('paidBy', t)}
          />

          <Text style={styles.inputLabel}>Date (MM/DD/YYYY):</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="MM/DD/YYYY"
            value={expense.date}
            onChangeText={(t) => handleChange('date', t)}
            keyboardType="numeric"
            maxLength={10}
          />

          <Text style={styles.inputLabel}>Split Between (comma-separated):</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g., Alice, Bob, Charlie"
            value={expense.splitBetween ? expense.splitBetween.join(", ") : ""}
            onChangeText={(t) => handleChange('splitBetween', t)}
            keyboardType="default"  // <-- forces a normal text keyboard
            autoCapitalize="none"   // optional: prevents automatic capitalization
            autoCorrect={false}     // optional: prevents automatic corrections
          />

          <View style={styles.modalButtonsRow}>
            <Pressable style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
