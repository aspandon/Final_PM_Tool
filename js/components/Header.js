// js/components/Header.js

/**
 * Header Component
 * Displays the app title and logo
 */

export function Header({
  addProject,
  hideProjectFields,
  setHideProjectFields,
  onImportClick,
  exportToExcel,
  darkMode,
  setDarkMode
}) {
  return React.createElement('div', {
    className: 'mb-6'
  },
    // Logo and Title (centered)
    React.createElement('div', {
      className: 'flex flex-col items-center'
    },
      // Logo and Title on same line
      React.createElement('div', {
        className: 'flex items-center gap-4 mb-3'
      },
        // Logo
        React.createElement('div', {
          className: 'p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg'
        },
          React.createElement('svg', {
            className: 'w-8 h-8 text-white',
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
          )
        ),

        // Title
        React.createElement('h1', {
          className: `text-2xl font-bold bg-gradient-to-r ${darkMode ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`
        }, 'Digital Development Project Management')
      ),

      // Subtitle
      React.createElement('p', {
        className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`
      }, 'Project planning and resource management • Version 1.1')
    )
  );
}
