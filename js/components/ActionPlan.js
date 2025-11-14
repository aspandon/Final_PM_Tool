// js/components/ActionPlan.js

/**
 * ActionPlan Component
 * Manages hierarchical action plans with Actions > Tasks > Subtasks
 * Supports reordering, due dates, assignees, and dependencies
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
  const [editingItem, setEditingItem] = React.useState(null); // { type, actionId, taskId, subtaskId }

  // Initialize action plan if it doesn't exist
  const actionPlan = project.actionPlan || [];

  // Update action plan
  const updateActionPlan = (newActionPlan) => {
    updateProject(pIndex, 'actionPlan', newActionPlan);
  };

  // Add new action
  const addAction = () => {
    const newAction = {
      id: Date.now().toString(),
      name: '',
      tasks: [],
      dependencies: []
    };
    updateActionPlan([...actionPlan, newAction]);
    setEditingItem({ type: 'action', actionId: newAction.id });
  };

  // Add new task to action
  const addTask = (actionId) => {
    const newActionPlan = actionPlan.map(action => {
      if (action.id === actionId) {
        const newTask = {
          id: Date.now().toString(),
          name: '',
          dueDate: '',
          assignee: '',
          subtasks: [],
          dependencies: []
        };
        return { ...action, tasks: [...action.tasks, newTask] };
      }
      return action;
    });
    updateActionPlan(newActionPlan);
    const newTask = newActionPlan.find(a => a.id === actionId).tasks.slice(-1)[0];
    setEditingItem({ type: 'task', actionId, taskId: newTask.id });
  };

  // Add new subtask to task
  const addSubtask = (actionId, taskId) => {
    const newActionPlan = actionPlan.map(action => {
      if (action.id === actionId) {
        return {
          ...action,
          tasks: action.tasks.map(task => {
            if (task.id === taskId) {
              const newSubtask = {
                id: Date.now().toString(),
                name: '',
                dueDate: '',
                assignee: '',
                dependencies: []
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
    const newSubtask = newActionPlan
      .find(a => a.id === actionId)
      .tasks.find(t => t.id === taskId)
      .subtasks.slice(-1)[0];
    setEditingItem({ type: 'subtask', actionId, taskId, subtaskId: newSubtask.id });
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
    if (!confirm(`Delete this ${type}?`)) return;

    const newActionPlan = actionPlan.map(action => {
      if (type === 'action' && action.id === ids.actionId) {
        return null;
      }
      if (action.id === ids.actionId) {
        return {
          ...action,
          tasks: action.tasks.map(task => {
            if (type === 'task' && task.id === ids.taskId) {
              return null;
            }
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

  // Toggle expand/collapse
  const toggleAction = (actionId) => {
    setExpandedActions(prev => ({ ...prev, [actionId]: !prev[actionId] }));
  };

  const toggleTask = (taskId) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // Get all items for dependency dropdown
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

  // Render dependency selector
  const renderDependencySelector = (item, type, ids) => {
    const allItems = getAllItems().filter(i => i.id !== item.id);
    const selectedDeps = item.dependencies || [];

    return React.createElement('div', {
      className: 'mt-1'
    },
      React.createElement('label', {
        className: `text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1`
      }, '🔗 Dependencies'),
      React.createElement('select', {
        multiple: true,
        value: selectedDeps,
        onChange: (e) => {
          const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
          updateItem(type, ids, 'dependencies', selected);
        },
        className: `w-full px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
        disabled: isEditLocked,
        size: 3
      },
        allItems.map(i =>
          React.createElement('option', {
            key: i.id,
            value: i.id
          }, `[${i.type}] ${i.name}`)
        )
      ),
      selectedDeps.length > 0 && React.createElement('div', {
        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`
      }, `${selectedDeps.length} selected (Ctrl/Cmd+Click to select multiple)`)
    );
  };

  // Render subtask
  const renderSubtask = (subtask, actionId, taskId) => {
    const ids = { actionId, taskId, subtaskId: subtask.id };
    const isEditing = editingItem?.type === 'subtask' && editingItem?.subtaskId === subtask.id;

    return React.createElement('div', {
      key: subtask.id,
      className: `ml-8 mb-2 p-2 rounded ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} border`
    },
      React.createElement('div', {
        className: 'flex items-center gap-2'
      },
        React.createElement('span', {
          className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
        }, '└─'),
        React.createElement('input', {
          type: 'text',
          value: subtask.name,
          onChange: (e) => updateItem('subtask', ids, 'name', e.target.value),
          onFocus: () => setEditingItem({ type: 'subtask', actionId, taskId, subtaskId: subtask.id }),
          onBlur: () => setEditingItem(null),
          placeholder: 'Subtask name',
          className: `flex-1 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked
        }),
        React.createElement('input', {
          type: 'date',
          value: subtask.dueDate || '',
          onChange: (e) => updateItem('subtask', ids, 'dueDate', e.target.value),
          className: `w-32 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked
        }),
        React.createElement('input', {
          type: 'text',
          value: subtask.assignee || '',
          onChange: (e) => updateItem('subtask', ids, 'assignee', e.target.value),
          placeholder: 'Assignee',
          className: `w-28 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked
        }),
        React.createElement('button', {
          onClick: () => moveItem('subtask', ids, 'up'),
          className: `p-1 text-xs ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked,
          title: 'Move up'
        }, '▲'),
        React.createElement('button', {
          onClick: () => moveItem('subtask', ids, 'down'),
          className: `p-1 text-xs ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked,
          title: 'Move down'
        }, '▼'),
        React.createElement('button', {
          onClick: () => deleteItem('subtask', ids),
          className: `p-1 text-xs text-red-500 hover:text-red-700 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked,
          title: 'Delete subtask'
        }, '🗑️')
      ),
      isEditing && renderDependencySelector(subtask, 'subtask', ids)
    );
  };

  // Render task
  const renderTask = (task, actionId) => {
    const ids = { actionId, taskId: task.id };
    const isExpanded = expandedTasks[task.id];
    const isEditing = editingItem?.type === 'task' && editingItem?.taskId === task.id;

    return React.createElement('div', {
      key: task.id,
      className: `ml-4 mb-2`
    },
      React.createElement('div', {
        className: `p-2 rounded ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-blue-50 border-blue-200'} border`
      },
        React.createElement('div', {
          className: 'flex items-center gap-2'
        },
          React.createElement('button', {
            onClick: () => toggleTask(task.id),
            className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
          }, isExpanded ? '▼' : '▶'),
          React.createElement('input', {
            type: 'text',
            value: task.name,
            onChange: (e) => updateItem('task', ids, 'name', e.target.value),
            onFocus: () => setEditingItem({ type: 'task', actionId, taskId: task.id }),
            onBlur: () => setEditingItem(null),
            placeholder: 'Task name',
            className: `flex-1 px-2 py-1 text-sm font-semibold border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-blue-300 bg-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            disabled: isEditLocked
          }),
          React.createElement('input', {
            type: 'date',
            value: task.dueDate || '',
            onChange: (e) => updateItem('task', ids, 'dueDate', e.target.value),
            className: `w-32 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-blue-300 bg-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            disabled: isEditLocked
          }),
          React.createElement('input', {
            type: 'text',
            value: task.assignee || '',
            onChange: (e) => updateItem('task', ids, 'assignee', e.target.value),
            placeholder: 'Assignee',
            className: `w-28 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-blue-300 bg-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            disabled: isEditLocked
          }),
          React.createElement('button', {
            onClick: () => addSubtask(actionId, task.id),
            className: `px-2 py-1 text-xs ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            disabled: isEditLocked,
            title: 'Add subtask'
          }, '+ Sub'),
          React.createElement('button', {
            onClick: () => moveItem('task', ids, 'up'),
            className: `p-1 text-xs ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            disabled: isEditLocked,
            title: 'Move up'
          }, '▲'),
          React.createElement('button', {
            onClick: () => moveItem('task', ids, 'down'),
            className: `p-1 text-xs ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            disabled: isEditLocked,
            title: 'Move down'
          }, '▼'),
          React.createElement('button', {
            onClick: () => deleteItem('task', ids),
            className: `p-1 text-xs text-red-500 hover:text-red-700 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            disabled: isEditLocked,
            title: 'Delete task'
          }, '🗑️')
        ),
        isEditing && renderDependencySelector(task, 'task', ids)
      ),
      isExpanded && task.subtasks.map(subtask => renderSubtask(subtask, actionId, task.id))
    );
  };

  // Render action
  const renderAction = (action) => {
    const ids = { actionId: action.id };
    const isExpanded = expandedActions[action.id];
    const isEditing = editingItem?.type === 'action' && editingItem?.actionId === action.id;

    return React.createElement('div', {
      key: action.id,
      className: `mb-3 p-3 rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-green-50 border-green-200'} border-2`
    },
      React.createElement('div', {
        className: 'flex items-center gap-2 mb-2'
      },
        React.createElement('button', {
          onClick: () => toggleAction(action.id),
          className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
        }, isExpanded ? '▼' : '▶'),
        React.createElement('input', {
          type: 'text',
          value: action.name,
          onChange: (e) => updateItem('action', ids, 'name', e.target.value),
          onFocus: () => setEditingItem({ type: 'action', actionId: action.id }),
          onBlur: () => setEditingItem(null),
          placeholder: 'Action name',
          className: `flex-1 px-3 py-1.5 text-sm font-bold border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-green-300 bg-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked
        }),
        React.createElement('button', {
          onClick: () => addTask(action.id),
          className: `px-3 py-1 text-sm ${darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked,
          title: 'Add task'
        }, '+ Task'),
        React.createElement('button', {
          onClick: () => moveItem('action', ids, 'up'),
          className: `p-1 text-sm ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked,
          title: 'Move up'
        }, '▲'),
        React.createElement('button', {
          onClick: () => moveItem('action', ids, 'down'),
          className: `p-1 text-sm ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked,
          title: 'Move down'
        }, '▼'),
        React.createElement('button', {
          onClick: () => deleteItem('action', ids),
          className: `p-1 text-sm text-red-500 hover:text-red-700 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked,
          title: 'Delete action'
        }, '🗑️')
      ),
      isEditing && renderDependencySelector(action, 'action', ids),
      isExpanded && action.tasks.map(task => renderTask(task, action.id))
    );
  };

  // Main render
  return React.createElement('div', {
    className: `p-3 border-t-2 ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
  },
    React.createElement('div', {
      className: `rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700/50' : 'border-indigo-200 bg-indigo-50/50'} p-3`
    },
      // Header
      React.createElement('div', {
        className: `flex items-center justify-between mb-3`
      },
        React.createElement('div', {
          className: `text-sm font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-900'} flex items-center gap-2`
        },
          React.createElement('div', {
            className: 'w-0.5 h-3 bg-indigo-600 rounded'
          }),
          '📋 Action Plan'
        ),
        React.createElement('button', {
          onClick: addAction,
          className: `px-3 py-1 text-sm font-semibold ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
          disabled: isEditLocked
        }, '+ Add Action')
      ),

      // Actions list
      actionPlan.length === 0 ? React.createElement('div', {
        className: `text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`
      }, 'No actions yet. Click "Add Action" to get started.') : actionPlan.map(action => renderAction(action))
    )
  );
}
