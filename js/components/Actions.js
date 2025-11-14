// js/components/Actions.js

import { ActionPlan } from './ActionPlan.js';

/**
 * Actions Component
 * Displays all projects with their action plans
 * Allows managing action plans for each project
 */

export function Actions({
  projects,
  filteredProjects,
  updateProject,
  darkMode,
  isEditLocked = false
}) {
  const [expandedProjects, setExpandedProjects] = React.useState({});

  // Toggle project expansion
  const toggleProject = (projectIndex) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectIndex]: !prev[projectIndex]
    }));
  };

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
    React.createElement('polyline', { points: '6 9 12 15 18 9' })
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
    React.createElement('polyline', { points: '9 18 15 12 9 6' })
  );

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

  // Get Kanban status display
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

  // Get status badge color
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

  // Render project card
  const renderProjectCard = (project, displayIndex) => {
    // Find the actual index in the projects array
    const actualIndex = projects.indexOf(project);
    const isExpanded = expandedProjects[actualIndex];
    const currentStatus = project.kanbanStatus || 'backlog';

    return React.createElement('div', {
      key: actualIndex,
      className: `mb-4 rounded-xl overflow-hidden border-2 ${darkMode ? 'border-slate-600 bg-slate-800' : 'border-gray-200 bg-white'} shadow-lg`
    },
      // Project Header
      React.createElement('div', {
        className: `p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-blue-50/50'} cursor-pointer hover:opacity-80 transition-opacity`,
        onClick: () => toggleProject(actualIndex)
      },
        React.createElement('div', {
          className: 'flex items-center gap-3'
        },
          // Expand/Collapse Icon
          React.createElement('div', {
            className: `${darkMode ? 'text-blue-400' : 'text-blue-600'}`
          },
            isExpanded
              ? React.createElement(ChevronDown, { className: 'w-6 h-6' })
              : React.createElement(ChevronRight, { className: 'w-6 h-6' })
          ),
          // Project Icon
          React.createElement(Briefcase, {
            className: `w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
          }),
          // Project Name
          React.createElement('div', {
            className: `flex-1 text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
          }, project.name || 'Unnamed Project'),
          // Status Badge
          React.createElement('div', {
            className: `px-3 py-1 text-xs font-bold rounded-lg border-2 ${darkMode ? getStatusColorDark(currentStatus) : getStatusColorLight(currentStatus)} whitespace-nowrap`
          }, getStatusDisplay(currentStatus)),
          // Division
          project.division && React.createElement('div', {
            className: `px-3 py-1 text-sm font-semibold ${darkMode ? 'bg-slate-600 text-gray-200' : 'bg-gray-100 text-gray-700'} rounded-lg`
          }, project.division),
          // Action Plan Count
          React.createElement('div', {
            className: `px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'} rounded-lg`
          }, `${(project.actionPlan || []).length} ${(project.actionPlan || []).length === 1 ? 'Action' : 'Actions'}`)
        )
      ),
      // Action Plan (expanded)
      isExpanded && React.createElement('div', {
        className: 'p-4'
      },
        React.createElement(ActionPlan, {
          project,
          pIndex: actualIndex,
          updateProject,
          darkMode,
          isEditLocked
        })
      )
    );
  };

  // Main render
  if (filteredProjects.length === 0) {
    return React.createElement('div', {
      className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
    },
      React.createElement('p', { className: 'text-lg mb-2' }, '📋 No projects to display'),
      React.createElement('p', { className: 'text-sm' }, 'Add projects in the Projects tab to manage their action plans here')
    );
  }

  return React.createElement('div', {
    className: 'space-y-4'
  },
    // Header - Matching Kanban Board Style
    React.createElement('div', {
      className: 'mb-6'
    },
      React.createElement('h2', {
        className: `text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
      },
        React.createElement('div', {
          className: 'w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full'
        }),
        'Project Action Plans'
      ),
      React.createElement('p', {
        className: `mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, 'Manage actions, tasks, and subtasks for each project. Click on a project to expand and edit its action plan.')
    ),

    // Project Cards
    filteredProjects.map((project, displayIndex) => renderProjectCard(project, displayIndex))
  );
}
