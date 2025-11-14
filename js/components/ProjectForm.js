// js/components/ProjectForm.js

/**
 * ProjectForm Component
 * Displays a comprehensive form for entering and editing project data including
 * team members, phases, allocations, and timelines
 */

export function ProjectForm({
  project,
  pIndex,
  updateProject,
  updatePhase,
  deleteProject,
  phases,
  darkMode,
  isEditLocked = false
}) {
  // Modern Icon Component for Project
  const Briefcase = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('rect', { width: '20', height: '14', x: '2', y: '7', rx: '2', ry: '2' }),
    React.createElement('path', { d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' })
  );

  // Calculate budget totals
  const calculateBudgetTotals = () => {
    const capexYear1 = parseFloat(project.capexYear1) || 0;
    const capexYear2 = parseFloat(project.capexYear2) || 0;
    const capexYear3 = parseFloat(project.capexYear3) || 0;
    const capexYear4 = parseFloat(project.capexYear4) || 0;
    const capexYear5 = parseFloat(project.capexYear5) || 0;

    const opexYear1 = parseFloat(project.opexYear1) || 0;
    const opexYear2 = parseFloat(project.opexYear2) || 0;
    const opexYear3 = parseFloat(project.opexYear3) || 0;
    const opexYear4 = parseFloat(project.opexYear4) || 0;
    const opexYear5 = parseFloat(project.opexYear5) || 0;

    const totalCapex = capexYear1 + capexYear2 + capexYear3 + capexYear4 + capexYear5;
    const totalOpex = opexYear1 + opexYear2 + opexYear3 + opexYear4 + opexYear5;
    const totalBudget = totalCapex + totalOpex;

    const totalYear1 = capexYear1 + opexYear1;
    const totalYear2 = capexYear2 + opexYear2;
    const totalYear3 = capexYear3 + opexYear3;
    const totalYear4 = capexYear4 + opexYear4;
    const totalYear5 = capexYear5 + opexYear5;

    return {
      totalCapex,
      totalOpex,
      totalBudget,
      totalYear1,
      totalYear2,
      totalYear3,
      totalYear4,
      totalYear5
    };
  };

  const budgetTotals = calculateBudgetTotals();
  const firstYear = parseInt(project.budgetFirstYear) || new Date().getFullYear();

  return React.createElement('div', {
    key: pIndex,
    className: `relative border-4 card-modern card-glow ${
      isEditLocked
        ? 'border-red-500 glow-red'
        : darkMode ? 'border-slate-600' : 'border-gray-200'
    } ${darkMode ? 'bg-slate-800 hover:border-blue-500' : 'bg-white hover:border-blue-300'} rounded-xl overflow-hidden shadow-md`,
    style: isEditLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}
  },
    // Compact Header
    React.createElement('div', {
      className: 'px-3 py-2',
      style: {
        background: darkMode
          ? 'linear-gradient(to right, rgba(51, 65, 85, 0.85), rgba(71, 85, 105, 0.85))'
          : 'linear-gradient(to right, rgba(147, 197, 253, 0.85), rgba(165, 180, 252, 0.85))'
      }
    },
      React.createElement('div', {
        className: 'flex items-center gap-2'
      },
        React.createElement(Briefcase, {
          className: 'w-6 h-6 flex-shrink-0 text-blue-500'
        }),
        React.createElement('input', {
          type: 'text',
          value: project.name,
          onChange: (e) => updateProject(pIndex, 'name', e.target.value),
          className: `flex-1 text-base font-bold px-3 py-1.5 border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white input-glow'} rounded-lg placeholder-gray-400 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          placeholder: 'Project Name',
          disabled: isEditLocked
        }),
        React.createElement('input', {
          type: 'text',
          value: project.division,
          onChange: (e) => updateProject(pIndex, 'division', e.target.value),
          className: `w-36 text-sm font-semibold px-3 py-1.5 border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white input-glow'} rounded-lg placeholder-gray-400 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          placeholder: 'Division',
          disabled: isEditLocked
        }),
        React.createElement('button', {
          onClick: () => deleteProject(pIndex),
          className: `p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg btn-modern delete-shake ${isEditLocked ? 'opacity-50 cursor-not-allowed' : ''}`,
          title: isEditLocked ? 'Locked - Cannot delete' : 'Delete',
          disabled: isEditLocked
        }, React.createElement('span', { className: 'text-sm' }, '🗑️'))
      )
    ),

    // Ultra Compact Content Grid
    React.createElement('div', {
      className: 'p-3 grid grid-cols-2 gap-2'
    },
      // Left Column - Team Section
      React.createElement('div', {
        className: 'space-y-2'
      },
        React.createElement('div', {
          className: `rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700/50' : 'border-blue-200 bg-blue-50/50'} p-2`
        },
          // Team Header
          React.createElement('div', {
            className: `text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1.5 flex items-center gap-1`
          },
            React.createElement('div', {
              className: 'w-0.5 h-3 bg-blue-600 rounded'
            }),
            '👥 Team'
          ),

          // Team 2x2 Grid
          React.createElement('div', {
            className: 'grid grid-cols-2 gap-1.5 mb-2'
          },
            // Project Manager Name
            React.createElement('div', null,
              React.createElement('label', {
                className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-0.5`
              }, '👤 Project Manager'),
              React.createElement('input', {
                type: 'text',
                value: project.projectManager,
                onChange: (e) => updateProject(pIndex, 'projectManager', e.target.value),
                className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                placeholder: 'Name',
                disabled: isEditLocked
              })
            ),
            // PM Allocation
            React.createElement('div', null,
              React.createElement('label', {
                className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-0.5`
              }, '⚡ FTE Effort (Implementation Phase)'),
              React.createElement('input', {
                type: 'number',
                step: '0.1',
                value: project.pmAllocation,
                onChange: (e) => updateProject(pIndex, 'pmAllocation', e.target.value),
                className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                placeholder: '0.5',
                disabled: isEditLocked
              })
            ),
            // Business Partner Name
            React.createElement('div', null,
              React.createElement('label', {
                className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-0.5`
              }, '👤 Business Partner'),
              React.createElement('input', {
                type: 'text',
                value: project.businessPartner,
                onChange: (e) => updateProject(pIndex, 'businessPartner', e.target.value),
                className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                placeholder: 'Name',
                disabled: isEditLocked
              })
            ),
            // BP Allocation
            React.createElement('div', null,
              React.createElement('label', {
                className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-0.5`
              }, '⚡ FTE Effort (PSD & Inv. Prop. Preparation)'),
              React.createElement('input', {
                type: 'number',
                step: '0.1',
                value: project.bpAllocation,
                onChange: (e) => updateProject(pIndex, 'bpAllocation', e.target.value),
                className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                placeholder: '0.5',
                disabled: isEditLocked
              })
            )
          ),

          // BP Implementation Section
          React.createElement('div', {
            className: `pt-2 border-t ${darkMode ? 'border-slate-600' : 'border-blue-300'}`
          },
            React.createElement('div', {
              className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1.5`
            }, 'BP Implementation'),
            React.createElement('div', {
              className: 'grid grid-cols-2 gap-1.5'
            },
              React.createElement('div', {
                className: 'space-y-1.5'
              },
                React.createElement('input', {
                  type: 'date',
                  value: project.bpImplementation.start,
                  onChange: (e) => updatePhase(pIndex, 'bpImplementation', 'start', e.target.value),
                  className: `w-full px-1.5 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                  disabled: isEditLocked
                }),
                React.createElement('input', {
                  type: 'date',
                  value: project.bpImplementation.finish,
                  onChange: (e) => updatePhase(pIndex, 'bpImplementation', 'finish', e.target.value),
                  className: `w-full px-1.5 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                  disabled: isEditLocked
                })
              ),
              React.createElement('div', null,
                React.createElement('label', {
                  className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-0.5`
                }, '⚡ FTE Effort (Implementation Phase)'),
                React.createElement('input', {
                  type: 'number',
                  step: '0.1',
                  value: project.bpImplementationAllocation,
                  onChange: (e) => updateProject(pIndex, 'bpImplementationAllocation', e.target.value),
                  className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                  placeholder: '0.5',
                  disabled: isEditLocked
                })
              )
            )
          ),

          // External Resources Section
          React.createElement('div', {
            className: `pt-2 mt-2 border-t ${darkMode ? 'border-slate-600' : 'border-blue-300'}`
          },
            React.createElement('div', {
              className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1.5`
            }, 'External Resources'),
            React.createElement('div', {
              className: 'grid grid-cols-2 gap-1.5'
            },
              React.createElement('div', null,
                React.createElement('label', {
                  className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-0.5`
                }, '⚡ FTE Effort (PM External)'),
                React.createElement('input', {
                  type: 'number',
                  step: '0.1',
                  value: project.pmExternalAllocation,
                  onChange: (e) => updateProject(pIndex, 'pmExternalAllocation', e.target.value),
                  className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                  placeholder: '0.5',
                  disabled: isEditLocked
                })
              ),
              React.createElement('div', null,
                React.createElement('label', {
                  className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-0.5`
                }, '⚡ FTE Effort (QA External)'),
                React.createElement('input', {
                  type: 'number',
                  step: '0.1',
                  value: project.qaExternalAllocation,
                  onChange: (e) => updateProject(pIndex, 'qaExternalAllocation', e.target.value),
                  className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                  placeholder: '0.5',
                  disabled: isEditLocked
                })
              )
            )
          )
        )
      ),

      // Right Column - Phases Section
      React.createElement('div', {
        className: `rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700/50' : 'border-purple-200 bg-purple-50/50'} p-2`
      },
        // Phases Header
        React.createElement('div', {
          className: `text-sm font-bold ${darkMode ? 'text-purple-300' : 'text-purple-900'} mb-1.5 flex items-center gap-1`
        },
          React.createElement('div', {
            className: 'w-0.5 h-3 bg-purple-600 rounded'
          }),
          '🎯 Project Phases'
        ),

        // Main 4 Phases in 2x2 Grid
        React.createElement('div', {
          className: 'grid grid-cols-2 gap-1.5 mb-2'
        },
          phases.map((phase) =>
            React.createElement('div', {
              key: phase.key,
              className: `${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-purple-100'} rounded p-1.5 border`
            },
              React.createElement('div', {
                className: `text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-1 mb-1`
              },
                React.createElement('div', {
                  className: `w-2 h-2 ${phase.color} rounded-full`
                }),
                React.createElement('span', {
                  className: 'line-clamp-1'
                }, phase.label.replace('PSD & Inv. Proposal (Drafting Phase)', 'PSD')
                           .replace('Investment (Approval Phase)', 'Investment')
                           .replace('Procurement Phase', 'Procurement')
                           .replace('Implementation Phase (CAPEX Reg)', 'Implementation'))
              ),
              React.createElement('input', {
                type: 'date',
                value: project[phase.key].start,
                onChange: (e) => updatePhase(pIndex, phase.key, 'start', e.target.value),
                className: `w-full px-1.5 py-0.5 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 mb-1 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                disabled: isEditLocked
              }),
              React.createElement('input', {
                type: 'date',
                value: project[phase.key].finish,
                onChange: (e) => updatePhase(pIndex, phase.key, 'finish', e.target.value),
                className: `w-full px-1.5 py-0.5 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                disabled: isEditLocked
              })
            )
          )
        ),

        // Planned & Actual Section
        React.createElement('div', {
          className: 'grid grid-cols-2 gap-1.5'
        },
          // Planned (Investment Proposal)
          React.createElement('div', {
            className: `${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-purple-100'} rounded p-1.5 border`
          },
            React.createElement('div', {
              className: `text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-1 mb-1`
            },
              '📅 ',
              React.createElement('span', null, 'PM Plan (In. Proposal)')
            ),
            React.createElement('input', {
              type: 'date',
              value: project.plannedInvestment.start,
              onChange: (e) => updatePhase(pIndex, 'plannedInvestment', 'start', e.target.value),
              className: `w-full px-1.5 py-0.5 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 mb-1 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              disabled: isEditLocked
            }),
            React.createElement('input', {
              type: 'date',
              value: project.plannedInvestment.finish,
              onChange: (e) => updatePhase(pIndex, 'plannedInvestment', 'finish', e.target.value),
              className: `w-full px-1.5 py-0.5 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              disabled: isEditLocked
            })
          ),
          // Actual Implementation Phase
          React.createElement('div', {
            className: `${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-purple-100'} rounded p-1.5 border`
          },
            React.createElement('div', {
              className: `text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-1 mb-1`
            },
              '📅 ',
              React.createElement('span', null, 'Initial Official Plan')
            ),
            React.createElement('input', {
              type: 'date',
              value: project.actualDates.start,
              onChange: (e) => updatePhase(pIndex, 'actualDates', 'start', e.target.value),
              className: `w-full px-1.5 py-0.5 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 mb-1 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              disabled: isEditLocked
            }),
            React.createElement('input', {
              type: 'date',
              value: project.actualDates.finish,
              onChange: (e) => updatePhase(pIndex, 'actualDates', 'finish', e.target.value),
              className: `w-full px-1.5 py-0.5 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              disabled: isEditLocked
            })
          )
        )
      )
    ),

    // Budget Section - Full Width
    React.createElement('div', {
      className: `p-3 border-t-2 ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
    },
      React.createElement('div', {
        className: `rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700/50' : 'border-green-200 bg-green-50/50'} p-3`
      },
        // Budget Header
        React.createElement('div', {
          className: `text-sm font-bold ${darkMode ? 'text-green-300' : 'text-green-900'} mb-2 flex items-center gap-2`
        },
          React.createElement('div', {
            className: 'w-0.5 h-3 bg-green-600 rounded'
          }),
          '💰 Project Budget'
        ),

        // First Year Selector
        React.createElement('div', {
          className: 'mb-3'
        },
          React.createElement('label', {
            className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-1`
          }, '📅 First Budget Year'),
          React.createElement('select', {
            value: project.budgetFirstYear || new Date().getFullYear(),
            onChange: (e) => updateProject(pIndex, 'budgetFirstYear', e.target.value),
            className: `w-32 px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-green-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            disabled: isEditLocked
          },
            // Generate year options from current year - 5 to current year + 10
            Array.from({ length: 16 }, (_, i) => {
              const year = new Date().getFullYear() - 5 + i;
              return React.createElement('option', { key: year, value: year }, year);
            })
          )
        ),

        // Budget Grid
        React.createElement('div', {
          className: 'grid grid-cols-6 gap-2'
        },
          // Year Labels Row
          React.createElement('div', {
            className: `text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`
          }, ''),
          ...[1, 2, 3, 4, 5].map(yearNum =>
            React.createElement('div', {
              key: `year-label-${yearNum}`,
              className: `text-xs font-bold ${darkMode ? 'text-green-300' : 'text-green-800'} text-center`
            }, firstYear + yearNum - 1)
          ),

          // CAPEX Row
          React.createElement('div', {
            className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`
          }, '💵 CAPEX'),
          ...[1, 2, 3, 4, 5].map(yearNum =>
            React.createElement('input', {
              key: `capex-year-${yearNum}`,
              type: 'number',
              step: '0.01',
              value: project[`capexYear${yearNum}`] || '',
              onChange: (e) => updateProject(pIndex, `capexYear${yearNum}`, e.target.value),
              className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-green-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              placeholder: '0',
              disabled: isEditLocked
            })
          ),

          // OPEX Row
          React.createElement('div', {
            className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`
          }, '📊 OPEX'),
          ...[1, 2, 3, 4, 5].map(yearNum =>
            React.createElement('input', {
              key: `opex-year-${yearNum}`,
              type: 'number',
              step: '0.01',
              value: project[`opexYear${yearNum}`] || '',
              onChange: (e) => updateProject(pIndex, `opexYear${yearNum}`, e.target.value),
              className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-green-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              placeholder: '0',
              disabled: isEditLocked
            })
          ),

          // Total per Year Row (read-only calculated)
          React.createElement('div', {
            className: `text-xs font-bold ${darkMode ? 'text-green-300' : 'text-green-800'} flex items-center`
          }, '💎 Total/Year'),
          ...[1, 2, 3, 4, 5].map(yearNum =>
            React.createElement('div', {
              key: `total-year-${yearNum}`,
              className: `px-2 py-1 text-sm font-bold text-center rounded ${darkMode ? 'bg-slate-800 text-green-300' : 'bg-green-100 text-green-800'}`
            }, budgetTotals[`totalYear${yearNum}`].toFixed(2))
          )
        ),

        // Summary Totals
        React.createElement('div', {
          className: `mt-3 pt-3 border-t ${darkMode ? 'border-slate-600' : 'border-green-300'} grid grid-cols-3 gap-3`
        },
          // Total CAPEX
          React.createElement('div', {
            className: `p-2 rounded ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-600' : 'border-green-200'}`
          },
            React.createElement('div', {
              className: `text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`
            }, 'Total CAPEX'),
            React.createElement('div', {
              className: `text-lg font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`
            }, budgetTotals.totalCapex.toFixed(2))
          ),

          // Total OPEX
          React.createElement('div', {
            className: `p-2 rounded ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-600' : 'border-green-200'}`
          },
            React.createElement('div', {
              className: `text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`
            }, 'Total OPEX'),
            React.createElement('div', {
              className: `text-lg font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`
            }, budgetTotals.totalOpex.toFixed(2))
          ),

          // Total Budget
          React.createElement('div', {
            className: `p-2 rounded ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-700' : 'bg-gradient-to-br from-green-100 to-blue-100'} border-2 ${darkMode ? 'border-green-500' : 'border-green-400'}`
          },
            React.createElement('div', {
              className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`
            }, '💰 TOTAL BUDGET'),
            React.createElement('div', {
              className: `text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-800'}`
            }, budgetTotals.totalBudget.toFixed(2))
          )
        )
      )
    )
  );
}