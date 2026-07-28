'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface NavbarProps {
  breadcrumbs?: BreadcrumbItem[];
}

export default function Navbar({ breadcrumbs = [] }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </motion.div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Grade<span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
              </span>
            </Link>
          </div>

          {/* Breadcrumbs (Middle) */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            {breadcrumbs.length > 0 && (
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {breadcrumbs.map((item, index) => (
                    <li key={item.href}>
                      <div className="flex items-center">
                        {index > 0 && (
                          <svg className="flex-shrink-0 h-5 w-5 text-slate-400 dark:text-slate-500 mx-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                          </svg>
                        )}
                        <Link
                          href={item.href}
                          className={`text-sm font-medium ${
                            index === breadcrumbs.length - 1
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                          }`}
                          aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                        >
                          {item.label}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>

          {/* Right Section (Theme Toggle) */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>

        </div>
      </div>
    </header>
  );
}
