// js/shared/icons/UIIcons.js

/**
 * UI Icons
 * General UI icons (eye, moon, sun, settings, etc.)
 */

export const Eye = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' }),
  React.createElement('circle', { cx: '12', cy: '12', r: '3' })
);

export const EyeOff = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'm9.88 9.88a3 3 0 1 0 4.24 4.24' }),
  React.createElement('path', { d: 'M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' }),
  React.createElement('path', { d: 'M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' }),
  React.createElement('line', { x1: '2', x2: '22', y1: '2', y2: '22' })
);

export const Moon = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' })
);

export const Sun = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('circle', { cx: '12', cy: '12', r: '4' }),
  React.createElement('path', { d: 'M12 2v2' }),
  React.createElement('path', { d: 'M12 20v2' }),
  React.createElement('path', { d: 'm4.93 4.93 1.41 1.41' }),
  React.createElement('path', { d: 'm17.66 17.66 1.41 1.41' }),
  React.createElement('path', { d: 'M2 12h2' }),
  React.createElement('path', { d: 'M20 12h2' }),
  React.createElement('path', { d: 'm6.34 17.66-1.41 1.41' }),
  React.createElement('path', { d: 'm19.07 4.93-1.41 1.41' })
);

export const Settings = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }),
  React.createElement('circle', { cx: '12', cy: '12', r: '3' })
);

export const HelpCircle = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
  React.createElement('path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }),
  React.createElement('path', { d: 'M12 17h.01' })
);

export const Search = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('circle', { cx: '11', cy: '11', r: '8' }),
  React.createElement('path', { d: 'm21 21-4.3-4.3' })
);

export const Filter = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('polygon', { points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' })
);

export const Lock = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2' }),
  React.createElement('path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' })
);

export const Unlock = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2' }),
  React.createElement('path', { d: 'M7 11V7a5 5 0 0 1 9.9-1' })
);

export const PauseCircle = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
  React.createElement('line', { x1: '10', x2: '10', y1: '15', y2: '9' }),
  React.createElement('line', { x1: '14', x2: '14', y1: '15', y2: '9' })
);

export const Flask = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M9 3h6' }),
  React.createElement('path', { d: 'M10 9v7.5' }),
  React.createElement('path', { d: 'M14 9v7.5' }),
  React.createElement('path', { d: 'M7.252 21h9.496c1.076 0 1.908-.982 1.659-1.98L16.5 9M7.5 9l-1.907 10.02C5.344 20.018 6.176 21 7.252 21' }),
  React.createElement('path', { d: 'M10 3v6h4V3' })
);

export const PartyPopper = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M5.8 11.3 2 22l10.7-3.79' }),
  React.createElement('path', { d: 'M4 3h.01' }),
  React.createElement('path', { d: 'M22 8h.01' }),
  React.createElement('path', { d: 'M15 2h.01' }),
  React.createElement('path', { d: 'M22 20h.01' }),
  React.createElement('path', { d: 'M22 2 13 13l-2-2 11-11Z' }),
  React.createElement('path', { d: 'M11 13 9 11l-6 6v.01' })
);
