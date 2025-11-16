// js/components/Reporting/ReportingTables.js

/**
 * ReportingTables Component
 *
 * Displays data in table format for reporting views.
 * Includes project lists, resource breakdowns, and other tabular data.
 *
 * Props:
 * - data: Array of objects to display in table
 * - columns: Array of column definitions { header, key, render }
 * - title: Optional table title
 * - darkMode: Boolean for dark mode styling
 */

export function DataTable({ data, columns, title, darkMode }) {
  if (!data || data.length === 0) {
    return React.createElement('div', {
      className: `text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`
    }, 'No data available');
  }

  return React.createElement('div', {
    className: `mt-4 rounded-lg border ${darkMode ? 'border-slate-600' : 'border-gray-200'} overflow-hidden`
  },
    title && React.createElement('div', {
      className: `px-4 py-2 font-semibold ${darkMode ? 'bg-slate-700 text-gray-200' : 'bg-gray-50 text-gray-700'} border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
    }, title),
    React.createElement('div', {
      className: 'overflow-x-auto'
    },
      React.createElement('table', {
        className: 'w-full text-sm'
      },
        React.createElement('thead', null,
          React.createElement('tr', {
            className: `${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`
          },
            columns.map((col, idx) =>
              React.createElement('th', {
                key: idx,
                className: `px-4 py-2 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
              }, col.header)
            )
          )
        ),
        React.createElement('tbody', null,
          data.map((row, rowIdx) =>
            React.createElement('tr', {
              key: rowIdx,
              className: `${darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'} ${rowIdx % 2 === 0 ? (darkMode ? 'bg-slate-800/50' : 'bg-white') : (darkMode ? 'bg-slate-800/30' : 'bg-gray-50/50')}`
            },
              columns.map((col, colIdx) =>
                React.createElement('td', {
                  key: colIdx,
                  className: `px-4 py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`
                }, col.render ? col.render(row) : row[col.key])
              )
            )
          )
        )
      )
    )
  );
}
