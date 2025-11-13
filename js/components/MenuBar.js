// js/components/MenuBar.js

/**
 * MenuBar Component
 * Displays dropdown menus for Files, Settings, and Help
 */

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
  const { useState } = React;

  const [filesMenuOpen, setFilesMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [kanbanSubMenuOpen, setKanbanSubMenuOpen] = useState(false);

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

  const ChevronRight = ({ className }) => React.createElement('svg', {
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
  }, [filesMenuOpen, settingsMenuOpen, helpMenuOpen]);

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
          : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-gray-300'
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
          // Add Project
          React.createElement('button', {
            onClick: (e) => {
              e.stopPropagation();
              addProject();
              setFilesMenuOpen(false);
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
              className: `absolute left-full top-0 ml-1 w-64 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-slate-700' : 'border-gray-200'} p-4 z-50`,
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
              className: 'p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl'
            },
              React.createElement(HelpCircle, { className: 'w-6 h-6 text-white' })
            ),
            React.createElement('h2', {
              className: `text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, 'PM Tool User Guide')
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
              className: `text-xl font-bold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }, '🎯 Purpose'),
            React.createElement('p', { className: 'mb-3' },
              'The Digital Development Project Management Tool is a comprehensive web-based application designed to streamline project planning, resource allocation, and portfolio management across multiple divisions and initiatives.'
            ),
            React.createElement('p', { className: 'mb-2' },
              'This tool helps you:'
            ),
            React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1 mb-3' },
              React.createElement('li', null, 'Plan and track multiple projects simultaneously across different phases'),
              React.createElement('li', null, 'Visualize project timelines with interactive Gantt charts'),
              React.createElement('li', null, 'Manage resource allocation for Project Managers, Business Partners, and external resources'),
              React.createElement('li', null, 'Monitor FTE (Full-Time Equivalent) distribution across divisions and time periods'),
              React.createElement('li', null, 'Compare planned timelines against actual execution dates'),
              React.createElement('li', null, 'Make data-driven decisions using visual analytics and filtering capabilities'),
              React.createElement('li', null, 'Maintain project portfolio data with automatic saving and Excel integration')
            )
          ),

          // Options Section
          React.createElement('section', { className: 'mb-8' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }, '⚙️ Options & Navigation'),
            React.createElement('p', { className: 'mb-4' },
              'The PM Tool provides multiple views and menu options to help you manage your projects effectively:'
            ),

            React.createElement('h4', {
              className: `font-bold text-lg mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, 'Application Tabs'),

            // Projects Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📋 Projects'),
              React.createElement('p', { className: 'mb-2' },
                'The Projects tab is where you create and manage all your project entries. Each project includes:'
              ),
              React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                React.createElement('li', null, 'Project name and division'),
                React.createElement('li', null, 'Project Manager and Business Partner assignments'),
                React.createElement('li', null, 'Resource allocations (PM, BP, External resources)'),
                React.createElement('li', null, 'Multiple project phases with start/finish dates:'),
                React.createElement('ul', { className: 'list-circle list-inside ml-8 mt-1 space-y-1' },
                  React.createElement('li', null, 'PSD & Inv. Proposal Preparation'),
                  React.createElement('li', null, 'Investment Approval'),
                  React.createElement('li', null, 'Procurement'),
                  React.createElement('li', null, 'Project Implementation (CAPEX Reg)'),
                  React.createElement('li', null, 'BP Implementation'),
                  React.createElement('li', null, 'Planned Investment Rec.')
                )
              ),
              React.createElement('p', { className: 'mt-3' },
                'Use the Lock/Unlock button (🔒/🔓) in the tab bar to prevent accidental edits to project data when reviewing or presenting.'
              )
            ),

            // Planner Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📅 Planner'),
              React.createElement('p', null,
                'Visual Gantt timeline showing all project phases across a calendar view. Color-coded bars represent different phases, making it easy to see project schedules at a glance and identify overlaps or gaps.'
              )
            ),

            // Kanban Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📋 Kanban'),
              React.createElement('p', { className: 'mb-2' },
                'Board view organizing projects into columns based on their phase status. Provides a visual workflow management system where projects can be moved between different phase stages.'
              ),
              React.createElement('p', { className: 'mb-2' },
                'Features customizable card display options (configure via Settings > Kanban):'
              ),
              React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                React.createElement('li', null, 'RAG Status - Red/Amber/Green project health indicators'),
                React.createElement('li', null, 'Project Manager - Show/hide PM assignments'),
                React.createElement('li', null, 'Business Partner - Show/hide BP assignments'),
                React.createElement('li', null, 'Division - Show/hide division labels')
              )
            ),

            // Resources Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '👥 Resources'),
              React.createElement('p', { className: 'mb-2' },
                'Per-person resource effort tracking showing:'
              ),
              React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                React.createElement('li', null, 'Individual PM and BP effort over time'),
                React.createElement('li', null, 'Consolidated totals (Total PM, Total BP)'),
                React.createElement('li', null, 'External resource tracking (PM External, QA External)'),
                React.createElement('li', null, 'BAU (Business As Usual) allocation overlay')
              )
            ),

            // Divisions Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📊 Divisions'),
              React.createElement('p', null,
                'Consolidated view showing FTE (Full-Time Equivalent) distribution across divisions over time. Visualize resource allocation by department using stacked bar charts.'
              )
            ),

            // Actuals Comparison Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📈 Actuals Comparison'),
              React.createElement('p', null,
                'Compare planned project timelines against actual execution dates. Identify delays or accelerations by visualizing planned vs. actual start and finish dates side-by-side.'
              )
            ),

            // Menu Options
            React.createElement('h4', {
              className: `font-bold text-lg mb-3 mt-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, 'Menu Options'),

            React.createElement('div', { className: 'space-y-3 ml-4' },
              React.createElement('div', null,
                React.createElement('h5', { className: 'font-bold mb-1' }, '📁 Files Menu'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Add Project - Create a new project entry'),
                  React.createElement('li', null, 'Import from Excel - Load projects from .xlsx/.xls file'),
                  React.createElement('li', null, 'Export to Excel - Save all projects to Excel'),
                  React.createElement('li', null, 'Clear All Data - Remove all projects and filters (with confirmation)')
                )
              ),
              React.createElement('div', null,
                React.createElement('h5', { className: 'font-bold mb-1' }, '⚙️ Settings Menu'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Hide/Show Project Fields - Toggle input form visibility'),
                  React.createElement('li', null, 'Light/Dark Mode - Switch color theme')
                )
              ),
              React.createElement('div', null,
                React.createElement('h5', { className: 'font-bold mb-1' }, '❓ Help Menu'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4' },
                  React.createElement('li', null, 'Guide - Open this comprehensive help documentation')
                )
              )
            )
          ),

          // Functionality Section
          React.createElement('section', { className: 'mb-8' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }, '⚡ Functionality'),
            React.createElement('p', { className: 'mb-4' },
              'The PM Tool includes powerful features to enhance your project management experience:'
            ),

            React.createElement('div', { className: 'space-y-3' },
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🔄 Auto-Save with Status Indicator'),
                React.createElement('p', { className: 'mb-2' },
                  'All changes to projects and filters are automatically saved to your browser\'s local storage. Your data persists across sessions and browser restarts.'
                ),
                React.createElement('p', null,
                  'Monitor the auto-save status in the top-right corner of the menu bar: Green indicator = "Auto-Save Active", Red indicator = "Save Error - Check Connection", Yellow pulsing = "Saving..."'
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🔍 Global Filters with Persistence'),
                React.createElement('p', { className: 'mb-2' },
                  'Filter your project portfolio by multiple criteria:'
                ),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Date Range - Focus on specific time periods'),
                  React.createElement('li', null, 'Divisions - Select one or multiple divisions'),
                  React.createElement('li', null, 'Projects - Choose specific projects to display'),
                  React.createElement('li', null, 'Project Managers & Business Partners - Filter by resource'),
                  React.createElement('li', null, 'External Resources - Toggle PM External and QA External visibility'),
                  React.createElement('li', null, 'BAU Allocation - Add constant monthly FTE values')
                ),
                React.createElement('p', { className: 'mt-2' },
                  'All filter choices are automatically saved and restored when you return to the application. Click "Apply" to activate filters, "Clear" to reset them.'
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '📥 Import/Export to Excel'),
                React.createElement('p', { className: 'mb-2' },
                  'Seamlessly integrate with Excel spreadsheets:'
                ),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Import - Upload .xlsx or .xls files to load projects'),
                  React.createElement('li', null, 'Export - Download your portfolio as "gantt_chart_projects.xlsx"'),
                  React.createElement('li', null, 'Backup - Regular exports ensure data safety'),
                  React.createElement('li', null, 'Sharing - Share Excel files with team members')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🌙 Dark Mode Support'),
                React.createElement('p', null,
                  'Toggle between light and dark themes via Settings menu for comfortable viewing in any environment. Theme preference is saved automatically.'
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '👁️ Hide/Show Project Fields'),
                React.createElement('p', null,
                  'Collapse project input forms to focus exclusively on charts and timelines, or expand them to edit project details. Perfect for presentations or data entry modes.'
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🏠 Back to Hub Navigation'),
                React.createElement('p', null,
                  'Quickly return to the Digital Development Hub landing page to switch between PM Tool and Action Items Tracker applications.'
                )
              )
            )
          ),

          // How to Use Section
          React.createElement('section', { className: 'mb-4' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }, '📖 How to Use the PM Tool'),
            React.createElement('p', { className: 'mb-4' },
              'Follow these steps to effectively manage your project portfolio:'
            ),

            React.createElement('div', { className: 'space-y-4' },
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-2' }, '1️⃣ Adding Projects'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Click Files > Add Project to create a new project entry'),
                  React.createElement('li', null, 'Fill in basic details: Project Name and Division'),
                  React.createElement('li', null, 'Assign resources: Project Manager and Business Partner'),
                  React.createElement('li', null, 'Enter allocation percentages as decimals (0.5 = 50% FTE, 1.0 = 100% FTE)'),
                  React.createElement('li', null, 'Add External Resource allocations if applicable'),
                  React.createElement('li', null, 'Define phase dates using the date pickers for each project phase')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-2' }, '2️⃣ Viewing & Analyzing Data'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Switch between tabs (Projects, Planner, Resources, Divisions, Actuals) to see different views'),
                  React.createElement('li', null, 'Use Planner tab for Gantt timeline visualization'),
                  React.createElement('li', null, 'Check Resources tab to monitor individual PM/BP workload'),
                  React.createElement('li', null, 'Review Divisions tab for departmental FTE distribution'),
                  React.createElement('li', null, 'Compare timelines in Actuals Comparison tab')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-2' }, '3️⃣ Filtering Your Portfolio'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Use Global Filters panel to narrow down your project view'),
                  React.createElement('li', null, 'Select date range to focus on specific time periods'),
                  React.createElement('li', null, 'Choose divisions, projects, PMs, or BPs from dropdown menus'),
                  React.createElement('li', null, 'Toggle External PM/QA checkboxes to include/exclude external resources'),
                  React.createElement('li', null, 'Click "Apply" to activate filters, "Clear" to reset')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-2' }, '4️⃣ Managing Data'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Delete projects using the delete button on each project card'),
                  React.createElement('li', null, 'Export to Excel regularly for backups (Files > Export to Excel)'),
                  React.createElement('li', null, 'Import existing Excel files (Files > Import from Excel)'),
                  React.createElement('li', null, 'Clear all data and start fresh (Files > Clear All Data)')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-2' }, '5️⃣ Best Practices'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Use consistent naming conventions for PMs and BPs across all projects'),
                  React.createElement('li', null, 'Keep allocation percentages accurate for reliable FTE calculations'),
                  React.createElement('li', null, 'Set realistic phase dates based on actual project timelines'),
                  React.createElement('li', null, 'Review the auto-save indicator to ensure data is being saved'),
                  React.createElement('li', null, 'Export your data regularly as an additional backup'),
                  React.createElement('li', null, 'Use Hide Fields when presenting to stakeholders for cleaner views'),
                  React.createElement('li', null, 'Apply filters to create focused reports for specific divisions or time periods')
                )
              )
            )
          ),

          // Quick Tips
          React.createElement('section', { className: 'mb-4 p-4 rounded-lg ' + (darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200') },
            React.createElement('h3', {
              className: `text-lg font-bold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }, '💡 Quick Tips'),

            React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
              React.createElement('li', null, 'Use consistent naming for Project Managers and Business Partners across projects for accurate resource tracking'),
              React.createElement('li', null, 'Enter allocation percentages as decimals (e.g., 0.5 for 50% FTE, 1.0 for 100% FTE)'),
              React.createElement('li', null, 'Set date ranges in Global Filters to zoom into specific time periods'),
              React.createElement('li', null, 'Use the Hide Fields option when presenting to focus on visualizations'),
              React.createElement('li', null, 'Export regularly to maintain backups of your project data'),
              React.createElement('li', null, 'BAU allocation adds a constant FTE value per month to all PMs or BPs')
            )
          )
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