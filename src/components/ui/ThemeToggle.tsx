"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { FIGMA_THEMES, THEME_CATEGORIES } from "@/lib/figmaThemes";
import { Palette, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { currentTheme, themeId, setThemeId } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("2026 Modern");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const filteredThemes = FIGMA_THEMES.filter(t => t.category === selectedCategory);

  return (
    <div className="relative" ref={modalRef}>
      {/* Header Palette Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border theme-accent-border ui-card hover:opacity-90 transition-all text-xs font-extrabold shadow-sm cursor-pointer"
        aria-label="Open Figma Color Palette Library"
      >
        <Palette className="w-4 h-4 theme-accent-text animate-pulse" />
        <span className="font-mono">{currentTheme.name}</span>
        <span 
          className="w-3 h-3 rounded-full border border-white/40 shadow-sm shrink-0" 
          style={{ backgroundColor: currentTheme.primary }} 
        />
      </button>

      {/* Figma 100 Themes Dropdown Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 ui-card border theme-accent-border rounded-3xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-500/20 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg theme-accent-bg text-white flex items-center justify-center shadow-sm">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black font-display uppercase tracking-wider">
                    Figma Color Combinations Library
                  </h4>
                  <span className="text-[10px] opacity-70 font-mono">100 Palettes categorized by mood</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg opacity-70 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none text-[11px] font-bold">
              {THEME_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "theme-accent-bg text-white shadow-md font-extrabold"
                      : "ui-card opacity-75 hover:opacity-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Theme Swatches List */}
            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredThemes.map((theme) => {
                const isSelected = themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setThemeId(theme.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? "theme-accent-border theme-accent-bg text-white font-extrabold shadow-sm"
                        : "border-slate-500/20 ui-card opacity-80 hover:opacity-100 hover:theme-accent-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color Swatch Preview Pill */}
                      <div className="flex items-center -space-x-1 shrink-0">
                        <span 
                          className="w-4 h-4 rounded-full border border-white/40 shadow-sm" 
                          style={{ backgroundColor: theme.canvas }} 
                        />
                        <span 
                          className="w-4 h-4 rounded-full border border-white/40 shadow-sm" 
                          style={{ backgroundColor: theme.primary }} 
                        />
                        <span 
                          className="w-4 h-4 rounded-full border border-white/40 shadow-sm" 
                          style={{ backgroundColor: theme.accent }} 
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold">
                          {theme.name}
                        </div>
                        <div className="text-[10px] font-mono opacity-70">
                          Canvas: {theme.canvas} &bull; Accent: {theme.primary}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-white text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-3.5 h-3.5 font-extrabold" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
