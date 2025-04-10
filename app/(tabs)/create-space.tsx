import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/supabaseClient";
import { useSpace } from "@/spaceContext";

export default function CreateSpaceScreen() {
  const [spaceName, setSpaceName] = useState("");
  const [spaceCode, setSpaceCode] = useState("");
  const { refreshSpace } = useSpace();

  const handleCreateSpace = async () => {
    if (spaceName.trim() === "") {
      Alert.alert("Error", "Please enter a space name.");
      return;
    }

    const { data, error } = await supabase.rpc("create_space", {
      space_name: spaceName,
    });
    if (error) throw error;

    refreshSpace();
    setSpaceName("");
    router.push("/shared-dashboard");
  };

  const handleJoinSpace = async () => {
    if (spaceCode.trim() === "") {
      Alert.alert("Error", "Please enter a space code.");
      return;
    }
    const { data, error } = await supabase.rpc("join_space_by_code", {
      join_code: spaceCode,
    });

    Alert.alert("data" + data + (error ? "error" + error.message : ""));

    if (error) throw error;

    refreshSpace();
    setSpaceCode("");
    router.push("/shared-dashboard");
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