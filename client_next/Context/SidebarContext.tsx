import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context state
interface SidebarContextType {
  active: boolean;
  setActive: (active: boolean) => void;
}

// Create the context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Create a provider component
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState(false);

  return (
    <SidebarContext.Provider value={{ active, setActive }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Create a hook to use the SidebarContext
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
