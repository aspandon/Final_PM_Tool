// js/components/ProjectForm/ProjectTeamSection.js

/**
 * ProjectTeamSection Component
 * Handles team member fields (PM, BP, allocations)
 */

import { Briefcase, Users, User } from '../../shared/icons/index.js';

// Zap icon used locally (not in shared icons)
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

export function ProjectTeamSection({
  project,
  pIndex,
  updateProject,
  updatePhase,
  darkMode,
  isEditLocked = false
}) {
  return React.createElement('div', {
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
        'Project Team'
      ),

      // Team 2x2 Grid
      React.createElement('div', {
        className: 'grid grid-cols-2 gap-1.5 mb-2'
      },
        // Project Manager Name
        React.createElement('div', null,
          React.createElement('label', {
            className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} flex items-center gap-1 mb-0.5`
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
            className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} flex items-center gap-1 mb-0.5`
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
            className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} flex items-center gap-1 mb-0.5`
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
            className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} flex items-center gap-1 mb-0.5`
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
              className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} flex items-center gap-1 mb-0.5`
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
              className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} flex items-center gap-1 mb-0.5`
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
              className: `text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'} flex items-center gap-1 mb-0.5`
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
  );
}