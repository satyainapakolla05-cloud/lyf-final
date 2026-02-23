import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Otp() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const { confirmation } = useAuth();
  const verifyOtp = async () => {
    try {
      const result = await confirmation.confirm(code);

      // 1. Capture details from Firebase result
      const firebasePhoneNumber = result.user.phoneNumber;
      const firebaseUid = result.user.uid;

      // 2. Call your new .NET API
      const response = await api.post(`/Vendors/link-uid`, {
        phoneNumber: firebasePhoneNumber,
        firebaseUid: firebaseUid,
      });

      // 3. Capture the Integer ID (1) and save it
      const dbId = response.data.vendorId.toString();
      await AsyncStorage.setItem("vendorId", dbId);

      // 4. Move to Dashboard
      router.replace("/dashboard");
    } catch (e) {
      console.log("Link Error:", e);
      alert("Could not link account. Check backend connection.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Verify OTP</Text>
        </View>

        {/* Form Section */}
        <View style={styles.content}>
          <Text style={styles.inputLabel}>Enter 6-Digit Code</Text>

          <View style={styles.inputContainer}>
            <TextInput
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholder="0 0 0 0 0 0"
              placeholderTextColor="#9ca3af"
              maxLength={6}
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity
            onPress={verifyOtp}
            activeOpacity={0.8}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Verify & Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/auth/login")}
            style={styles.resendContainer}
          >
            <Text style={styles.resendText}>
              Wrong Number? <Text style={styles.resendLink}>Edit Number</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Lyf Vendor © 2026</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  },
  headerSubtitle: {
    color: "#dcfce7",
    fontSize: 15,
    marginTop: 10,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },
  inputContainer: {
    backgroundColor: "#f9fafb",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    fontSize: 24,
    color: "#111827",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "#16a34a",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
    elevation: 6,
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
  resendContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  resendText: {
    color: "#6b7280",
    fontSize: 14,
  },
  resendLink: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  footer: {
    paddingBottom: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#9ca3af",
    fontSize: 12,
  },
});
