// js/components/Header.js

/**
 * Header Component
 * Displays the app title and logo
 */

export function Header({ darkMode }) {
  // Icon component
  const BarChart3 = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M3 3v18h18' }),
    React.createElement('path', { d: 'M18 17V9' }),
    React.createElement('path', { d: 'M13 17V5' }),
    React.createElement('path', { d: 'M8 17v-3' })
  );

  return React.createElement('div', {
    className: 'flex items-center justify-center mb-3'
  },
    // Logo and Title
    React.createElement('div', {
      className: 'flex items-center gap-3'
    },
      React.createElement('div', {
        className: 'p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg'
      },
        React.createElement(BarChart3, { className: 'w-7 h-7 text-white' })
      ),
      React.createElement('div', null,
        React.createElement('h1', {
          className: `text-3xl font-bold ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'}`
        }, 'Digital Development Project Management'),
        React.createElement('p', {
          className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`
        }, 'Project planning and resource management • Version 1.1')
      )
    )
  );
}