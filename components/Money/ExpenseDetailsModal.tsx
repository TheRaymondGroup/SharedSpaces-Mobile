import React from "react";
import { View, Text, TextInput, Modal, Pressable } from "react-native";
import { styles, Expense, formatDateInput } from "./utils";

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

  // Local state for the current input text for splitting names
  const [splitInput, setSplitInput] = React.useState("");

  // Generic handler for other expense fields
  const handleChange = (field: keyof Expense, value: string) => {
    const updated = { ...expense } as any;
    if (field === "amount") {
      updated.amount = parseFloat(value) || 0;
    } else if (field === "date") {
      updated.date = formatDateInput(value);
    } else {
      updated[field] = value;
    }
    onChange(updated);
  };

  // Handler for the "Split Between" input.
  // As soon as a comma is detected, all complete names (every part except the last) 
  // are added to the list and rendered as bubbles.
  const handleSplitInputChange = (text: string) => {
    if (text.includes(",")) {
      // Split text by comma.
      const parts = text.split(",");
      // Consider all parts except the last as complete names.
      const completeNames = parts
        .slice(0, -1)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      if (completeNames.length > 0) {
        const currentSplits = expense.splitBetween || [];
        const updatedSplits = [...currentSplits, ...completeNames];
        onChange({ ...expense, splitBetween: updatedSplits });
      }

      // Set the input to whatever remains after the last comma.
      setSplitInput(parts[parts.length - 1].trim());
    } else {
      setSplitInput(text);
    }
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
            onChangeText={(t) => handleChange("description", t)}
          />

          <Text style={styles.inputLabel}>Amount:</Text>
          <TextInput
            style={styles.modalInput}
            keyboardType="numeric"
            value={expense.amount.toString()}
            onChangeText={(t) => handleChange("amount", t)}
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

          <Text style={styles.inputLabel}>
            Split Between (type a name and comma to add):
          </Text>
          {/* Display added names as bubbles */}
          {expense.splitBetween && expense.splitBetween.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
              {expense.splitBetween.map((name, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#eee",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    marginRight: 4,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 12 }}>{name}</Text>
                </View>
              ))}
            </View>
          )}
          <TextInput
            style={styles.modalInput}
            placeholder="e.g., Alice, "
            value={splitInput}
            onChangeText={handleSplitInputChange}
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
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
