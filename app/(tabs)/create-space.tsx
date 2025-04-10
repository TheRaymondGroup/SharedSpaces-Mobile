import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/supabaseClient";
import { useSpace } from "@/spaceContext";

export default function CreateSpaceScreen() {
  const [spaceName, setSpaceName] = useState("");
  const [spaceCode, setSpaceCode] = useState("");
  const { refreshSpace } = useSpace();

  // Function to create a space using Supabase RPC
  const handleCreateSpace = async () => {
    if (spaceName.trim() === "") {
      Alert.alert("Error", "Please enter a space name.");
      return;
    }
    try {
      const { data, error } = await supabase.rpc("create_space", {
        space_name: spaceName,
      });
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
      // Optionally refresh your space information by uncommenting the line below
      // refreshSpace();
      Alert.alert("Success", `Space "${spaceName}" created!`);
      setSpaceName("");
      router.push("/shared-dashboard");
    } catch (error) {
      console.error("Error creating space:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  // Function to join a space using Supabase RPC
  const handleJoinSpace = async () => {
    if (spaceCode.trim() === "") {
      Alert.alert("Error", "Please enter a space code.");
      return;
    }
    try {
      const { data, error } = await supabase.rpc("join_space_by_code", {
        join_code: spaceCode,
      });
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
      // Optionally refresh your space information by uncommenting the line below
      // refreshSpace();
      Alert.alert("Success", `Joined space with code "${spaceCode}"!`);
      setSpaceCode("");
      router.push("/shared-dashboard");
    } catch (error) {
      console.error("Error joining space:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create or Join a Space</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Space Name"
          value={spaceName}
          onChangeText={setSpaceName}
        />
        <Button title="Create" onPress={handleCreateSpace} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Code"
          value={spaceCode}
          onChangeText={setSpaceCode}
        />
        <Button title="Join" onPress={handleJoinSpace} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});
