// js/shared/icons/ActionIcons.js

/**
 * Action Icons
 * Icons for user actions (add, edit, delete, save, etc.)
 */

export const Plus = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M5 12h14' }),
  React.createElement('path', { d: 'M12 5v14' })
);

export const Trash = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M3 6h18' }),
  React.createElement('path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }),
  React.createElement('path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }),
  React.createElement('line', { x1: '10', x2: '10', y1: '11', y2: '17' }),
  React.createElement('line', { x1: '14', x2: '14', y1: '11', y2: '17' })
);

export const Trash2 = Trash; // Alias

export const Edit = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' }),
  React.createElement('path', { d: 'm15 5 4 4' })
);

export const Save = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' }),
  React.createElement('polyline', { points: '17 21 17 13 7 13 7 21' }),
  React.createElement('polyline', { points: '7 3 7 8 15 8' })
);

export const X = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M18 6 6 18' }),
  React.createElement('path', { d: 'm6 6 12 12' })
);

export const Check = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('polyline', { points: '20 6 9 17 4 12' })
);

export const Copy = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }),
  React.createElement('path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' })
);

export const MoreVertical = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('circle', { cx: '12', cy: '12', r: '1' }),
  React.createElement('circle', { cx: '12', cy: '5', r: '1' }),
  React.createElement('circle', { cx: '12', cy: '19', r: '1' })
);

export const MoreHorizontal = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('circle', { cx: '12', cy: '12', r: '1' }),
  React.createElement('circle', { cx: '19', cy: '12', r: '1' }),
  React.createElement('circle', { cx: '5', cy: '12', r: '1' })
);
