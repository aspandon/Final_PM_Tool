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
  // Modern Icon Components
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

  const Users = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
    React.createElement('circle', { cx: '9', cy: '7', r: '4' }),
    React.createElement('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
    React.createElement('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
  );

  const Calendar = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('rect', { width: '18', height: '18', x: '3', y: '4', rx: '2', ry: '2' }),
    React.createElement('line', { x1: '16', x2: '16', y1: '2', y2: '6' }),
    React.createElement('line', { x1: '8', x2: '8', y1: '2', y2: '6' }),
    React.createElement('line', { x1: '3', x2: '21', y1: '10', y2: '10' })
  );

  const DollarSign = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('line', { x1: '12', x2: '12', y1: '2', y2: '22' }),
    React.createElement('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' })
  );

  const Trash = ({ className }) => React.createElement('svg', {
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

  const User = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }),
    React.createElement('circle', { cx: '12', cy: '7', r: '4' })
  );

  const Zap = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
  );

  // Get Kanban status display name
  const getStatusDisplay = (kanbanStatus) => {
    const statusMap = {
      'onhold': 'On Hold',
      'backlog': 'Backlog',
      'psdpre': 'PSD & Inv. Prop Pre',
      'psdready': 'PSD & Inv. Prop. Ready',
      'invapproved': 'Inv. Prop. Approved',
      'procurement': 'Procurement',
      'implementation': 'Implementation',
      'uat': 'UAT',
      'done': 'Done'
    };
    return statusMap[kanbanStatus] || 'Backlog';
  };

  // Get status badge color for light mode
  const getStatusColorLight = (kanbanStatus) => {
    const colorMap = {
      'onhold': 'bg-yellow-500/20 text-yellow-700 border-yellow-500',
      'backlog': 'bg-gray-500/20 text-gray-700 border-gray-500',
      'psdpre': 'bg-blue-500/20 text-blue-700 border-blue-500',
      'psdready': 'bg-cyan-500/20 text-cyan-700 border-cyan-500',
      'invapproved': 'bg-green-500/20 text-green-700 border-green-500',
      'procurement': 'bg-purple-500/20 text-purple-700 border-purple-500',
      'implementation': 'bg-indigo-500/20 text-indigo-700 border-indigo-500',
      'uat': 'bg-orange-500/20 text-orange-700 border-orange-500',
      'done': 'bg-emerald-500/20 text-emerald-700 border-emerald-500'
    };
    return colorMap[kanbanStatus] || 'bg-gray-500/20 text-gray-700 border-gray-500';
  };

  // Get status badge color for dark mode
  const getStatusColorDark = (kanbanStatus) => {
    const colorMap = {
      'onhold': 'bg-yellow-500/30 text-yellow-300 border-yellow-400',
      'backlog': 'bg-gray-500/30 text-gray-300 border-gray-400',
      'psdpre': 'bg-blue-500/30 text-blue-300 border-blue-400',
      'psdready': 'bg-cyan-500/30 text-cyan-300 border-cyan-400',
      'invapproved': 'bg-green-500/30 text-green-300 border-green-400',
      'procurement': 'bg-purple-500/30 text-purple-300 border-purple-400',
      'implementation': 'bg-indigo-500/30 text-indigo-300 border-indigo-400',
      'uat': 'bg-orange-500/30 text-orange-300 border-orange-400',
      'done': 'bg-emerald-500/30 text-emerald-300 border-emerald-400'
    };
    return colorMap[kanbanStatus] || 'bg-gray-500/30 text-gray-300 border-gray-400';
  };

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
  const currentStatus = project.kanbanStatus || 'backlog';

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
        React.createElement('div', {
          className: `px-3 py-1.5 text-xs font-bold rounded-lg border-2 ${darkMode ? getStatusColorDark(currentStatus) : getStatusColorLight(currentStatus)} whitespace-nowrap ${isEditLocked ? 'opacity-60' : ''}`
        }, getStatusDisplay(currentStatus)),
        React.createElement('button', {
          onClick: () => deleteProject(pIndex),
          className: `px-3 py-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg btn-modern delete-shake flex items-center ${isEditLocked ? 'opacity-50 cursor-not-allowed' : ''}`,
          title: isEditLocked ? 'Locked - Cannot delete' : 'Delete',
          disabled: isEditLocked
        }, React.createElement(Trash, { className: 'w-4 h-4' }))
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
            className: `text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1.5 flex items-center gap-1.5`
          },
            React.createElement(Users, {
              className: `w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }),
            'Team'
          ),

          // Team 2x2 Grid
          React.createElement('div', {
            className: 'grid grid-cols-2 gap-1.5 mb-2'
          },
            // Project Manager Name
            React.createElement('div', null,
              React.createElement('label', {
                className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-1 mb-0.5`
              },
                React.createElement(User, {
                  className: `w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                }),
                'Project Manager'
              ),
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
                className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-1 mb-0.5`
              },
                React.createElement(Zap, {
                  className: `w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                }),
                'FTE Effort (Implementation Phase)'
              ),
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
                className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-1 mb-0.5`
              },
                React.createElement(User, {
                  className: `w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                }),
                'Business Partner'
              ),
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
                className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-1 mb-0.5`
              },
                React.createElement(Zap, {
                  className: `w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                }),
                'FTE Effort (PSD & Inv. Prop. Preparation)'
              ),
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
              className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1.5 flex items-center gap-1`
            },
              React.createElement(Calendar, {
                className: `w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
              }),
              'BP Implementation'
            ),
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
                  className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                  disabled: isEditLocked
                }),
                React.createElement('input', {
                  type: 'date',
                  value: project.bpImplementation.finish,
                  onChange: (e) => updatePhase(pIndex, 'bpImplementation', 'finish', e.target.value),
                  className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                  disabled: isEditLocked
                })
              ),
              React.createElement('div', null,
                React.createElement('label', {
                  className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-1 mb-0.5`
                },
                  React.createElement(Zap, {
                    className: `w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                  }),
                  'FTE Effort (Implementation Phase)'
                ),
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
                  className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-1 mb-0.5`
                },
                  React.createElement(Zap, {
                    className: `w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                  }),
                  'FTE Effort (PM External)'
                ),
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
                  className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-1 mb-0.5`
                },
                  React.createElement(Zap, {
                    className: `w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                  }),
                  'FTE Effort (QA External)'
                ),
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
          className: `text-sm font-bold ${darkMode ? 'text-purple-300' : 'text-purple-900'} mb-1.5 flex items-center gap-1.5`
        },
          React.createElement(Calendar, {
            className: `w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`
          }),
          'Project Phases'
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
                className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 mb-1 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                disabled: isEditLocked
              }),
              React.createElement('input', {
                type: 'date',
                value: project[phase.key].finish,
                onChange: (e) => updatePhase(pIndex, phase.key, 'finish', e.target.value),
                className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
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
              React.createElement(Calendar, {
                className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`
              }),
              React.createElement('span', null, 'PM Plan (In. Proposal)')
            ),
            React.createElement('input', {
              type: 'date',
              value: project.plannedInvestment.start,
              onChange: (e) => updatePhase(pIndex, 'plannedInvestment', 'start', e.target.value),
              className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 mb-1 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              disabled: isEditLocked
            }),
            React.createElement('input', {
              type: 'date',
              value: project.plannedInvestment.finish,
              onChange: (e) => updatePhase(pIndex, 'plannedInvestment', 'finish', e.target.value),
              className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
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
              React.createElement(Calendar, {
                className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`
              }),
              React.createElement('span', null, 'Initial Official Plan')
            ),
            React.createElement('input', {
              type: 'date',
              value: project.actualDates.start,
              onChange: (e) => updatePhase(pIndex, 'actualDates', 'start', e.target.value),
              className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 mb-1 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              disabled: isEditLocked
            }),
            React.createElement('input', {
              type: 'date',
              value: project.actualDates.finish,
              onChange: (e) => updatePhase(pIndex, 'actualDates', 'finish', e.target.value),
              className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-purple-500 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
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
        className: `rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700/50' : 'border-purple-700 bg-purple-900/30'} p-3`
      },
        // Budget Header
        React.createElement('div', {
          className: `text-sm font-bold ${darkMode ? 'text-purple-300' : 'text-purple-100'} mb-2 flex items-center gap-2`
        },
          React.createElement(DollarSign, {
            className: `w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-300'}`
          }),
          'Project Budget'
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
              className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-purple-200'} text-center`
            }, firstYear + yearNum - 1)
          ),

          // CAPEX Row
          React.createElement('div', {
            className: `text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-1`
          },
            React.createElement(DollarSign, {
              className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`
            }),
            'CAPEX'
          ),
          ...[1, 2, 3, 4, 5].map(yearNum =>
            React.createElement('input', {
              key: `capex-year-${yearNum}`,
              type: 'number',
              step: '0.01',
              value: project[`capexYear${yearNum}`] || '',
              onChange: (e) => updateProject(pIndex, `capexYear${yearNum}`, e.target.value),
              className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-purple-600 bg-purple-50 input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              placeholder: '0',
              disabled: isEditLocked
            })
          ),

          // OPEX Row
          React.createElement('div', {
            className: `text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-1`
          },
            React.createElement(DollarSign, {
              className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`
            }),
            'OPEX'
          ),
          ...[1, 2, 3, 4, 5].map(yearNum =>
            React.createElement('input', {
              key: `opex-year-${yearNum}`,
              type: 'number',
              step: '0.01',
              value: project[`opexYear${yearNum}`] || '',
              onChange: (e) => updateProject(pIndex, `opexYear${yearNum}`, e.target.value),
              className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-purple-600 bg-purple-50 input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              placeholder: '0',
              disabled: isEditLocked
            })
          ),

          // Total per Year Row (read-only calculated)
          React.createElement('div', {
            className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-purple-200'} flex items-center gap-1`
          },
            React.createElement(DollarSign, {
              className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-purple-300'}`
            }),
            'Total/Year'
          ),
          ...[1, 2, 3, 4, 5].map(yearNum =>
            React.createElement('div', {
              key: `total-year-${yearNum}`,
              className: `px-2 py-1 text-sm font-bold text-center rounded ${darkMode ? 'bg-slate-800 text-purple-300' : 'bg-purple-700 text-purple-100'}`
            }, budgetTotals[`totalYear${yearNum}`].toFixed(2))
          )
        ),

        // Summary Totals
        React.createElement('div', {
          className: `mt-3 pt-3 border-t ${darkMode ? 'border-slate-600' : 'border-purple-600'} grid grid-cols-4 gap-3`
        },
          // First Year Selector
          React.createElement('div', {
            className: `p-2 rounded ${darkMode ? 'bg-slate-800' : 'bg-purple-800'} border ${darkMode ? 'border-slate-600' : 'border-purple-700'} flex flex-col`
          },
            React.createElement('div', {
              className: `text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-purple-100'} mb-1 flex items-center gap-1`
            },
              React.createElement(Calendar, {
                className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-purple-300'}`
              }),
              'First Budget Year'
            ),
            React.createElement('select', {
              value: project.budgetFirstYear || new Date().getFullYear(),
              onChange: (e) => updateProject(pIndex, 'budgetFirstYear', e.target.value),
              className: `flex-1 px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-purple-600 bg-purple-700 text-purple-100'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
              disabled: isEditLocked
            },
              // Generate year options from current year - 5 to current year + 10
              Array.from({ length: 16 }, (_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return React.createElement('option', { key: year, value: year }, year);
              })
            )
          ),

          // Total CAPEX
          React.createElement('div', {
            className: `p-2 rounded ${darkMode ? 'bg-slate-800' : 'bg-purple-800'} border ${darkMode ? 'border-slate-600' : 'border-purple-700'}`
          },
            React.createElement('div', {
              className: `text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-purple-100'} mb-1`
            }, 'Total CAPEX'),
            React.createElement('div', {
              className: `text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-purple-100'}`
            }, budgetTotals.totalCapex.toFixed(2))
          ),

          // Total OPEX
          React.createElement('div', {
            className: `p-2 rounded ${darkMode ? 'bg-slate-800' : 'bg-purple-800'} border ${darkMode ? 'border-slate-600' : 'border-purple-700'}`
          },
            React.createElement('div', {
              className: `text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-purple-100'} mb-1`
            }, 'Total OPEX'),
            React.createElement('div', {
              className: `text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-purple-100'}`
            }, budgetTotals.totalOpex.toFixed(2))
          ),

          // Total Budget
          React.createElement('div', {
            className: `p-2 rounded ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-700' : 'bg-gradient-to-br from-purple-900 to-indigo-900'} border-2 ${darkMode ? 'border-purple-500' : 'border-purple-600'}`
          },
            React.createElement('div', {
              className: `text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-purple-100'} mb-1 flex items-center gap-1`
            },
              React.createElement(DollarSign, {
                className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-purple-200'}`
              }),
              'TOTAL BUDGET'
            ),
            React.createElement('div', {
              className: `text-xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-100'}`
            }, budgetTotals.totalBudget.toFixed(2))
          )
        )
      )
    )
  );
}