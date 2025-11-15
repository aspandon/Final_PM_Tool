// js/components/FilterPanel/index.js

/**
 * FilterPanel Component - Main Orchestrator
 * Displays global filters for projects including divisions, projects, PMs, BPs, dates, and BAU allocations
 * Uses vanilla React.createElement() - NO JSX
 */

import { FilterDropdowns } from './FilterDropdowns.js';
import { Filter, Calendar } from '../../shared/icons/index.js';

export function FilterPanel({
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  filterDivisions,
  setFilterDivisions,
  selectedProjects,
  setSelectedProjects,
  selectedPMs,
  setSelectedPMs,
  selectedBPs,
  setSelectedBPs,
  showExternalPM,
  setShowExternalPM,
  showExternalQA,
  setShowExternalQA,
  pmBAU,
  setPmBAU,
  bpBAU,
  setBpBAU,
  isFilterActive,
  applyFilter,
  clearFilter,
  uniqueDivisions,
  uniquePMs,
  uniqueBPs,
  availableProjectsForDropdown,
  darkMode,
  hideProjectFields,
  projects,
  phases
}) {
  return React.createElement('div', {
    className: `mb-6 p-4 rounded-xl shadow-lg ${darkMode ? 'glass-dark border-animated-dark' : 'glass border-animated'}`,
    style: {
      background: darkMode
        ? 'linear-gradient(to right, rgba(51, 65, 85, 0.85), rgba(71, 85, 105, 0.85))'
        : 'linear-gradient(to right, rgba(147, 197, 253, 0.85), rgba(165, 180, 252, 0.85))'
    }
  },
    // Header with Apply and Clear buttons
    React.createElement('div', {
      className: `mb-3 flex items-center justify-between gap-4`
    },
      React.createElement('h3', {
        className: `text-base font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
      },
        React.createElement('div', {
          className: 'w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full'
        }),
        'Global Filters'
      ),
      // Apply and Clear buttons
      React.createElement('div', {
        className: 'flex gap-2'
      },
        // Apply Button
        React.createElement('button', {
          onClick: applyFilter,
          className: 'px-4 py-2 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md btn-modern btn-gradient-flow btn-pulse ripple'
        }, 'Apply'),
        // Clear Button
        React.createElement('button', {
          onClick: clearFilter,
          className: 'px-4 py-2 text-xs bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 font-medium shadow-md btn-modern btn-pulse ripple'
        }, 'Clear')
      )
    ),

    // Filter Dropdowns Component
    React.createElement(FilterDropdowns, {
      filterStartDate,
      setFilterStartDate,
      filterEndDate,
      setFilterEndDate,
      filterDivisions,
      setFilterDivisions,
      selectedProjects,
      setSelectedProjects,
      selectedPMs,
      setSelectedPMs,
      selectedBPs,
      setSelectedBPs,
      showExternalPM,
      setShowExternalPM,
      showExternalQA,
      setShowExternalQA,
      uniqueDivisions,
      uniquePMs,
      uniqueBPs,
      availableProjectsForDropdown,
      darkMode,
      projects
    }),

    // Active Filter Display
    isFilterActive && React.createElement('div', {
      className: `border-t ${darkMode ? 'border-slate-600' : 'border-white/40'} pt-4 mt-4`
    },
      React.createElement('div', {
        className: `text-sm ${darkMode ? 'text-blue-300 bg-slate-700' : 'text-blue-700 bg-blue-50'} font-medium px-4 py-2 rounded-lg flex items-center gap-2`
      },
        React.createElement(Calendar, {
          className: `w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
        }),
        React.createElement('span', null,
          selectedProjects.length > 0 && `Projects: ${selectedProjects.length} selected | `,
          filterDivisions.length > 0 && `Divisions: ${filterDivisions.join(', ')} | `,
          selectedPMs.length > 0 && `PMs: ${selectedPMs.join(', ')} | `,
          selectedBPs.length > 0 && `BPs: ${selectedBPs.join(', ')} | `,
          filterStartDate || 'Beginning',
          ' to ',
          filterEndDate || 'End'
        )
      )
    ),

    // Project fields hidden notice
    hideProjectFields && projects.length > 0 && React.createElement('div', {
      className: `border-t ${darkMode ? 'border-slate-600' : 'border-white/40'} pt-4 mt-4`
    },
      React.createElement('div', {
        className: `border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50'} rounded-lg px-4 py-2 shadow-sm`
      },
        React.createElement('p', {
          className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'} flex items-center justify-center gap-1.5 whitespace-nowrap`
        },
          React.createElement(Filter, {
            className: `w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
          }),
          React.createElement('span', null, 'Project data entry fields hidden'),
          React.createElement('span', {
            className: `${darkMode ? 'text-blue-400' : 'text-blue-700'} font-normal`
          },
            `${projects.length} project${projects.length !== 1 ? 's' : ''} loaded. Click "Show Fields" to edit.`
          )
        )
      )
    )
  );
}
