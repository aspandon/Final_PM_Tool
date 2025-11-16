// js/components/ProjectForm/index.js

/**
 * ProjectForm Component (Main Orchestrator)
 * Displays a comprehensive form for entering and editing project data including
 * team members, phases, allocations, and timelines
 */

import { Briefcase, Trash } from '../../shared/icons/index.js';
import { ProjectTeamSection } from './ProjectTeamSection.js';
import { ProjectPhasesSection } from './ProjectPhasesSection.js';
import { ProjectBudgetSection } from './ProjectBudgetSection.js';

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
  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = React.useState(null);

  // Check if delete confirmation is showing for this project
  const isDeletePending = () => {
    return deleteConfirm === pIndex;
  };

  // Handle delete with confirmation reset
  const handleDelete = () => {
    deleteProject(pIndex);
    setDeleteConfirm(null);
  };

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
        // Delete Button (inline confirmation)
        !isEditLocked && (isDeletePending()
          ? React.createElement('div', {
              className: `flex items-center gap-1 ${darkMode ? 'bg-red-900/30' : 'bg-red-100'} px-2 py-1 rounded-lg`
            },
              React.createElement('span', {
                className: `text-xs font-semibold ${darkMode ? 'text-red-300' : 'text-red-700'}`
              }, 'Delete?'),
              React.createElement('button', {
                onClick: handleDelete,
                className: 'px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded font-semibold'
              }, 'Yes'),
              React.createElement('button', {
                onClick: () => setDeleteConfirm(null),
                className: 'px-2 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded font-semibold'
              }, 'No')
            )
          : React.createElement('button', {
              onClick: () => setDeleteConfirm(pIndex),
              className: `px-3 py-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg btn-modern delete-shake flex items-center`,
              title: 'Delete'
            }, React.createElement(Trash, { className: 'w-4 h-4' }))
        ),
        isEditLocked && React.createElement('button', {
          className: `px-3 py-1.5 bg-red-500/90 text-white rounded-lg btn-modern flex items-center opacity-50 cursor-not-allowed`,
          title: 'Locked - Cannot delete',
          disabled: true
        }, React.createElement(Trash, { className: 'w-4 h-4' }))
      )
    ),

    // Ultra Compact Content Grid
    React.createElement('div', {
      className: 'p-3 grid grid-cols-2 gap-2'
    },
      // Left Column - Team Section
      React.createElement(ProjectTeamSection, {
        project,
        pIndex,
        updateProject,
        updatePhase,
        darkMode,
        isEditLocked
      }),

      // Right Column - Phases Section
      React.createElement(ProjectPhasesSection, {
        project,
        pIndex,
        phases,
        updatePhase,
        darkMode,
        isEditLocked
      })
    ),

    // Budget Section - Full Width
    React.createElement(ProjectBudgetSection, {
      project,
      pIndex,
      updateProject,
      darkMode,
      isEditLocked
    })
  );
}
