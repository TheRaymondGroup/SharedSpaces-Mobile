import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/supabaseClient";
import Icon from 'react-native-vector-icons/Ionicons';

const developmentMode = false;

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    //form validation unless in dev mode
    if (developmentMode) {
      if (
        fullName.trim() === "" ||
        email.trim() === "" ||
        username.trim() === "" ||
        password.trim() === ""
      ) {
        Alert.alert("Error", "All fields are required.");
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert("Error", "Please enter a valid email address.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        Alert.alert("Error", "Password must be at least 8 characters long.");
        return;
      }
    }
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
      setIsLoading(false);
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>CREATE ACCOUNT</Text>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
          }}
          style={styles.avatar}
        />

        {/* Full Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Username Input */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        {/* Password Input with Eye Icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeIconButton}
          >
            <Icon
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input with Eye Icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#666"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword((prev) => !prev)}
            style={styles.eyeIconButton}
          >
            <Icon
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#34495e" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/sign-in")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#D6CCCC",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#D6CCCC",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    height: 40,
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: "transparent",
  },
  eyeIconButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e",
  },
  loginText: {
    marginTop: 20,
    color: "#555",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});