import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}></Stack>
    </AuthProvider>
  );
}
