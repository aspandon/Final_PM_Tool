// js/config/priorities.js

/**
 * Priority Configurations
 * Defines priority levels and their visual properties
 */

export const getPriorities = (darkMode) => ({
  'critical': {
    label: 'Critical',
    icon: '⚠',
    order: 4,
    gradient: 'from-red-500 to-rose-600',
    bg: darkMode ? 'bg-red-500/20' : 'bg-red-100',
    border: darkMode ? 'border-red-400/50' : 'border-red-300',
    text: darkMode ? 'text-red-300' : 'text-red-700',
    hover: darkMode ? 'hover:bg-red-500/30' : 'hover:bg-red-200'
  },
  'high': {
    label: 'High',
    icon: '▲',
    order: 3,
    gradient: 'from-orange-400 to-orange-600',
    bg: darkMode ? 'bg-orange-500/20' : 'bg-orange-100',
    border: darkMode ? 'border-orange-400/50' : 'border-orange-300',
    text: darkMode ? 'text-orange-300' : 'text-orange-700',
    hover: darkMode ? 'hover:bg-orange-500/30' : 'hover:bg-orange-200'
  },
  'medium': {
    label: 'Medium',
    icon: '●',
    order: 2,
    gradient: 'from-sky-400 to-sky-600',
    bg: darkMode ? 'bg-sky-500/20' : 'bg-sky-100',
    border: darkMode ? 'border-sky-400/50' : 'border-sky-300',
    text: darkMode ? 'text-sky-300' : 'text-sky-700',
    hover: darkMode ? 'hover:bg-sky-500/30' : 'hover:bg-sky-200'
  },
  'low': {
    label: 'Low',
    icon: '▼',
    order: 1,
    gradient: 'from-gray-400 to-gray-500',
    bg: darkMode ? 'bg-gray-500/20' : 'bg-gray-100',
    border: darkMode ? 'border-gray-400/50' : 'border-gray-300',
    text: darkMode ? 'text-gray-300' : 'text-gray-600',
    hover: darkMode ? 'hover:bg-gray-500/30' : 'hover:bg-gray-200'
  }
});
