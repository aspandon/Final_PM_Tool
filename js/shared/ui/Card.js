// js/shared/ui/Card.js

/**
 * Card Component
 * Reusable card container
 */

export function Card({
  children,
  title,
  subtitle,
  darkMode = false,
  className = '',
  padding = true,
  ...props
}) {
  const baseClasses = `rounded-lg border ${
    darkMode
      ? 'glass-dark border-animated-dark'
      : 'glass border-animated'
  }`;

  return React.createElement('div', {
    className: `${baseClasses} ${className}`,
    ...props
  },
    (title || subtitle) && React.createElement('div', {
      className: `${padding ? 'px-6 py-4' : 'p-0'} border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
    },
      title && React.createElement('h3', {
        className: `text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, title),
      subtitle && React.createElement('p', {
        className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${title ? 'mt-1' : ''}`
      }, subtitle)
    ),

    React.createElement('div', {
      className: padding ? 'p-6' : 'p-0'
    }, children)
  );
}
