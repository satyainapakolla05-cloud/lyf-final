import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function AddProduct() {
  const router = useRouter();
  const [category, setCategory] = useState("Veggies");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const [price, setPrice] = useState("");
  const [price500, setPrice500] = useState("");
  const [price1000, setPrice1000] = useState("");
  const [minPrice, setMinPrice] = useState("");

  const isWeightBased = category === "Veggies" || category === "Grocery";

  const handleSave = async () => {
    if (!name || !quantity) {
      Alert.alert("Error", "Please fill in the product name and quantity.");
      return;
    }

    try {
      const vendorId = await AsyncStorage.getItem("vendorId");

      // LOGIC: Create a clean filename (e.g., "Fresh Tomato" -> "freshtomato.jpeg")
      const cleanImageName = name.toLowerCase().replace(/\s+/g, "") + ".jpeg";

      const productData = {
        vendorId: vendorId,
        name: name,
        description: description,
        quantity: quantity,
        category: category,
        imageUrl: cleanImageName, // Code-level imageUrl
        ...(isWeightBased
          ? {
              price500: parseFloat(price500),
              price1000: parseFloat(price1000),
              minPrice: parseFloat(minPrice),
            }
          : {
              price: parseFloat(price),
            }),
      };

      console.log("Sending Data:", productData);

      // Replace with your actual API endpoint
      await api.post(`/Product/add`, productData);
      alert("Product added successfully!");
      setName("");
      setDescription("");
      setQuantity("");
      setPrice("");
      setPrice500("");
      setPrice1000("");
      setMinPrice("");
      setCategory("Veggies");
      router.replace("/(tabs)/products");
    } catch (e) {
      console.log("Save Error:", e);
      Alert.alert("Error", "Could not save product.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/products")}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Product</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            placeholder="e.g. Red Onions"
            onChangeText={setName}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your product..."
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Total Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 100"
            value={quantity}
            keyboardType="numeric"
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryRow}>
            {["Veggies", "Grocery", "Other"].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, category === cat && styles.catBtnActive]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.catText,
                    category === cat && styles.catTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.priceContainer}>
            {isWeightBased ? (
              <View>
                <Text style={styles.label}>Price for 500g</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="₹ 0.00"
                  value={price500}
                  onChangeText={setPrice500}
                />

                <Text style={styles.label}>Price for 1kg</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="₹ 0.00"
                  value={price1000}
                  onChangeText={setPrice1000}
                />

                <Text style={styles.label}>Min Price (Display)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="₹ 0.00"
                  value={minPrice}
                  onChangeText={setMinPrice}
                />
              </View>
            ) : (
              <View>
                <Text style={styles.label}>Standard Price</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="₹ 0.00"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Confirm & Save</Text>
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
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 15,
  },
  form: { padding: 25, paddingBottom: 50 },
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
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: "#1e293b",
  },
  textArea: { height: 100, paddingTop: 15 },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  catBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  catBtnActive: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  catText: { color: "#64748b", fontWeight: "bold" },
  catTextActive: { color: "#fff" },
  priceContainer: {
    backgroundColor: "#f1f5f9",
    padding: 20,
    borderRadius: 20,
    marginTop: 25,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
  },
  saveBtn: {
    backgroundColor: "#16a34a",
    padding: 20,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 40,
    elevation: 4,
    shadowColor: "#16a34a",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
