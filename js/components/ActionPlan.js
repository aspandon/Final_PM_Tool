// js/components/ActionPlan.js

/**
 * ActionPlan Component - Modern Redesign
 * Manages hierarchical action plans with Actions > Tasks > Subtasks
 * Features: Completion tracking, inline editing, tag-based dependencies, progress bars
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

  // Initialize action plan
  const actionPlan = project.actionPlan || [];

  // Update action plan
  const updateActionPlan = (newActionPlan) => {
    updateProject(pIndex, 'actionPlan', newActionPlan);
  };

  // Add new action
  const addAction = () => {
    const newAction = {
      id: Date.now().toString(),
      name: 'New Action',
      tasks: [],
      dependencies: [],
      completed: false
    };
    updateActionPlan([...actionPlan, newAction]);
    setExpandedActions({ ...expandedActions, [newAction.id]: true });
    setEditingItem({ type: 'action', actionId: newAction.id });
  };

  // Add new task
  const addTask = (actionId) => {
    const newActionPlan = actionPlan.map(action => {
      if (action.id === actionId) {
        const newTask = {
          id: Date.now().toString(),
          name: 'New Task',
          dueDate: '',
          assignee: '',
          subtasks: [],
          dependencies: [],
          completed: false
        };
        return { ...action, tasks: [...action.tasks, newTask] };
      }
      return action;
    });
    updateActionPlan(newActionPlan);
    const newTaskId = newActionPlan.find(a => a.id === actionId).tasks.slice(-1)[0].id;
    setExpandedTasks({ ...expandedTasks, [newTaskId]: true });
    setEditingItem({ type: 'task', actionId, taskId: newTaskId });
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

  // Add dependency
  const addDependency = (item, type, ids, depId) => {
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
    if (action.tasks.length === 0) return 0;
    const completedTasks = action.tasks.filter(t => t.completed).length;
    return Math.round((completedTasks / action.tasks.length) * 100);
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
      } border-l-2 ${subtask.completed ? 'opacity-60' : ''}`
    },
      // Subtask Header
      React.createElement('div', {
        className: 'flex items-center gap-2'
      },
        // Checkbox
        React.createElement('input', {
          type: 'checkbox',
          checked: subtask.completed || false,
          onChange: () => toggleCompletion('subtask', ids),
          className: `w-4 h-4 rounded border-2 ${darkMode ? 'border-slate-500' : 'border-gray-400'} ${isEditLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`,
          disabled: isEditLocked
        }),
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
              className: `flex-1 text-sm font-medium ${subtask.completed ? 'line-through' : ''} ${darkMode ? 'text-gray-200' : 'text-gray-800'} cursor-pointer`
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
    const completedSubtasks = task.subtasks.filter(s => s.completed).length;
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
          // Checkbox
          React.createElement('input', {
            type: 'checkbox',
            checked: task.completed || false,
            onChange: () => toggleCompletion('task', ids),
            className: `w-4 h-4 rounded border-2 ${darkMode ? 'border-slate-500' : 'border-blue-400'} ${isEditLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`,
            disabled: isEditLocked
          }),
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
                className: `flex-1 text-sm font-semibold ${task.completed ? 'line-through' : ''} ${darkMode ? 'text-gray-200' : 'text-gray-800'} cursor-pointer`
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
        showDeps && renderDependencySelector(task, 'task', ids)
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
    const completedTasks = action.tasks.filter(t => t.completed).length;
    const totalTasks = action.tasks.length;

    return React.createElement('div', {
      key: action.id,
      className: `group mb-4 rounded-xl overflow-hidden transition-all ${
        darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-green-300'
      } border-2 shadow-lg hover:shadow-xl ${action.completed ? 'opacity-70' : ''}`
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
          // Checkbox
          React.createElement('input', {
            type: 'checkbox',
            checked: action.completed || false,
            onChange: () => toggleCompletion('action', ids),
            className: `w-5 h-5 rounded border-2 ${darkMode ? 'border-green-500' : 'border-green-500'} ${isEditLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`,
            disabled: isEditLocked
          }),
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
                className: `flex-1 text-base font-bold ${action.completed ? 'line-through' : ''} ${darkMode ? 'text-gray-200' : 'text-gray-800'} cursor-pointer`
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
        showDeps && renderDependencySelector(action, 'action', ids)
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

  return React.createElement('div', {
    className: 'space-y-4'
  },
    // Actions list
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
  );
}
