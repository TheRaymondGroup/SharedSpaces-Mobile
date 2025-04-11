import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Drawer } from "expo-router/drawer";
import {
  Pressable,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useNavigation } from "expo-router";
import OnDemandModal from "@/components/OnDemandModal";
import { supabase } from "@/supabaseClient";
import { useSpace, SpaceProvider } from "@/spaceContext";

// Custom Drawer Icon Component
function DrawerIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginRight: 12 }} {...props} />;
}

// Create a custom header component
function SpaceNameHeader() {
  const { currentSpace, loading } = useSpace();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSpaceNamePress = () => {
    if (currentSpace) {
      setModalVisible(true);
    }
  };

  return (
    <>
      <Pressable
        onPress={handleSpaceNamePress}
        style={({ pressed }) => [
          styles.headerContainer,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={styles.headerText}>
          {loading ? "Loading..." : currentSpace?.name || "No Space Selected"}
        </Text>
        <FontAwesome
          name="caret-down"
          size={16}
          color="white"
          style={styles.caretIcon}
        />
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
              <Text style={styles.modalTitle}>{currentSpace?.name}</Text>

              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Space Code:</Text>
                <Text style={styles.codeValue}>{currentSpace?.code}</Text>
              </View>

              <Text style={styles.shareText}>
                Share this code with others to join this space
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export function LeftHeaderButton() {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  // Add this useEffect hook
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000); // Message will disappear after  seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [successMessage]);

  // Function to handle notification for silence
  const handleNotifyForSilence = () => {
    console.log("Notifying for silence...");
    setSuccessMessage("Notification was sent!");
    setIsModalVisible(false);
  };

  // Function to handle notification for visiting guests
  const handleNotifyForVisitors = () => {
    console.log("Notifying for visiting guests...");
    setSuccessMessage("Notification was sent!");
    setIsModalVisible(false);
  };

  // Function to handle custom notifications
  const handleCustomNotification = (message: string) => {
    console.log(`Sending custom notification: ${message}`);
    setSuccessMessage("Custom notification sent!");
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {successMessage && (
        <View style={styles.successBanner}>
          <TouchableOpacity onPress={() => setSuccessMessage("")}>
            <Text style={styles.successText}>{successMessage}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bell Icon to Open Modal */}
      <Pressable
        onPress={() => setIsModalVisible(true)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.6 : 1,
          marginLeft: 15,
        })}
      >
        <FontAwesome name="bell" size={24} color="white" />
      </Pressable>

      {/* OnDemandModal Component */}
      <OnDemandModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onNotifyForSilence={handleNotifyForSilence}
        onNotifyForVisitors={handleNotifyForVisitors}
        onCustomNotification={handleCustomNotification}
        customMessage={customMessage}
        onCustomMessageChange={setCustomMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    alignItems: "flex-start", // Keeps the bell icon aligned to the left
  },
  successBanner: {
    backgroundColor: "#d4edda",
    padding: 12,
    borderRadius: 8,
    position: "absolute",
    top: 50,
    left: "50%", // Move the left edge of the banner to the center of the screen
    transform: [{ translateX: -75 }], // Shift it left by half of its width (150px / 2)
    width: 150,
    alignItems: "center", // Ensures the text inside is centered
    justifyContent: "center", // Centers children vertically
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
  },
  successText: {
    color: "#155724",
    fontWeight: "bold",
    textAlign: "center", // Ensures text is centered inside the Text component
    width: "100%", // Ensures text block spans full width of parent for alignment
  },
  caretIcon: {
    marginLeft: 4,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalCard: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  codeContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginBottom: 15,
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "#2D2B2B",
  },
  shareText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2D2B2B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

// Drawer Layout Component
export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(true, true),
        headerStyle: { backgroundColor: "#2D2B2B" },
        headerTintColor: "white",
        headerTitle: () => <SpaceNameHeader />,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "white",
        },
        drawerStyle: {
          backgroundColor: "#f5f5f5",
          width: 250,
        },
        drawerLabelStyle: {
          fontSize: 16,
        },
        headerRight: () => (
          <View style={{ marginRight: 15 }}>
            <LeftHeaderButton />
          </View>
        ),
      }}
    >
      <Drawer.Screen
        name="shared-dashboard"
        options={{
          drawerLabel: "Dashboard",
          drawerIcon: ({ color }) => <DrawerIcon name="home" color={color} />,
        }}
      />

      <Drawer.Screen
        name="shared-task-list"
        options={{
          drawerLabel: "Tasks",
          drawerIcon: ({ color }) => <DrawerIcon name="tasks" color={color} />,
        }}
      />

      <Drawer.Screen
        name="shared-event-list"
        options={{
          drawerLabel: "Events",
          drawerIcon: ({ color }) => (
            <DrawerIcon name="beer" color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="money"
        options={{
          drawerLabel: "Money",
          drawerIcon: ({ color }) => (
            <DrawerIcon name="money" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="calendar-view"
        options={{
          drawerLabel: "Calendar",
          drawerIcon: ({ color }) => (
            <DrawerIcon name="calendar" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="create-space"
        options={{
          drawerLabel: "Create Space",
          drawerIcon: ({ color }) => (
            <DrawerIcon name="plus" color={color} />
          ),
        }}
      />

    </Drawer>
  );
}