// js/components/MenuBar/FileMenu.js

import { Plus, Upload, Download, Trash2 } from '../../shared/icons/index.js';

export function FileMenu({
  isOpen,
  onClose,
  addProject,
  onImportClick,
  exportToExcel,
  onClearAll,
  darkMode,
  setShowClearConfirmModal
}) {
  if (!isOpen) return null;

  const menuItemClass = `flex items-center gap-3 px-4 py-2.5 text-sm dropdown-item ${
    darkMode
      ? 'text-gray-200 hover:bg-slate-600'
      : 'text-gray-700 hover:bg-gray-100'
  }`;

  return React.createElement('div', {
    className: `absolute top-full left-0 mt-1 w-56 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-slate-700' : 'border-gray-200'} py-1 z-[100] dropdown-enter`
  },
    // Add Project
    React.createElement('button', {
      onClick: (e) => {
        e.stopPropagation();
        addProject();
        onClose();
      },
      className: menuItemClass
    },
      React.createElement(Plus, { className: 'w-4 h-4' }),
      'Add Project'
    ),

    // Import
    React.createElement('button', {
      onClick: (e) => {
        e.stopPropagation();
        onImportClick();
        onClose();
      },
      className: menuItemClass
    },
      React.createElement(Upload, { className: 'w-4 h-4' }),
      'Import from Excel'
    ),

    // Export
    React.createElement('button', {
      onClick: (e) => {
        e.stopPropagation();
        exportToExcel();
        onClose();
      },
      className: menuItemClass
    },
      React.createElement(Download, { className: 'w-4 h-4' }),
      'Export to Excel'
    ),

    // Divider
    React.createElement('div', {
      className: `my-1 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
    }),

    // Clear All
    React.createElement('button', {
      onClick: (e) => {
        e.stopPropagation();
        setShowClearConfirmModal(true);
        onClose();
      },
      className: `${menuItemClass} text-red-600 hover:text-red-700 ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`
    },
      React.createElement(Trash2, { className: 'w-4 h-4' }),
      'Clear All Data'
    )
  );
}
