'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, User, BookOpen, Layers, Palette, ArrowRight, X, Sparkles } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent?: (usn: string) => void;
  onOpenCompare?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onSelectStudent,
  onOpenCompare
}: CommandPaletteProps) {
  const router = useRouter();
  const { currentTheme, setThemeId } = useTheme();

  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch search results dynamically when query length > 1
  useEffect(() => {
    if (!isOpen) return;

    setTimeout(() => inputRef.current?.focus(), 50);

    if (query.trim().length < 2) {
      setStudents([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/students/2024-2028/CS/1`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const q = query.toLowerCase();
            const filtered = data.filter((s: any) => {
              const name = (s.name || s.Name || '').toLowerCase();
              const usn = (s.usn || s.USN || '').toLowerCase();
              return name.includes(q) || usn.includes(q);
            }).slice(0, 8);
            setStudents(filtered);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }, 150);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Static Navigation Commands
  const navigationCommands: CommandItem[] = useMemo(() => [
    { id: 'home', title: 'Go to Batches Home', subtitle: 'Browse 2022-2026, 2023-2027, 2024-2028 & 2025-2029', icon: Layers, action: () => { onClose(); router.push('/'); } },
    { id: 'compare', title: 'Open Compare Students Dual', subtitle: 'Side-by-side USN performance duel', icon: Sparkles, action: () => { onClose(); onOpenCompare?.(); } },
    { id: 'theme-toggle', title: 'Switch Palette Theme', subtitle: `Current theme: ${currentTheme.name}`, icon: Palette, action: () => { onClose(); setThemeId(currentTheme.id === 'blue-eclipse' ? 'obsidian' : 'blue-eclipse'); } },
    { id: 'branch-cs', title: 'Navigate to Computer Science (CS)', subtitle: 'View CS cohort dashboard', icon: BookOpen, action: () => { onClose(); router.push('/2024-2028/CS/1'); } },
    { id: 'branch-is', title: 'Navigate to Information Science (IS)', subtitle: 'View IS cohort dashboard', icon: BookOpen, action: () => { onClose(); router.push('/2024-2028/IS/1'); } },
    { id: 'branch-ad', title: 'Navigate to AI & Data Science (AD)', subtitle: 'View AD cohort dashboard', icon: BookOpen, action: () => { onClose(); router.push('/2024-2028/AD/1'); } },
  ], [router, currentTheme, setThemeId, onClose, onOpenCompare]);

  // Combine Results for Keyboard Navigation
  const combinedResults: CommandItem[] = useMemo(() => {
    const studentCmds: CommandItem[] = students.map(s => ({
      id: `student-${s.usn || s.USN}`,
      title: `${s.name || s.Name} (${s.usn || s.USN})`,
      subtitle: `Section ${s.section || 'A'} • CGPA ${Number(s.cgpa || s.overallCgpa || 0).toFixed(2)}`,
      icon: User,
      action: () => {
        onClose();
        onSelectStudent?.(s.usn || s.USN);
      }
    }));

    if (query.trim().length > 0) {
      const filteredNav = navigationCommands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
      return [...studentCmds, ...filteredNav];
    }

    return [...navigationCommands];
  }, [students, query, navigationCommands, onClose, onSelectStudent]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (combinedResults.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + combinedResults.length) % (combinedResults.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (combinedResults[selectedIndex]) {
          combinedResults[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, combinedResults, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Command Palette Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-xl ui-card rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-500/20"
        >
          {/* Search Input Bar */}
          <div className="p-4 border-b border-slate-500/20 flex items-center gap-3">
            <Search className="w-5 h-5 theme-accent-text shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type student name, USN, branch, or action..."
              className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder:opacity-50"
            />
            {query ? (
              <button onClick={() => setQuery('')} className="opacity-60 hover:opacity-100 p-1">
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold rounded border border-slate-500/20 bg-slate-500/10 opacity-70">
                ESC
              </kbd>
            )}
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="py-8 text-center text-xs opacity-60 font-mono animate-pulse">
                Searching academic registry...
              </div>
            ) : combinedResults.length === 0 ? (
              <div className="py-8 text-center text-xs opacity-60 font-medium">
                No matching students or commands found for "{query}"
              </div>
            ) : (
              combinedResults.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={item.id + idx}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'theme-accent-bg text-white shadow-sm'
                        : 'hover:bg-slate-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-500/10 opacity-70'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{item.title}</div>
                        {item.subtitle && (
                          <div className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'opacity-60'}`}>
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts Hint */}
          <div className="px-4 py-2.5 bg-slate-500/10 border-t border-slate-500/20 flex items-center justify-between text-[11px] opacity-70 font-mono">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-500/20">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-500/20">↵</kbd> Select</span>
            </div>
            <div className="flex items-center gap-1 font-bold theme-accent-text">
              <Command className="w-3 h-3" /> GradePulse QuickNav
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
