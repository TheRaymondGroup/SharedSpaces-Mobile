import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, Pressable, ScrollView } from "react-native";
import ModalDropdown from 'react-native-modal-dropdown';
import { styles, Expense, formatDateInput } from "./utils";
import { SegmentedControl } from './SegmentedControl';

interface ExpenseDetailsModalProps {
  visible: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (updated: Expense) => void;
  errorMessage?: string;
}

export const ExpenseDetailsModal: React.FC<ExpenseDetailsModalProps> = ({
  visible,
  expense,
  onClose,
  onSave,
  onChange,
  errorMessage,
}) => {
  const [participantInput, setParticipantInput] = useState("");
  const [amountText, setAmountText] = useState(
    expense ? expense.amount.toString() : "0"
  );
  const [participantShareInputs, setParticipantShareInputs] = useState<{[index: number]: string}>({});

  // Update amount text when expense changes
  useEffect(() => {
    if (expense) {
      setAmountText(expense.amount.toString());
    }
  }, [expense]);

  // Now safe to return early
  if (!expense) return null;

  const handleChange = (field: keyof Expense, value: string | number) => {
    const updated = { ...expense } as any;
    if (field === "amount") {
      updated.amount = parseFloat(value as string) || 0;
      
      // If using equal split, update all participant shares
      if (updated.splitMethod === 'equal' && updated.participants?.length > 0) {
        const equalShare = updated.amount / updated.participants.length;
        updated.participants = updated.participants.map((p: { name: any; }) => ({
          name: p.name,
          share: equalShare
        }));
      }
    } else if (field === "date") {
      updated.date = formatDateInput(value as string);
    } else if (field === "splitMethod") {
      updated.splitMethod = value as 'equal' | 'custom';
      
      // Instead of removing participants, update their shares to be equal
      if (value === 'equal' && updated.participants?.length > 0) {
        const equalShare = updated.amount / updated.participants.length;
        updated.participants = updated.participants.map((p: { name: any; }) => ({
          name: p.name,
          share: equalShare
        }));
      }
    } else {
      updated[field] = value;
    }
    onChange(updated);
  };

  const handleAddParticipant = () => {
    if (participantInput.trim()) {
      const updatedExpense = {...expense};
      
      if (!updatedExpense.participants) {
        updatedExpense.participants = [];
      }
      
      // For equal splits, just track the participant by name
      const newParticipant = {
        name: participantInput.trim(),
        share: expense.splitMethod === 'equal' 
          ? expense.amount / (updatedExpense.participants.length + 1)
          : 0 // For custom split, user will set the share separately
      };
      
      updatedExpense.participants = [...updatedExpense.participants, newParticipant];
      onChange(updatedExpense);
      setParticipantInput("");
    }
  };

  const handleRemoveParticipant = (index: number) => {
    const updatedExpense = {...expense};
    updatedExpense.participants = [...(updatedExpense.participants || [])];
    updatedExpense.participants.splice(index, 1);
    onChange(updatedExpense);
  };

  const handleParticipantShareChange = (index: number, shareText: string) => {
    // Store the raw input text
    setParticipantShareInputs(prev => ({
      ...prev,
      [index]: shareText
    }));
    
    // Only update the actual share value if it's a valid number
    if (shareText === '' || shareText === '.') {
      // Don't update the actual share yet, just keep the input text
      return;
    }
    
    const share = parseFloat(shareText);
    
    const updatedExpense = {...expense};
    updatedExpense.participants = [...(updatedExpense.participants || [])];
    updatedExpense.participants[index] = {
      ...updatedExpense.participants[index],
      share: isNaN(share) ? 0 : share
    };
    onChange(updatedExpense);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <ScrollView style={styles.modalContainer}>
        <Text style={styles.modalHeader}>Expense Details</Text>
        <View style={styles.modalContent}>
          <Text style={styles.inputLabel}>Description:</Text>
          <TextInput
            style={styles.modalInput}
            value={expense.description}
            onChangeText={(t) => handleChange("description", t)}
          />
          <Text style={styles.inputLabel}>Amount:</Text>
          <TextInput
            style={styles.modalInput}
            keyboardType="decimal-pad"
            value={amountText}
            onChangeText={(text) => {
              if (/^\d*\.?\d{0,2}$/.test(text)) {
                setAmountText(text);
              }
            }}
            onBlur={() => {
              const parsed = parseFloat(amountText);
              if (!isNaN(parsed)) {
                handleChange("amount", parsed);
              }
            }}
          />
          <Text style={styles.inputLabel}>Paid By:</Text>
          <TextInput
            style={styles.modalInput}
            value={expense.paidBy}
            onChangeText={(t) => handleChange("paidBy", t)}
          />

          <Text style={styles.inputLabel}>Date (MM/DD/YYYY):</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="MM/DD/YYYY"
            value={expense.date}
            onChangeText={(t) => handleChange("date", t)}
            keyboardType="numeric"
            maxLength={10}
          />

          <Text style={styles.inputLabel}>Category:</Text>
          <TextInput
            style={styles.modalInput}
            value={expense.category || ""}
            onChangeText={(t) => handleChange("category", t)}
          />

          <Text style={styles.inputLabel}>Split Method:</Text>
          <SegmentedControl
            options={[
              { label: 'Equal Split', value: 'equal' },
              { label: 'Custom Split', value: 'custom' }
            ]}
            selectedValue={expense.splitMethod}
            onValueChange={(value) => handleChange('splitMethod', value)}
          />

          <Text style={styles.inputLabel}>
            Add Participants:
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={[styles.modalInput, { flex: 1 }]}
              placeholder="Enter name"
              value={participantInput}
              onChangeText={setParticipantInput}
            />
            <Pressable 
              style={styles.addButton} 
              onPress={handleAddParticipant}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>

          {/* Display participants */}
          {expense.participants && expense.participants.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.inputLabel}>Participants:</Text>
              {expense.participants.map((participant, index) => (
                <View key={index} style={styles.participantRow}>
                  <Text style={{ flex: 1 }}>{participant.name}</Text>
                  
                  {expense.splitMethod === 'custom' && (
                    <TextInput
                      style={styles.shareInput}
                      placeholder="Share"
                      value={
                        // Use the raw input value if it exists, otherwise use the share value
                        participantShareInputs[index] !== undefined 
                          ? participantShareInputs[index] 
                          : participant.share.toString()
                      }
                      onChangeText={(text) => {
                        // More permissive regex that allows decimal input
                        if (/^(\d*\.?\d{0,2})?$/.test(text)) {
                          handleParticipantShareChange(index, text);
                        }
                      }}
                      // Add an onBlur handler to convert and finalize the value
                      onBlur={() => {
                        const inputValue = participantShareInputs[index] || '';
                        let finalValue = inputValue === '' || inputValue === '.' ? 0 : parseFloat(inputValue);
                        if (isNaN(finalValue)) finalValue = 0;
                        
                        // Update both the raw input and the actual share value
                        setParticipantShareInputs(prev => ({
                          ...prev,
                          [index]: finalValue.toString()
                        }));
                        
                        const updatedExpense = {...expense};
                        updatedExpense.participants = [...(updatedExpense.participants || [])];
                        updatedExpense.participants[index] = {
                          ...updatedExpense.participants[index],
                          share: finalValue
                        };
                        onChange(updatedExpense);
                      }}
                      keyboardType="decimal-pad"
                    />
                  )}
                  
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => handleRemoveParticipant(index)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {errorMessage ? (
            <Text style={{ color: "red", marginTop: 8 }}>{errorMessage}</Text>
          ) : null}

          <View style={styles.modalButtonsRow}>
            <Pressable style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};
