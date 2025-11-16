// js/components/MenuBar/index.js

/**
 * MenuBar Component
 * Displays dropdown menus for Files, Settings, and Help
 */

import { ChevronDown, Trash2 } from '../../shared/icons/index.js';
import { FileMenu } from './FileMenu.js';
import { SettingsMenu } from './SettingsMenu.js';
import { HelpMenu } from './HelpMenu.js';

export function MenuBar({
  addProject,
  onImportClick,
  exportToExcel,
  onClearAll,
  hideProjectFields,
  setHideProjectFields,
  darkMode,
  setDarkMode,
  kanbanSettings,
  setKanbanSettings,
  saveStatus
}) {
  const { useState, useEffect } = React;

  const [filesMenuOpen, setFilesMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setFilesMenuOpen(false);
      setSettingsMenuOpen(false);
      setHelpMenuOpen(false);
    };

    if (filesMenuOpen || settingsMenuOpen || helpMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [filesMenuOpen, settingsMenuOpen, helpMenuOpen]);

  const menuButtonClass = `flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all btn-modern ripple ${
    darkMode
      ? 'text-gray-100 hover:bg-slate-600'
      : 'text-gray-800 hover:bg-gray-200'
  }`;

  return React.createElement('div', null,
    // Menu Bar
    React.createElement('div', {
      className: `mb-4 flex gap-2 shadow-md relative z-[100] ${
        darkMode
          ? 'glass-dark border-animated-dark'
          : 'glass border-animated'
      } py-1 px-2 rounded-lg`
    },
      // Files Menu
      React.createElement('div', {
        className: 'relative',
        onClick: (e) => {
          e.stopPropagation();
          setFilesMenuOpen(!filesMenuOpen);
          setSettingsMenuOpen(false);
          setHelpMenuOpen(false);
        }
      },
        React.createElement('button', {
          className: menuButtonClass
        },
          'Files',
          React.createElement(ChevronDown, { className: 'w-4 h-4' })
        ),

        // Files Dropdown
        React.createElement(FileMenu, {
          isOpen: filesMenuOpen,
          onClose: () => setFilesMenuOpen(false),
          addProject,
          onImportClick,
          exportToExcel,
          onClearAll,
          darkMode,
          setShowClearConfirmModal
        })
      ),

      // Settings Menu
      React.createElement('div', {
        className: 'relative',
        onClick: (e) => {
          e.stopPropagation();
          setSettingsMenuOpen(!settingsMenuOpen);
          setFilesMenuOpen(false);
          setHelpMenuOpen(false);
        }
      },
        React.createElement('button', {
          className: menuButtonClass
        },
          'Settings',
          React.createElement(ChevronDown, { className: 'w-4 h-4' })
        ),

        // Settings Dropdown
        React.createElement(SettingsMenu, {
          isOpen: settingsMenuOpen,
          onClose: () => setSettingsMenuOpen(false),
          darkMode,
          setDarkMode,
          hideProjectFields,
          setHideProjectFields,
          kanbanSettings,
          setKanbanSettings
        })
      ),

      // Help Menu
      React.createElement('div', {
        className: 'relative',
        onClick: (e) => {
          e.stopPropagation();
          setHelpMenuOpen(!helpMenuOpen);
          setFilesMenuOpen(false);
          setSettingsMenuOpen(false);
        }
      },
        React.createElement('button', {
          className: menuButtonClass
        },
          'Help',
          React.createElement(ChevronDown, { className: 'w-4 h-4' })
        ),

        // Help Dropdown
        React.createElement(HelpMenu, {
          isOpen: helpMenuOpen,
          onClose: () => setHelpMenuOpen(false),
          darkMode,
          showHelpModal,
          setShowHelpModal
        })
      ),

      // Auto-Save Status Indicator
      React.createElement('div', {
        className: 'ml-auto flex items-center gap-2 px-3 py-1.5 save-indicator'
      },
        // Status dot
        React.createElement('div', {
          className: `w-2.5 h-2.5 rounded-full ${
            saveStatus === 'success'
              ? 'bg-green-500 save-success glow-green'
              : saveStatus === 'error'
              ? 'bg-red-500 glow-red'
              : 'bg-yellow-500 pulse-dot'
          }`
        }),
        // Status text
        React.createElement('span', {
          className: `text-xs font-medium ${
            saveStatus === 'success'
              ? darkMode ? 'text-green-400' : 'text-green-600'
              : saveStatus === 'error'
              ? darkMode ? 'text-red-400' : 'text-red-600'
              : darkMode ? 'text-yellow-400' : 'text-yellow-600'
          }`
        },
          saveStatus === 'success'
            ? 'Auto-Save Active'
            : saveStatus === 'error'
            ? 'Save Error - Check Connection'
            : 'Saving...'
        )
      )
    ),

    // Clear All Confirmation Modal
    showClearConfirmModal && React.createElement('div', {
      className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4',
      onClick: () => setShowClearConfirmModal(false)
    },
      React.createElement('div', {
        className: `${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full`,
        onClick: (e) => e.stopPropagation()
      },
        // Modal Header
        React.createElement('div', {
          className: `flex items-center gap-3 p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
        },
          React.createElement('div', {
            className: 'p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl'
          },
            React.createElement(Trash2, { className: 'w-6 h-6 text-white' })
          ),
          React.createElement('h2', {
            className: `text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
          }, 'Clear All Data')
        ),

        // Modal Content
        React.createElement('div', {
          className: `p-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
        },
          React.createElement('p', { className: 'mb-4' },
            'Are you sure you want to clear all project data? This action cannot be undone.'
          ),
          React.createElement('p', { className: 'text-sm font-semibold' },
            'All projects, phases, and resource allocations will be permanently deleted.'
          )
        ),

        // Modal Actions
        React.createElement('div', {
          className: `flex gap-3 p-6 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
        },
          // No button
          React.createElement('button', {
            onClick: () => setShowClearConfirmModal(false),
            className: `flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${darkMode ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }, 'No, Cancel'),
          // Yes button
          React.createElement('button', {
            onClick: () => {
              onClearAll();
              setShowClearConfirmModal(false);
            },
            className: 'flex-1 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md'
          }, 'Yes, Clear All')
        )
      )
    )
  );
}
