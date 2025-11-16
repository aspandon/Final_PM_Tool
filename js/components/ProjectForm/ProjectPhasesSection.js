// js/components/ProjectForm/ProjectPhasesSection.js

/**
 * ProjectPhasesSection Component
 * Handles all phase date fields (PSD, investment, procurement, implementation, etc.)
 */

import { Calendar } from '../../shared/icons/index.js';

export function ProjectPhasesSection({
  project,
  pIndex,
  phases,
  updatePhase,
  darkMode,
  isEditLocked = false
}) {
  return React.createElement('div', {
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
            className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-purple-900'} flex items-center gap-1 mb-1`
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
          className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-purple-900'} flex items-center gap-1 mb-1`
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
          className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-purple-900'} flex items-center gap-1 mb-1`
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
          className: `w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-200 bg-white'} rounded focus:ring-1 focus:ring-1 focus:ring-purple-500 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked
        })
      )
    )
  );
}