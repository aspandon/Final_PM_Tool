// js/components/ActionPlan/ActionPlanBoard.js

/**
 * ActionPlanBoard Component
 * Kanban-style board view grouped by status
 * Features drag-and-drop to change status for Actions, Tasks, and Subtasks
 */

export function ActionPlanBoard({ actionPlan, darkMode, onUpdate, statuses, priorities, isEditLocked }) {
  console.log('📊 [ActionPlanBoard] Component loaded - VERSION 2.0');

  const [draggedItem, setDraggedItem] = React.useState(null);
  const [viewFilters, setViewFilters] = React.useState({
    showActions: true,
    showTasks: true,
    showSubtasks: true
  });

  const statusOrder = ['not-started', 'blocked', 'in-progress', 'completed'];

  // Toggle filter
  const toggleFilter = (filterKey) => {
    setViewFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  // Handle drag start
  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  // Handle drag over - allow drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop - update item status
  const handleDrop = (newStatus) => {
    if (!draggedItem || isEditLocked) return;

    const newActionPlan = actionPlan.map(action => {
      // Update Action status
      if (draggedItem.type === 'action' && action.id === draggedItem.id) {
        return { ...action, status: newStatus };
      }

      // Update Task or Subtask status
      if (draggedItem.type === 'task' || draggedItem.type === 'subtask') {
        if (action.id === draggedItem.actionId) {
          return {
            ...action,
            tasks: action.tasks.map(task => {
              // Update Task status
              if (draggedItem.type === 'task' && task.id === draggedItem.id) {
                return { ...task, status: newStatus };
              }

              // Update Subtask status
              if (draggedItem.type === 'subtask' && task.id === draggedItem.taskId) {
                return {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.id === draggedItem.id
                      ? { ...subtask, status: newStatus }
                      : subtask
                  )
                };
              }

              return task;
            })
          };
        }
      }

      return action;
    });

    onUpdate(newActionPlan);
    setDraggedItem(null);
  };

  // Get all items grouped by status
  const itemsByStatus = {};
  statusOrder.forEach(status => {
    itemsByStatus[status] = [];
  });

  console.log('[ActionPlanBoard] View filters:', viewFilters);
  console.log('[ActionPlanBoard] Action plan data:', actionPlan);

  actionPlan.forEach(action => {
    // Add Actions
    if (viewFilters.showActions) {
      const status = action.status || 'not-started';
      itemsByStatus[status].push({
        ...action,
        type: 'action',
        itemName: action.name,
        displayName: action.name
      });
      console.log('[ActionPlanBoard] Added Action:', action.name, 'Status:', status);
    }

    // Add Tasks
    if (viewFilters.showTasks && action.tasks) {
      action.tasks.forEach(task => {
        const status = task.status || 'not-started';
        itemsByStatus[status].push({
          ...task,
          type: 'task',
          itemName: task.name,
          displayName: task.name,
          actionName: action.name,
          actionId: action.id
        });
        console.log('[ActionPlanBoard] Added Task:', task.name, 'Status:', status);
      });
    }

    // Add Subtasks
    if (viewFilters.showSubtasks && action.tasks) {
      action.tasks.forEach(task => {
        if (task.subtasks && task.subtasks.length > 0) {
          task.subtasks.forEach(subtask => {
            const status = subtask.status || 'not-started';
            itemsByStatus[status].push({
              ...subtask,
              type: 'subtask',
              itemName: subtask.name,
              displayName: subtask.name,
              taskName: task.name,
              taskId: task.id,
              actionName: action.name,
              actionId: action.id
            });
            console.log('[ActionPlanBoard] Added Subtask:', subtask.name, 'Status:', status);
          });
        }
      });
    }
  });

  console.log('[ActionPlanBoard] Items by status:', itemsByStatus);

  return React.createElement('div', { className: 'space-y-4' },
    // Filter Toggles
    React.createElement('div', {
      className: `flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'}`
    },
      React.createElement('span', {
        className: `text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
      }, 'Show:'),

      // Actions Toggle
      React.createElement('button', {
        onClick: () => toggleFilter('showActions'),
        disabled: isEditLocked,
        className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          viewFilters.showActions
            ? darkMode
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : darkMode
              ? 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
        } ${isEditLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
      }, 'Actions'),

      // Tasks Toggle
      React.createElement('button', {
        onClick: () => toggleFilter('showTasks'),
        disabled: isEditLocked,
        className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          viewFilters.showTasks
            ? darkMode
              ? 'bg-green-600 text-white'
              : 'bg-green-500 text-white'
            : darkMode
              ? 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
        } ${isEditLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
      }, 'Tasks'),

      // Subtasks Toggle
      React.createElement('button', {
        onClick: () => toggleFilter('showSubtasks'),
        disabled: isEditLocked,
        className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          viewFilters.showSubtasks
            ? darkMode
              ? 'bg-purple-600 text-white'
              : 'bg-purple-500 text-white'
            : darkMode
              ? 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
        } ${isEditLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
      }, 'Subtasks')
    ),

    // Board Columns
    React.createElement('div', {
      className: 'grid grid-cols-4 gap-4'
    },
      statusOrder.map(status => {
        const statusInfo = statuses[status];
        const items = itemsByStatus[status];

        return React.createElement('div', {
          key: status,
          className: `rounded-xl ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'} p-4 shadow-sm min-h-[400px]`,
          onDragOver: handleDragOver,
          onDrop: () => handleDrop(status)
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
            }, items.length)
          ),

          // Cards
          React.createElement('div', { className: 'space-y-3' },
            items.map(item => {
              const priorityInfo = priorities[item.priority || 'medium'];

              // Type-specific styling
              const typeStyles = {
                action: {
                  border: darkMode ? 'border-blue-500/50' : 'border-blue-400',
                  badge: darkMode ? 'bg-blue-600' : 'bg-blue-500',
                  dot: darkMode ? 'bg-blue-400' : 'bg-blue-500',
                  label: 'Action'
                },
                task: {
                  border: darkMode ? 'border-green-500/50' : 'border-green-400',
                  badge: darkMode ? 'bg-green-600' : 'bg-green-500',
                  dot: darkMode ? 'bg-green-400' : 'bg-green-500',
                  label: 'Task'
                },
                subtask: {
                  border: darkMode ? 'border-purple-500/50' : 'border-purple-400',
                  badge: darkMode ? 'bg-purple-600' : 'bg-purple-500',
                  dot: darkMode ? 'bg-purple-400' : 'bg-purple-500',
                  label: 'Subtask'
                }
              };

              const typeStyle = typeStyles[item.type];
              const subtaskProgress = item.type === 'task' && item.subtasks && item.subtasks.length > 0
                ? Math.round((item.subtasks.filter(s => s.status === 'completed').length / item.subtasks.length) * 100)
                : 0;

              return React.createElement('div', {
                key: `${item.type}-${item.id}`,
                draggable: !isEditLocked,
                onDragStart: () => handleDragStart(item),
                className: `p-3 rounded-lg border-l-4 ${typeStyle.border} ${
                  darkMode
                    ? 'bg-slate-700/70 hover:bg-slate-700 border border-slate-600'
                    : 'bg-white hover:shadow-md border border-gray-200'
                } ${!isEditLocked ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} transition-all text-xs group`
              },
                // Type Badge
                React.createElement('div', { className: 'flex items-center justify-between mb-2' },
                  React.createElement('div', {
                    className: `px-2 py-0.5 rounded text-[10px] font-bold text-white ${typeStyle.badge}`
                  }, typeStyle.label),
                  item.priority && React.createElement('span', {
                    className: priorityInfo.text
                  }, priorityInfo.icon)
                ),

                // Item Name
                React.createElement('div', {
                  className: `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`
                }, item.displayName),

                // Hierarchy Info
                item.type === 'task' && React.createElement('div', {
                  className: `text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 flex items-center gap-1.5`
                },
                  React.createElement('div', {
                    className: `w-1.5 h-1.5 rounded-full ${typeStyles.action.dot}`
                  }),
                  item.actionName
                ),

                item.type === 'subtask' && React.createElement('div', {
                  className: `text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1 space-y-1`
                },
                  React.createElement('div', { className: 'flex items-center gap-1.5' },
                    React.createElement('div', {
                      className: `w-1.5 h-1.5 rounded-full ${typeStyles.action.dot}`
                    }),
                    item.actionName
                  ),
                  React.createElement('div', { className: 'flex items-center gap-1.5' },
                    React.createElement('div', {
                      className: `w-1.5 h-1.5 rounded-full ${typeStyles.task.dot}`
                    }),
                    item.taskName
                  )
                ),

                // Priority & Owner/Assignees
                React.createElement('div', { className: 'flex items-center justify-between gap-2 mb-2' },
                  item.priority && React.createElement('div', {
                    className: `flex items-center gap-1.5 px-2 py-1 rounded ${priorityInfo.bg}`
                  },
                    React.createElement('span', {
                      className: `text-xs font-semibold ${priorityInfo.text}`
                    }, priorityInfo.label)
                  ),
                  (item.owner || (item.assignees && item.assignees.length > 0)) && React.createElement('div', {
                    className: `flex items-center gap-1 px-2 py-1 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`
                  },
                    React.createElement('span', {
                      className: `text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
                    }, item.owner || item.assignees[0])
                  )
                ),

                // Progress Bar (if task has subtasks)
                item.type === 'task' && item.subtasks && item.subtasks.length > 0 && React.createElement('div', {
                  className: 'mt-2'
                },
                  React.createElement('div', {
                    className: `flex items-center gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`
                  },
                    React.createElement('span', null, `${item.subtasks.filter(s => s.status === 'completed').length}/${item.subtasks.length} subtasks`),
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
}