import React from "react";
import { View, Text, TextInput, Modal, Pressable } from "react-native";
import { styles, Expense, formatDateInput } from "./utils";

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
  if (!expense) return null;

  const [splitInput, setSplitInput] = React.useState("");
  const [amountText, setAmountText] = React.useState(expense.amount.toString());

  React.useEffect(() => {
    setAmountText(expense.amount.toString());
  }, [expense]);

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

  const handleSplitInputChange = (text: string) => {
    if (text.includes(",")) {
      const parts = text.split(",");
      const completeNames = parts
        .slice(0, -1)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      if (completeNames.length > 0) {
        const currentSplits = expense.splitBetween || [];
        const updatedSplits = [...currentSplits, ...completeNames];
        onChange({ ...expense, splitBetween: updatedSplits });
      }

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
              const updated = { ...expense, amount: parsed };
              onChange(updated);
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

          <Text style={styles.inputLabel}>
            Split Between (type a name and comma to add):
          </Text>
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
      </View>
    </Modal>
  );
};
