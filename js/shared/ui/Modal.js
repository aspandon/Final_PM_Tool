// js/shared/ui/Modal.js

/**
 * Modal Component
 * Reusable modal dialog
 */

import { X } from '../icons/index.js';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  darkMode = false,
  size = 'md', // sm, md, lg, xl
  showCloseButton = true
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return React.createElement('div', {
    className: 'fixed inset-0 z-50 overflow-y-auto',
    onClick: onClose
  },
    // Backdrop
    React.createElement('div', {
      className: 'fixed inset-0 bg-black bg-opacity-50 transition-opacity'
    }),

    // Modal Container
    React.createElement('div', {
      className: 'flex min-h-full items-center justify-center p-4'
    },
      // Modal Content
      React.createElement('div', {
        className: `relative ${sizeClasses[size]} w-full ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border`,
        onClick: (e) => e.stopPropagation()
      },
        // Header
        React.createElement('div', {
          className: `flex items-center justify-between p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
        },
          React.createElement('h2', {
            className: `text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
          }, title),

          showCloseButton && React.createElement('button', {
            onClick: onClose,
            className: `p-1 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`
          },
            React.createElement(X, { className: 'w-5 h-5' })
          )
        ),

        // Body
        React.createElement('div', {
          className: 'p-6'
        }, children)
      )
    )
  );
}
