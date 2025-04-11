import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/supabaseClient";
import Icon from 'react-native-vector-icons/Ionicons';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setLoginError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoginError("Wrong email or password.");
    } else {
      setLoginError("");
      router.replace("/shared-dashboard");
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGN IN</Text>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
        }}
        style={styles.avatar}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (loginError) setLoginError("");
        }}
        autoCapitalize="none"
      />

      {/* Password Input with properly aligned eye icon */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (loginError) setLoginError("");
          }}
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

      {/* Error Message */}
      {loginError !== "" && (
        <Text style={{ color: "red", marginBottom: 10 }}>{loginError}</Text>
      )}

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#34495e" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      {/* Sign Up Prompt */}
      <Text style={styles.signupText}>Don't have an account?</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/sign-up")}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#D6CCCC",
    alignItems: "center",
    justifyContent: "center",
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
  signupText: {
    marginTop: 20,
    color: "#555",
    fontSize: 14,
  },
  createButton: {
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