// js/components/ActionPlan/ActionPlanTable.js

/**
 * ActionPlanTable Component
 * Table view with sortable columns showing Actions, Tasks, and Subtasks
 */

export function ActionPlanTable({ actionPlan, darkMode, statuses, priorities }) {
  const [viewFilters, setViewFilters] = React.useState({
    showActions: true,
    showTasks: true,
    showSubtasks: true
  });

  // Toggle filter
  const toggleFilter = (filterKey) => {
    setViewFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  // Collect all items
  const allItems = [];

  actionPlan.forEach(action => {
    // Add Actions
    if (viewFilters.showActions) {
      allItems.push({
        ...action,
        type: 'action',
        itemName: action.name,
        displayName: action.name,
        sortPriority: 1 // Actions first
      });
    }

    // Add Tasks
    if (viewFilters.showTasks) {
      action.tasks.forEach(task => {
        allItems.push({
          ...task,
          type: 'task',
          itemName: task.name,
          displayName: task.name,
          actionName: action.name,
          actionId: action.id,
          sortPriority: 2 // Tasks second
        });
      });
    }

    // Add Subtasks
    if (viewFilters.showSubtasks) {
      action.tasks.forEach(task => {
        if (task.subtasks && task.subtasks.length > 0) {
          task.subtasks.forEach(subtask => {
            allItems.push({
              ...subtask,
              type: 'subtask',
              itemName: subtask.name,
              displayName: subtask.name,
              taskName: task.name,
              taskId: task.id,
              actionName: action.name,
              actionId: action.id,
              sortPriority: 3 // Subtasks third
            });
          });
        }
      });
    }
  });

  // Sort by type, then priority, then due date
  allItems.sort((a, b) => {
    // First by type (Actions, Tasks, Subtasks)
    if (a.sortPriority !== b.sortPriority) {
      return a.sortPriority - b.sortPriority;
    }
    // Then by priority
    const priorityDiff = (priorities[b.priority || 'medium'].order) - (priorities[a.priority || 'medium'].order);
    if (priorityDiff !== 0) return priorityDiff;
    // Then by due date
    return (a.dueDate || '').localeCompare(b.dueDate || '');
  });

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
        className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          viewFilters.showActions
            ? darkMode
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : darkMode
              ? 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
        } cursor-pointer`
      }, 'Actions'),

      // Tasks Toggle
      React.createElement('button', {
        onClick: () => toggleFilter('showTasks'),
        className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          viewFilters.showTasks
            ? darkMode
              ? 'bg-green-600 text-white'
              : 'bg-green-500 text-white'
            : darkMode
              ? 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
        } cursor-pointer`
      }, 'Tasks'),

      // Subtasks Toggle
      React.createElement('button', {
        onClick: () => toggleFilter('showSubtasks'),
        className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          viewFilters.showSubtasks
            ? darkMode
              ? 'bg-purple-600 text-white'
              : 'bg-purple-500 text-white'
            : darkMode
              ? 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
        } cursor-pointer`
      }, 'Subtasks')
    ),

    // Table
    React.createElement('div', {
      className: `rounded-xl overflow-hidden ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'} shadow-lg`
    },
      // Table header
      React.createElement('div', {
        className: `grid grid-cols-8 gap-3 p-4 font-bold text-xs ${darkMode ? 'bg-slate-800 text-gray-300 border-b border-slate-700' : 'bg-gray-50 text-gray-700 border-b border-gray-200'}`
      },
        React.createElement('div', null, 'TYPE'),
        React.createElement('div', null, 'NAME'),
        React.createElement('div', null, 'HIERARCHY'),
        React.createElement('div', null, 'STATUS'),
        React.createElement('div', null, 'PRIORITY'),
        React.createElement('div', null, 'OWNER/ASSIGNEE'),
        React.createElement('div', null, 'DUE DATE'),
        React.createElement('div', null, 'PROGRESS')
      ),
      // Table rows
      React.createElement('div', { className: `divide-y ${darkMode ? 'divide-slate-700' : 'divide-gray-200'}` },
        allItems.length === 0
          ? React.createElement('div', {
            className: `p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
          }, 'No items to display. Please select at least one filter.')
          : allItems.map(item => {
            const statusInfo = statuses[item.status || 'not-started'];
            const priorityInfo = priorities[item.priority || 'medium'];
            const progress = item.type === 'task' && item.subtasks && item.subtasks.length > 0
              ? Math.round((item.subtasks.filter(s => s.status === 'completed').length / item.subtasks.length) * 100)
              : 0;

            // Type-specific styling
            const typeStyles = {
              action: {
                badge: darkMode ? 'bg-blue-600' : 'bg-blue-500',
                dot: darkMode ? 'bg-blue-400' : 'bg-blue-500',
                label: 'Action'
              },
              task: {
                badge: darkMode ? 'bg-green-600' : 'bg-green-500',
                dot: darkMode ? 'bg-green-400' : 'bg-green-500',
                label: 'Task'
              },
              subtask: {
                badge: darkMode ? 'bg-purple-600' : 'bg-purple-500',
                dot: darkMode ? 'bg-purple-400' : 'bg-purple-500',
                label: 'Subtask'
              }
            };

            const typeStyle = typeStyles[item.type];

            return React.createElement('div', {
              key: `${item.type}-${item.id}`,
              className: `grid grid-cols-8 gap-3 p-4 text-xs ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors`
            },
              // Type Badge
              React.createElement('div', null,
                React.createElement('span', {
                  className: `px-2 py-1 rounded text-[10px] font-bold text-white ${typeStyle.badge}`
                }, typeStyle.label)
              ),

              // Item Name
              React.createElement('div', {
                className: `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, item.displayName),

              // Hierarchy
              React.createElement('div', {
                className: `${darkMode ? 'text-gray-400' : 'text-gray-600'} text-[10px]`
              },
                item.type === 'action' && React.createElement('span', null, '-'),
                item.type === 'task' && React.createElement('div', { className: 'flex items-center gap-1' },
                  React.createElement('div', {
                    className: `w-1.5 h-1.5 rounded-full ${typeStyles.action.dot}`
                  }),
                  React.createElement('span', null, item.actionName)
                ),
                item.type === 'subtask' && React.createElement('div', { className: 'space-y-0.5' },
                  React.createElement('div', { className: 'flex items-center gap-1' },
                    React.createElement('div', {
                      className: `w-1.5 h-1.5 rounded-full ${typeStyles.action.dot}`
                    }),
                    React.createElement('span', null, item.actionName)
                  ),
                  React.createElement('div', { className: 'flex items-center gap-1 ml-2' },
                    React.createElement('div', {
                      className: `w-1.5 h-1.5 rounded-full ${typeStyles.task.dot}`
                    }),
                    React.createElement('span', null, item.taskName)
                  )
                )
              ),

              // Status
              React.createElement('div', null,
                React.createElement('span', {
                  className: `px-2.5 py-1.5 rounded-lg font-semibold ${statusInfo.bg} ${statusInfo.text}`
                }, statusInfo.label)
              ),

              // Priority
              React.createElement('div', null,
                item.priority && React.createElement('span', {
                  className: `px-2.5 py-1.5 rounded-lg font-semibold ${priorityInfo.bg} ${priorityInfo.text}`
                }, `${priorityInfo.icon} ${priorityInfo.label}`)
              ),

              // Owner/Assignees
              React.createElement('div', {
                className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              },
                item.owner
                  ? item.owner
                  : item.assignees && item.assignees.length > 0
                    ? item.assignees.join(', ')
                    : '-'
              ),

              // Due Date
              React.createElement('div', {
                className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              }, item.dueDate || '-'),

              // Progress
              React.createElement('div', { className: 'flex items-center gap-2' },
                item.type === 'task' && item.subtasks && item.subtasks.length > 0 ? [
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
    )
  );
}
