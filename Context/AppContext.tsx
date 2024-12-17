import React, { createContext, useContext, useMemo, useState } from "react";

interface AppContextType {
  messageModal: { message: string; display: boolean } | null;
  setModalMessage: (message: string) => void;
  resetModalMessage: () => void;
}
const defaultContextValue: AppContextType = {
  messageModal: null,
  setModalMessage: () => {}, // Placeholder function to satisfy TypeScript
  resetModalMessage: () => {},
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const AppProvider = ({ children }: any) => {
  const [messageModal, setMessageModal] = useState<{
    message: string;
    display: boolean;
  } | null>(null);
  const resetModalMessage = () => {
    setMessageModal({ message: "", display: false });
  };

  const setModalMessage = (message: string) => {
    setMessageModal({ message, display: true });
  };

  const value = useMemo(
    () => ({ messageModal, setModalMessage, resetModalMessage }),
    [messageModal, setModalMessage, resetModalMessage]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for consuming the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
