import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coffee, Home, ShoppingBag, Car, Smartphone } from "lucide-react";

export type Transaction = {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  iconName: string;
  color: string;
  bg: string;
  isHidden?: boolean;
};

const initialTransactions: Transaction[] = [
  { id: 1, name: "Starbucks", category: "Food & Drink", amount: -5.40, date: "Today, 08:30 AM", iconName: "Coffee", color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 2, name: "Whole Foods", category: "Groceries", amount: -124.50, date: "Yesterday, 06:15 PM", iconName: "ShoppingBag", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 3, name: "Uber", category: "Transport", amount: -24.00, date: "Yesterday, 09:40 AM", iconName: "Car", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 4, name: "Rent", category: "Housing", amount: -1500.00, date: "Oct 1, 09:00 AM", iconName: "Home", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { id: 5, name: "Apple", category: "Tech", amount: -99.00, date: "Sep 28, 02:20 PM", iconName: "Smartphone", color: "text-pink-500", bg: "bg-pink-500/10" },
];

export const iconMap: Record<string, React.ElementType> = {
  Coffee,
  Home,
  ShoppingBag,
  Car,
  Smartphone,
};

type AppContextType = {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  isHiddenTransactionsEnabled: boolean;
  setIsHiddenTransactionsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  hiddenPasswordHash: string | null;
  setHiddenPasswordHash: React.Dispatch<React.SetStateAction<string | null>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isHiddenTransactionsEnabled, setIsHiddenTransactionsEnabled] = useState(false);
  const [hiddenPasswordHash, setHiddenPasswordHash] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{
      transactions,
      setTransactions,
      isHiddenTransactionsEnabled,
      setIsHiddenTransactionsEnabled,
      hiddenPasswordHash,
      setHiddenPasswordHash
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
