import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
 
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from '@react-native-firebase/auth';
const { width } = Dimensions.get("window");
export default function Login() {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const { setConfirmation } = useAuth();
  
  const sendOtp = async () => {
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    console.log("auth:",auth)
    try {
      const confirmation = await auth().signInWithPhoneNumber('+91' + phone);
      setConfirmation(confirmation);
      router.push("/auth/otp");
    } catch (e) {
      console.log(e);
      alert("OTP Failed! Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      {/* Green Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to LYF</Text>
        <Text style={styles.headerSubtitle}>Explore your Business with us</Text>
      </View>

      {/* Input Section */}
      <View style={styles.content}>
        <Text style={styles.inputLabel}>Mobile Number</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#9ca3af"
            maxLength={10}
            style={styles.textInput}
          />
        </View>
        <Text style={styles.infoText}>
          We will send a 6-digit OTP to your mobile number.
        </Text>

        <TouchableOpacity
          onPress={sendOtp}
          activeOpacity={0.8}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get OTP</Text>
        </TouchableOpacity>
      </View>

      {/* REGISTER LINK */}
      <View style={styles.registerContainer}>
        <Text style={styles.accountText}>New to Lyf Partner?</Text>
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.registerLink}> Register Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Lyf Vendor © 2026</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30, // Space from the login button
    alignItems: "center",
  },
  accountText: {
    color: "#6b7280", // Gray color
    fontSize: 15,
  },
  registerLink: {
    color: "#16a34a", // Your brand green
    fontSize: 15,
    fontWeight: "bold",
    textDecorationLine: "underline", // Optional: makes it look more like a link
  },
  header: {
    backgroundColor: "#16a34a",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#dcfce7",
    fontSize: 16,
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    paddingHorizontal: 15,
    backgroundColor: "#f9fafb",
    height: 60,
  },
  countryCode: {
    fontSize: 16,
    color: "#4b5563",
    fontWeight: "bold",
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    paddingRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: "#111827",
    fontWeight: "500",
  },
  infoText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 12,
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#16a34a",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    // Shadow for Android
    elevation: 6,
    // Shadow for iOS
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    paddingBottom: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#9ca3af",
    fontSize: 12,
    letterSpacing: 1,
  },
});
