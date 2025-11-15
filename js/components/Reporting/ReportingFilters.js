// js/components/Reporting/ReportingFilters.js

/**
 * ReportingFilters Component
 *
 * Display and manage active filters for reporting views.
 * Shows filter badges and provides controls to clear filters.
 *
 * Props:
 * - selectedDivision: Currently selected division filter
 * - selectedRAGStatus: Currently selected RAG status filter
 * - selectedKanbanStatus: Currently selected kanban status filter
 * - setSelectedDivision: Function to update division filter
 * - setSelectedRAGStatus: Function to update RAG status filter
 * - setSelectedKanbanStatus: Function to update kanban status filter
 * - resetFilters: Function to clear all filters
 * - getColumnDisplayName: Function to format kanban status display name
 * - darkMode: Boolean for dark mode styling
 */

export function ActiveFiltersDisplay({
  selectedDivision,
  selectedRAGStatus,
  selectedKanbanStatus,
  setSelectedDivision,
  setSelectedRAGStatus,
  setSelectedKanbanStatus,
  resetFilters,
  getColumnDisplayName,
  darkMode
}) {
  // Only render if there are active filters
  if (!selectedDivision && !selectedRAGStatus && !selectedKanbanStatus) {
    return null;
  }

  return React.createElement('div', {
    className: 'mt-4 flex flex-wrap gap-2 items-center'
  },
    React.createElement('span', {
      className: `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
    }, 'Active Filters:'),

    selectedDivision && React.createElement('span', {
      className: `px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} flex items-center gap-2`
    },
      `Division: ${selectedDivision}`,
      React.createElement('button', {
        onClick: () => setSelectedDivision(null),
        className: 'hover:text-red-500'
      }, '×')
    ),

    selectedRAGStatus && React.createElement('span', {
      className: `px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'} flex items-center gap-2`
    },
      `RAG: ${selectedRAGStatus}`,
      React.createElement('button', {
        onClick: () => setSelectedRAGStatus(null),
        className: 'hover:text-red-500'
      }, '×')
    ),

    selectedKanbanStatus && React.createElement('span', {
      className: `px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'} flex items-center gap-2`
    },
      `Status: ${getColumnDisplayName(selectedKanbanStatus)}`,
      React.createElement('button', {
        onClick: () => setSelectedKanbanStatus(null),
        className: 'hover:text-red-500'
      }, '×')
    ),

    React.createElement('button', {
      onClick: resetFilters,
      className: `px-3 py-1 rounded text-sm ${darkMode ? 'bg-red-900 text-red-200 hover:bg-red-800' : 'bg-red-100 text-red-800 hover:bg-red-200'}`
    }, 'Clear All')
  );
}
