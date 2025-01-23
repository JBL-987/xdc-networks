"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useMagic } from "@/context/MagicProvider";
import { useUser } from "@/context/UserContext";

interface AuthContextType {
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { magic } = useMagic();
  const { fetchUser } = useUser();

  const handleConnect = async () => {
    try {
      await magic?.wallet.connectWithUI();
      await fetchUser();
    } catch (error) {
      console.error("handleConnect:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await magic?.user.logout();
      await fetchUser();
      setIsLoading(false);
    } catch (error) {
      console.log("handleDisconnect:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ handleConnect, handleDisconnect, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
