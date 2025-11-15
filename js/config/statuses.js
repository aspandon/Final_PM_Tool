// js/config/statuses.js

/**
 * Status Configurations
 * Defines all status types and their visual properties
 */

export const getStatuses = (darkMode) => ({
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
});
