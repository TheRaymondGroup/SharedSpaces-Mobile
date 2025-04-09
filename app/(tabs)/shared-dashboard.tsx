import { StyleSheet, SafeAreaView, TouchableOpacity, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Using Ionicons for button icons

export default function TabOneScreen() {
  const router = useRouter();

  const buttons = [
    {
      label: "Shared Event List",
      icon: "calendar-outline",
      color: "#F0E5DE",
      onPress: () => router.push("/shared-event-list"),
    },
    {
      label: "Shared Task List",
      icon: "checkmark-done-outline",
      color: "#DDEFEF",
      onPress: () => router.push("/shared-task-list"),
    },
    {
      label: "Calendar View for Shared Lists",
      icon: "calendar",
      color: "#EAE6F2",
      onPress: () => router.push("/calendar-view"),
    },
    {
      label: "Money Reimbursement",
      icon: "cash-outline",
      color: "#E8F5E9",
      onPress: () => router.push("/money-reinbursement"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.spaceName}>SHARED DASHBOARD</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        {buttons.map((btn, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.button, { backgroundColor: btn.color }]}
            onPress={btn.onPress}
          >
            <Ionicons name={btn.icon as keyof typeof Ionicons.glyphMap} size={24} color="#333" style={styles.icon} />
            <Text style={styles.buttonText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  header: {
    marginTop: 32,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spaceName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    textTransform: "uppercase",
  },
  buttonsContainer: {
    flexDirection: "column",
    gap: 16,
  },
  button: {
    width: "100%",
    height: 100,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "300",
    color: "#555",
  },
});
