// js/shared/icons/NavigationIcons.js

/**
 * Navigation Icons
 * Chevrons, arrows, and directional icons
 */

export const ChevronDown = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'm6 9 6 6 6-6' })
);

export const ChevronRight = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'm9 18 6-6-6-6' })
);

export const ChevronLeft = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'm15 18-6-6 6-6' })
);

export const ChevronUp = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'm18 15-6-6-6 6' })
);

export const ArrowLeft = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M19 12H5' }),
  React.createElement('path', { d: 'm12 19-7-7 7-7' })
);

export const ArrowRight = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M5 12h14' }),
  React.createElement('path', { d: 'm12 5 7 7-7 7' })
);
