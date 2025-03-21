import React, { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Drawer } from 'expo-router/drawer';
import { Modal, Pressable, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useNavigation } from 'expo-router';
import OnDemandModal from '@/components/OnDemandModal';

// Custom Drawer Icon Component
function DrawerIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string; }) {
  return <FontAwesome size={24} style={{ marginRight: 12 }} {...props} />;
}

// Custom Header with Title
function CustomHeader(title: string) {
  return () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
    </View>
  );
}

export default function LeftHeaderButton() {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  // Add this useEffect hook
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 2000); // Message will disappear after  seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [successMessage]);

  // Function to handle notification for silence
  const handleNotifyForSilence = () => {
    console.log('Notifying for silence...');
    setSuccessMessage('Notification was sent!');
    setIsModalVisible(false);
  };

  // Function to handle notification for visiting guests
  const handleNotifyForVisitors = () => {
    console.log('Notifying for visiting guests...');
    setSuccessMessage('Notification was sent!');
    setIsModalVisible(false);
  };

  // Function to handle custom notifications
  const handleCustomNotification = (message: string) => {
    console.log(`Sending custom notification: ${message}`);
    setSuccessMessage('Custom notification sent!');
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {successMessage && (
        <View style={styles.successBanner}>
          <TouchableOpacity onPress={() => setSuccessMessage('')}>
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
    position: 'relative',
    width: '100%',
    alignItems: 'flex-start', // Keeps the bell icon aligned to the left
  },
  successBanner: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
    position: 'absolute',
    top: 50,
    left: '50%', // Move the left edge of the banner to the center of the screen
    transform: [{ translateX: -75 }], // Shift it left by half of its width (150px / 2)
    width: 150,
    alignItems: 'center', // Ensures the text inside is centered
    justifyContent: 'center', // Centers children vertically
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
  },  
  successText: {
    color: '#155724',
    fontWeight: 'bold',
    textAlign: 'center', // Ensures text is centered inside the Text component
    width: '100%', // Ensures text block spans full width of parent for alignment
  },
});



// Drawer Layout Component
export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(true, true),
        headerStyle: { backgroundColor: '#2D2B2B' },
        headerTintColor: 'white',
        headerTitle: "Space Name",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold",
          color: 'white',
        },
        drawerStyle: {
          backgroundColor: '#f5f5f5',
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
          drawerIcon: ({ color }) => <DrawerIcon name="calendar" color={color} />,
        }}
      />
    </Drawer>
  );
}