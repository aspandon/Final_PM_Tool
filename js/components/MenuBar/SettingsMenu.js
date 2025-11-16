// js/components/MenuBar/SettingsMenu.js

import { ChevronRight, Eye, EyeOff, Moon, Sun } from '../../shared/icons/index.js';

export function SettingsMenu({
  isOpen,
  onClose,
  darkMode,
  setDarkMode,
  hideProjectFields,
  setHideProjectFields,
  kanbanSettings,
  setKanbanSettings
}) {
  const { useState } = React;

  const [kanbanSubMenuOpen, setKanbanSubMenuOpen] = useState(false);

  if (!isOpen) return null;

  const menuItemClass = `flex items-center gap-3 px-4 py-2.5 text-sm dropdown-item ${
    darkMode
      ? 'text-gray-200 hover:bg-slate-600'
      : 'text-gray-700 hover:bg-gray-100'
  }`;

  return React.createElement('div', {
    className: `absolute top-full left-0 mt-1 w-56 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-slate-700' : 'border-gray-200'} py-1 z-[100] dropdown-enter`
  },
    // Kanban Settings (with sub-menu)
    React.createElement('div', {
      className: 'relative',
      onMouseEnter: () => setKanbanSubMenuOpen(true),
      onMouseLeave: () => setKanbanSubMenuOpen(false)
    },
      React.createElement('button', {
        onClick: (e) => {
          e.stopPropagation();
          setKanbanSubMenuOpen(!kanbanSubMenuOpen);
        },
        className: `${menuItemClass} justify-between`
      },
        React.createElement('div', { className: 'flex items-center gap-3' },
          React.createElement('svg', {
            className: 'w-4 h-4',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            viewBox: '0 0 24 24'
          },
            React.createElement('path', { d: 'M3 3h7v9H3z' }),
            React.createElement('path', { d: 'M14 3h7v5h-7z' }),
            React.createElement('path', { d: 'M14 12h7v9h-7z' }),
            React.createElement('path', { d: 'M3 16h7v5H3z' })
          ),
          'Kanban'
        ),
        React.createElement(ChevronRight, { className: 'w-4 h-4' })
      ),

      // Kanban Sub-menu
      kanbanSubMenuOpen && React.createElement('div', {
        className: `absolute left-full top-0 ml-1 w-64 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-slate-700' : 'border-gray-200'} p-4 z-[110] dropdown-enter`,
        onClick: (e) => e.stopPropagation()
      },
        React.createElement('div', {
          className: `text-xs font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
        }, 'Display on Kanban Cards'),

        // RAG Status Toggle
        React.createElement('div', {
          className: 'flex items-center justify-between mb-3'
        },
          React.createElement('span', {
            className: `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
          }, 'RAG Status'),
          React.createElement('button', {
            onClick: () => setKanbanSettings({...kanbanSettings, showRAG: !kanbanSettings.showRAG}),
            className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              kanbanSettings.showRAG
                ? 'bg-blue-600'
                : darkMode ? 'bg-slate-700' : 'bg-gray-300'
            }`
          },
            React.createElement('span', {
              className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                kanbanSettings.showRAG ? 'translate-x-6' : 'translate-x-1'
              }`
            })
          )
        ),

        // PM Toggle
        React.createElement('div', {
          className: 'flex items-center justify-between mb-3'
        },
          React.createElement('span', {
            className: `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
          }, 'Project Manager'),
          React.createElement('button', {
            onClick: () => setKanbanSettings({...kanbanSettings, showPM: !kanbanSettings.showPM}),
            className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              kanbanSettings.showPM
                ? 'bg-blue-600'
                : darkMode ? 'bg-slate-700' : 'bg-gray-300'
            }`
          },
            React.createElement('span', {
              className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                kanbanSettings.showPM ? 'translate-x-6' : 'translate-x-1'
              }`
            })
          )
        ),

        // BP Toggle
        React.createElement('div', {
          className: 'flex items-center justify-between mb-3'
        },
          React.createElement('span', {
            className: `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
          }, 'Business Partner'),
          React.createElement('button', {
            onClick: () => setKanbanSettings({...kanbanSettings, showBP: !kanbanSettings.showBP}),
            className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              kanbanSettings.showBP
                ? 'bg-blue-600'
                : darkMode ? 'bg-slate-700' : 'bg-gray-300'
            }`
          },
            React.createElement('span', {
              className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                kanbanSettings.showBP ? 'translate-x-6' : 'translate-x-1'
              }`
            })
          )
        ),

        // Division Toggle
        React.createElement('div', {
          className: 'flex items-center justify-between'
        },
          React.createElement('span', {
            className: `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
          }, 'Division'),
          React.createElement('button', {
            onClick: () => setKanbanSettings({...kanbanSettings, showDivision: !kanbanSettings.showDivision}),
            className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              kanbanSettings.showDivision
                ? 'bg-blue-600'
                : darkMode ? 'bg-slate-700' : 'bg-gray-300'
            }`
          },
            React.createElement('span', {
              className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                kanbanSettings.showDivision ? 'translate-x-6' : 'translate-x-1'
              }`
            })
          )
        )
      )
    ),

    // Divider
    React.createElement('div', {
      className: `my-1 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
    }),

    // Hide/Show Fields
    React.createElement('button', {
      onClick: (e) => {
        e.stopPropagation();
        setHideProjectFields(!hideProjectFields);
      },
      className: menuItemClass
    },
      React.createElement(hideProjectFields ? Eye : EyeOff, { className: 'w-4 h-4' }),
      hideProjectFields ? 'Show Project Fields' : 'Hide Project Fields'
    ),

    // Dark Mode Toggle
    React.createElement('button', {
      onClick: (e) => {
        e.stopPropagation();
        setDarkMode(!darkMode);
      },
      className: menuItemClass
    },
      React.createElement(darkMode ? Sun : Moon, { className: 'w-4 h-4' }),
      darkMode ? 'Light Mode' : 'Dark Mode'
    )
  );
}
