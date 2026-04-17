import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedMode = window.localStorage.getItem("themeMode");
    if (savedMode === "dark" || savedMode === "light") {
      setMode(savedMode);
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setMode(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", mode === "dark");
    window.localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
