import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const fetchProducts = async () => {
    setRefreshing(true);
    try {
      const loadProducts = async () => {
        const vendorId = await AsyncStorage.getItem("vendorId");
        if (!vendorId) return;
        const res = await api.get(`/Product/${vendorId}`);
        setProducts(res.data);
      };
      await loadProducts();
    } finally {
      setRefreshing(false);
    }
  };
  const filteredProducts = products.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Logic to add product (Trigger this after your Add Product Modal/Page finishes)
  const handleAddProductSuccess = (newProduct: any) => {
    // Spread operator to put the new product at the TOP (index 0)
    setProducts([newProduct, ...products]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header with Large Refresh Icon */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Inventory</Text>
          <TouchableOpacity onPress={fetchProducts} style={styles.refreshBtn}>
            <Ionicons name="refresh-circle" size={35} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <Ionicons
            name="search"
            size={20}
            color="#9ca3af"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchProducts}
              colors={["#16a34a"]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.cardInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.category}>{item.category}</Text>

                <View style={styles.priceRow}>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>500g: ₹{item.price500}</Text>
                  </View>
                  <View style={[styles.priceTag, { marginLeft: 10 }]}>
                    <Text style={styles.priceText}>1kg: ₹{item.price1000}</Text>
                  </View>
                </View>

                <View style={styles.stockRow}>
                  <Text style={styles.stockLabel}>Stock: </Text>
                  <Text
                    style={[
                      styles.stockValue,
                      { color: item.stock < 10 ? "#ef4444" : "#16a34a" },
                    ]}
                  >
                    {item.stock} units
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  router.push({
                    pathname: "/edit-product",
                    params: { id: item.id },
                  })
                }
              >
                <Ionicons name="pencil" size={18} color="#fff" />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Floating Add Product Button */}
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => router.replace("/add-product")}
        >
          <Ionicons name="add" size={30} color="#fff" />
          <Text style={styles.floatingBtnText}>Add New Product</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#16a34a",
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  refreshBtn: { padding: 5 },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 15,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 16 },
  productCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardInfo: { flex: 1 },
  productName: { fontSize: 19, fontWeight: "bold", color: "#1f2937" },
  category: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  priceRow: { flexDirection: "row", marginBottom: 10 },
  priceTag: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: { color: "#16a34a", fontWeight: "bold", fontSize: 13 },
  stockRow: { flexDirection: "row", alignItems: "center" },
  stockLabel: { fontSize: 14, color: "#6b7280" },
  stockValue: { fontSize: 14, fontWeight: "bold" },
  editBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  editBtnText: { color: "#fff", fontWeight: "bold", marginLeft: 5 },
  floatingBtn: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
  },
  floatingBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
