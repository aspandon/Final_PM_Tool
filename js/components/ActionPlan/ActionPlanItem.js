// js/components/ActionPlan/ActionPlanItem.js

/**
 * ActionPlanItem Helper Functions
 * Shared UI components for rendering status, priority, dependencies, etc.
 */

// Modern status dropdown selector
export function renderStatusDropdown(item, type, ids, statuses, darkMode, updateItem, isEditLocked) {
  const status = item.status || 'not-started';
  const statusInfo = statuses[status];

  return React.createElement('select', {
    value: status,
    onChange: (e) => updateItem(type, ids, 'status', e.target.value),
    className: `px-3 py-2 text-xs rounded-lg font-bold border-2 ${statusInfo.border} ${statusInfo.bg} ${statusInfo.text} ${statusInfo.hover} transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 ${isEditLocked ? 'opacity-50 cursor-not-allowed' : ''}`,
    disabled: isEditLocked,
    style: { minWidth: '140px' }
  },
    Object.entries(statuses).map(([key, val]) =>
      React.createElement('option', { key, value: key }, `${val.icon} ${val.label}`)
    )
  );
}

// Modern priority dropdown selector
export function renderPriorityDropdown(item, type, ids, priorities, darkMode, updateItem, isEditLocked) {
  const priority = item.priority || 'medium';

  return React.createElement('select', {
    value: priority,
    onChange: (e) => updateItem(type, ids, 'priority', e.target.value),
    className: `px-2.5 py-2.5 text-xs rounded-lg font-bold border flex items-center ${
      darkMode
        ? 'bg-slate-600/50 text-gray-200 border-slate-500'
        : 'bg-blue-100 text-blue-700 border-blue-300'
    } transition-all cursor-pointer ${isEditLocked ? 'opacity-50 cursor-not-allowed' : ''}`,
    disabled: isEditLocked,
    style: { minWidth: '110px' }
  },
    Object.entries(priorities).map(([key, val]) =>
      React.createElement('option', { key, value: key }, `${val.icon} ${val.label}`)
    )
  );
}

// Link icon SVG
export function LinkIcon({ className }) {
  return React.createElement('svg', {
    className: className || 'w-4 h-4',
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
    React.createElement('path', { d: 'M9 17H7A5 5 0 0 1 7 7h2' }),
    React.createElement('path', { d: 'M15 7h2a5 5 0 1 1 0 10h-2' }),
    React.createElement('line', { x1: '8', x2: '16', y1: '12', y2: '12' })
  );
}

// File icon SVG (for activity log)
export function FileIcon({ className }) {
  return React.createElement('svg', {
    className: className || 'w-4 h-4',
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
    React.createElement('path', { d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' }),
    React.createElement('polyline', { points: '14 2 14 8 20 8' }),
    React.createElement('line', { x1: '16', x2: '8', y1: '13', y2: '13' }),
    React.createElement('line', { x1: '16', x2: '8', y1: '17', y2: '17' }),
    React.createElement('line', { x1: '10', x2: '8', y1: '9', y2: '9' })
  );
}

// Trash icon SVG
export function TrashIcon({ className }) {
  return React.createElement('svg', {
    className: className || 'w-4 h-4',
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
    React.createElement('path', { d: 'M3 6h18' }),
    React.createElement('path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }),
    React.createElement('path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }),
    React.createElement('line', { x1: '10', x2: '10', y1: '11', y2: '17' }),
    React.createElement('line', { x1: '14', x2: '14', y1: '11', y2: '17' })
  );
}

// Render dependency tags
export function renderDependencyTags(item, type, ids, allItems, darkMode, removeDependency, isEditLocked) {
  const deps = item.dependencies || [];

  return deps.map(depId => {
    const depItem = allItems.find(i => i.id === depId);
    if (!depItem) return null;

    const colors = {
      action: darkMode ? 'bg-green-500/20 text-green-300 border-green-400' : 'bg-green-100 text-green-700 border-green-500',
      task: darkMode ? 'bg-blue-500/20 text-blue-300 border-blue-400' : 'bg-blue-100 text-blue-700 border-blue-500',
      subtask: darkMode ? 'bg-gray-500/20 text-gray-300 border-gray-400' : 'bg-gray-100 text-gray-700 border-gray-500'
    };

    return React.createElement('div', {
      key: depId,
      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${colors[depItem.type]}`
    },
      React.createElement('span', null, depItem.name),
      !isEditLocked && React.createElement('button', {
        onClick: (e) => {
          e.stopPropagation();
          removeDependency(item, type, ids, depId);
        },
        className: 'hover:opacity-70 transition-opacity',
        title: 'Remove dependency'
      }, '×')
    );
  });
}

// Render dependency selector
export function renderDependencySelector(item, type, ids, allItems, darkMode, addDependency, isEditLocked) {
  const currentDeps = item.dependencies || [];
  const availableItems = allItems.filter(i => i.id !== item.id && !currentDeps.includes(i.id));

  return React.createElement('div', {
    className: `mt-2 p-2 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} border ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
  },
    React.createElement('div', {
      className: `text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1 flex items-center gap-1`
    },
      React.createElement(LinkIcon, { className: 'w-3.5 h-3.5' }),
      'Add Dependency'
    ),
    React.createElement('select', {
      onChange: (e) => {
        if (e.target.value) {
          addDependency(item, type, ids, e.target.value);
          e.target.value = '';
        }
      },
      className: `w-full px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded`,
      disabled: isEditLocked
    },
      React.createElement('option', { value: '' }, 'Select item...'),
      availableItems.map(i =>
        React.createElement('option', {
          key: i.id,
          value: i.id
        }, `[${i.type}] ${i.name}`)
      )
    )
  );
}

// Render circular progress indicator
export function renderCircularProgress(completed, total, darkMode, size = 32) {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = size === 32 ? 12 : (size === 36 ? 14 : 12);
  const strokeWidth = size === 32 ? 2.5 : 3;
  const circumference = 2 * Math.PI * radius;

  return React.createElement('div', {
    className: 'relative flex items-center justify-center flex-shrink-0',
    style: { width: `${size}px`, height: `${size}px` },
    title: `${completed}/${total} Complete`
  },
    React.createElement('svg', {
      className: 'transform -rotate-90',
      style: { width: `${size}px`, height: `${size}px` }
    },
      // Background circle
      React.createElement('circle', {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        stroke: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.5)',
        strokeWidth: strokeWidth,
        fill: 'none'
      }),
      // Progress circle
      React.createElement('circle', {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        stroke: progress === 100 ? '#10b981' : '#3b82f6',
        strokeWidth: strokeWidth,
        fill: 'none',
        strokeLinecap: 'round',
        strokeDasharray: `${circumference}`,
        strokeDashoffset: `${circumference * (1 - progress / 100)}`,
        style: { transition: 'stroke-dashoffset 0.3s ease' }
      })
    ),
    // Progress percentage text
    React.createElement('div', {
      className: `absolute inset-0 flex items-center justify-center text-[${size === 36 ? '10px' : '9px'}] font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
    }, `${progress}%`)
  );
}

// Render delete button with inline confirmation
export function renderDeleteButton(type, ids, isDeletePending, deleteItem, setDeleteConfirm, darkMode, isEditLocked, iconSize = 'w-4 h-4') {
  if (isEditLocked) return null;

  if (isDeletePending) {
    return React.createElement('div', {
      className: 'flex items-center gap-1 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-lg'
    },
      React.createElement('span', {
        className: 'text-xs font-semibold text-red-700 dark:text-red-300'
      }, 'Delete?'),
      React.createElement('button', {
        onClick: () => deleteItem(type, ids),
        className: 'px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded font-semibold'
      }, 'Yes'),
      React.createElement('button', {
        onClick: () => setDeleteConfirm(null),
        className: 'px-2 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded font-semibold'
      }, 'No')
    );
  }

  return React.createElement('button', {
    onClick: () => setDeleteConfirm({ type, ids }),
    className: `p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg btn-modern delete-shake transition-all`,
    title: 'Delete'
  },
    React.createElement(TrashIcon, { className: iconSize })
  );
}
