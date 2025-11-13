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
        React.createElement('span', {
          className: 'text-lg flex-shrink-0'
        }, '📊'),
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
              React.createElement('span', null, 'Planned (Inv. Proposal)')
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
              React.createElement('span', null, 'Actual Implementation Phase')
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
    )
  );
}