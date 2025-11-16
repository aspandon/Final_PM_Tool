// js/config/actionPlanConstants.js

/**
 * Action Plan Constants
 * Modern status workflow and priority levels with dark mode support
 */

// Get status configurations based on dark mode
export function getStatuses(darkMode = false) {
  return {
    'not-started': {
      label: 'Not Started',
      icon: '○',
      color: 'slate',
      gradient: 'from-slate-400 to-slate-500',
      bg: darkMode ? 'bg-slate-500/20' : 'bg-slate-100',
      border: darkMode ? 'border-slate-400/50' : 'border-slate-300',
      text: darkMode ? 'text-slate-300' : 'text-slate-700',
      hover: darkMode ? 'hover:bg-slate-500/30' : 'hover:bg-slate-200'
    },
    'in-progress': {
      label: 'In Progress',
      icon: '▶',
      color: 'blue',
      gradient: 'from-blue-400 to-blue-600',
      bg: darkMode ? 'bg-blue-500/20' : 'bg-blue-100',
      border: darkMode ? 'border-blue-400/50' : 'border-blue-300',
      text: darkMode ? 'text-blue-300' : 'text-blue-700',
      hover: darkMode ? 'hover:bg-blue-500/30' : 'hover:bg-blue-200'
    },
    'blocked': {
      label: 'Blocked',
      icon: '⬛',
      color: 'red',
      gradient: 'from-red-400 to-red-600',
      bg: darkMode ? 'bg-red-500/20' : 'bg-red-100',
      border: darkMode ? 'border-red-400/50' : 'border-red-300',
      text: darkMode ? 'text-red-300' : 'text-red-700',
      hover: darkMode ? 'hover:bg-red-500/30' : 'hover:bg-red-200'
    },
    'completed': {
      label: 'Completed',
      icon: '✓',
      color: 'emerald',
      gradient: 'from-emerald-400 to-emerald-600',
      bg: darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100',
      border: darkMode ? 'border-emerald-400/50' : 'border-emerald-300',
      text: darkMode ? 'text-emerald-300' : 'text-emerald-700',
      hover: darkMode ? 'hover:bg-emerald-500/30' : 'hover:bg-emerald-200'
    }
  };
}

// Get priority configurations based on dark mode
export function getPriorities(darkMode = false) {
  return {
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
  };
}
