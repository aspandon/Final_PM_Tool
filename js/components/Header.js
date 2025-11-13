// js/components/Header.js

/**
 * Header Component
 * Displays the app title, logo, and Back to Hub link
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
    // Top row - Back to Hub link (blue)
    React.createElement('div', {
      className: 'flex items-center mb-4'
    },
      React.createElement('a', {
        href: 'index.html',
        className: 'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-blue-600 hover:text-blue-700 hover:bg-blue-50',
        title: 'Back to Hub'
      },
        React.createElement('span', { className: 'text-sm' }, '←'),
        React.createElement('span', { className: 'text-sm font-medium' }, 'Back to Hub')
      )
    ),

    // Center row - Logo and Title (centered)
    React.createElement('div', {
      className: 'flex flex-col items-center'
    },
      // Logo
      React.createElement('div', {
        className: 'p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-3'
      },
        React.createElement('span', { className: 'text-2xl' }, '📊')
      ),

      // Title
      React.createElement('h1', {
        className: `text-2xl font-bold bg-gradient-to-r ${darkMode ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent text-center`
      }, 'Digital Development Project Management'),

      // Subtitle
      React.createElement('p', {
        className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center`
      }, 'Project planning and resource management • Version 1.1')
    )
  );
}
