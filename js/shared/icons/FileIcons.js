// js/shared/icons/FileIcons.js

/**
 * File Icons
 * Icons for file operations (upload, download, folder, etc.)
 */

export const Upload = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
  React.createElement('polyline', { points: '17 8 12 3 7 8' }),
  React.createElement('line', { x1: '12', x2: '12', y1: '3', y2: '15' })
);

export const Download = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
  React.createElement('polyline', { points: '7 10 12 15 17 10' }),
  React.createElement('line', { x1: '12', x2: '12', y1: '15', y2: '3' })
);

export const File = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' }),
  React.createElement('polyline', { points: '14 2 14 8 20 8' })
);

export const FileText = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' }),
  React.createElement('polyline', { points: '14 2 14 8 20 8' }),
  React.createElement('line', { x1: '16', x2: '8', y1: '13', y2: '13' }),
  React.createElement('line', { x1: '16', x2: '8', y1: '17', y2: '17' }),
  React.createElement('line', { x1: '10', x2: '8', y1: '9', y2: '9' })
);

export const Folder = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z' })
);

export const FolderKanban = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z' }),
  React.createElement('path', { d: 'M8 10v4' }),
  React.createElement('path', { d: 'M12 10v2' }),
  React.createElement('path', { d: 'M16 10v6' })
);

export const Inbox = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('polyline', { points: '22 12 16 12 14 15 10 15 8 12 2 12' }),
  React.createElement('path', { d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' })
);

export const FileEdit = ({ className }) => React.createElement('svg', {
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24'
},
  React.createElement('path', { d: 'M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5' }),
  React.createElement('polyline', { points: '14 2 14 8 20 8' }),
  React.createElement('path', { d: 'M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z' })
);
