// js/components/ActionPlan/index.js

/**
 * ActionPlan Component - Main Orchestrator
 * Manages hierarchical action plans with Actions > Tasks > Subtasks
 * Features: Status workflow, Priority levels, Multiple views (List/Board/Table),
 *          Dependencies, Templates, Activity log, Drag-and-drop
 */

import { getStatuses, getPriorities } from '../../config/actionPlanConstants.js';
import { ActionPlanList } from './ActionPlanList.js';
import { ActionPlanBoard } from './ActionPlanBoard.js';
import { ActionPlanTable } from './ActionPlanTable.js';
import { ActionPlanGantt } from './ActionPlanGantt.js';
import { ActionPlanFilters } from './ActionPlanFilters.js';

export function ActionPlan({
  project,
  pIndex,
  updateProject,
  darkMode,
  isEditLocked = false
}) {
  console.log('🚀 [ActionPlan] Component loaded - VERSION 2.0 with Gantt view');
  console.log('🚀 [ActionPlan] Project:', project.name);
  console.log('🚀 [ActionPlan] Action plan data:', project.actionPlan);

  // State management
  const [currentView, setCurrentView] = React.useState('list'); // list, board, table, gantt
  const [showTemplates, setShowTemplates] = React.useState(false);
  const [filters, setFilters] = React.useState({ status: [], priority: [], search: '' });
  const [draggedAction, setDraggedAction] = React.useState(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState(null); // { type, ids }
  const [itemOrder, setItemOrder] = React.useState([]); // Custom order for Gantt/List/Table views

  // Get constants based on dark mode
  const STATUSES = getStatuses(darkMode);
  const PRIORITIES = getPriorities(darkMode);

  // Initialize action plan with data migration
  const actionPlan = (project.actionPlan || []).map(action => ({
    ...action,
    status: action.status || (action.completed ? 'completed' : 'not-started'),
    priority: action.priority || 'medium',
    description: action.description || '',
    owner: action.owner || project.projectManager || '',
    comments: action.comments || [],
    activityLog: action.activityLog || [],
    tasks: (action.tasks || []).map(task => ({
      ...task,
      status: task.status || (task.completed ? 'completed' : 'not-started'),
      priority: task.priority || 'medium',
      description: task.description || '',
      assignees: task.assignees || (task.assignee ? [task.assignee] : []),
      comments: task.comments || [],
      activityLog: task.activityLog || [],
      estimatedHours: task.estimatedHours || 0,
      actualHours: task.actualHours || 0,
      subtasks: (task.subtasks || []).map(subtask => ({
        ...subtask,
        status: subtask.status || (subtask.completed ? 'completed' : 'not-started')
      }))
    }))
  }));

  const settings = project.actionPlanSettings || { templates: [] };
  const currentUser = project.projectManager || 'User';

  // Helper functions
  const getTimestamp = () => new Date().toISOString();
  const createActivity = (action, details) => ({
    timestamp: getTimestamp(),
    user: currentUser,
    action,
    details
  });

  // Update action plan
  const updateActionPlan = (newActionPlan) => {
    updateProject(pIndex, 'actionPlan', newActionPlan);
  };

  // Validate dependencies - prevent circular references
  const validateDependency = (itemId, newDepId) => {
    const visited = new Set();

    const hasCycle = (currentId, targetId) => {
      if (currentId === targetId) return true;
      if (visited.has(currentId)) return false;
      visited.add(currentId);

      let currentDeps = [];
      for (const action of actionPlan) {
        if (action.id === currentId) {
          currentDeps = action.dependencies || [];
        } else {
          for (const task of action.tasks) {
            if (task.id === currentId) {
              currentDeps = task.dependencies || [];
            }
          }
        }
      }

      for (const depId of currentDeps) {
        if (hasCycle(depId, targetId)) return true;
      }
      return false;
    };

    return !hasCycle(newDepId, itemId);
  };

  // Add new action
  const addAction = () => {
    const newAction = {
      id: Date.now().toString(),
      name: 'New Action',
      description: '',
      status: 'not-started',
      priority: 'medium',
      owner: currentUser,
      startDate: '',
      finishDate: '',
      tasks: [],
      dependencies: [],
      comments: [],
      activityLog: [createActivity('created', 'Action created')]
    };
    updateActionPlan([...actionPlan, newAction]);
  };

  // Add new task
  const addTask = (actionId) => {
    const newActionPlan = actionPlan.map(action => {
      if (action.id === actionId) {
        const newTask = {
          id: Date.now().toString(),
          name: 'New Task',
          description: '',
          status: 'not-started',
          priority: 'medium',
          assignees: [],
          startDate: '',
          finishDate: '',
          dueDate: '',
          estimatedHours: 0,
          actualHours: 0,
          subtasks: [],
          dependencies: [],
          comments: [],
          activityLog: [createActivity('created', 'Task created')]
        };
        return {
          ...action,
          tasks: [...action.tasks, newTask],
          activityLog: [...action.activityLog, createActivity('task-added', `Task "${newTask.name}" added`)]
        };
      }
      return action;
    });
    updateActionPlan(newActionPlan);
  };

  // Add new subtask
  const addSubtask = (actionId, taskId) => {
    const newActionPlan = actionPlan.map(action => {
      if (action.id === actionId) {
        return {
          ...action,
          tasks: action.tasks.map(task => {
            if (task.id === taskId) {
              const newSubtask = {
                id: Date.now().toString(),
                name: 'New Subtask',
                status: 'not-started',
                priority: 'medium',
                startDate: '',
                finishDate: '',
                dueDate: '',
                assignee: '',
                dependencies: [],
                completed: false
              };
              return { ...task, subtasks: [...task.subtasks, newSubtask] };
            }
            return task;
          })
        };
      }
      return action;
    });
    updateActionPlan(newActionPlan);
  };

  // Update item field
  const updateItem = (type, ids, field, value) => {
    const newActionPlan = actionPlan.map(action => {
      if (type === 'action' && action.id === ids.actionId) {
        return { ...action, [field]: value };
      }
      if (action.id === ids.actionId) {
        return {
          ...action,
          tasks: action.tasks.map(task => {
            if (type === 'task' && task.id === ids.taskId) {
              return { ...task, [field]: value };
            }
            if (task.id === ids.taskId) {
              return {
                ...task,
                subtasks: task.subtasks.map(subtask => {
                  if (type === 'subtask' && subtask.id === ids.subtaskId) {
                    return { ...subtask, [field]: value };
                  }
                  return subtask;
                })
              };
            }
            return task;
          })
        };
      }
      return action;
    });
    updateActionPlan(newActionPlan);
  };

  // Delete item
  const deleteItem = (type, ids) => {
    const newActionPlan = actionPlan.map(action => {
      if (type === 'action' && action.id === ids.actionId) return null;
      if (action.id === ids.actionId) {
        return {
          ...action,
          tasks: action.tasks.map(task => {
            if (type === 'task' && task.id === ids.taskId) return null;
            if (task.id === ids.taskId) {
              return {
                ...task,
                subtasks: task.subtasks.filter(subtask => subtask.id !== ids.subtaskId)
              };
            }
            return task;
          }).filter(Boolean)
        };
      }
      return action;
    }).filter(Boolean);
    updateActionPlan(newActionPlan);
    setDeleteConfirm(null);
  };

  // Drag and drop handlers for Actions
  const handleActionDragStart = (action) => {
    setDraggedAction(action);
  };

  const handleActionDragOver = (e) => {
    e.preventDefault();
  };

  const handleActionDrop = (targetAction) => {
    if (!draggedAction || isEditLocked || draggedAction.id === targetAction.id) return;

    const draggedIndex = actionPlan.findIndex(a => a.id === draggedAction.id);
    const targetIndex = actionPlan.findIndex(a => a.id === targetAction.id);

    const newActionPlan = [...actionPlan];
    newActionPlan.splice(draggedIndex, 1);
    newActionPlan.splice(targetIndex, 0, draggedAction);

    updateActionPlan(newActionPlan);
    setDraggedAction(null);
  };

  // Get all items for dependency selection
  const getAllItems = () => {
    const items = [];
    actionPlan.forEach(action => {
      items.push({ id: action.id, name: action.name || 'Unnamed Action', type: 'action' });
      action.tasks.forEach(task => {
        items.push({ id: task.id, name: task.name || 'Unnamed Task', type: 'task' });
        task.subtasks.forEach(subtask => {
          items.push({ id: subtask.id, name: subtask.name || 'Unnamed Subtask', type: 'subtask' });
        });
      });
    });
    return items;
  };

  // Add dependency with validation
  const addDependency = (item, type, ids, depId) => {
    // Validate no circular dependency
    if (!validateDependency(item.id, depId)) {
      alert('Cannot add dependency: This would create a circular dependency!');
      return;
    }

    const deps = item.dependencies || [];
    if (!deps.includes(depId)) {
      updateItem(type, ids, 'dependencies', [...deps, depId]);
    }
  };

  // Remove dependency
  const removeDependency = (item, type, ids, depId) => {
    const deps = item.dependencies || [];
    updateItem(type, ids, 'dependencies', deps.filter(id => id !== depId));
  };

  // Calculate progress for action
  const calculateProgress = (action) => {
    if (action.tasks.length === 0) return action.status === 'completed' ? 100 : 0;
    const completedTasks = action.tasks.filter(t => t.status === 'completed').length;
    return Math.round((completedTasks / action.tasks.length) * 100);
  };

  // Template management
  const saveAsTemplate = () => {
    const name = prompt('Enter template name:');
    if (!name) return;

    const template = {
      id: Date.now().toString(),
      name,
      description: `Template created from ${project.name}`,
      actions: actionPlan.map(action => ({
        ...action,
        id: '',
        activityLog: [],
        comments: [],
        tasks: action.tasks.map(task => ({
          ...task,
          id: '',
          activityLog: [],
          comments: [],
          subtasks: task.subtasks.map(st => ({ ...st, id: '' }))
        }))
      }))
    };

    const newSettings = {
      ...settings,
      templates: [...settings.templates, template]
    };
    updateProject(pIndex, 'actionPlanSettings', newSettings);
    alert(`Template "${name}" saved!`);
  };

  const applyTemplate = (template) => {
    if (!confirm(`Apply template "${template.name}"? This will add ${template.actions.length} actions.`)) return;

    const newActions = template.actions.map(action => ({
      ...action,
      id: Date.now().toString() + Math.random(),
      activityLog: [createActivity('created-from-template', `Created from template "${template.name}"`)],
      tasks: action.tasks.map((task, i) => ({
        ...task,
        id: Date.now().toString() + Math.random() + i,
        subtasks: task.subtasks.map((st, j) => ({
          ...st,
          id: Date.now().toString() + Math.random() + i + j
        }))
      }))
    }));

    updateActionPlan([...actionPlan, ...newActions]);
    setShowTemplates(false);
    alert('Template applied successfully!');
  };

  // SVG Icon Components
  const ListIcon = () => React.createElement('svg', {
    className: 'w-4 h-4',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M4 6h16M4 12h16M4 18h16' })
  );

  const BoardIcon = () => React.createElement('svg', {
    className: 'w-4 h-4',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M9 3H4a1 1 0 00-1 1v16a1 1 0 001 1h5V3zM15 3h-4v20h4V3zM21 3h-5v20h5a1 1 0 001-1V4a1 1 0 00-1-1z' })
  );

  const TableIcon = () => React.createElement('svg', {
    className: 'w-4 h-4',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M3 3h18v18H3V3zm0 6h18M9 3v18' })
  );

  const GanttIcon = () => React.createElement('svg', {
    className: 'w-4 h-4',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M3 3h18v18H3V3z' }),
    React.createElement('path', { d: 'M9 9h6M9 15h10' })
  );

  const SaveIcon = () => React.createElement('svg', {
    className: 'w-4 h-4',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z' }),
    React.createElement('path', { d: 'M17 21v-8H7v8M7 3v5h8' })
  );

  const TemplatesIcon = () => React.createElement('svg', {
    className: 'w-4 h-4',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z' }),
    React.createElement('path', { d: 'M9 7h6M9 11h6M9 15h4' })
  );

  // Toolbar with view switcher and template management
  const renderToolbar = () => {
    const views = [
      { id: 'list', label: 'List', icon: ListIcon },
      { id: 'board', label: 'Board', icon: BoardIcon },
      { id: 'table', label: 'Table', icon: TableIcon },
      { id: 'gantt', label: 'Gantt', icon: GanttIcon }
    ];

    return React.createElement('div', {
      className: `flex items-center justify-between mb-6 p-4 rounded-xl ${darkMode ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-white border border-gray-200'} shadow-lg`
    },
      // View switcher
      React.createElement('div', { className: 'flex gap-3' },
        views.map(view =>
          React.createElement('button', {
            key: view.id,
            onClick: () => setCurrentView(view.id),
            className: `flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
              currentView === view.id
                ? darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                : darkMode
                  ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-slate-600'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`
          },
            React.createElement(view.icon),
            view.label
          )
        )
      ),
      // Template management
      !isEditLocked && React.createElement('div', { className: 'flex gap-3' },
        actionPlan.length > 0 && React.createElement('button', {
          onClick: saveAsTemplate,
          className: `flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
            darkMode
              ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-md'
              : 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-md'
          }`
        },
          React.createElement(SaveIcon),
          'Save as Template'
        ),
        settings.templates.length > 0 && React.createElement('button', {
          onClick: () => setShowTemplates(!showTemplates),
          className: `flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
            darkMode
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md'
              : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md'
          }`
        },
          React.createElement(TemplatesIcon),
          `Templates (${settings.templates.length})`
        )
      )
    );
  };

  // Template selector panel
  const renderTemplateSelector = () => {
    if (!showTemplates || settings.templates.length === 0) return null;

    return React.createElement('div', {
      className: `mb-4 p-4 rounded-lg ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} border-2`
    },
      React.createElement('h3', {
        className: `text-lg font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, 'Available Templates'),
      React.createElement('div', { className: 'grid gap-2' },
        settings.templates.map(template =>
          React.createElement('div', {
            key: template.id,
            className: `p-3 rounded ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'} cursor-pointer transition-colors`
          },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', null,
                React.createElement('div', {
                  className: `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                }, template.name),
                React.createElement('div', {
                  className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                }, `${template.actions.length} actions`)
              ),
              React.createElement('button', {
                onClick: () => applyTemplate(template),
                className: `px-3 py-1 rounded text-sm font-semibold ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`
              }, 'Apply')
            )
          )
        )
      )
    );
  };

  // Main render - Empty state
  if (actionPlan.length === 0) {
    return React.createElement('div', {
      className: `text-center py-12 ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'} rounded-xl border-2 ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
    },
      React.createElement('div', {
        className: 'text-6xl mb-4'
      }, '📋'),
      React.createElement('p', {
        className: `text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
      }, 'No actions yet'),
      React.createElement('p', {
        className: `text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, 'Create your first action to start planning'),
      !isEditLocked && React.createElement('button', {
        onClick: addAction,
        className: `px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 ${
          darkMode
            ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white'
            : 'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white'
        }`
      }, '+ Add Action')
    );
  }

  // Main render - With content
  return React.createElement('div', {
    className: 'space-y-4'
  },
    // Toolbar
    renderToolbar(),
    // Template selector
    renderTemplateSelector(),
    // Content based on current view
    currentView === 'board'
      ? React.createElement(ActionPlanBoard, {
          actionPlan,
          darkMode,
          onUpdate: updateActionPlan,
          statuses: STATUSES,
          priorities: PRIORITIES,
          isEditLocked
        })
      : currentView === 'table'
        ? React.createElement(ActionPlanTable, {
            actionPlan,
            darkMode,
            statuses: STATUSES,
            priorities: PRIORITIES,
            itemOrder,
            setItemOrder
          })
        : currentView === 'gantt'
          ? React.createElement(ActionPlanGantt, {
              actionPlan,
              darkMode,
              onUpdate: updateActionPlan,
              statuses: STATUSES,
              priorities: PRIORITIES,
              isEditLocked,
              itemOrder,
              setItemOrder
            })
          : // List view (default)
            React.createElement('div', { className: 'space-y-4' },
              React.createElement(ActionPlanList, {
                actionPlan,
                darkMode,
                statuses: STATUSES,
                priorities: PRIORITIES,
                isEditLocked,
                updateItem,
                deleteItem,
                addTask,
                addSubtask,
                allItems: getAllItems(),
                addDependency,
                removeDependency,
                calculateProgress,
                handleActionDragStart,
                handleActionDragOver,
                handleActionDrop,
                deleteConfirm,
                setDeleteConfirm,
                itemOrder,
                setItemOrder
              }),
              // Add Action button
              !isEditLocked && React.createElement('button', {
                onClick: addAction,
                className: `w-full py-4 rounded-xl border-2 border-dashed font-bold transition-all shadow-sm hover:shadow-md ${
                  darkMode
                    ? 'border-sky-400/50 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 hover:border-sky-400'
                    : 'border-sky-400 bg-sky-50 hover:bg-sky-100 text-sky-700 hover:border-sky-500'
                }`
              }, '+ Add Action')
            )
  );
}