// js/components/FilterPanel/FilterDropdowns.js

/**
 * FilterDropdowns Component
 * Contains all filter dropdown controls: Division, Project, PM, BP selectors, date pickers, and external resource checkboxes
 * Uses vanilla React.createElement() - NO JSX
 */

import { ChevronDown } from '../../shared/icons/index.js';

export function FilterDropdowns({
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  filterDivisions,
  setFilterDivisions,
  selectedProjects,
  setSelectedProjects,
  selectedPMs,
  setSelectedPMs,
  selectedBPs,
  setSelectedBPs,
  showExternalPM,
  setShowExternalPM,
  showExternalQA,
  setShowExternalQA,
  uniqueDivisions,
  uniquePMs,
  uniqueBPs,
  availableProjectsForDropdown,
  darkMode,
  projects
}) {
  // Local state for dropdown visibility
  const [showProjectDropdown, setShowProjectDropdown] = React.useState(false);
  const [showDivisionDropdown, setShowDivisionDropdown] = React.useState(false);
  const [showPMDropdown, setShowPMDropdown] = React.useState(false);
  const [showBPDropdown, setShowBPDropdown] = React.useState(false);

  // Division Helper Functions
  const toggleDivisionSelection = (division) => {
    setFilterDivisions(prev => {
      if (prev.includes(division)) {
        return prev.filter(d => d !== division);
      } else {
        return [...prev, division];
      }
    });
  };

  const selectAllDivisions = () => {
    setFilterDivisions([...uniqueDivisions]);
  };

  const deselectAllDivisions = () => {
    setFilterDivisions([]);
  };

  // Project Helper Functions
  const toggleProjectSelection = (projectName) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectName)) {
        return prev.filter(name => name !== projectName);
      } else {
        return [...prev, projectName];
      }
    });
  };

  const selectAllProjects = () => {
    setSelectedProjects(availableProjectsForDropdown.map(p => p.name));
  };

  const deselectAllProjects = () => {
    setSelectedProjects([]);
  };

  // PM Helper Functions
  const togglePMSelection = (pmName) => {
    setSelectedPMs(prev => {
      if (prev.includes(pmName)) {
        return prev.filter(name => name !== pmName);
      } else {
        return [...prev, pmName];
      }
    });
  };

  const selectAllPMs = () => {
    setSelectedPMs([...uniquePMs]);
    setShowExternalPM(true);
    setShowExternalQA(true);
  };

  const deselectAllPMs = () => {
    setSelectedPMs([]);
    setShowExternalPM(false);
    setShowExternalQA(false);
  };

  // BP Helper Functions
  const toggleBPSelection = (bpName) => {
    setSelectedBPs(prev => {
      if (prev.includes(bpName)) {
        return prev.filter(name => name !== bpName);
      } else {
        return [...prev, bpName];
      }
    });
  };

  const selectAllBPs = () => {
    setSelectedBPs([...uniqueBPs]);
  };

  const deselectAllBPs = () => {
    setSelectedBPs([]);
  };

  // Helper to get PM selection display text
  const getPMSelectionText = () => {
    const internalCount = selectedPMs.length;
    const externalCount = (showExternalPM ? 1 : 0) + (showExternalQA ? 1 : 0);
    const totalCount = internalCount + externalCount;

    if (totalCount === 0) {
      return 'All PMs';
    }

    const parts = [];
    if (internalCount > 0) {
      parts.push(`${internalCount} PM${internalCount > 1 ? 's' : ''}`);
    }
    if (showExternalPM) {
      parts.push('Ext PM');
    }
    if (showExternalQA) {
      parts.push('Ext QA');
    }

    return parts.join(', ');
  };

  // Main filter controls container
  return React.createElement('div', {
    className: 'flex flex-wrap items-end gap-3 mb-4'
  },
    // Division Filter
    React.createElement('div', {
      className: 'flex-1 min-w-[180px] relative'
    },
      React.createElement('label', {
        className: `block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`
      }, 'Division'),
      React.createElement('button', {
        onClick: () => setShowDivisionDropdown(!showDivisionDropdown),
        className: `w-full px-2 py-1 text-sm border rounded text-left flex items-center justify-between btn-modern ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white text-gray-900 input-glow'}`
      },
        React.createElement('span', { className: 'truncate' },
          filterDivisions.length === 0
            ? 'All Divisions'
            : filterDivisions.length === uniqueDivisions.length
            ? 'All Divisions Selected'
            : `${filterDivisions.length} Selected`
        ),
        React.createElement(ChevronDown, { className: 'w-4 h-4 ml-1' })
      ),

      // Division Dropdown
      showDivisionDropdown && React.createElement('div', {
        className: `absolute z-10 mt-1 w-full ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'} border rounded-lg shadow-xl max-h-60 overflow-y-auto dropdown-enter`,
        onMouseLeave: () => setShowDivisionDropdown(false)
      },
        // Dropdown header with buttons
        React.createElement('div', {
          className: `sticky top-0 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'} p-2 border-b flex gap-2`
        },
          React.createElement('button', {
            onClick: selectAllDivisions,
            className: 'flex-1 px-2 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium shadow-sm btn-modern ripple btn-pulse'
          }, 'Select All'),
          React.createElement('button', {
            onClick: deselectAllDivisions,
            className: 'flex-1 px-2 py-1.5 text-xs bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 font-medium shadow-sm btn-modern ripple btn-pulse'
          }, 'Clear All')
        ),
        // Division options
        uniqueDivisions.map((division) =>
          React.createElement('label', {
            key: division,
            className: `flex items-center px-4 py-3 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'} cursor-pointer border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'} transition-colors`
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: filterDivisions.includes(division),
              onChange: () => toggleDivisionSelection(division),
              className: 'mr-3 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
            }),
            React.createElement('span', {
              className: `text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`
            }, division)
          )
        )
      )
    ),

    // Business Partner Filter
    React.createElement('div', {
      className: 'flex-1 min-w-[180px] relative'
    },
      React.createElement('label', {
        className: `block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`
      }, 'Business Partner'),
      React.createElement('button', {
        onClick: () => setShowBPDropdown(!showBPDropdown),
        className: `w-full px-2 py-1 text-sm border rounded text-left flex items-center justify-between btn-modern ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white text-gray-900 input-glow'}`
      },
        React.createElement('span', { className: 'truncate' },
          selectedBPs.length === 0
            ? 'All BPs'
            : selectedBPs.length === uniqueBPs.length
            ? 'All BPs Selected'
            : `${selectedBPs.length} Selected`
        ),
        React.createElement(ChevronDown, { className: 'w-4 h-4 ml-1' })
      ),

      // BP Dropdown
      showBPDropdown && React.createElement('div', {
        className: `absolute z-10 mt-1 w-full ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} border rounded shadow-lg max-h-60 overflow-y-auto dropdown-enter`,
        onMouseLeave: () => setShowBPDropdown(false)
      },
        React.createElement('div', {
          className: `sticky top-0 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-300'} p-2 border-b flex gap-2`
        },
          React.createElement('button', {
            onClick: selectAllBPs,
            className: 'flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600'
          }, 'Select All'),
          React.createElement('button', {
            onClick: deselectAllBPs,
            className: 'flex-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600'
          }, 'Clear All')
        ),
        uniqueBPs.length > 0 ? uniqueBPs.map((bp) =>
          React.createElement('label', {
            key: bp,
            className: `flex items-center px-3 py-2 ${darkMode ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-gray-50 border-gray-100'} cursor-pointer border-b`
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: selectedBPs.includes(bp),
              onChange: () => toggleBPSelection(bp),
              className: 'mr-2'
            }),
            React.createElement('span', {
              className: `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`
            }, bp)
          )
        ) : React.createElement('div', {
          className: `px-3 py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
        }, 'No BPs assigned yet')
      )
    ),

    // Project Manager Filter
    React.createElement('div', {
      className: 'flex-1 min-w-[180px] relative'
    },
      React.createElement('label', {
        className: `block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`
      }, 'Project Manager'),
      React.createElement('button', {
        onClick: () => setShowPMDropdown(!showPMDropdown),
        className: `w-full px-2 py-1 text-sm border rounded text-left flex items-center justify-between btn-modern ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white text-gray-900 input-glow'}`
      },
        React.createElement('span', { className: 'truncate' }, getPMSelectionText()),
        React.createElement(ChevronDown, { className: 'w-4 h-4 ml-1' })
      ),

      // PM Dropdown
      showPMDropdown && React.createElement('div', {
        className: `absolute z-10 mt-1 w-full ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} border rounded shadow-lg max-h-60 overflow-y-auto dropdown-enter`,
        onMouseLeave: () => setShowPMDropdown(false)
      },
        React.createElement('div', {
          className: `sticky top-0 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-300'} p-2 border-b flex gap-2`
        },
          React.createElement('button', {
            onClick: selectAllPMs,
            className: 'flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600'
          }, 'Select All'),
          React.createElement('button', {
            onClick: deselectAllPMs,
            className: 'flex-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600'
          }, 'Clear All')
        ),

        // External Resources Section
        React.createElement('div', {
          className: `${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-blue-50 border-blue-200'} border-b-2`
        },
          React.createElement('div', {
            className: `px-3 py-1 text-xs font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`
          }, 'External Resources'),
          React.createElement('label', {
            className: `flex items-center px-3 py-2 ${darkMode ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-blue-100 border-blue-100'} cursor-pointer border-b`
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: showExternalPM,
              onChange: (e) => setShowExternalPM(e.target.checked),
              className: 'mr-2'
            }),
            React.createElement('span', {
              className: `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`
            }, 'External PM')
          ),
          React.createElement('label', {
            className: `flex items-center px-3 py-2 ${darkMode ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-blue-100 border-blue-100'} cursor-pointer border-b`
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: showExternalQA,
              onChange: (e) => setShowExternalQA(e.target.checked),
              className: 'mr-2'
            }),
            React.createElement('span', {
              className: `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`
            }, 'External QA')
          )
        ),

        // Internal PMs Section
        uniquePMs.length > 0 && React.createElement('div', {
          className: `${darkMode ? 'bg-slate-800' : 'bg-white'}`
        },
          React.createElement('div', {
            className: `px-3 py-1 text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
          }, 'Internal Project Managers'),
          uniquePMs.map((pm) =>
            React.createElement('label', {
              key: pm,
              className: `flex items-center px-3 py-2 ${darkMode ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-gray-50 border-gray-100'} cursor-pointer border-b`
            },
              React.createElement('input', {
                type: 'checkbox',
                checked: selectedPMs.includes(pm),
                onChange: () => togglePMSelection(pm),
                className: 'mr-2'
              }),
              React.createElement('span', {
                className: `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`
              }, pm)
            )
          )
        ),

        uniquePMs.length === 0 && React.createElement('div', {
          className: `px-3 py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
        }, 'No PMs assigned yet')
      )
    ),

    // Select Projects Filter
    React.createElement('div', {
      className: 'flex-1 min-w-[180px] relative'
    },
      React.createElement('label', {
        className: `block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`
      }, 'Select Projects'),
      React.createElement('button', {
        onClick: () => setShowProjectDropdown(!showProjectDropdown),
        className: `w-full px-2 py-1 text-sm border rounded text-left flex items-center justify-between btn-modern ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white text-gray-900 input-glow'}`
      },
        React.createElement('span', { className: 'truncate' },
          selectedProjects.length === 0
            ? 'All Projects'
            : selectedProjects.length === projects.length
            ? 'All Projects Selected'
            : `${selectedProjects.length} Selected`
        ),
        React.createElement(ChevronDown, { className: 'w-4 h-4 ml-1' })
      ),

      // Project Dropdown
      showProjectDropdown && React.createElement('div', {
        className: `absolute z-10 mt-1 w-full ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} border rounded shadow-lg max-h-60 overflow-y-auto dropdown-enter`,
        onMouseLeave: () => setShowProjectDropdown(false)
      },
        React.createElement('div', {
          className: `sticky top-0 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-300'} p-2 border-b flex gap-2`
        },
          React.createElement('button', {
            onClick: selectAllProjects,
            className: 'flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600'
          }, 'Select All'),
          React.createElement('button', {
            onClick: deselectAllProjects,
            className: 'flex-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600'
          }, 'Clear All')
        ),
        availableProjectsForDropdown.map((project, idx) =>
          React.createElement('label', {
            key: idx,
            className: `flex items-center px-3 py-2 ${darkMode ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-gray-50 border-gray-100'} cursor-pointer border-b`
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: selectedProjects.includes(project.name),
              onChange: () => toggleProjectSelection(project.name),
              className: 'mr-2'
            }),
            React.createElement('span', {
              className: `text-sm flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`
            }, project.name),
            React.createElement('span', {
              className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
            }, project.division)
          )
        )
      )
    ),

    // Start Date
    React.createElement('div', {
      className: 'flex-1 min-w-[150px]'
    },
      React.createElement('label', {
        className: `block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`
      }, 'Start Date'),
      React.createElement('input', {
        type: 'date',
        value: filterStartDate,
        onChange: (e) => setFilterStartDate(e.target.value),
        className: `w-full px-2 py-1 text-sm border rounded ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white text-gray-900 input-glow'}`
      })
    ),

    // End Date
    React.createElement('div', {
      className: 'flex-1 min-w-[150px]'
    },
      React.createElement('label', {
        className: `block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`
      }, 'End Date'),
      React.createElement('input', {
        type: 'date',
        value: filterEndDate,
        onChange: (e) => setFilterEndDate(e.target.value),
        className: `w-full px-2 py-1 text-sm border rounded ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white text-gray-900 input-glow'}`
      })
    )
  );
}
