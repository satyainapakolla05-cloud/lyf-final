import React, { createContext, useContext, useState } from "react";

/* ---------------- TYPES ---------------- */

type Vendor = {
  id: number;
  name?: string;
  mobile: string;
};

type VendorContextType = {
  vendor: Vendor | null;
  setVendor: (v: Vendor | null) => void;
  logout: () => void;
};

/* ---------------- CONTEXT ---------------- */

const VendorAuthContext = createContext<VendorContextType | null>(null);

/* ---------------- PROVIDER ---------------- */

export function VendorAuthProvider({ children }: any) {
  const [vendor, setVendor] = useState<Vendor | null>(null);

  const logout = () => {
    setVendor(null);
  };

  return (
    <VendorAuthContext.Provider value={{ vendor, setVendor, logout }}>
      {children}
    </VendorAuthContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export const useVendorAuth = () => {
  const ctx = useContext(VendorAuthContext);

  if (!ctx) {
    throw new Error("useVendorAuth must be used inside VendorAuthProvider");
  }

  return ctx;
};
