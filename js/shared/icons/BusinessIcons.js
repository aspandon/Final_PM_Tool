// js/shared/icons/BusinessIcons.js

/**
 * Business Icons
 * Icons for business-related items (briefcase, users, calendar, dollar, etc.)
 */

export const Briefcase = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('rect', { width: '20', height: '14', x: '2', y: '7', rx: '2', ry: '2' }),
  React.createElement('path', { d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' })
);

export const Users = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
  React.createElement('circle', { cx: '9', cy: '7', r: '4' }),
  React.createElement('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
  React.createElement('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
);

export const User = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }),
  React.createElement('circle', { cx: '12', cy: '7', r: '4' })
);

export const Calendar = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('rect', { width: '18', height: '18', x: '3', y: '4', rx: '2', ry: '2' }),
  React.createElement('line', { x1: '16', x2: '16', y1: '2', y2: '6' }),
  React.createElement('line', { x1: '8', x2: '8', y1: '2', y2: '6' }),
  React.createElement('line', { x1: '3', x2: '21', y1: '10', y2: '10' })
);

export const DollarSign = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('line', { x1: '12', x2: '12', y1: '2', y2: '22' }),
  React.createElement('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' })
);

export const Euro = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M19 6a10 10 0 0 0-14 0' }),
  React.createElement('path', { d: 'M19 18a10 10 0 0 1-14 0' }),
  React.createElement('line', { x1: '3', x2: '11', y1: '12', y2: '12' }),
  React.createElement('line', { x1: '3', x2: '10', y1: '9', y2: '9' })
);

export const Target = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
  React.createElement('circle', { cx: '12', cy: '12', r: '6' }),
  React.createElement('circle', { cx: '12', cy: '12', r: '2' })
);

export const TrendingUp = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('polyline', { points: '22 7 13.5 15.5 8.5 10.5 2 17' }),
  React.createElement('polyline', { points: '16 7 22 7 22 13' })
);

export const Activity = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('polyline', { points: '22 12 18 12 15 21 9 3 6 12 2 12' })
);

export const ShoppingCart = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('circle', { cx: '8', cy: '21', r: '1' }),
  React.createElement('circle', { cx: '19', cy: '21', r: '1' }),
  React.createElement('path', { d: 'M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' })
);