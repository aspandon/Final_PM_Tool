// js/components/ActionPlan.js

/**
 * ActionPlan Component - Modern PM Platform
 * Manages hierarchical action plans with Actions > Tasks > Subtasks
 * Features: Status workflow, Priority levels, Descriptions, Activity log,
 *          Completion tracking, Inline editing, Tag-based dependencies, Progress bars,
 *          Dependency validation, Templates, Multiple views
 */

export function ActionPlan({
  project,
  pIndex,
  updateProject,
  darkMode,
  isEditLocked = false
}) {
  const [expandedActions, setExpandedActions] = React.useState({});
  const [expandedTasks, setExpandedTasks] = React.useState({});
  const [editingItem, setEditingItem] = React.useState(null);
  const [showDependencies, setShowDependencies] = React.useState({});
  const [showDescription, setShowDescription] = React.useState({});
  const [showActivityLog, setShowActivityLog] = React.useState({});
  const [currentView, setCurrentView] = React.useState('list'); // list, board, table
  const [showTemplates, setShowTemplates] = React.useState(false);
  const [filters, setFilters] = React.useState({ status: [], priority: [], search: '' });

  // Modern status workflow (4 states, no Review)
  const STATUSES = {
    'not-started': {
      label: 'Not Started',
      icon: '○',
      color: 'slate',
      gradient: 'from-slate-400 to-slate-500',
      bg: darkMode ? 'bg-slate-500/20' : 'bg-slate-100',
      border: darkMode ? 'border-slate-400/50' : 'border-slate-300',
      text: darkMode ? 'text-slate-300' : 'text-slate-700',
      hover: darkMode ? 'hover:bg-slate-500/30' : 'hover:bg-slate-200'
    },
    'in-progress': {
      label: 'In Progress',
      icon: '▶',
      color: 'blue',
      gradient: 'from-blue-400 to-blue-600',
      bg: darkMode ? 'bg-blue-500/20' : 'bg-blue-100',
      border: darkMode ? 'border-blue-400/50' : 'border-blue-300',
      text: darkMode ? 'text-blue-300' : 'text-blue-700',
      hover: darkMode ? 'hover:bg-blue-500/30' : 'hover:bg-blue-200'
    },
    'blocked': {
      label: 'Blocked',
      icon: '⬛',
      color: 'red',
      gradient: 'from-red-400 to-red-600',
      bg: darkMode ? 'bg-red-500/20' : 'bg-red-100',
      border: darkMode ? 'border-red-400/50' : 'border-red-300',
      text: darkMode ? 'text-red-300' : 'text-red-700',
      hover: darkMode ? 'hover:bg-red-500/30' : 'hover:bg-red-200'
    },
    'completed': {
      label: 'Completed',
      icon: '✓',
      color: 'emerald',
      gradient: 'from-emerald-400 to-emerald-600',
      bg: darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100',
      border: darkMode ? 'border-emerald-400/50' : 'border-emerald-300',
      text: darkMode ? 'text-emerald-300' : 'text-emerald-700',
      hover: darkMode ? 'hover:bg-emerald-500/30' : 'hover:bg-emerald-200'
    }
  };

  const PRIORITIES = {
    'critical': {
      label: 'Critical',
      icon: '⚠',
      order: 4,
      gradient: 'from-red-500 to-rose-600',
      bg: darkMode ? 'bg-red-500/20' : 'bg-red-100',
      border: darkMode ? 'border-red-400/50' : 'border-red-300',
      text: darkMode ? 'text-red-300' : 'text-red-700',
      hover: darkMode ? 'hover:bg-red-500/30' : 'hover:bg-red-200'
    },
    'high': {
      label: 'High',
      icon: '▲',
      order: 3,
      gradient: 'from-orange-400 to-orange-600',
      bg: darkMode ? 'bg-orange-500/20' : 'bg-orange-100',
      border: darkMode ? 'border-orange-400/50' : 'border-orange-300',
      text: darkMode ? 'text-orange-300' : 'text-orange-700',
      hover: darkMode ? 'hover:bg-orange-500/30' : 'hover:bg-orange-200'
    },
    'medium': {
      label: 'Medium',
      icon: '●',
      order: 2,
      gradient: 'from-sky-400 to-sky-600',
      bg: darkMode ? 'bg-sky-500/20' : 'bg-sky-100',
      border: darkMode ? 'border-sky-400/50' : 'border-sky-300',
      text: darkMode ? 'text-sky-300' : 'text-sky-700',
      hover: darkMode ? 'hover:bg-sky-500/30' : 'hover:bg-sky-200'
    },
    'low': {
      label: 'Low',
      icon: '▼',
      order: 1,
      gradient: 'from-gray-400 to-gray-500',
      bg: darkMode ? 'bg-gray-500/20' : 'bg-gray-100',
      border: darkMode ? 'border-gray-400/50' : 'border-gray-300',
      text: darkMode ? 'text-gray-300' : 'text-gray-600',
      hover: darkMode ? 'hover:bg-gray-500/30' : 'hover:bg-gray-200'
    }
  };

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

  // Validate dependencies - prevent circular references (Phase 5)
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
      tasks: [],
      dependencies: [],
      comments: [],
      activityLog: [createActivity('created', 'Action created')]
    };
    updateActionPlan([...actionPlan, newAction]);
    setExpandedActions({ ...expandedActions, [newAction.id]: true });
    setEditingItem({ type: 'action', actionId: newAction.id, field: 'name' });
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
    const newTaskId = newActionPlan.find(a => a.id === actionId).tasks.slice(-1)[0].id;
    setExpandedTasks({ ...expandedTasks, [newTaskId]: true });
    setEditingItem({ type: 'task', actionId, taskId: newTaskId, field: 'name' });
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

  // Toggle completion
  const toggleCompletion = (type, ids) => {
    const newActionPlan = actionPlan.map(action => {
      if (type === 'action' && action.id === ids.actionId) {
        return { ...action, completed: !action.completed };
      }
      if (action.id === ids.actionId) {
        return {
          ...action,
          tasks: action.tasks.map(task => {
            if (type === 'task' && task.id === ids.taskId) {
              return { ...task, completed: !task.completed };
            }
            if (task.id === ids.taskId) {
              return {
                ...task,
                subtasks: task.subtasks.map(subtask => {
                  if (type === 'subtask' && subtask.id === ids.subtaskId) {
                    return { ...subtask, completed: !subtask.completed };
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
    if (!confirm(`Delete this ${type}?`)) return;

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
  };

  // Move item up/down
  const moveItem = (type, ids, direction) => {
    if (type === 'action') {
      const index = actionPlan.findIndex(a => a.id === ids.actionId);
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === actionPlan.length - 1)) return;
      const newActionPlan = [...actionPlan];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newActionPlan[index], newActionPlan[newIndex]] = [newActionPlan[newIndex], newActionPlan[index]];
      updateActionPlan(newActionPlan);
    } else {
      const newActionPlan = actionPlan.map(action => {
        if (action.id === ids.actionId) {
          if (type === 'task') {
            const index = action.tasks.findIndex(t => t.id === ids.taskId);
            if ((direction === 'up' && index === 0) || (direction === 'down' && index === action.tasks.length - 1)) return action;
            const newTasks = [...action.tasks];
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            [newTasks[index], newTasks[newIndex]] = [newTasks[newIndex], newTasks[index]];
            return { ...action, tasks: newTasks };
          } else if (type === 'subtask') {
            return {
              ...action,
              tasks: action.tasks.map(task => {
                if (task.id === ids.taskId) {
                  const index = task.subtasks.findIndex(s => s.id === ids.subtaskId);
                  if ((direction === 'up' && index === 0) || (direction === 'down' && index === task.subtasks.length - 1)) return task;
                  const newSubtasks = [...task.subtasks];
                  const newIndex = direction === 'up' ? index - 1 : index + 1;
                  [newSubtasks[index], newSubtasks[newIndex]] = [newSubtasks[newIndex], newSubtasks[index]];
                  return { ...task, subtasks: newSubtasks };
                }
                return task;
              })
            };
          }
        }
        return action;
      });
      updateActionPlan(newActionPlan);
    }
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

  // Add dependency with validation (Phase 5)
  const addDependency = (item, type, ids, depId) => {
    // Validate no circular dependency
    if (!validateDependency(item.id, depId)) {
      alert('⚠️ Cannot add dependency: This would create a circular dependency!');
      return;
    }

    const deps = item.dependencies || [];
    if (!deps.includes(depId)) {
      updateItem(type, ids, 'dependencies', [...deps, depId]);
    }
  };

  // Template management (Phase 5)
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
    alert(`✅ Template "${name}" saved!`);
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
    alert('✅ Template applied successfully!');
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

  // Modern status badge/selector
  const renderStatusDropdown = (item, type, ids) => {
    const status = item.status || 'not-started';
    const statusInfo = STATUSES[status];

    return React.createElement('select', {
      value: status,
      onChange: (e) => updateItem(type, ids, 'status', e.target.value, status),
      className: `px-3 py-2 text-xs rounded-lg font-bold border-2 ${statusInfo.border} ${statusInfo.bg} ${statusInfo.text} ${statusInfo.hover} transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 ${isEditLocked ? 'opacity-50 cursor-not-allowed' : ''}`,
      disabled: isEditLocked,
      style: { minWidth: '140px' }
    },
      Object.entries(STATUSES).map(([key, val]) =>
        React.createElement('option', { key, value: key }, `${val.icon} ${val.label}`)
      )
    );
  };

  // Modern priority badge/selector
  const renderPriorityDropdown = (item, type, ids) => {
    const priority = item.priority || 'medium';
    const priorityInfo = PRIORITIES[priority];

    return React.createElement('select', {
      value: priority,
      onChange: (e) => updateItem(type, ids, 'priority', e.target.value, priority),
      className: `px-3 py-2 text-xs rounded-lg font-bold border-2 ${priorityInfo.border} ${priorityInfo.bg} ${priorityInfo.text} ${priorityInfo.hover} transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 ${isEditLocked ? 'opacity-50 cursor-not-allowed' : ''}`,
      disabled: isEditLocked,
      style: { minWidth: '120px' }
    },
      Object.entries(PRIORITIES).map(([key, val]) =>
        React.createElement('option', { key, value: key }, `${val.icon} ${val.label}`)
      )
    );
  };

  // Modern description field
  const renderDescription = (item, type, ids) => {
    const key = ids.actionId + (ids.taskId || '');
    const isExpanded = showDescription[key];

    return React.createElement('div', { className: 'mt-3' },
      React.createElement('button', {
        onClick: () => setShowDescription({ ...showDescription, [key]: !isExpanded }),
        className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          darkMode
            ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
        } ${isEditLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
        disabled: isEditLocked
      }, isExpanded ? '▼ Description' : '▶ Description'),
      isExpanded && React.createElement('textarea', {
        value: item.description || '',
        onChange: (e) => updateItem(type, ids, 'description', e.target.value),
        placeholder: 'Add detailed description...',
        className: `mt-2 w-full px-3 py-2 text-sm border-2 rounded-lg transition-all focus:ring-2 ${
          darkMode
            ? 'border-slate-600 bg-slate-800/50 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20'
            : 'border-gray-200 bg-white text-gray-800 focus:border-indigo-400 focus:ring-indigo-400/20'
        }`,
        rows: 3,
        disabled: isEditLocked
      })
    );
  };

  // Modern activity log
  const renderActivityLog = (item, ids) => {
    const key = ids.actionId + (ids.taskId || '');
    const isExpanded = showActivityLog[key];
    const activities = item.activityLog || [];

    return React.createElement('div', { className: 'mt-3' },
      React.createElement('button', {
        onClick: () => setShowActivityLog({ ...showActivityLog, [key]: !isExpanded }),
        className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          darkMode
            ? 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-400/30'
            : 'bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200'
        }`
      }, `📋 Activity Log (${activities.length})`),
      isExpanded && React.createElement('div', { className: `mt-2 max-h-32 overflow-y-auto ${darkMode ? 'bg-slate-900/50' : 'bg-gray-50'} rounded p-2 space-y-1` },
        activities.slice().reverse().map((activity, i) =>
          React.createElement('div', { key: i, className: 'text-xs' },
            React.createElement('span', { className: `font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}` }, activity.user),
            React.createElement('span', { className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}` }, ` ${activity.details}`),
            React.createElement('span', { className: `${darkMode ? 'text-gray-500' : 'text-gray-500'} ml-2` }, new Date(activity.timestamp).toLocaleTimeString())
          )
        )
      )
    );
  };

  // Render dependency tags
  const renderDependencyTags = (item, type, ids) => {
    const deps = item.dependencies || [];
    const allItems = getAllItems();

    return deps.map(depId => {
      const depItem = allItems.find(i => i.id === depId);
      if (!depItem) return null;

      const colors = {
        action: darkMode ? 'bg-green-500/20 text-green-300 border-green-400' : 'bg-green-100 text-green-700 border-green-500',
        task: darkMode ? 'bg-blue-500/20 text-blue-300 border-blue-400' : 'bg-blue-100 text-blue-700 border-blue-500',
        subtask: darkMode ? 'bg-gray-500/20 text-gray-300 border-gray-400' : 'bg-gray-100 text-gray-700 border-gray-500'
      };

      return React.createElement('div', {
        key: depId,
        className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${colors[depItem.type]}`
      },
        React.createElement('span', null, depItem.name),
        !isEditLocked && React.createElement('button', {
          onClick: (e) => {
            e.stopPropagation();
            removeDependency(item, type, ids, depId);
          },
          className: 'hover:opacity-70 transition-opacity',
          title: 'Remove dependency'
        }, '×')
      );
    });
  };

  // Render dependency selector
  const renderDependencySelector = (item, type, ids) => {
    const allItems = getAllItems().filter(i => i.id !== item.id);
    const currentDeps = item.dependencies || [];
    const availableItems = allItems.filter(i => !currentDeps.includes(i.id));

    return React.createElement('div', {
      className: `mt-2 p-2 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} border ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
    },
      React.createElement('div', {
        className: `text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`
      }, '🔗 Add Dependency'),
      React.createElement('select', {
        onChange: (e) => {
          if (e.target.value) {
            addDependency(item, type, ids, e.target.value);
            e.target.value = '';
          }
        },
        className: `w-full px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded`,
        disabled: isEditLocked
      },
        React.createElement('option', { value: '' }, 'Select item...'),
        availableItems.map(i =>
          React.createElement('option', {
            key: i.id,
            value: i.id
          }, `[${i.type}] ${i.name}`)
        )
      )
    );
  };

  // Render subtask
  const renderSubtask = (subtask, actionId, taskId) => {
    const ids = { actionId, taskId, subtaskId: subtask.id };
    const isEditing = editingItem?.type === 'subtask' && editingItem?.subtaskId === subtask.id;
    const showDeps = showDependencies[subtask.id];

    return React.createElement('div', {
      key: subtask.id,
      className: `group ml-6 mb-2 p-3 rounded-lg transition-all ${
        darkMode ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
      } border-l-2 ${subtask.status === 'completed' ? 'opacity-60' : ''}`
    },
      // Subtask Header
      React.createElement('div', {
        className: 'flex items-center gap-2'
      },
        // Status dropdown (Phase 1)
        renderStatusDropdown(subtask, 'subtask', ids),
        // Name
        isEditing
          ? React.createElement('input', {
              type: 'text',
              value: subtask.name,
              onChange: (e) => updateItem('subtask', ids, 'name', e.target.value),
              onBlur: () => setEditingItem(null),
              onKeyDown: (e) => e.key === 'Enter' && setEditingItem(null),
              autoFocus: true,
              className: `flex-1 px-2 py-1 text-sm font-medium border ${darkMode ? 'border-slate-500 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded`,
              disabled: isEditLocked
            })
          : React.createElement('div', {
              onClick: () => !isEditLocked && setEditingItem({ type: 'subtask', actionId, taskId, subtaskId: subtask.id }),
              className: `flex-1 text-sm font-medium ${subtask.status === 'completed' ? 'line-through' : ''} ${darkMode ? 'text-gray-200' : 'text-gray-800'} cursor-pointer`
            }, subtask.name),
        // Due Date
        React.createElement('input', {
          type: 'date',
          value: subtask.dueDate || '',
          onChange: (e) => updateItem('subtask', ids, 'dueDate', e.target.value),
          className: `w-32 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded`,
          disabled: isEditLocked
        }),
        // Assignee
        React.createElement('input', {
          type: 'text',
          value: subtask.assignee || '',
          onChange: (e) => updateItem('subtask', ids, 'assignee', e.target.value),
          placeholder: 'Assignee',
          className: `w-24 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded`,
          disabled: isEditLocked
        }),
        // Actions (shown on hover)
        React.createElement('div', {
          className: 'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'
        },
          React.createElement('button', {
            onClick: () => moveItem('subtask', ids, 'up'),
            className: `p-1 rounded ${darkMode ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`,
            disabled: isEditLocked,
            title: 'Move up'
          }, '↑'),
          React.createElement('button', {
            onClick: () => moveItem('subtask', ids, 'down'),
            className: `p-1 rounded ${darkMode ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`,
            disabled: isEditLocked,
            title: 'Move down'
          }, '↓'),
          React.createElement('button', {
            onClick: () => setShowDependencies({ ...showDependencies, [subtask.id]: !showDeps }),
            className: `p-1 rounded ${darkMode ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`,
            disabled: isEditLocked,
            title: 'Dependencies'
          }, '🔗'),
          React.createElement('button', {
            onClick: () => deleteItem('subtask', ids),
            className: `p-1 rounded ${darkMode ? 'hover:bg-red-600 text-red-400' : 'hover:bg-red-100 text-red-600'}`,
            disabled: isEditLocked,
            title: 'Delete'
          }, '×')
        )
      ),
      // Dependencies
      (subtask.dependencies || []).length > 0 && React.createElement('div', {
        className: 'mt-2 flex flex-wrap gap-1'
      }, renderDependencyTags(subtask, 'subtask', ids)),
      showDeps && renderDependencySelector(subtask, 'subtask', ids)
    );
  };

  // Render task
  const renderTask = (task, actionId) => {
    const ids = { actionId, taskId: task.id };
    const isExpanded = expandedTasks[task.id];
    const isEditing = editingItem?.type === 'task' && editingItem?.taskId === task.id;
    const showDeps = showDependencies[task.id];
    const completedSubtasks = task.subtasks.filter(s => s.status === 'completed').length;
    const totalSubtasks = task.subtasks.length;

    return React.createElement('div', {
      key: task.id,
      className: `group mb-3 rounded-lg overflow-hidden transition-all ${
        darkMode
          ? 'bg-slate-700/50 border-l-4 border-blue-500/50 shadow-md'
          : 'bg-white border-l-4 border-blue-400 shadow-md'
      } hover:shadow-lg ${task.completed ? 'opacity-70' : ''}`
    },
      // Task Header
      React.createElement('div', {
        className: `p-3 ${
          darkMode
            ? 'bg-slate-700/30'
            : 'bg-gradient-to-r from-blue-50/30 to-indigo-50/30'
        }`
      },
        React.createElement('div', {
          className: 'flex items-center gap-2'
        },
          // Expand/Collapse
          totalSubtasks > 0 && React.createElement('button', {
            onClick: () => setExpandedTasks({ ...expandedTasks, [task.id]: !isExpanded }),
            className: `p-1 rounded ${darkMode ? 'hover:bg-slate-600' : 'hover:bg-blue-100'}`
          }, isExpanded ? '▼' : '▶'),
          // Status dropdown (Phase 1)
          renderStatusDropdown(task, 'task', ids),
          // Priority dropdown (Phase 1)
          renderPriorityDropdown(task, 'task', ids),
          // Name
          isEditing
            ? React.createElement('input', {
                type: 'text',
                value: task.name,
                onChange: (e) => updateItem('task', ids, 'name', e.target.value),
                onBlur: () => setEditingItem(null),
                onKeyDown: (e) => e.key === 'Enter' && setEditingItem(null),
                autoFocus: true,
                className: `flex-1 px-2 py-1 text-sm font-semibold border ${darkMode ? 'border-slate-500 bg-slate-800 text-gray-200' : 'border-blue-300 bg-white'} rounded`,
                disabled: isEditLocked
              })
            : React.createElement('div', {
                onClick: () => !isEditLocked && setEditingItem({ type: 'task', actionId, taskId: task.id }),
                className: `flex-1 text-sm font-semibold ${task.status === 'completed' ? 'line-through' : ''} ${darkMode ? 'text-gray-200' : 'text-gray-800'} cursor-pointer`
              }, task.name),
          // Subtask count
          totalSubtasks > 0 && React.createElement('div', {
            className: `px-2 py-0.5 rounded-full text-xs font-semibold ${darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`
          }, `${completedSubtasks}/${totalSubtasks}`),
          // Due Date
          React.createElement('input', {
            type: 'date',
            value: task.dueDate || '',
            onChange: (e) => updateItem('task', ids, 'dueDate', e.target.value),
            className: `w-32 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-blue-300 bg-white'} rounded`,
            disabled: isEditLocked
          }),
          // Assignee
          React.createElement('input', {
            type: 'text',
            value: task.assignee || '',
            onChange: (e) => updateItem('task', ids, 'assignee', e.target.value),
            placeholder: 'Assignee',
            className: `w-24 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-blue-300 bg-white'} rounded`,
            disabled: isEditLocked
          }),
          // Actions
          React.createElement('div', {
            className: 'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'
          },
            React.createElement('button', {
              onClick: () => addSubtask(actionId, task.id),
              className: `px-2 py-1 text-xs rounded ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-200' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'} font-semibold`,
              disabled: isEditLocked
            }, '+ Sub'),
            React.createElement('button', {
              onClick: () => moveItem('task', ids, 'up'),
              className: `p-1 rounded ${darkMode ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-blue-100 text-gray-600'}`,
              disabled: isEditLocked
            }, '↑'),
            React.createElement('button', {
              onClick: () => moveItem('task', ids, 'down'),
              className: `p-1 rounded ${darkMode ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-blue-100 text-gray-600'}`,
              disabled: isEditLocked
            }, '↓'),
            React.createElement('button', {
              onClick: () => setShowDependencies({ ...showDependencies, [task.id]: !showDeps }),
              className: `p-1 rounded ${darkMode ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-blue-100 text-gray-600'}`,
              disabled: isEditLocked
            }, '🔗'),
            React.createElement('button', {
              onClick: () => deleteItem('task', ids),
              className: `p-1 rounded ${darkMode ? 'hover:bg-red-600 text-red-400' : 'hover:bg-red-100 text-red-600'}`,
              disabled: isEditLocked
            }, '×')
          )
        ),
        // Dependencies
        (task.dependencies || []).length > 0 && React.createElement('div', {
          className: 'mt-2 flex flex-wrap gap-1'
        }, renderDependencyTags(task, 'task', ids)),
        showDeps && renderDependencySelector(task, 'task', ids),
        // Description
        renderDescription(task, 'task', ids),
        // Activity Log
        renderActivityLog(task, ids)
      ),
      // Subtasks
      isExpanded && task.subtasks.length > 0 && React.createElement('div', {
        className: `p-3 ${darkMode ? 'bg-slate-800/20' : 'bg-indigo-50/20'}`
      }, task.subtasks.map(subtask => renderSubtask(subtask, actionId, task.id)))
    );
  };

  // Render action
  const renderAction = (action, index) => {
    const ids = { actionId: action.id };
    const isExpanded = expandedActions[action.id];
    const isEditing = editingItem?.type === 'action' && editingItem?.actionId === action.id;
    const showDeps = showDependencies[action.id];
    const progress = calculateProgress(action);
    const completedTasks = action.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = action.tasks.length;

    return React.createElement('div', {
      key: action.id,
      className: `group mb-4 rounded-xl overflow-hidden transition-all ${
        darkMode
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      } border shadow-lg hover:shadow-2xl ${action.status === 'completed' ? 'opacity-70' : ''}`
    },
      // Action Header - Modern sleek design with improved layout
      React.createElement('div', {
        className: `p-5 ${
          darkMode
            ? 'bg-gradient-to-r from-slate-700/30 to-slate-800/30 border-b border-slate-700/50'
            : 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-200/50'
        }`
      },
        // Row 1: Main info (expand, status, priority, name)
        React.createElement('div', {
          className: 'flex items-center gap-4 mb-3'
        },
          // Expand/Collapse
          totalTasks > 0 && React.createElement('button', {
            onClick: () => setExpandedActions({ ...expandedActions, [action.id]: !isExpanded }),
            className: `p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-slate-600 text-green-400' : 'hover:bg-blue-100 text-blue-600'}`
          }, isExpanded ? '▼' : '▶'),
          // Status dropdown
          renderStatusDropdown(action, 'action', ids),
          // Priority dropdown
          renderPriorityDropdown(action, 'action', ids),
          // Name
          isEditing
            ? React.createElement('input', {
                type: 'text',
                value: action.name,
                onChange: (e) => updateItem('action', ids, 'name', e.target.value),
                onBlur: () => setEditingItem(null),
                onKeyDown: (e) => e.key === 'Enter' && setEditingItem(null),
                autoFocus: true,
                className: `flex-1 px-4 py-2 text-base font-bold border-2 rounded-lg ${darkMode ? 'border-green-500 bg-slate-800 text-gray-200' : 'border-green-400 bg-white'} focus:ring-2 focus:ring-green-500`,
                disabled: isEditLocked
              })
            : React.createElement('div', {
                onClick: () => !isEditLocked && setEditingItem({ type: 'action', actionId: action.id }),
                className: `flex-1 text-base font-bold ${action.status === 'completed' ? 'line-through' : ''} ${darkMode ? 'text-gray-200' : 'text-gray-800'} cursor-pointer hover:text-green-500 transition-colors`
              }, action.name)
        ),
        // Row 2: Stats and Action buttons
        React.createElement('div', {
          className: 'flex items-center justify-between gap-4'
        },
          // Left: Stats
          React.createElement('div', {
            className: 'flex items-center gap-3'
          },
            totalTasks > 0 && React.createElement('div', {
              className: `px-4 py-2 rounded-lg text-sm font-bold ${darkMode ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'}`
            }, `${completedTasks}/${totalTasks} Tasks`),
            totalTasks > 0 && React.createElement('div', {
              className: `px-4 py-2 rounded-lg text-sm font-bold ${darkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`
            }, `${progress}% Complete`)
          ),
          // Right: Action buttons
          React.createElement('div', {
            className: 'flex items-center gap-2'
          },
            !isEditLocked && React.createElement('button', {
              onClick: () => addTask(action.id),
              className: `px-4 py-2 text-sm rounded-lg font-semibold transition-all shadow-sm hover:shadow-md ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`,
              disabled: isEditLocked
            }, '+ Add Task'),
            React.createElement('div', {
              className: `flex items-center gap-1 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-100'} rounded-lg p-1`
            },
              React.createElement('button', {
                onClick: () => moveItem('action', ids, 'up'),
                className: `p-1.5 rounded transition-all ${darkMode ? 'hover:bg-slate-600 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'}`,
                disabled: isEditLocked,
                title: 'Move up'
              }, '↑'),
              React.createElement('button', {
                onClick: () => moveItem('action', ids, 'down'),
                className: `p-1.5 rounded transition-all ${darkMode ? 'hover:bg-slate-600 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'}`,
                disabled: isEditLocked,
                title: 'Move down'
              }, '↓'),
              React.createElement('button', {
                onClick: () => setShowDependencies({ ...showDependencies, [action.id]: !showDeps }),
                className: `p-1.5 rounded transition-all ${darkMode ? 'hover:bg-slate-600 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'}`,
                disabled: isEditLocked,
                title: 'Dependencies'
              }, '🔗'),
              !isEditLocked && React.createElement('button', {
                onClick: () => deleteItem('action', ids),
                className: `p-1.5 rounded transition-all ${darkMode ? 'hover:bg-red-600 text-red-400 hover:text-white' : 'hover:bg-red-100 text-red-600 hover:text-red-700'}`,
                disabled: isEditLocked,
                title: 'Delete'
              }, '×')
            )
          )
        ),
        // Row 3: Progress Bar
        totalTasks > 0 && React.createElement('div', {
          className: 'mt-4'
        },
          React.createElement('div', {
            className: `w-full h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`
          },
            React.createElement('div', {
              className: `h-full transition-all duration-500 ${darkMode ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`,
              style: { width: `${progress}%` }
            })
          )
        ),
        // Dependencies
        (action.dependencies || []).length > 0 && React.createElement('div', {
          className: 'mt-2 flex flex-wrap gap-1'
        }, renderDependencyTags(action, 'action', ids)),
        showDeps && renderDependencySelector(action, 'action', ids),
        // Description
        renderDescription(action, 'action', ids),
        // Activity Log
        renderActivityLog(action, ids)
      ),
      // Tasks
      isExpanded && React.createElement('div', {
        className: `p-4 ${darkMode ? 'bg-slate-900/30' : 'bg-gray-50/50'}`
      },
        action.tasks.length > 0
          ? action.tasks.map(task => renderTask(task, action.id))
          : React.createElement('div', {
              className: `text-center py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
            }, 'No tasks yet. Click "+ Task" to add one.')
      )
    );
  };

  // Main render
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
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
        }`
      }, '✨ Add Action')
    );
  }

  // Board View (Kanban) - Phase 4 - Modern PM Tool Style
  const renderBoardView = () => {
    const statuses = ['not-started', 'in-progress', 'blocked', 'completed'];

    // Get all tasks grouped by status
    const tasksByStatus = {};
    statuses.forEach(status => {
      tasksByStatus[status] = [];
    });

    actionPlan.forEach(action => {
      action.tasks.forEach(task => {
        const status = task.status || 'not-started';
        tasksByStatus[status].push({ ...task, actionName: action.name, actionId: action.id });
      });
    });

    return React.createElement('div', { className: 'space-y-4' },
      React.createElement('div', {
        className: 'grid grid-cols-4 gap-4'
      },
        statuses.map(status => {
          const statusInfo = STATUSES[status];
          const tasks = tasksByStatus[status];

          return React.createElement('div', {
            key: status,
            className: `rounded-xl ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'} p-4 shadow-sm`
          },
            // Column Header
            React.createElement('div', {
              className: `flex items-center justify-between mb-4 pb-3 border-b-2 ${statusInfo.border}`
            },
              React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement('div', {
                  className: `w-3 h-3 rounded-full bg-gradient-to-br ${statusInfo.gradient}`
                }),
                React.createElement('span', {
                  className: `font-bold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                }, statusInfo.label)
              ),
              React.createElement('span', {
                className: `px-2.5 py-1 rounded-lg text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`
              }, tasks.length)
            ),
            // Cards
            React.createElement('div', { className: 'space-y-3' },
              tasks.map(task => {
                const priorityInfo = PRIORITIES[task.priority || 'medium'];
                const subtaskProgress = task.subtasks && task.subtasks.length > 0
                  ? Math.round((task.subtasks.filter(s => s.status === 'completed').length / task.subtasks.length) * 100)
                  : 0;

                return React.createElement('div', {
                  key: task.id,
                  className: `p-3 rounded-lg ${
                    darkMode
                      ? 'bg-slate-700/70 hover:bg-slate-700 border border-slate-600'
                      : 'bg-white hover:shadow-md border border-gray-200'
                  } cursor-pointer transition-all text-xs group`
                },
                  // Task Name
                  React.createElement('div', {
                    className: `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`
                  }, task.name),
                  // Action Name
                  React.createElement('div', {
                    className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 flex items-center gap-1.5`
                  },
                    React.createElement('div', {
                      className: `w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`
                    }),
                    task.actionName
                  ),
                  // Priority & Assignees
                  React.createElement('div', { className: 'flex items-center justify-between gap-2 mb-2' },
                    React.createElement('div', {
                      className: `flex items-center gap-1.5 px-2 py-1 rounded ${priorityInfo.bg}`
                    },
                      React.createElement('span', { className: priorityInfo.text }, priorityInfo.icon),
                      React.createElement('span', {
                        className: `text-xs font-semibold ${priorityInfo.text}`
                      }, priorityInfo.label)
                    ),
                    task.assignees && task.assignees.length > 0 && React.createElement('div', {
                      className: `flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`
                    },
                      React.createElement('span', {
                        className: `text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
                      }, task.assignees[0])
                    )
                  ),
                  // Progress Bar (if has subtasks)
                  task.subtasks && task.subtasks.length > 0 && React.createElement('div', {
                    className: 'mt-2'
                  },
                    React.createElement('div', {
                      className: `flex items-center gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`
                    },
                      React.createElement('span', null, `${task.subtasks.filter(s => s.status === 'completed').length}/${task.subtasks.length} subtasks`),
                      React.createElement('span', {
                        className: 'ml-auto font-semibold'
                      }, `${subtaskProgress}%`)
                    ),
                    React.createElement('div', {
                      className: `w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`
                    },
                      React.createElement('div', {
                        className: `h-full transition-all duration-300 bg-gradient-to-r ${statusInfo.gradient}`,
                        style: { width: `${subtaskProgress}%` }
                      })
                    )
                  )
                );
              })
            )
          );
        })
      )
    );
  };

  // Gantt Chart View - Timeline style matching Action Items app
  const renderGanttView = () => {
    // Collect all items
    const ganttItems = [];

    actionPlan.forEach(action => {
      const actionProgress = calculateProgress(action);
      ganttItems.push({
        type: 'action',
        id: action.id,
        name: action.name,
        status: action.status,
        priority: action.priority,
        progress: actionProgress,
        dependencies: action.dependencies || [],
        level: 0
      });

      action.tasks.forEach(task => {
        const taskProgress = task.subtasks && task.subtasks.length > 0
          ? Math.round((task.subtasks.filter(s => s.status === 'completed').length / task.subtasks.length) * 100)
          : (task.status === 'completed' ? 100 : 0);

        ganttItems.push({
          type: 'task',
          id: task.id,
          actionId: action.id,
          name: task.name,
          status: task.status,
          priority: task.priority,
          progress: taskProgress,
          dependencies: task.dependencies || [],
          level: 1
        });

        if (task.subtasks) {
          task.subtasks.forEach(subtask => {
            ganttItems.push({
              type: 'subtask',
              id: subtask.id,
              taskId: task.id,
              actionId: action.id,
              name: subtask.name,
              status: subtask.status,
              priority: subtask.priority,
              progress: subtask.status === 'completed' ? 100 : 0,
              dependencies: subtask.dependencies || [],
              level: 2
            });
          });
        }
      });
    });

    return React.createElement('div', {
      className: `overflow-x-auto ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-md p-4 border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
    },
      // Header
      React.createElement('h2', {
        className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
      },
        React.createElement('div', {
          className: 'w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full'
        }),
        'Action Plan Timeline'
      ),

      React.createElement('div', { className: 'min-w-[1000px]' },
        // Progress scale header (0% to 100%)
        React.createElement('div', { className: 'flex mb-2' },
          // Empty space for item names
          React.createElement('div', { className: 'w-48 flex-shrink-0' }),
          // Progress scale
          React.createElement('div', {
            className: `flex-1 flex border-b ${darkMode ? 'border-slate-600' : 'border-gray-300'} pb-1`
          },
            [0, 25, 50, 75, 100].map(percent =>
              React.createElement('div', {
                key: percent,
                className: `flex-1 text-xs ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-center font-semibold`
              }, `${percent}%`)
            )
          )
        ),

        // Item rows
        ganttItems.map((item, index) => {
          const indentation = item.level * 12;
          const isCompleted = item.status === 'completed';

          // Determine color based on type
          let barColor, textColor;
          if (item.type === 'action') {
            barColor = 'bg-green-500';
            textColor = darkMode ? 'text-green-300' : 'text-green-700';
          } else if (item.type === 'task') {
            barColor = 'bg-blue-500';
            textColor = darkMode ? 'text-blue-300' : 'text-blue-700';
          } else {
            barColor = 'bg-purple-500';
            textColor = darkMode ? 'text-purple-300' : 'text-purple-700';
          }

          return React.createElement('div', {
            key: `${item.type}-${item.id}`,
            className: 'flex items-center mb-1'
          },
            // Item name column
            React.createElement('div', {
              className: 'w-48 flex-shrink-0 pr-2',
              style: { paddingLeft: `${indentation}px` }
            },
              React.createElement('div', {
                className: `text-[11px] font-bold ${textColor} truncate flex items-center gap-1.5`
              },
                item.type === 'action' && React.createElement('div', {
                  className: `w-1.5 h-1.5 rounded-full ${barColor}`
                }),
                item.type === 'task' && React.createElement('div', {
                  className: `w-1.5 h-1.5 rounded-sm ${barColor}`
                }),
                item.type === 'subtask' && React.createElement('div', {
                  className: `w-1 h-1 rounded-full ${barColor}`
                }),
                item.name
              ),
              item.dependencies.length > 0 && React.createElement('div', {
                className: `text-[9px] ${darkMode ? 'text-amber-400' : 'text-amber-600'}`
              }, `${item.dependencies.length} dep${item.dependencies.length > 1 ? 's' : ''}`)
            ),

            // Timeline area
            React.createElement('div', {
              className: `flex-1 relative h-5 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} rounded border`
            },
              // Grid lines at 25%, 50%, 75%
              [25, 50, 75].map(percent =>
                React.createElement('div', {
                  key: percent,
                  className: `absolute top-0 bottom-0 w-px ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`,
                  style: { left: `${percent}%` }
                })
              ),

              // Progress bar
              React.createElement('div', {
                className: `absolute h-full ${barColor} rounded flex items-center justify-center text-white text-[10px] font-semibold hover:opacity-90 transition cursor-pointer`,
                style: {
                  left: '0%',
                  width: `${item.progress}%`,
                  opacity: isCompleted ? 0.3 : 1
                },
                title: `${item.name}: ${item.progress}% complete`
              }, item.progress > 15 ? `${item.progress}%` : '')
            )
          );
        })
      ),

      // Legend
      React.createElement('div', {
        className: `mt-4 pt-3 border-t ${darkMode ? 'border-slate-700' : 'border-gray-300'} flex items-center justify-between`
      },
        React.createElement('div', {
          className: 'flex items-center gap-6 text-xs'
        },
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('div', { className: 'w-3 h-3 bg-green-500 rounded' }),
            React.createElement('span', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }, 'Action')
          ),
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('div', { className: 'w-3 h-3 bg-blue-500 rounded' }),
            React.createElement('span', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }, 'Task')
          ),
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('div', { className: 'w-3 h-3 bg-purple-500 rounded' }),
            React.createElement('span', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }, 'Subtask')
          )
        ),
        React.createElement('div', {
          className: `text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`
        }, 'Completed items shown with reduced opacity')
      )
    );
  };

  // Table View - Phase 4 - Modernized
  const renderTableView = () => {
    const allTasks = [];
    actionPlan.forEach(action => {
      action.tasks.forEach(task => {
        allTasks.push({ ...task, actionName: action.name, actionId: action.id });
      });
    });

    // Sort by priority then due date
    allTasks.sort((a, b) => {
      const priorityDiff = (PRIORITIES[b.priority || 'medium'].order) - (PRIORITIES[a.priority || 'medium'].order);
      if (priorityDiff !== 0) return priorityDiff;
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    });

    return React.createElement('div', {
      className: `rounded-xl overflow-hidden ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'} shadow-lg`
    },
      // Table header
      React.createElement('div', {
        className: `grid grid-cols-7 gap-3 p-4 font-bold text-xs ${darkMode ? 'bg-slate-800 text-gray-300 border-b border-slate-700' : 'bg-gray-50 text-gray-700 border-b border-gray-200'}`
      },
        React.createElement('div', null, 'TASK'),
        React.createElement('div', null, 'ACTION'),
        React.createElement('div', null, 'STATUS'),
        React.createElement('div', null, 'PRIORITY'),
        React.createElement('div', null, 'ASSIGNEES'),
        React.createElement('div', null, 'DUE DATE'),
        React.createElement('div', null, 'PROGRESS')
      ),
      // Table rows
      React.createElement('div', { className: `divide-y ${darkMode ? 'divide-slate-700' : 'divide-gray-200'}` },
        allTasks.map(task => {
          const statusInfo = STATUSES[task.status || 'not-started'];
          const priorityInfo = PRIORITIES[task.priority || 'medium'];
          const progress = task.subtasks && task.subtasks.length > 0
            ? Math.round((task.subtasks.filter(s => s.status === 'completed').length / task.subtasks.length) * 100)
            : 0;

          return React.createElement('div', {
            key: task.id,
            className: `grid grid-cols-7 gap-3 p-4 text-xs ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors`
          },
            React.createElement('div', {
              className: `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, task.name),
            React.createElement('div', {
              className: `flex items-center gap-1.5`
            },
              React.createElement('div', {
                className: `w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`
              }),
              React.createElement('span', {
                className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              }, task.actionName)
            ),
            React.createElement('div', null,
              React.createElement('span', {
                className: `px-2.5 py-1.5 rounded-lg font-semibold ${statusInfo.bg} ${statusInfo.text}`
              }, statusInfo.label)
            ),
            React.createElement('div', null,
              React.createElement('span', {
                className: `px-2.5 py-1.5 rounded-lg font-semibold ${priorityInfo.bg} ${priorityInfo.text}`
              }, `${priorityInfo.icon} ${priorityInfo.label}`)
            ),
            React.createElement('div', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }, task.assignees && task.assignees.length > 0 ? task.assignees.join(', ') : '-'),
            React.createElement('div', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }, task.dueDate || '-'),
            React.createElement('div', { className: 'flex items-center gap-2' },
              task.subtasks && task.subtasks.length > 0 ? [
                React.createElement('div', {
                  key: 'bar',
                  className: `flex-1 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`
                },
                  React.createElement('div', {
                    className: `h-full transition-all duration-300 bg-gradient-to-r ${statusInfo.gradient}`,
                    style: { width: `${progress}%` }
                  })
                ),
                React.createElement('span', {
                  key: 'text',
                  className: `font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                }, `${progress}%`)
              ] : React.createElement('span', {
                className: `${darkMode ? 'text-gray-500' : 'text-gray-400'}`
              }, '-')
            )
          );
        })
      )
    );
  };

  // SVG Icon Components - Modern toolbar icons
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
    React.createElement('path', { d: 'M3 3v18h18M7 16h4M7 11h7M7 6h10' })
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

  // Toolbar with view switcher and template management (Phase 4 & 5)
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
      // View switcher (Phase 4)
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
      // Template management (Phase 5)
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

  // Template selector panel (Phase 5)
  const renderTemplateSelector = () => {
    if (!showTemplates || settings.templates.length === 0) return null;

    return React.createElement('div', {
      className: `mb-4 p-4 rounded-lg ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} border-2`
    },
      React.createElement('h3', {
        className: `text-lg font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, '📚 Available Templates'),
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

  return React.createElement('div', {
    className: 'space-y-4'
  },
    // Toolbar
    renderToolbar(),
    // Template selector
    renderTemplateSelector(),
    // Content based on current view
    currentView === 'board' ? renderBoardView() :
    currentView === 'table' ? renderTableView() :
    currentView === 'gantt' ? renderGanttView() :
    // List view (default)
    React.createElement('div', { className: 'space-y-4' },
      actionPlan.map((action, index) => renderAction(action, index)),
      // Add Action button
      !isEditLocked && React.createElement('button', {
        onClick: addAction,
        className: `w-full py-4 rounded-xl border-2 border-dashed font-bold transition-all shadow-sm hover:shadow-md ${
          darkMode
            ? 'border-emerald-400/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:border-emerald-400'
            : 'border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:border-emerald-500'
        }`
      }, '✨ Add Action')
    )
  );
}
