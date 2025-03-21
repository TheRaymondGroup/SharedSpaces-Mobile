import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

export default function CreateSpaceScreen() {
  const [spaceName, setSpaceName] = useState('');
  const [spaceCode, setSpaceCode] = useState('');

  const handleCreateSpace = () => {
    if (spaceName.trim() === '') {
      Alert.alert('Error', 'Please enter a space name.');
      return;
    }
    Alert.alert('Success', `Space "${spaceName}" created!`);
    setSpaceName('');
  };

  const handleJoinSpace = () => {
    if (spaceCode.trim() === '') {
      Alert.alert('Error', 'Please enter a space code.');
      return;
    }
    Alert.alert('Success', `Joined space with code "${spaceCode}"!`);
    setSpaceCode('');
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
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});