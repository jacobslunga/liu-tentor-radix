import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export type FontSize = "compact" | "regular" | "sparse";

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  getFontSizeClasses: () => string;
  getTablePaddingClasses: () => string;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fontSize, setFontSizeState] = useState<FontSize>("compact");

  // Load font size from cookie on mount
  useEffect(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent === "true") {
      const savedFontSize = Cookies.get("fontSize") as FontSize;
      if (
        savedFontSize &&
        ["compact", "regular", "sparse"].includes(savedFontSize)
      ) {
        setFontSizeState(savedFontSize);
      }
    }
  }, []);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent === "true") {
      Cookies.set("fontSize", size, {
        secure: true,
        sameSite: "Lax",
        expires: 365 * 100,
        domain:
          window.location.hostname === "liutentor.se"
            ? ".liutentor.se"
            : undefined,
      });
    }
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case "compact":
        return "text-xs leading-tight";
      case "sparse":
        return "text-base leading-relaxed";
      default: // regular
        return "text-sm leading-normal";
    }
  };

  const getTablePaddingClasses = () => {
    switch (fontSize) {
      case "compact":
        return "py-2";
      case "sparse":
        return "py-6";
      default: // regular
        return "py-4";
    }
  };

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        setFontSize,
        getFontSizeClasses,
        getTablePaddingClasses,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
};
