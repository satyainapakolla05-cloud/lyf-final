import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get Product ID from URL
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Veggies");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [price500, setPrice500] = useState("");
  const [price1000, setPrice1000] = useState("");
  const [minPrice, setMinPrice] = useState("");

  const isWeightBased = category === "Veggies" || category === "Grocery";

  // FETCH EXISTING DATA
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await api.get(`/Product/single/${id}`);
        const p = res.data;
        setName(p.name);
        setDescription(p.description);
        setQuantity(p.quantity.toString());
        setCategory(p.category);
        if (p.category === "Veggies" || p.category === "Grocery") {
          setPrice500(p.price500?.toString());
          setPrice1000(p.price1000?.toString());
          setMinPrice(p.minPrice?.toString());
        } else {
          setPrice(p.price?.toString());
        }
      } catch (e) {
        Alert.alert("Error", "Could not load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const cleanImageName = name.toLowerCase().replace(/\s+/g, "") + ".jpeg";
      const updatedData = {
        id: id,
        name: name,
        description: description,
        quantity: quantity,
        category: category,
        imageUrl: cleanImageName,
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
      console.log("Updating with Data:", updatedData);
      await api.put(`/Product/update/${id}`, updatedData);
      Alert.alert("Success", "Product updated!");
      router.replace("/(tabs)/products");
    } catch (e) {
      Alert.alert("Error", "Update failed");
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#16a34a" style={{ flex: 1 }} />
    );

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
          <Text style={styles.headerTitle}>Edit Product</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Total Quantity</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
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
                  value={price500}
                  onChangeText={setPrice500}
                />
                <Text style={styles.label}>Price for 1kg</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={price1000}
                  onChangeText={setPrice1000}
                />
                <Text style={styles.label}>Min Price</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
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
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={styles.updateText}>Update Product</Text>
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
  },
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
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
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
  updateBtn: {
    backgroundColor: "#16a34a",
    padding: 20,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 40,
  },
  updateText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
