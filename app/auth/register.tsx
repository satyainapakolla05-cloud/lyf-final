import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const router = useRouter();

  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [businessType, setBusinessType] = useState("Grocery");
  const [otherBusinessType, setOtherBusinessType] = useState(""); // State for "Others"
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    // Determine the final business type to send to DB
    const finalBusinessType =
      businessType === "Others" ? otherBusinessType : businessType;

    if (
      !shopName ||
      !ownerName ||
      !address ||
      !phone ||
      (businessType === "Others" && !otherBusinessType)
    ) {
      Alert.alert("Required Fields", "Please fill in all mandatory details.");
      return;
    }

    try {
      const vendorData = {
        shopName: shopName,
        ownerName: ownerName,
        shopImageUrl: shopName.toLowerCase().replace(/\s+/g, "") + ".jpeg", // e.g. "Satya Traders" -> "satyatraders.jpeg"
        businessType: finalBusinessType,
        address: address,
        mobile: phone,
        isVerified: false,
      };

      console.log("Registering:", vendorData);
      await api.post(`/Vendors/register`, vendorData);
      Alert.alert(
        "Success",
        "Registration successful! Our team will contact you.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }],
      );
    } catch (e) {
      Alert.alert("Error", "Submission failed.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* GREEN HEADER - MATCHES PRODUCTS/DASHBOARD */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join as a Partner</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Shop Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Satya Traders"
            onChangeText={setShopName}
          />

          <Text style={styles.label}>Owner Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            onChangeText={setOwnerName}
          />

          {/* Business Type Chips */}
          <Text style={styles.label}>Business Type *</Text>
          <View style={styles.typeRow}>
            {["Grocery", "Veggies", "Meat", "Others"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeBtn,
                  businessType === type && styles.typeBtnActive,
                ]}
                onPress={() => setBusinessType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    businessType === type && styles.typeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DYNAMIC "OTHERS" INPUT */}
          {businessType === "Others" && (
            <View style={styles.othersContainer}>
              <Text style={styles.label}>Specify Business Type *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bakery or Stationery"
                onChangeText={setOtherBusinessType}
                autoFocus={true}
              />
            </View>
          )}

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="+91"
            keyboardType="phone-pad"
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Email Address (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="mail@example.com"
            keyboardType="email-address"
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Full Address *</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Complete address with landmark"
            multiline
            onChangeText={setAddress}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Registration</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    backgroundColor: "#16a34a",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  backBtn: { padding: 5 },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 15,
  },
  form: { padding: 25 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 8,
    marginTop: 18,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
  },
  addressInput: { height: 80, textAlignVertical: "top" },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 5 },
  typeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  typeBtnActive: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  typeText: { color: "#64748b", fontWeight: "bold" },
  typeTextActive: { color: "#fff" },
  othersContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f0fdf4",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  submitBtn: {
    backgroundColor: "#16a34a",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 35,
    elevation: 4,
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
