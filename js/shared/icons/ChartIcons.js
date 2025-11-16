// js/shared/icons/ChartIcons.js

/**
 * Chart Icons
 * Icons for charts and analytics (bar chart, pie chart, line chart, etc.)
 */

export const BarChartIcon = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('line', { x1: '12', x2: '12', y1: '20', y2: '10' }),
  React.createElement('line', { x1: '18', x2: '18', y1: '20', y2: '4' }),
  React.createElement('line', { x1: '6', x2: '6', y1: '20', y2: '16' })
);

export const PieChartIcon = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M21.21 15.89A10 10 0 1 1 8 2.83' }),
  React.createElement('path', { d: 'M22 12A10 10 0 0 0 12 2v10z' })
);

export const LineChartIcon = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M3 3v18h18' }),
  React.createElement('path', { d: 'm19 9-5 5-4-4-3 3' })
);

export const LayoutDashboard = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('rect', { width: '7', height: '9', x: '3', y: '3', rx: '1' }),
  React.createElement('rect', { width: '7', height: '5', x: '14', y: '3', rx: '1' }),
  React.createElement('rect', { width: '7', height: '9', x: '14', y: '12', rx: '1' }),
  React.createElement('rect', { width: '7', height: '5', x: '3', y: '16', rx: '1' })
);

export const ListChecks = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'm3 17 2 2 4-4' }),
  React.createElement('path', { d: 'm3 7 2 2 4-4' }),
  React.createElement('path', { d: 'M13 6h8' }),
  React.createElement('path', { d: 'M13 12h8' }),
  React.createElement('path', { d: 'M13 18h8' })
);

export const CheckSquare = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('polyline', { points: '9 11 12 14 22 4' }),
  React.createElement('path', { d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' })
);
