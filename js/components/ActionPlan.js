// js/components/ActionPlan.js

/**
 * ActionPlan Component - Full PM Platform
 * Manages hierarchical action plans with Actions > Tasks > Subtasks
 * Features: Status workflow, Priority levels, Descriptions, Comments, Activity log,
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
  const [showComments, setShowComments] = React.useState({});
  const [showDescription, setShowDescription] = React.useState({});
  const [showActivityLog, setShowActivityLog] = React.useState({});
  const [newComment, setNewComment] = React.useState({});
  const [currentView, setCurrentView] = React.useState('list'); // list, board, table
  const [showTemplates, setShowTemplates] = React.useState(false);
  const [filters, setFilters] = React.useState({ status: [], priority: [], search: '' });

  // Constants for status workflow
  const STATUSES = {
    'not-started': { label: 'Not Started', color: 'gray', icon: '⭕', bg: 'bg-gray-500', bgLight: 'bg-gray-100', text: 'text-gray-700' },
    'in-progress': { label: 'In Progress', color: 'blue', icon: '🔵', bg: 'bg-blue-500', bgLight: 'bg-blue-100', text: 'text-blue-700' },
    'blocked': { label: 'Blocked', color: 'red', icon: '🔴', bg: 'bg-red-500', bgLight: 'bg-red-100', text: 'text-red-700' },
    'review': { label: 'Review', color: 'yellow', icon: '🟡', bg: 'bg-yellow-500', bgLight: 'bg-yellow-100', text: 'text-yellow-700' },
    'completed': { label: 'Completed', color: 'green', icon: '🟢', bg: 'bg-green-500', bgLight: 'bg-green-100', text: 'text-green-700' }
  };

  const PRIORITIES = {
    'critical': { label: 'Critical', icon: '🔴', order: 4, color: 'red', bg: 'bg-red-500', bgLight: 'bg-red-100', text: 'text-red-700' },
    'high': { label: 'High', icon: '🟠', order: 3, color: 'orange', bg: 'bg-orange-500', bgLight: 'bg-orange-100', text: 'text-orange-700' },
    'medium': { label: 'Medium', icon: '🟡', order: 2, color: 'yellow', bg: 'bg-yellow-500', bgLight: 'bg-yellow-100', text: 'text-yellow-700' },
    'low': { label: 'Low', icon: '🔵', order: 1, color: 'blue', bg: 'bg-blue-500', bgLight: 'bg-blue-100', text: 'text-blue-700' }
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

  // Add comment (Phase 3)
  const addComment = (type, ids, text) => {
    if (!text.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: currentUser,
      text: text.trim(),
      timestamp: getTimestamp()
    };

    const newActionPlan = actionPlan.map(action => {
      if (type === 'action' && action.id === ids.actionId) {
        return {
          ...action,
          comments: [...action.comments, comment],
          activityLog: [...action.activityLog, createActivity('comment-added', 'Comment added')]
        };
      }
      if (action.id === ids.actionId) {
        return {
          ...action,
          tasks: action.tasks.map(task => {
            if (type === 'task' && task.id === ids.taskId) {
              return {
                ...task,
                comments: [...task.comments, comment],
                activityLog: [...task.activityLog, createActivity('comment-added', 'Comment added')]
              };
            }
            return task;
          })
        };
      }
      return action;
    });

    updateActionPlan(newActionPlan);
    const key = ids.actionId + (ids.taskId || '');
    setNewComment({ ...newComment, [key]: '' });
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

  // Render status dropdown (Phase 1)
  const renderStatusDropdown = (item, type, ids) => {
    const status = item.status || 'not-started';
    const statusInfo = STATUSES[status];

    return React.createElement('select', {
      value: status,
      onChange: (e) => updateItem(type, ids, 'status', e.target.value, status),
      className: `px-2 py-1 text-xs rounded border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} font-semibold ${statusInfo.text}`,
      disabled: isEditLocked
    },
      Object.entries(STATUSES).map(([key, val]) =>
        React.createElement('option', { key, value: key }, `${val.icon} ${val.label}`)
      )
    );
  };

  // Render priority dropdown (Phase 1)
  const renderPriorityDropdown = (item, type, ids) => {
    const priority = item.priority || 'medium';
    const priorityInfo = PRIORITIES[priority];

    return React.createElement('select', {
      value: priority,
      onChange: (e) => updateItem(type, ids, 'priority', e.target.value, priority),
      className: `px-2 py-1 text-xs rounded border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} font-semibold ${priorityInfo.text}`,
      disabled: isEditLocked
    },
      Object.entries(PRIORITIES).map(([key, val]) =>
        React.createElement('option', { key, value: key }, `${val.icon} ${val.label}`)
      )
    );
  };

  // Render description field (Phase 1)
  const renderDescription = (item, type, ids) => {
    const key = ids.actionId + (ids.taskId || '');
    const isExpanded = showDescription[key];

    return React.createElement('div', { className: 'mt-2' },
      React.createElement('button', {
        onClick: () => setShowDescription({ ...showDescription, [key]: !isExpanded }),
        className: `text-xs font-semibold ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`,
        disabled: isEditLocked
      }, isExpanded ? '📝 Hide Description' : '📝 Description'),
      isExpanded && React.createElement('textarea', {
        value: item.description || '',
        onChange: (e) => updateItem(type, ids, 'description', e.target.value),
        placeholder: 'Add description...',
        className: `mt-1 w-full px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded`,
        rows: 3,
        disabled: isEditLocked
      })
    );
  };

  // Render comments section (Phase 3)
  const renderComments = (item, type, ids) => {
    const key = ids.actionId + (ids.taskId || '');
    const isExpanded = showComments[key];
    const comments = item.comments || [];

    return React.createElement('div', { className: 'mt-2' },
      React.createElement('button', {
        onClick: () => setShowComments({ ...showComments, [key]: !isExpanded }),
        className: `text-xs font-semibold ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`,
        disabled: isEditLocked
      }, `💬 Comments (${comments.length})`),
      isExpanded && React.createElement('div', { className: 'mt-2 space-y-2' },
        comments.length > 0 && React.createElement('div', { className: `space-y-1 max-h-40 overflow-y-auto ${darkMode ? 'bg-slate-900/50' : 'bg-gray-50'} rounded p-2` },
          comments.map(comment =>
            React.createElement('div', { key: comment.id, className: 'text-xs' },
              React.createElement('div', { className: `font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}` }, comment.author),
              React.createElement('div', { className: `${darkMode ? 'text-gray-300' : 'text-gray-700'}` }, comment.text),
              React.createElement('div', { className: `${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs` }, new Date(comment.timestamp).toLocaleString())
            )
          )
        ),
        !isEditLocked && React.createElement('div', { className: 'flex gap-1' },
          React.createElement('input', {
            type: 'text',
            value: newComment[key] || '',
            onChange: (e) => setNewComment({ ...newComment, [key]: e.target.value }),
            onKeyDown: (e) => e.key === 'Enter' && addComment(type, ids, newComment[key]),
            placeholder: 'Add a comment...',
            className: `flex-1 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded`
          }),
          React.createElement('button', {
            onClick: () => addComment(type, ids, newComment[key]),
            className: `px-2 py-1 text-xs rounded font-semibold ${darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`,
          }, 'Send')
        )
      )
    );
  };

  // Render activity log (Phase 3)
  const renderActivityLog = (item, ids) => {
    const key = ids.actionId + (ids.taskId || '');
    const isExpanded = showActivityLog[key];
    const activities = item.activityLog || [];

    return React.createElement('div', { className: 'mt-2' },
      React.createElement('button', {
        onClick: () => setShowActivityLog({ ...showActivityLog, [key]: !isExpanded }),
        className: `text-xs font-semibold ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`
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
        darkMode ? 'bg-slate-700/70 border-slate-600' : 'bg-white border-blue-200'
      } border-l-4 shadow-sm hover:shadow-md ${task.completed ? 'opacity-70' : ''}`
    },
      // Task Header
      React.createElement('div', {
        className: `p-3 ${darkMode ? 'bg-slate-700/50' : 'bg-blue-50/50'}`
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
        // Description (Phase 1)
        renderDescription(task, 'task', ids),
        // Comments (Phase 3)
        renderComments(task, 'task', ids),
        // Activity Log (Phase 3)
        renderActivityLog(task, ids)
      ),
      // Subtasks
      isExpanded && task.subtasks.length > 0 && React.createElement('div', {
        className: `p-3 ${darkMode ? 'bg-slate-800/30' : 'bg-blue-50/30'}`
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
        darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-green-300'
      } border-2 shadow-lg hover:shadow-xl ${action.status === 'completed' ? 'opacity-70' : ''}`
    },
      // Action Header with Gradient
      React.createElement('div', {
        className: `p-4 ${darkMode ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50' : 'bg-gradient-to-r from-green-50 to-emerald-50'}`
      },
        React.createElement('div', {
          className: 'flex items-center gap-3'
        },
          // Expand/Collapse
          totalTasks > 0 && React.createElement('button', {
            onClick: () => setExpandedActions({ ...expandedActions, [action.id]: !isExpanded }),
            className: `p-1.5 rounded ${darkMode ? 'hover:bg-green-800 text-green-400' : 'hover:bg-green-100 text-green-600'}`
          }, isExpanded ? '▼' : '▶'),
          // Status dropdown (Phase 1)
          renderStatusDropdown(action, 'action', ids),
          // Priority dropdown (Phase 1)
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
                className: `flex-1 px-3 py-1.5 text-base font-bold border ${darkMode ? 'border-green-500 bg-slate-800 text-gray-200' : 'border-green-400 bg-white'} rounded`,
                disabled: isEditLocked
              })
            : React.createElement('div', {
                onClick: () => !isEditLocked && setEditingItem({ type: 'action', actionId: action.id }),
                className: `flex-1 text-base font-bold ${action.status === 'completed' ? 'line-through' : ''} ${darkMode ? 'text-gray-200' : 'text-gray-800'} cursor-pointer`
              }, action.name),
          // Task count badge
          totalTasks > 0 && React.createElement('div', {
            className: `px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-green-500/30 text-green-300' : 'bg-green-100 text-green-700'}`
          }, `${completedTasks}/${totalTasks} Tasks`),
          // Progress percentage
          totalTasks > 0 && React.createElement('div', {
            className: `px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`
          }, `${progress}%`),
          // Actions (shown on hover)
          React.createElement('div', {
            className: 'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'
          },
            React.createElement('button', {
              onClick: () => addTask(action.id),
              className: `px-2 py-1 text-xs rounded font-semibold ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`,
              disabled: isEditLocked
            }, '+ Task'),
            React.createElement('button', {
              onClick: () => moveItem('action', ids, 'up'),
              className: `p-1 rounded ${darkMode ? 'hover:bg-green-800 text-gray-400' : 'hover:bg-green-100 text-gray-600'}`,
              disabled: isEditLocked,
              title: 'Move up'
            }, '↑'),
            React.createElement('button', {
              onClick: () => moveItem('action', ids, 'down'),
              className: `p-1 rounded ${darkMode ? 'hover:bg-green-800 text-gray-400' : 'hover:bg-green-100 text-gray-600'}`,
              disabled: isEditLocked,
              title: 'Move down'
            }, '↓'),
            React.createElement('button', {
              onClick: () => setShowDependencies({ ...showDependencies, [action.id]: !showDeps }),
              className: `p-1 rounded ${darkMode ? 'hover:bg-green-800 text-gray-400' : 'hover:bg-green-100 text-gray-600'}`,
              disabled: isEditLocked,
              title: 'Dependencies'
            }, '🔗'),
            React.createElement('button', {
              onClick: () => deleteItem('action', ids),
              className: `p-1 rounded ${darkMode ? 'hover:bg-red-600 text-red-400' : 'hover:bg-red-100 text-red-600'}`,
              disabled: isEditLocked,
              title: 'Delete'
            }, '×')
          )
        ),
        // Progress Bar
        totalTasks > 0 && React.createElement('div', {
          className: 'mt-3'
        },
          React.createElement('div', {
            className: `w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`
          },
            React.createElement('div', {
              className: `h-full transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`,
              style: { width: `${progress}%` }
            })
          )
        ),
        // Dependencies
        (action.dependencies || []).length > 0 && React.createElement('div', {
          className: 'mt-2 flex flex-wrap gap-1'
        }, renderDependencyTags(action, 'action', ids)),
        showDeps && renderDependencySelector(action, 'action', ids),
        // Description (Phase 1)
        renderDescription(action, 'action', ids),
        // Comments (Phase 3)
        renderComments(action, 'action', ids),
        // Activity Log (Phase 3)
        renderActivityLog(action, ids)
      ),
      // Tasks
      isExpanded && React.createElement('div', {
        className: `p-4 ${darkMode ? 'bg-slate-800/50' : 'bg-green-50/20'}`
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
        className: `px-4 py-2 rounded-lg font-semibold ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`
      }, '+ Add Action')
    );
  }

  // Board View (Kanban) - Phase 4
  const renderBoardView = () => {
    const statuses = ['not-started', 'in-progress', 'blocked', 'review', 'completed'];

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
        className: 'grid grid-cols-5 gap-4'
      },
        statuses.map(status => {
          const statusInfo = STATUSES[status];
          const tasks = tasksByStatus[status];

          return React.createElement('div', {
            key: status,
            className: `rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-50'} p-3`
          },
            React.createElement('div', {
              className: `flex items-center gap-2 mb-3 pb-2 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
            },
              React.createElement('span', { className: 'text-xl' }, statusInfo.icon),
              React.createElement('span', {
                className: `font-bold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, statusInfo.label),
              React.createElement('span', {
                className: `ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
              }, tasks.length)
            ),
            React.createElement('div', { className: 'space-y-2' },
              tasks.map(task => {
                const priorityInfo = PRIORITIES[task.priority || 'medium'];
                return React.createElement('div', {
                  key: task.id,
                  className: `p-2 rounded ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-100'} cursor-pointer transition-colors text-xs`
                },
                  React.createElement('div', {
                    className: `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`
                  }, task.name),
                  React.createElement('div', {
                    className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`
                  }, `📋 ${task.actionName}`),
                  React.createElement('div', { className: 'flex items-center gap-1' },
                    React.createElement('span', null, priorityInfo.icon),
                    task.assignees && task.assignees.length > 0 && React.createElement('span', {
                      className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                    }, `👤 ${task.assignees.join(', ')}`)
                  )
                );
              })
            )
          );
        })
      )
    );
  };

  // Table View - Phase 4
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
      className: `rounded-lg overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
    },
      // Table header
      React.createElement('div', {
        className: `grid grid-cols-7 gap-2 p-3 font-bold text-xs ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'} border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
      },
        React.createElement('div', null, 'Task'),
        React.createElement('div', null, 'Action'),
        React.createElement('div', null, 'Status'),
        React.createElement('div', null, 'Priority'),
        React.createElement('div', null, 'Assignees'),
        React.createElement('div', null, 'Due Date'),
        React.createElement('div', null, 'Progress')
      ),
      // Table rows
      React.createElement('div', { className: 'divide-y' + (darkMode ? ' divide-slate-700' : ' divide-gray-200') },
        allTasks.map(task => {
          const statusInfo = STATUSES[task.status || 'not-started'];
          const priorityInfo = PRIORITIES[task.priority || 'medium'];
          const progress = task.subtasks && task.subtasks.length > 0
            ? Math.round((task.subtasks.filter(s => s.status === 'completed').length / task.subtasks.length) * 100)
            : 0;

          return React.createElement('div', {
            key: task.id,
            className: `grid grid-cols-7 gap-2 p-3 text-xs ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'} transition-colors`
          },
            React.createElement('div', {
              className: `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, task.name),
            React.createElement('div', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }, task.actionName),
            React.createElement('div', null,
              React.createElement('span', {
                className: `px-2 py-1 rounded text-xs ${darkMode ? statusInfo.bgLight.replace('bg-', 'bg-opacity-20 bg-') : statusInfo.bgLight}`
              }, `${statusInfo.icon} ${statusInfo.label}`)
            ),
            React.createElement('div', null,
              React.createElement('span', null, `${priorityInfo.icon} ${priorityInfo.label}`)
            ),
            React.createElement('div', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }, task.assignees && task.assignees.length > 0 ? task.assignees.join(', ') : '-'),
            React.createElement('div', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }, task.dueDate || '-'),
            React.createElement('div', null,
              task.subtasks && task.subtasks.length > 0 && React.createElement('span', {
                className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              }, `${progress}%`)
            )
          );
        })
      )
    );
  };

  // Toolbar with view switcher and template management (Phase 4 & 5)
  const renderToolbar = () => {
    return React.createElement('div', {
      className: `flex items-center justify-between mb-4 p-3 rounded-lg ${darkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`
    },
      // View switcher (Phase 4)
      React.createElement('div', { className: 'flex gap-2' },
        ['list', 'board', 'table'].map(view =>
          React.createElement('button', {
            key: view,
            onClick: () => setCurrentView(view),
            className: `px-3 py-1.5 rounded text-sm font-semibold transition-all ${
              currentView === view
                ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-white text-gray-700 hover:bg-gray-200'
            }`
          }, view === 'list' ? '📋 List' : view === 'board' ? '📊 Board' : '📑 Table')
        )
      ),
      // Template management (Phase 5)
      !isEditLocked && React.createElement('div', { className: 'flex gap-2' },
        actionPlan.length > 0 && React.createElement('button', {
          onClick: saveAsTemplate,
          className: `px-3 py-1.5 rounded text-sm font-semibold ${darkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`
        }, '💾 Save as Template'),
        settings.templates.length > 0 && React.createElement('button', {
          onClick: () => setShowTemplates(!showTemplates),
          className: `px-3 py-1.5 rounded text-sm font-semibold ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`
        }, `📚 Templates (${settings.templates.length})`)
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
    // List view (default)
    React.createElement('div', { className: 'space-y-4' },
      actionPlan.map((action, index) => renderAction(action, index)),
      // Add Action button
      !isEditLocked && React.createElement('button', {
        onClick: addAction,
        className: `w-full py-3 rounded-xl border-2 border-dashed font-semibold transition-all ${
          darkMode
            ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-400'
            : 'border-green-500 bg-green-50 hover:bg-green-100 text-green-700'
        }`
      }, '+ Add Action')
    )
  );
}
