"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { FIGMA_THEMES, FigmaTheme } from "@/lib/figmaThemes";

interface ThemeContextType {
  currentTheme: FigmaTheme;
  themeId: string;
  setThemeId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>("blue-eclipse");
  const [currentTheme, setCurrentTheme] = useState<FigmaTheme>(FIGMA_THEMES[2]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("gradepulse-figma-theme");
    const initialId = saved || "blue-eclipse";
    applyTheme(initialId);
  }, []);

  const applyTheme = (id: string) => {
    const targetTheme = FIGMA_THEMES.find(t => t.id === id) || FIGMA_THEMES[2];
    setThemeIdState(targetTheme.id);
    setCurrentTheme(targetTheme);
    localStorage.setItem("gradepulse-figma-theme", targetTheme.id);

    const root = document.documentElement;

    // Set exact theme CSS variables for canvas, cards, text, buttons & accents
    root.style.setProperty("--background", targetTheme.canvas);
    root.style.setProperty("--foreground", targetTheme.text);
    root.style.setProperty("--card-bg", targetTheme.cardBg);
    root.style.setProperty("--card-border", targetTheme.cardBorder);
    root.style.setProperty("--muted-fg", targetTheme.mutedText);
    root.style.setProperty("--color-primary", targetTheme.primary);
    root.style.setProperty("--color-accent", targetTheme.accent);

    // Apply direct body styles for absolute responsiveness
    if (document.body) {
      document.body.style.backgroundColor = targetTheme.canvas;
      document.body.style.color = targetTheme.text;
    }

    if (targetTheme.isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  const setThemeId = (id: string) => {
    applyTheme(id);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
