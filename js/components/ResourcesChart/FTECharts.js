// js/components/ResourcesChart/FTECharts.js

/**
 * FTECharts Component
 * Renders FTE (Full-Time Equivalent) line charts for PM, BP, and External Resources
 */
export function FTECharts({
  chartData,
  activePMs,
  activeBPs,
  showExternalPM,
  showExternalQA,
  darkMode,
  colors,
  pmBAU,
  bpBAU,
  isFilterActive,
  yAxisMax
}) {
  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  return React.createElement('div', {
    className: `${darkMode ? 'bg-slate-800' : 'bg-white'} p-5 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-gray-200'} shadow-md`
  },
    // Chart
    React.createElement(ResponsiveContainer, { width: '100%', height: 400 },
      React.createElement(LineChart, {
        data: chartData,
        margin: { top: 5, right: 30, left: 20, bottom: 5 }
      },
        React.createElement(CartesianGrid, {
          strokeDasharray: '3 3',
          stroke: darkMode ? '#475569' : '#e5e7eb'
        }),
        React.createElement(XAxis, {
          dataKey: 'month',
          angle: -45,
          textAnchor: 'end',
          height: 80,
          style: { fontSize: '12px', fill: darkMode ? '#e5e7eb' : '#374151' },
          stroke: darkMode ? '#94a3b8' : '#9ca3af'
        }),
        React.createElement(YAxis, {
          label: {
            value: 'FTE (Full-Time Equivalent)',
            angle: -90,
            position: 'insideLeft',
            style: { fill: darkMode ? '#e5e7eb' : '#374151' }
          },
          style: { fontSize: '12px', fill: darkMode ? '#e5e7eb' : '#374151' },
          stroke: darkMode ? '#94a3b8' : '#9ca3af',
          domain: [0, yAxisMax]
        }),
        React.createElement(Tooltip, {
          contentStyle: {
            fontSize: '12px',
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
            color: darkMode ? '#e5e7eb' : '#374151'
          },
          formatter: (value) => `${value} FTE`,
          labelStyle: { color: darkMode ? '#e5e7eb' : '#374151' }
        }),
        React.createElement(Legend, {
          wrapperStyle: { fontSize: '12px', color: darkMode ? '#e5e7eb' : '#374151' },
          iconType: 'line'
        }),

        // Total PM Line (thick)
        React.createElement(Line, {
          key: 'total-pm',
          type: 'monotone',
          dataKey: 'Total PM',
          stroke: '#1e40af',
          strokeWidth: 5,
          dot: { r: 6, fill: '#1e40af', strokeWidth: 2, stroke: '#fff' },
          activeDot: { r: 8 }
        }),

        // Total BP Line (thick)
        React.createElement(Line, {
          key: 'total-bp',
          type: 'monotone',
          dataKey: 'Total BP',
          stroke: '#047857',
          strokeWidth: 5,
          dot: { r: 6, fill: '#047857', strokeWidth: 2, stroke: '#fff' },
          activeDot: { r: 8 }
        }),

        // PM External Line (medium-thick)
        showExternalPM && React.createElement(Line, {
          key: 'pm-external',
          type: 'monotone',
          dataKey: 'PM External',
          stroke: '#dc2626',
          strokeWidth: 4,
          dot: { r: 5, fill: '#dc2626', strokeWidth: 2, stroke: '#fff' },
          activeDot: { r: 7 }
        }),

        // QA External Line (medium-thick)
        showExternalQA && React.createElement(Line, {
          key: 'qa-external',
          type: 'monotone',
          dataKey: 'QA External',
          stroke: '#ea580c',
          strokeWidth: 4,
          dot: { r: 5, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' },
          activeDot: { r: 7 }
        }),

        // Individual PM Lines (thin)
        ...activePMs.map((pm, idx) =>
          React.createElement(Line, {
            key: `pm-${pm}`,
            type: 'monotone',
            dataKey: `${pm} (PM)`,
            stroke: colors[idx % colors.length],
            strokeWidth: 2,
            dot: { r: 3 },
            activeDot: { r: 5 }
          })
        ),

        // Individual BP Lines (thin, dashed)
        ...activeBPs.map((bp, idx) =>
          React.createElement(Line, {
            key: `bp-${bp}`,
            type: 'monotone',
            dataKey: `${bp} (BP)`,
            stroke: colors[(activePMs.length + idx) % colors.length],
            strokeWidth: 2,
            strokeDasharray: '5 5',
            dot: { r: 3 },
            activeDot: { r: 5 }
          })
        )
      )
    ),

    // Legend explanation and notes
    React.createElement('div', { className: 'mt-4 space-y-2' },
      // Legend explanation
      React.createElement('div', {
        className: `text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
      },
        React.createElement('div', { className: 'mb-2' },
          React.createElement('strong', null, 'Consolidated Totals (thick lines):'),
          React.createElement('div', { className: 'ml-4 mt-1' },
            React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('div', { className: 'w-4 h-1 bg-blue-900' }),
              React.createElement('span', null, 'Total PM - sum of all Project Managers')
            ),
            React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('div', { className: 'w-4 h-1 bg-green-800' }),
              React.createElement('span', null, 'Total BP - sum of all Business Partners')
            )
          )
        ),
        (showExternalPM || showExternalQA) && React.createElement('div', { className: 'mb-2' },
          React.createElement('strong', null, 'External Resources (medium-thick lines) - toggle in Project Manager filter:'),
          React.createElement('div', { className: 'ml-4 mt-1' },
            showExternalPM && React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('div', { className: 'w-4 h-1 bg-red-600' }),
              React.createElement('span', null, 'PM External - cumulative external PM resources (Implementation Phase)')
            ),
            showExternalQA && React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('div', { className: 'w-4 h-1 bg-orange-600' }),
              React.createElement('span', null, 'QA External - cumulative external QA resources (Implementation Phase)')
            )
          )
        ),
        activePMs.length > 0 && React.createElement('div', null,
          React.createElement('strong', null, 'Project Managers (thin solid lines):'),
          ' ',
          activePMs.join(', ')
        ),
        activeBPs.length > 0 && React.createElement('div', null,
          React.createElement('strong', null, 'Business Partners (thin dashed lines):'),
          ' ',
          activeBPs.join(', ')
        )
      ),

      // Detailed note
      React.createElement('div', {
        className: `text-xs ${darkMode ? 'text-gray-300 bg-slate-700' : 'text-gray-600 bg-gray-50'} p-2 rounded`
      },
        React.createElement('strong', null, 'Note:'),
        ' This chart shows cumulative effort allocation in FTE (Full-Time Equivalent). For each month within a phase\'s date range, the full FTE allocation is added cumulatively. PMs: work during Project Implementation phase (PM Allocation FTE is summed across all their projects for each month). BPs: work during PSD & Inv. Proposal Preparation phase (BP Allocation) and BP Implementation phase (BP Implementation Allocation), with FTEs summed across all projects they\'re assigned to. External Resources: PM External and QA External work during the Implementation Phase (CAPEX Reg) and are tracked separately from internal resources, summed across all filtered projects. Use the Project Manager filter to show/hide external resources.',
        (pmBAU || bpBAU) && React.createElement('span', null,
          ' BAU allocation is added: ',
          pmBAU && `PM BAU = ${pmBAU} FTE/month`,
          pmBAU && bpBAU && ', ',
          bpBAU && `BP BAU = ${bpBAU} FTE/month`,
          '.'
        ),
        isFilterActive && React.createElement('span', null,
          ' The view is limited to filtered projects and date range.'
        )
      )
    )
  );
}
