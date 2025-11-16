// js/components/Reporting/ReportingCharts.js

const { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

/**
 * ReportingCharts Component
 *
 * Chart visualizations for reporting dashboard.
 * Includes Recharts-based visualizations for phase distribution and resource allocation.
 *
 * Props:
 * - chartData: Object containing various chart data (projectsWithDelays, etc.)
 * - darkMode: Boolean for dark mode styling
 */

// Chart colors
const COLORS = {
  Red: '#EF4444',
  Amber: '#EAB308',
  Green: '#22C55E',
  Blue: '#3B82F6',
  Purple: '#A855F7',
  Teal: '#14B8A6'
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return React.createElement('div', {
      className: `${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-3`
    },
      React.createElement('p', {
        className: `font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, label),
      payload.map((entry, index) =>
        React.createElement('p', {
          key: index,
          className: 'text-sm',
          style: { color: entry.color }
        }, `${entry.name}: ${entry.value}`)
      )
    );
  }
  return null;
};

/**
 * Timeline Performance Chart
 */
export function TimelinePerformanceChart({ projectsWithDelays, darkMode }) {
  if (!projectsWithDelays || projectsWithDelays.length === 0) {
    return null;
  }

  return React.createElement('div', {
    className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
  },
    React.createElement('h3', {
      className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
    }, '⏱️ Timeline Performance'),

    React.createElement('h4', {
      className: `text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
    }, 'Project Delays (Implementation vs Initial Official Plan)'),

    React.createElement(ResponsiveContainer, { width: '100%', height: 400 },
      React.createElement(BarChart, {
        data: projectsWithDelays.slice(0, 20),
        layout: 'vertical',
        margin: { top: 5, right: 30, left: 150, bottom: 5 }
      },
        React.createElement(CartesianGrid, {
          strokeDasharray: '3 3',
          stroke: darkMode ? '#374151' : '#E5E7EB'
        }),
        React.createElement(XAxis, {
          type: 'number',
          stroke: darkMode ? '#9CA3AF' : '#6B7280',
          label: { value: 'Days', position: 'insideBottom', offset: -5 }
        }),
        React.createElement(YAxis, {
          type: 'category',
          dataKey: 'name',
          stroke: darkMode ? '#9CA3AF' : '#6B7280',
          width: 140
        }),
        React.createElement(Tooltip, {
          content: React.createElement(CustomTooltip, { darkMode })
        }),
        React.createElement(Bar, {
          dataKey: 'delay',
          fill: COLORS.Red,
          label: { position: 'right' }
        },
          projectsWithDelays.slice(0, 20).map((entry, index) =>
            React.createElement(Cell, {
              key: `cell-${index}`,
              fill: entry.delay >= 30 ? COLORS.Red : entry.delay >= 15 ? COLORS.Amber : COLORS.Green
            })
          )
        )
      )
    )
  );
}
