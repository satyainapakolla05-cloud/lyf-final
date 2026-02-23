import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<any>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const vendorId = await AsyncStorage.getItem("vendorId");
      if (!vendorId) return;
      const res = await api.get(`/Orders/vendor/${vendorId}`);
      setOrders(res.data);
    } catch (err) {
      console.log("Order Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      // 1. Check if vendorId exists first
      const storedId = await AsyncStorage.getItem("vendorId");
      if (isOnline && storedId) {
        fetchOrders();
        intervalRef.current = setInterval(fetchOrders, 30000);
      }
    };

    loadDashboard();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOnline]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* MODERN HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isOnline ? "#4ade80" : "#f87171" },
              ]}
            />
            <Text style={styles.statusText}>
              {isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Accepting New Orders</Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: "#15803d", true: "#4ade80" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* BODY SECTION */}
      <View style={styles.body}>
        {!isOnline ? (
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>📴</Text>
            <Text style={styles.offText}>You are currently Offline</Text>
            <Text style={styles.offSubText}>
              Go online to start receiving new orders
            </Text>
          </View>
        ) : loading && orders.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#16a34a" />
            <Text style={styles.searchingText}>Searching for orders...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.searching}>Waiting for new orders...</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(i) => i.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.9} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.orderId}>Order #{item.id}</Text>
                  <View style={styles.statusChip}>
                    <Text style={styles.statusChipText}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBody}>
                  <View>
                    <Text style={styles.amountLabel}>Total Amount</Text>
                    <Text style={styles.amountValue}>₹{item.totalAmount}</Text>
                  </View>
                  <TouchableOpacity style={styles.detailBtn}>
                    <Text style={styles.detailBtnText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    backgroundColor: "#16a34a",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  toggleLabel: { color: "#dcfce7", fontSize: 16, fontWeight: "500" },
  body: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyIcon: { fontSize: 50, marginBottom: 15 },
  offText: { fontSize: 18, color: "#1f2937", fontWeight: "bold" },
  offSubText: { fontSize: 14, color: "#6b7280", marginTop: 5 },
  searchingText: { marginTop: 15, color: "#16a34a", fontWeight: "600" },
  searching: {
    fontSize: 16,
    color: "#16a34a",
    fontWeight: "600",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  statusChip: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusChipText: { color: "#16a34a", fontSize: 12, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 15 },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  amountLabel: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  amountValue: { fontSize: 22, fontWeight: "bold", color: "#16a34a" },
  detailBtn: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  detailBtnText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
});
