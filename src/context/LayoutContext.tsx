import React, { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
  headerSearchAlignX: number | null;
  setHeaderSearchAlignX: (x: number | null) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [headerSearchAlignX, setHeaderSearchAlignX] = useState<number | null>(
    null,
  );

  return (
    <LayoutContext.Provider
      value={{ headerSearchAlignX, setHeaderSearchAlignX }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
