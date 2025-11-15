// js/components/ResourcesChart/index.js

import { calculateResourceEffort } from '../../utils/calculations.js';
import { FTECharts } from './FTECharts.js';
import { ResourceInputs } from './ResourceInputs.js';

/**
 * ResourcesChart Component
 * Displays a line chart showing FTE (Full-Time Equivalent) effort per person over time
 * including Project Managers, Business Partners, and External Resources
 */
export function ResourcesChart({
  filteredProjects,
  filteredProjectsForExternal,
  earliestDate,
  latestDate,
  isFilterActive,
  filterStartDate,
  filterEndDate,
  pmBAU,
  bpBAU,
  setPmBAU,
  setBpBAU,
  showExternalPM,
  showExternalQA,
  darkMode,
  colors
}) {
  // State for BAU tooltip
  const [showBAUTooltip, setShowBAUTooltip] = React.useState(false);

  // Calculate resource effort data using shared utility function
  const { chartData, activePMs, activeBPs } = calculateResourceEffort(
    filteredProjects,
    filteredProjectsForExternal,
    earliestDate,
    latestDate,
    pmBAU,
    bpBAU,
    isFilterActive,
    filterStartDate,
    filterEndDate
  );

  // Don't render if no data
  if (filteredProjects.length === 0 || (activePMs.length === 0 && activeBPs.length === 0 && !showExternalPM && !showExternalQA)) {
    return null;
  }

  // Calculate max value for Y-axis
  const maxValue = Math.max(
    ...chartData.map(item => {
      let max = 0;
      activePMs.forEach(pm => {
        max = Math.max(max, item[`${pm} (PM)`] || 0);
      });
      activeBPs.forEach(bp => {
        max = Math.max(max, item[`${bp} (BP)`] || 0);
      });
      max = Math.max(max, item['Total PM'] || 0, item['Total BP'] || 0);
      if (showExternalPM) {
        max = Math.max(max, item['PM External'] || 0);
      }
      if (showExternalQA) {
        max = Math.max(max, item['QA External'] || 0);
      }
      return max;
    })
  );
  const yAxisMax = Math.ceil(maxValue * 1.1 * 4) / 4; // Round up to nearest 0.25 with 10% padding

  return React.createElement('div', { className: 'border-t pt-6 mt-6' },
    // Header with info icon
    React.createElement('div', {
      className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center justify-between gap-2`
    },
      React.createElement('div', {
        className: 'flex items-center gap-2'
      },
        React.createElement('div', {
          className: 'w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full'
        }),
        'Resource Effort per Person (FTE)'
      ),
      // Info icon with tooltip
      React.createElement('div', {
        className: 'relative',
        onMouseEnter: () => setShowBAUTooltip(true),
        onMouseLeave: () => setShowBAUTooltip(false)
      },
        React.createElement('div', {
          className: `w-5 h-5 rounded-full flex items-center justify-center cursor-help ${darkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'} hover:bg-blue-600 transition-colors`
        }, 'ℹ'),
        // Tooltip
        showBAUTooltip && React.createElement('div', {
          className: `absolute right-0 top-7 z-50 w-80 p-3 rounded-lg shadow-xl ${darkMode ? 'bg-slate-800 border-slate-600 text-gray-200' : 'bg-white border-gray-200 text-gray-700'} border text-xs leading-relaxed`
        },
          React.createElement('strong', null, 'Note: '),
          'BAU allocation in FTE (Full-Time Equivalent) is added to each team member for every month within the filtered date range. If no date filter is active, BAU is applied across the entire project timeline. 1 FTE = 22 working days per month.'
        )
      )
    ),

    // BAU Allocation Input Section
    React.createElement(ResourceInputs, {
      bauPM: pmBAU,
      bauBP: bpBAU,
      setBauPM: setPmBAU,
      setBauBP: setBpBAU,
      darkMode: darkMode
    }),

    // FTE Charts Section
    React.createElement(FTECharts, {
      chartData: chartData,
      activePMs: activePMs,
      activeBPs: activeBPs,
      showExternalPM: showExternalPM,
      showExternalQA: showExternalQA,
      darkMode: darkMode,
      colors: colors,
      pmBAU: pmBAU,
      bpBAU: bpBAU,
      isFilterActive: isFilterActive,
      yAxisMax: yAxisMax
    })
  );
}
