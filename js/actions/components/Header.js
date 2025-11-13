// js/actions/components/Header.js

/**
 * Header Component for Actions App
 * Displays the app title and logo
 */

export function Header({ darkMode }) {
  // Icon component
  const CheckSquare = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M9 11l3 3L22 4' }),
    React.createElement('path', { d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' })
  );

  return React.createElement('div', {
    className: 'flex items-center justify-center mb-3'
  },
    // Logo and Title
    React.createElement('div', {
      className: 'flex items-center gap-3'
    },
      React.createElement('div', {
        className: 'p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg'
      },
        React.createElement(CheckSquare, { className: 'w-7 h-7 text-white' })
      ),
      React.createElement('div', null,
        React.createElement('h1', {
          className: `text-3xl font-bold ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'}`
        }, 'Action Items Tracker'),
        React.createElement('p', {
          className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`
        }, 'Task and deliverable management • Version 0.1')
      )
    )
  );
}