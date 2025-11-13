// js/actions/components/MenuBar.js

/**
 * MenuBar Component for Actions App
 * Displays dropdown menus for Files and Settings
 */

export function MenuBar({
  addAction,
  onImportClick,
  exportToExcel,
  onClearAll,
  hideActionFields,
  setHideActionFields,
  darkMode,
  setDarkMode,
  saveStatus
}) {
  const { useState } = React;

  const [filesMenuOpen, setFilesMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Icon components
  const ChevronDown = ({ className }) => React.createElement('svg', {
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

  const Plus = ({ className }) => React.createElement('svg', {
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

  const Upload = ({ className }) => React.createElement('svg', {
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

  const Download = ({ className }) => React.createElement('svg', {
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

  const Trash2 = ({ className }) => React.createElement('svg', {
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

  const EyeOff = ({ className }) => React.createElement('svg', {
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

  const Eye = ({ className }) => React.createElement('svg', {
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

  const Moon = ({ className }) => React.createElement('svg', {
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

  const Sun = ({ className }) => React.createElement('svg', {
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

  const X = ({ className }) => React.createElement('svg', {
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

  const HelpCircle = ({ className }) => React.createElement('svg', {
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

  // Close menus when clicking outside
  React.useEffect(() => {
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
  }, [filesMenuOpen, settingsMenuOpen]);

  const menuButtonClass = `flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
    darkMode
      ? 'text-gray-100 hover:bg-slate-600'
      : 'text-gray-800 hover:bg-gray-200'
  }`;

  const menuItemClass = `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
    darkMode
      ? 'text-gray-200 hover:bg-slate-600'
      : 'text-gray-700 hover:bg-gray-100'
  }`;

  return React.createElement('div', null,
    // Menu Bar
    React.createElement('div', {
      className: `mb-4 flex gap-2 shadow-md ${
        darkMode
          ? 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600'
          : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-indigo-300'
      } py-1 px-2 rounded-lg border`
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
      filesMenuOpen && React.createElement('div', {
        className: `absolute top-full left-0 mt-1 w-56 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-slate-700' : 'border-gray-200'} py-1 z-50`
      },
        // Add Action
        React.createElement('button', {
          onClick: (e) => {
            e.stopPropagation();
            addAction();
            setFilesMenuOpen(false);
          },
          className: menuItemClass
        },
          React.createElement(Plus, { className: 'w-4 h-4' }),
          'Add Action'
        ),

        // Import
        React.createElement('button', {
          onClick: (e) => {
            e.stopPropagation();
            onImportClick();
            setFilesMenuOpen(false);
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
            setFilesMenuOpen(false);
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
            setFilesMenuOpen(false);
          },
          className: `${menuItemClass} text-red-600 hover:text-red-700 ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`
        },
          React.createElement(Trash2, { className: 'w-4 h-4' }),
          'Clear All Data'
        )
      )
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
      settingsMenuOpen && React.createElement('div', {
        className: `absolute top-full left-0 mt-1 w-56 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-slate-700' : 'border-gray-200'} py-1 z-50`
      },
        // Hide/Show Fields
        React.createElement('button', {
          onClick: (e) => {
            e.stopPropagation();
            setHideActionFields(!hideActionFields);
          },
          className: menuItemClass
        },
          React.createElement(hideActionFields ? Eye : EyeOff, { className: 'w-4 h-4' }),
          hideActionFields ? 'Show Action Fields' : 'Hide Action Fields'
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
      )
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
      helpMenuOpen && React.createElement('div', {
        className: `absolute top-full left-0 mt-1 w-56 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-slate-700' : 'border-gray-200'} py-1 z-50`
      },
        React.createElement('button', {
          onClick: (e) => {
            e.stopPropagation();
            setShowHelpModal(true);
            setHelpMenuOpen(false);
          },
          className: menuItemClass
        },
          React.createElement(HelpCircle, { className: 'w-4 h-4' }),
          'Guide'
        )
      )
    ),

    // Auto-Save Status Indicator
    React.createElement('div', {
      className: 'ml-auto flex items-center gap-2 px-3 py-1.5'
    },
      // Status dot
      React.createElement('div', {
        className: `w-2.5 h-2.5 rounded-full ${
          saveStatus === 'success'
            ? 'bg-green-500'
            : saveStatus === 'error'
            ? 'bg-red-500'
            : 'bg-yellow-500 animate-pulse'
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
            'Are you sure you want to clear all action items? This action cannot be undone.'
          ),
          React.createElement('p', { className: 'text-sm font-semibold' },
            'All actions and their data will be permanently deleted.'
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
    ),

    // Help Modal
    showHelpModal && React.createElement('div', {
      className: 'fixed inset-0 bg-black/50 flex items-start justify-center z-[100] p-4 pt-8 overflow-y-auto',
      onClick: () => setShowHelpModal(false)
    },
      React.createElement('div', {
        className: `${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`,
        onClick: (e) => e.stopPropagation()
      },
        // Modal Header
        React.createElement('div', {
          className: `flex items-center justify-between p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
        },
          React.createElement('div', {
            className: 'flex items-center gap-3'
          },
            React.createElement('div', {
              className: 'p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl'
            },
              React.createElement(HelpCircle, { className: 'w-6 h-6 text-white' })
            ),
            React.createElement('h2', {
              className: `text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, 'Action Items Tracker - User Guide')
          ),
          React.createElement('button', {
            onClick: () => setShowHelpModal(false),
            className: `p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`
          },
            React.createElement(X, { className: 'w-5 h-5' })
          )
        ),

        // Modal Content
        React.createElement('div', {
          className: `p-6 overflow-y-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
        },
          // Purpose Section
          React.createElement('section', { className: 'mb-8' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
            }, 'Purpose'),
            React.createElement('p', { className: 'mb-2' },
              'The Action Items Tracker is a comprehensive task and deliverable management system designed to help organizations track, monitor, and manage action items across multiple departments and business initiatives. It provides a centralized platform for capturing all critical actions, decisions, and studies with detailed context, progress tracking, and ownership assignment.'
            ),
            React.createElement('p', { className: 'mt-3' },
              'The application offers three distinct views: Actions for data entry, Slides for presentation, and Gantt for timeline visualization - making it easy to manage, present, and track your initiatives.'
            )
          ),

          // Key Abilities Section
          React.createElement('section', { className: 'mb-8' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
            }, 'Key Abilities'),

            React.createElement('div', { className: 'space-y-3' },
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🔄 Auto-Save'),
                React.createElement('p', null, 'All action items are automatically saved to your browser\'s local storage. Your data persists across sessions without manual saving.')
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '📊 Progress Tracking'),
                React.createElement('p', null, 'Track completion progress for each action with percentage-based indicators from 0% to 100% in 5% increments.')
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '📥 Import/Export'),
                React.createElement('p', null, 'Import action items from Excel spreadsheets or export your current actions to Excel for sharing, backup, or external analysis.')
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🎨 Dark Mode'),
                React.createElement('p', null, 'Toggle between light and dark themes for comfortable viewing in any lighting environment.')
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '👁️ Hide/Show Fields'),
                React.createElement('p', null, 'Collapse action entry forms to focus on review mode, or expand them to edit and add new items.')
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🏢 Multi-Department Support'),
                React.createElement('p', null, 'Track actions across different departments with clear departmental ownership and accountability.')
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '📋 Activities Tracking'),
                React.createElement('p', null, 'Break down each action into detailed activities with individual timelines, progress tracking, and key achievements.')
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '📊 Multiple Views'),
                React.createElement('p', null, 'Switch between Actions tab for data entry, Slides tab for professional presentation format, and Gantt tab for timeline visualization.')
              )
            )
          ),

          // Application Tabs Section
          React.createElement('section', { className: 'mb-8' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
            }, 'Application Tabs'),

            React.createElement('div', { className: 'space-y-4' },
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '✓ Actions Tab'),
                React.createElement('p', null, 'Primary data entry view where you create and manage action items. Each action can contain multiple activities with their own timelines and progress tracking. Rich text editing enables formatting of detailed scope, team members, investment needs, value capture, and key achievements.')
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📊 Slides Tab'),
                React.createElement('p', null, 'Professional presentation format displaying each action as a polished slide. Features include progress bars in action headers, two-column layouts for organized information display, and circular progress indicators for activities showing completion percentages visually alongside timeline information.')
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📅 Gantt Tab'),
                React.createElement('p', null, 'Interactive timeline visualization showing all activities across a calendar grid organized by years and quarters. Activity bars display progress with percentage labels, making it easy to see project schedules, identify overlaps, and track completion status at a glance.')
              )
            )
          ),

          // Action Fields & Functionality Section
          React.createElement('section', { className: 'mb-8' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
            }, 'Action Fields & Functionality'),

            React.createElement('div', { className: 'space-y-4' },
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold text-lg mb-2' }, 'Core Information'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, React.createElement('strong', null, 'Title:'), ' Brief description of the action item'),
                  React.createElement('li', null, React.createElement('strong', null, 'Department:'), ' Responsible department or organizational unit'),
                  React.createElement('li', null, React.createElement('strong', null, 'Classification:'), ' Choose from Action, Decision, or Risk to categorize the work type'),
                  React.createElement('li', null, React.createElement('strong', null, 'Progress:'), ' Select completion percentage from 0% to 100% in 5% increments'),
                  React.createElement('li', null, React.createElement('strong', null, 'Initiative Owner:'), ' Person responsible for the overall action')
                )
              ),

              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold text-lg mb-2' }, 'Activities'),
                React.createElement('p', { className: 'mb-2' }, 'Break down each action into specific activities. Each activity includes:'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, React.createElement('strong', null, 'Title:'), ' Name of the activity'),
                  React.createElement('li', null, React.createElement('strong', null, 'Start Date:'), ' Activity start date'),
                  React.createElement('li', null, React.createElement('strong', null, 'Finish Date:'), ' Activity completion date'),
                  React.createElement('li', null, React.createElement('strong', null, 'Progress:'), ' Activity completion percentage'),
                  React.createElement('li', null, React.createElement('strong', null, 'Key Achievements:'), ' Major milestones or accomplishments for this activity')
                ),
                React.createElement('p', { className: 'mt-2' }, 'Activities appear with circular progress indicators in the Slides tab and as timeline bars in the Gantt tab.')
              ),

              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold text-lg mb-2' }, 'Detailed Context'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, React.createElement('strong', null, 'Scope:'), ' Detailed description of work boundaries and deliverables'),
                  React.createElement('li', null, React.createElement('strong', null, 'Team Members:'), ' Supporting team members or stakeholders'),
                  React.createElement('li', null, React.createElement('strong', null, 'Investment Need:'), ' Budget or resource requirements'),
                  React.createElement('li', null, React.createElement('strong', null, 'Value Capture:'), ' Expected benefits, outcomes, or business value'),
                  React.createElement('li', null, React.createElement('strong', null, 'Key Achievements:'), ' Milestones completed or major wins')
                )
              )
            )
          ),

          // Menu Reference Section
          React.createElement('section', { className: 'mb-8' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
            }, 'Menu Reference'),

            React.createElement('div', { className: 'space-y-3' },
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, 'Files Menu'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Add Action - Create a new action item entry'),
                  React.createElement('li', null, 'Import from Excel - Load actions from .xlsx/.xls file'),
                  React.createElement('li', null, 'Export to Excel - Save all actions to Excel'),
                  React.createElement('li', null, 'Clear All Data - Remove all action items (with confirmation)')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, 'Settings Menu'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Hide/Show Action Fields - Toggle entry form visibility'),
                  React.createElement('li', null, 'Light/Dark Mode - Switch color theme')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, 'Help Menu'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4' },
                  React.createElement('li', null, 'Guide - Open this comprehensive help documentation')
                )
              )
            )
          ),

          // Best Practices Section
          React.createElement('section', { className: 'mb-4' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
            }, 'Best Practices'),

            React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
              React.createElement('li', null, 'Use clear, action-oriented descriptions for each action item'),
              React.createElement('li', null, 'Update progress percentages regularly to maintain accurate tracking'),
              React.createElement('li', null, 'Assign specific owners to ensure accountability'),
              React.createElement('li', null, 'Link actions to business initiatives for strategic alignment'),
              React.createElement('li', null, 'Document value capture to demonstrate ROI and business impact'),
              React.createElement('li', null, 'Export regularly to maintain backups of your action items'),
              React.createElement('li', null, 'Use Classification to organize and filter different work types'),
              React.createElement('li', null, 'Keep Team Members field updated to maintain transparency')
            )
          )
        )
      )
    )
  );
}