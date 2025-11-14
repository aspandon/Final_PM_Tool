// js/components/Reporting.js

/**
 * Reporting Component
 * Displays reporting dashboards and analytics
 */

export function Reporting({
  filteredProjects,
  projects,
  darkMode
}) {

  return React.createElement('div', {
    className: `card-modern ${darkMode ? 'bg-slate-800 text-gray-200' : 'bg-white text-gray-800'}`
  },
    // Header
    React.createElement('div', {
      className: `p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
    },
      React.createElement('h2', {
        className: `text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, 'Reporting Dashboard'),
      React.createElement('p', {
        className: `mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, 'Analytics and reports for your projects')
    ),

    // Content
    React.createElement('div', {
      className: 'p-6'
    },
      React.createElement('div', {
        className: `text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
      },
        React.createElement('svg', {
          className: 'w-16 h-16 mx-auto mb-4 opacity-50',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          viewBox: '0 0 24 24'
        },
          React.createElement('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
          React.createElement('polyline', { points: '14 2 14 8 20 8' }),
          React.createElement('line', { x1: '16', x2: '8', y1: '13', y2: '13' }),
          React.createElement('line', { x1: '16', x2: '8', y1: '17', y2: '17' }),
          React.createElement('polyline', { points: '10 9 9 9 8 9' })
        ),
        React.createElement('h3', {
          className: `text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
        }, 'Reporting Dashboard'),
        React.createElement('p', {
          className: 'text-sm'
        }, `Showing data for ${filteredProjects.length} of ${projects.length} projects`)
      )
    )
  );
}
