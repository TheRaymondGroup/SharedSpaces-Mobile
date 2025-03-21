import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Drawer } from 'expo-router/drawer';
import { Modal, Pressable, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useNavigation } from 'expo-router';



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

// Custom Left Header Button
function LeftHeaderButton() {
  const navigation = useNavigation();
  
  return (
    <Pressable
      onPress={() => {
        alert('Opens a modal with options for On-Demand notifications')
      }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        marginLeft: 15,
      })}
    >
      <FontAwesome name="bell" size={24} color="white" />
    </Pressable>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(true, true), // Ensures header is visible
        headerStyle: { backgroundColor: '#2D2B2B' }, // Dark header background
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
      {/* Shared Dashboard Screen */}
      <Drawer.Screen
        name="shared-dashboard" // The file in your (tabs) folder
        options={{
          drawerLabel: "Dashboard",
          drawerIcon: ({ color }) => <DrawerIcon name="home" color={color} />,
        }}
      />

      {/* Shared Task List Screen */}
      <Drawer.Screen
        name="shared-task-list" // The file in your (tabs) folder
        options={{
          drawerLabel: "Tasks",
          drawerIcon: ({ color }) => <DrawerIcon name="tasks" color={color} />,
        }}
      />

      {/* Shared Event List Screen */}
      <Drawer.Screen
        name="shared-event-list" // The file in your (tabs) folder
        options={{
          drawerLabel: "Events",
          drawerIcon: ({ color }) => <DrawerIcon name="calendar" color={color} />,
        }}
      />
    </Drawer>
  );
}