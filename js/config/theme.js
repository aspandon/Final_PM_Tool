// js/config/theme.js

/**
 * Theme Configuration
 * Color palettes and theme-related constants
 */

export const colors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
];

export const divisionColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
];

/**
 * Get theme-aware class names
 */
export const getThemeClasses = (darkMode) => ({
  glass: darkMode ? 'glass-dark border-animated-dark' : 'glass border-animated',
  text: {
    primary: darkMode ? 'text-gray-100' : 'text-gray-800',
    secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    muted: darkMode ? 'text-gray-400' : 'text-gray-500'
  },
  bg: {
    primary: darkMode ? 'bg-slate-800' : 'bg-white',
    secondary: darkMode ? 'bg-slate-700' : 'bg-gray-50',
    hover: darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'
  },
  border: darkMode ? 'border-slate-700' : 'border-gray-200'
});
