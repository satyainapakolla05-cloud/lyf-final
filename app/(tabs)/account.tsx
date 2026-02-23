import { auth } from "@/services/firebase"; // Adjust based on your file path
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Account() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("vendorId");
      await auth.signOut();
      router.replace("/auth/login");
    } catch (e) {
      console.log("Logout Error:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* PROFILE HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIconBtn}>
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.vendorName}>Vendor Partner</Text>
        <Text style={styles.vendorPhone}>+91 9876543210</Text>
      </View>

      {/* MENU OPTIONS */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>General Settings</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={[styles.iconBox, { backgroundColor: "#f0fdf4" }]}>
              <Ionicons name="person" size={22} color="#16a34a" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={[styles.iconBox, { backgroundColor: "#eff6ff" }]}>
              <Ionicons name="notifications" size={22} color="#3b82f6" />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={[styles.iconBox, { backgroundColor: "#fff7ed" }]}>
              <Ionicons name="help-circle" size={22} color="#f97316" />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out" size={22} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>Lyf Vendor App • v1.0.2</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    backgroundColor: "#16a34a",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
  },
  editIconBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#111827",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  vendorName: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  vendorPhone: { color: "#dcfce7", fontSize: 16, marginTop: 4 },
  menuContainer: { flex: 1, paddingHorizontal: 25, marginTop: -30 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 15,
    marginLeft: 5,
  },
  menuItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    padding: 18,
    backgroundColor: "#fee2e2",
    borderRadius: 18,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  versionText: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 20,
  },
});
