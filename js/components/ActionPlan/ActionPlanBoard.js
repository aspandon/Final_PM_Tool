// js/components/ActionPlan/ActionPlanBoard.js

/**
 * ActionPlanBoard Component
 * Kanban-style board view grouped by status
 * Features drag-and-drop to change task status
 */

export function ActionPlanBoard({ actionPlan, darkMode, onUpdate, statuses, priorities, isEditLocked }) {
  const [draggedTask, setDraggedTask] = React.useState(null);

  const statusOrder = ['not-started', 'blocked', 'in-progress', 'completed'];

  // Handle drag start
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  // Handle drag over - allow drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop - update task status
  const handleDrop = (newStatus) => {
    if (!draggedTask || isEditLocked) return;

    // Find and update the task
    const newActionPlan = actionPlan.map(action => {
      if (action.id === draggedTask.actionId) {
        return {
          ...action,
          tasks: action.tasks.map(task => {
            if (task.id === draggedTask.id) {
              return { ...task, status: newStatus };
            }
            return task;
          })
        };
      }
      return action;
    });

    onUpdate(newActionPlan);
    setDraggedTask(null);
  };

  // Get all tasks grouped by status
  const tasksByStatus = {};
  statusOrder.forEach(status => {
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
      statusOrder.map(status => {
        const statusInfo = statuses[status];
        const tasks = tasksByStatus[status];

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
            }, tasks.length)
          ),
          // Cards
          React.createElement('div', { className: 'space-y-3' },
            tasks.map(task => {
              const priorityInfo = priorities[task.priority || 'medium'];
              const subtaskProgress = task.subtasks && task.subtasks.length > 0
                ? Math.round((task.subtasks.filter(s => s.status === 'completed').length / task.subtasks.length) * 100)
                : 0;

              return React.createElement('div', {
                key: task.id,
                draggable: !isEditLocked,
                onDragStart: () => handleDragStart(task),
                className: `p-3 rounded-lg ${
                  darkMode
                    ? 'bg-slate-700/70 hover:bg-slate-700 border border-slate-600'
                    : 'bg-white hover:shadow-md border border-gray-200'
                } ${!isEditLocked ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} transition-all text-xs group`
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
}
