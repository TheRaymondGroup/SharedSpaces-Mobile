import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";

import { useRouter } from "expo-router";

export default function TabOneScreen() {
  const router = useRouter();

  // Array of pastel colors for the buttons
  const pastelColors = [
    "#FFB6C1", // Light Pink
    "#AFEEEE", // Pale Turquoise
    "#FFDAB9", // Peach Puff
    "#D8BFD8", // Thistle (Light Purple)
    "#98FB98", // Pale Green
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.buttonsContainer}>
        <View style={styles.column}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: pastelColors[0] }]}
            onPress={() => router.push("/shared-event-list")}
          >
            <Text style={styles.buttonText}>Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: pastelColors[1] }]}
            onPress={() => router.push("/shared-task-list")}
          >
            <Text style={styles.buttonText}>Task</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.column}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: pastelColors[3] }]}
            onPress={() => console.log("Button 4 pressed")}
          >
            <Text style={styles.buttonText}>this doesnt do anything</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: pastelColors[4] }]}
            onPress={() => console.log("Button 5 pressed")}
          >
            <Text style={styles.buttonText}>this also doesnt do anything</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
  },
  column: {
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  button: {
    width: 150, // Increased width for rectangle shape
    height: 100,
    borderRadius: 0, // Removed rounded borders
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Add elevation for Android
    elevation: 3,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
  },
});
