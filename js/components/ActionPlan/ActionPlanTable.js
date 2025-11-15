// js/components/ActionPlan/ActionPlanTable.js

/**
 * ActionPlanTable Component
 * Table view with sortable columns showing all tasks
 */

export function ActionPlanTable({ actionPlan, darkMode, statuses, priorities }) {
  const allTasks = [];
  actionPlan.forEach(action => {
    action.tasks.forEach(task => {
      allTasks.push({ ...task, actionName: action.name, actionId: action.id });
    });
  });

  // Sort by priority then due date
  allTasks.sort((a, b) => {
    const priorityDiff = (priorities[b.priority || 'medium'].order) - (priorities[a.priority || 'medium'].order);
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
        const statusInfo = statuses[task.status || 'not-started'];
        const priorityInfo = priorities[task.priority || 'medium'];
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
}
