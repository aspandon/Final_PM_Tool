// js/components/ActionPlan/ActionPlanFilters.js

/**
 * ActionPlanFilters Component
 * Provides filtering UI for action plans (status, priority, search)
 * Currently defined for future use - filters can be applied in parent component
 */

export function ActionPlanFilters({ filters, setFilters, darkMode, statuses, priorities }) {
  return React.createElement('div', {
    className: `flex items-center gap-4 p-4 rounded-xl ${
      darkMode ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-white border border-gray-200'
    } shadow-lg mb-4`
  },
    // Search Input
    React.createElement('div', { className: 'flex-1' },
      React.createElement('input', {
        type: 'text',
        value: filters.search || '',
        onChange: (e) => setFilters({ ...filters, search: e.target.value }),
        placeholder: 'Search actions, tasks...',
        className: `w-full px-4 py-2 text-sm border rounded-lg ${
          darkMode
            ? 'bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
        } focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all`
      })
    ),

    // Status Filter
    React.createElement('div', { className: 'flex items-center gap-2' },
      React.createElement('label', {
        className: `text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
      }, 'Status:'),
      React.createElement('select', {
        multiple: true,
        value: filters.status || [],
        onChange: (e) => {
          const selected = Array.from(e.target.selectedOptions, option => option.value);
          setFilters({ ...filters, status: selected });
        },
        className: `px-3 py-2 text-sm border rounded-lg ${
          darkMode
            ? 'bg-slate-700 border-slate-600 text-gray-200'
            : 'bg-white border-gray-300 text-gray-800'
        } focus:ring-2 focus:ring-blue-500/50`
      },
        Object.entries(statuses).map(([key, val]) =>
          React.createElement('option', { key, value: key }, `${val.icon} ${val.label}`)
        )
      )
    ),

    // Priority Filter
    React.createElement('div', { className: 'flex items-center gap-2' },
      React.createElement('label', {
        className: `text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
      }, 'Priority:'),
      React.createElement('select', {
        multiple: true,
        value: filters.priority || [],
        onChange: (e) => {
          const selected = Array.from(e.target.selectedOptions, option => option.value);
          setFilters({ ...filters, priority: selected });
        },
        className: `px-3 py-2 text-sm border rounded-lg ${
          darkMode
            ? 'bg-slate-700 border-slate-600 text-gray-200'
            : 'bg-white border-gray-300 text-gray-800'
        } focus:ring-2 focus:ring-blue-500/50`
      },
        Object.entries(priorities).map(([key, val]) =>
          React.createElement('option', { key, value: key }, `${val.icon} ${val.label}`)
        )
      )
    ),

    // Clear Filters Button
    (filters.search || filters.status.length > 0 || filters.priority.length > 0) &&
      React.createElement('button', {
        onClick: () => setFilters({ status: [], priority: [], search: '' }),
        className: `px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
          darkMode
            ? 'bg-red-600 hover:bg-red-500 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`
      }, 'Clear')
  );
}
