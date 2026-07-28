"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { FIGMA_THEMES, THEME_CATEGORIES, FigmaTheme } from "@/lib/figmaThemes";
import { Palette, Check, Sparkles, SlidersHorizontal, X } from "lucide-react";
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
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-all text-xs font-extrabold shadow-sm cursor-pointer"
        aria-label="Open Figma Color Palette Library"
      >
        <Palette className="w-4 h-4 text-indigo-500 animate-pulse" />
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
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black font-display uppercase tracking-wider text-slate-900 dark:text-white">
                    Figma Color Combinations Library
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">100 Palettes categorized by mood</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
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
                      ? "bg-indigo-600 text-white shadow-md font-extrabold"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
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
                        ? "border-indigo-500 bg-indigo-500/10 text-slate-900 dark:text-white font-extrabold shadow-sm"
                        : "border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-indigo-500/50"
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
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {theme.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Canvas: {theme.canvas} &bull; Accent: {theme.primary}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
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
