"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  plan: "basic" | "pro";
  isLoggedIn: boolean;
  subscription?: Subscription;
}

interface Subscription {
  id: string;
  user_id: string;
  tier: "basic" | "pro";
  status: "active" | "cancelled" | "expired" | "pending";
  started_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

interface PaymentData {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  upgradeToPro: (paymentData: PaymentData) => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("mero-pasal-user");
    console.log("UserContext: Loading saved user:", savedUser); // Debug log
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("UserContext: Parsed user:", parsedUser); // Debug log
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("mero-pasal-user");
      }
    }
    setIsLoading(false);
  }, []);

  // Save user data to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("mero-pasal-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("mero-pasal-user");
    }
  }, [user]);

  const login = (email: string, name?: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || email.split("@")[0],
      plan: "basic",
      isLoggedIn: true,
    };
    console.log("UserContext: Logging in user:", newUser); // Debug log
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const upgradeToPro = async (paymentData: PaymentData) => {
    if (!user) return;

    try {
      // Mock payment processing - simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create mock subscription
      const mockSubscription: Subscription = {
        id: "sub-" + Date.now(),
        user_id: user.id,
        tier: "pro",
        status: "active",
        started_at: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const updatedUser = {
        ...user,
        plan: "pro" as const,
        subscription: mockSubscription,
      };

      setUser(updatedUser);
      console.log("Successfully upgraded to Pro!");
    } catch (error) {
      console.error("Error upgrading to Pro:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{ user, login, logout, upgradeToPro, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
