// js/components/ActionPlan/ActionPlanList.js

/**
 * ActionPlanList Component
 * Hierarchical list view with Actions > Tasks > Subtasks
 * Features: Inline editing, dependencies, activity log, drag-and-drop
 */

import {
  renderStatusDropdown,
  renderPriorityDropdown,
  renderDependencyTags,
  renderDependencySelector,
  renderCircularProgress,
  renderDeleteButton,
  LinkIcon,
  FileIcon
} from './ActionPlanItem.js';

export function ActionPlanList({
  actionPlan,
  darkMode,
  statuses,
  priorities,
  isEditLocked,
  updateItem,
  deleteItem,
  addTask,
  addSubtask,
  allItems,
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
}) {
  const [expandedActions, setExpandedActions] = React.useState({});
  const [expandedTasks, setExpandedTasks] = React.useState({});
  const [showDependencies, setShowDependencies] = React.useState({});
  const [showActivityLog, setShowActivityLog] = React.useState({});

  // Get sorted action plan based on itemOrder
  const getSortedActionPlan = () => {
    if (!itemOrder || itemOrder.length === 0) return actionPlan;

    // Sort actions
    const sortedActions = [...actionPlan].sort((a, b) => {
      const aIndex = itemOrder.indexOf(a.id);
      const bIndex = itemOrder.indexOf(b.id);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    // Sort tasks and subtasks within each action
    return sortedActions.map(action => ({
      ...action,
      tasks: [...(action.tasks || [])].sort((a, b) => {
        const aIndex = itemOrder.indexOf(a.id);
        const bIndex = itemOrder.indexOf(b.id);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }).map(task => ({
        ...task,
        subtasks: [...(task.subtasks || [])].sort((a, b) => {
          const aIndex = itemOrder.indexOf(a.id);
          const bIndex = itemOrder.indexOf(b.id);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        })
      }))
    }));
  };

  // Check if delete confirmation is showing for this item
  const isDeletePending = (type, ids) => {
    if (!deleteConfirm) return false;
    if (deleteConfirm.type !== type) return false;
    if (type === 'action') return deleteConfirm.ids.actionId === ids.actionId;
    if (type === 'task') return deleteConfirm.ids.actionId === ids.actionId && deleteConfirm.ids.taskId === ids.taskId;
    if (type === 'subtask') return deleteConfirm.ids.actionId === ids.actionId && deleteConfirm.ids.taskId === ids.taskId && deleteConfirm.ids.subtaskId === ids.subtaskId;
    return false;
  };

  // Render subtask
  const renderSubtask = (subtask, actionId, taskId) => {
    const ids = { actionId, taskId, subtaskId: subtask.id };
    const showDeps = showDependencies[subtask.id];

    return React.createElement('div', {
      key: subtask.id,
      className: `group mb-2 rounded-lg overflow-hidden transition-all ${
        darkMode
          ? 'bg-gradient-to-br from-slate-600 to-slate-700 border-slate-500/50'
          : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
      } border shadow-sm hover:shadow-md ${subtask.status === 'completed' ? 'opacity-70' : ''}`
    },
      // Subtask Header
      React.createElement('div', {
        className: 'px-3 py-1.5',
        style: {
          background: darkMode
            ? 'linear-gradient(to right, rgba(71, 85, 105, 0.6), rgba(100, 116, 139, 0.6))'
            : 'linear-gradient(to right, rgba(221, 214, 254, 0.6), rgba(199, 210, 254, 0.6))'
        }
      },
        React.createElement('div', {
          className: 'flex items-center gap-2'
        },
          // Subtask Title
          React.createElement('input', {
            type: 'text',
            value: subtask.name,
            onChange: (e) => updateItem('subtask', ids, 'name', e.target.value),
            className: `flex-1 text-sm font-semibold px-2 py-1 border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-purple-300 bg-white'} rounded-lg placeholder-gray-400 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''} ${subtask.status === 'completed' ? 'line-through' : ''}`,
            placeholder: 'Subtask Name',
            disabled: isEditLocked
          }),
          // Status dropdown
          renderStatusDropdown(subtask, 'subtask', ids, statuses, darkMode, updateItem, isEditLocked),
          // Dependencies Button
          React.createElement('button', {
            onClick: () => setShowDependencies({ ...showDependencies, [subtask.id]: !showDeps }),
            className: `p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-slate-600 text-gray-400 hover:text-gray-200' : 'hover:bg-purple-200 text-gray-600 hover:text-gray-800'}`,
            disabled: isEditLocked,
            title: 'Dependencies'
          },
            React.createElement(LinkIcon, { className: 'w-3.5 h-3.5' })
          ),
          // Delete Button
          renderDeleteButton('subtask', ids, isDeletePending('subtask', ids), deleteItem, setDeleteConfirm, darkMode, isEditLocked, 'w-3.5 h-3.5')
        )
      ),
      // Content Area
      React.createElement('div', {
        className: `p-2 ${darkMode ? 'bg-slate-700/30' : 'bg-purple-50/20'}`
      },
        // Dates and Assignee
        React.createElement('div', {
          className: 'flex gap-2 items-center text-xs'
        },
          React.createElement('label', {
            className: `${darkMode ? 'text-gray-400' : 'text-gray-600'} font-semibold`
          }, 'Dates:'),
          React.createElement('input', {
            type: 'date',
            value: subtask.startDate || '',
            onChange: (e) => updateItem('subtask', ids, 'startDate', e.target.value),
            className: `w-32 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-purple-300 bg-white'} rounded`,
            disabled: isEditLocked
          }),
          React.createElement('span', { className: `${darkMode ? 'text-gray-500' : 'text-gray-400'}` }, '→'),
          React.createElement('input', {
            type: 'date',
            value: subtask.finishDate || '',
            onChange: (e) => updateItem('subtask', ids, 'finishDate', e.target.value),
            className: `w-32 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-purple-300 bg-white'} rounded`,
            disabled: isEditLocked
          }),
          React.createElement('div', { className: 'ml-auto flex items-center gap-2' },
            React.createElement('label', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'} font-semibold`
            }, 'Assignee:'),
            React.createElement('input', {
              type: 'text',
              value: subtask.assignee || '',
              onChange: (e) => updateItem('subtask', ids, 'assignee', e.target.value),
              placeholder: 'Assignee',
              className: `w-28 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-purple-300 bg-white'} rounded`,
              disabled: isEditLocked
            })
          )
        ),
        // Dependencies
        (subtask.dependencies || []).length > 0 && React.createElement('div', {
          className: 'mt-2 flex flex-wrap gap-1'
        }, renderDependencyTags(subtask, 'subtask', ids, allItems, darkMode, removeDependency, isEditLocked)),
        showDeps && renderDependencySelector(subtask, 'subtask', ids, allItems, darkMode, addDependency, isEditLocked)
      )
    );
  };

  // Render task
  const renderTask = (task, actionId) => {
    const ids = { actionId, taskId: task.id };
    const isExpanded = expandedTasks[task.id];
    const showDeps = showDependencies[task.id];
    const completedSubtasks = task.subtasks.filter(s => s.status === 'completed').length;
    const totalSubtasks = task.subtasks.length;

    return React.createElement('div', {
      key: task.id,
      className: `group mb-3 rounded-xl overflow-hidden transition-all ${
        darkMode
          ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600/50'
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
      } border shadow-md hover:shadow-lg ${task.status === 'completed' ? 'opacity-70' : ''}`
    },
      // Task Header
      React.createElement('div', {
        className: 'px-3 py-2',
        style: {
          background: darkMode
            ? 'linear-gradient(to right, rgba(51, 65, 85, 0.7), rgba(71, 85, 105, 0.7))'
            : 'linear-gradient(to right, rgba(191, 219, 254, 0.7), rgba(199, 210, 254, 0.7))'
        }
      },
        React.createElement('div', {
          className: 'flex items-center gap-2'
        },
          // Expand/Collapse Arrow
          !isEditLocked && React.createElement('button', {
            onClick: () => setExpandedTasks({ ...expandedTasks, [task.id]: !isExpanded }),
            className: `p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-slate-600/50 text-blue-300' : 'hover:bg-blue-200/50 text-blue-700'}`
          }, isExpanded ? '▼' : '▶'),
          // Task Title
          React.createElement('input', {
            type: 'text',
            value: task.name,
            onChange: (e) => updateItem('task', ids, 'name', e.target.value),
            className: `flex-1 text-sm font-bold px-3 py-1.5 border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-blue-300 bg-white input-glow'} rounded-lg placeholder-gray-400 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''} ${task.status === 'completed' ? 'line-through' : ''}`,
            placeholder: 'Task Name',
            disabled: isEditLocked
          }),
          // Subtask Count Badge
          totalSubtasks > 0 && React.createElement('div', {
            className: `px-2.5 py-2.5 rounded-lg text-xs font-bold flex items-center ${
              darkMode
                ? 'bg-slate-600/50 text-gray-200 border border-slate-500'
                : 'bg-blue-100 text-blue-700 border border-blue-300'
            }`,
            title: `${completedSubtasks}/${totalSubtasks} Subtasks Complete`
          }, `${totalSubtasks} ${totalSubtasks === 1 ? 'Sub' : 'Subs'}`),
          // Circular Progress Indicator
          totalSubtasks > 0 && renderCircularProgress(completedSubtasks, totalSubtasks, darkMode, 32),
          // Status dropdown
          renderStatusDropdown(task, 'task', ids, statuses, darkMode, updateItem, isEditLocked),
          // Dependencies Button
          React.createElement('button', {
            onClick: () => setShowDependencies({ ...showDependencies, [task.id]: !showDeps }),
            className: `p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-slate-600 text-gray-400 hover:text-gray-200' : 'hover:bg-blue-200 text-gray-600 hover:text-gray-800'}`,
            disabled: isEditLocked,
            title: 'Dependencies'
          },
            React.createElement(LinkIcon, { className: 'w-4 h-4' })
          ),
          // Activity Log Button
          React.createElement('button', {
            onClick: () => {
              const key = ids.actionId + ids.taskId;
              setShowActivityLog({ ...showActivityLog, [key]: !showActivityLog[key] });
            },
            className: `p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-slate-600 text-gray-400 hover:text-gray-200' : 'hover:bg-blue-200 text-gray-600 hover:text-gray-800'}`,
            disabled: isEditLocked,
            title: `Activity Log (${(task.activityLog || []).length})`
          },
            React.createElement(FileIcon, { className: 'w-4 h-4' })
          ),
          // Delete Button
          renderDeleteButton('task', ids, isDeletePending('task', ids), deleteItem, setDeleteConfirm, darkMode, isEditLocked)
        )
      ),
      // Content Area
      React.createElement('div', {
        className: `p-3 ${darkMode ? 'bg-slate-800/30' : 'bg-blue-50/20'}`
      },
        // Description
        React.createElement('textarea', {
          value: task.description || '',
          onChange: (e) => updateItem('task', ids, 'description', e.target.value),
          placeholder: 'Add detailed description...',
          className: `w-full px-3 py-2 text-sm border-2 rounded-lg transition-all focus:ring-2 mb-2 ${
            darkMode
              ? 'border-slate-600 bg-slate-800/50 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20'
              : 'border-blue-200 bg-white text-gray-800 focus:border-indigo-400 focus:ring-indigo-400/20'
          }`,
          rows: 2,
          disabled: isEditLocked
        }),
        // Dates and Assignee
        React.createElement('div', {
          className: 'flex gap-2 items-center text-xs mb-3'
        },
          React.createElement('label', {
            className: `${darkMode ? 'text-gray-400' : 'text-gray-600'} font-semibold`
          }, 'Dates:'),
          React.createElement('input', {
            type: 'date',
            value: task.startDate || '',
            onChange: (e) => updateItem('task', ids, 'startDate', e.target.value),
            className: `w-32 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-blue-300 bg-white'} rounded`,
            disabled: isEditLocked
          }),
          React.createElement('span', { className: `${darkMode ? 'text-gray-500' : 'text-gray-400'}` }, '→'),
          React.createElement('input', {
            type: 'date',
            value: task.finishDate || '',
            onChange: (e) => updateItem('task', ids, 'finishDate', e.target.value),
            className: `w-32 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-blue-300 bg-white'} rounded`,
            disabled: isEditLocked
          }),
          React.createElement('div', { className: 'ml-auto flex items-center gap-2' },
            React.createElement('label', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'} font-semibold`
            }, 'Assignee:'),
            React.createElement('input', {
              type: 'text',
              value: task.assignee || '',
              onChange: (e) => updateItem('task', ids, 'assignee', e.target.value),
              placeholder: 'Assignee',
              className: `w-28 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-blue-300 bg-white'} rounded`,
              disabled: isEditLocked
            })
          )
        ),
        // Activity Log Content
        (() => {
          const key = ids.actionId + ids.taskId;
          const isLogExpanded = showActivityLog[key];
          const activities = task.activityLog || [];
          return isLogExpanded && React.createElement('div', { className: `mb-3 max-h-32 overflow-y-auto ${darkMode ? 'bg-slate-900/50' : 'bg-blue-50'} rounded p-2 space-y-1` },
            activities.slice().reverse().map((activity, i) =>
              React.createElement('div', { key: i, className: 'text-xs' },
                React.createElement('span', { className: `font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}` }, activity.user),
                React.createElement('span', { className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}` }, ` ${activity.details}`),
                React.createElement('span', { className: `text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'} ml-2` },
                  new Date(activity.timestamp).toLocaleString()
                )
              )
            )
          );
        })(),
        // Dependencies
        (task.dependencies || []).length > 0 && React.createElement('div', {
          className: 'mt-2 flex flex-wrap gap-1'
        }, renderDependencyTags(task, 'task', ids, allItems, darkMode, removeDependency, isEditLocked)),
        showDeps && renderDependencySelector(task, 'task', ids, allItems, darkMode, addDependency, isEditLocked)
      ),
      // Subtasks
      isExpanded && React.createElement('div', {
        className: `p-3 ${darkMode ? 'bg-slate-900/30' : 'bg-indigo-50/50'}`
      },
        task.subtasks.map(subtask => renderSubtask(subtask, actionId, task.id)),
        // Add Subtask button
        !isEditLocked && React.createElement('button', {
          onClick: () => addSubtask(actionId, task.id),
          className: `w-full py-2 rounded-lg border-2 border-dashed font-semibold transition-all shadow-sm hover:shadow-md text-xs ${
            darkMode
              ? 'border-purple-400/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:border-purple-400'
              : 'border-purple-400 bg-purple-50 hover:bg-purple-100 text-purple-700 hover:border-purple-500'
          }`
        }, '+ Subtask')
      )
    );
  };

  // Render action
  const renderAction = (action, index) => {
    const ids = { actionId: action.id };
    const isExpanded = expandedActions[action.id];
    const showDeps = showDependencies[action.id];
    const progress = calculateProgress(action);
    const completedTasks = action.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = action.tasks.length;

    return React.createElement('div', {
      key: action.id,
      draggable: !isEditLocked,
      onDragStart: () => handleActionDragStart(action),
      onDragOver: handleActionDragOver,
      onDrop: () => handleActionDrop(action),
      className: `group mb-4 rounded-xl overflow-hidden transition-all ${
        darkMode
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      } border shadow-lg hover:shadow-2xl ${action.status === 'completed' ? 'opacity-70' : ''} ${
        !isEditLocked ? 'cursor-grab active:cursor-grabbing' : ''
      }`
    },
      // Action Header
      React.createElement('div', {
        className: 'px-3 py-2',
        style: {
          background: darkMode
            ? 'linear-gradient(to right, rgba(51, 65, 85, 0.85), rgba(71, 85, 105, 0.85))'
            : 'linear-gradient(to right, rgba(147, 197, 253, 0.85), rgba(165, 180, 252, 0.85))'
        }
      },
        React.createElement('div', {
          className: 'flex items-center gap-2'
        },
          // Expand/Collapse Arrow
          totalTasks > 0 && React.createElement('button', {
            onClick: () => setExpandedActions({ ...expandedActions, [action.id]: !isExpanded }),
            className: `p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-slate-600/50 text-blue-300' : 'hover:bg-blue-200/50 text-blue-700'}`
          }, isExpanded ? '▼' : '▶'),
          // Action Title
          React.createElement('input', {
            type: 'text',
            value: action.name,
            onChange: (e) => updateItem('action', ids, 'name', e.target.value),
            className: `flex-1 text-base font-bold px-3 py-1.5 border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white input-glow'} rounded-lg placeholder-gray-400 ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''} ${action.status === 'completed' ? 'line-through' : ''}`,
            placeholder: 'Action Name',
            disabled: isEditLocked
          }),
          // Circular Progress Indicator
          totalTasks > 0 && renderCircularProgress(completedTasks, totalTasks, darkMode, 36),
          // Task Count Badge
          totalTasks > 0 && React.createElement('div', {
            className: `px-2.5 py-2.5 rounded-lg text-xs font-bold flex items-center ${
              darkMode
                ? 'bg-slate-600/50 text-gray-200 border border-slate-500'
                : 'bg-blue-100 text-blue-700 border border-blue-300'
            }`,
            title: `${completedTasks}/${totalTasks} Tasks Complete`
          }, `${totalTasks} ${totalTasks === 1 ? 'Task' : 'Tasks'}`),
          // Priority dropdown
          renderPriorityDropdown(action, 'action', ids, priorities, darkMode, updateItem, isEditLocked),
          // Dependencies Button
          React.createElement('button', {
            onClick: () => setShowDependencies({ ...showDependencies, [action.id]: !showDeps }),
            className: `p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-slate-600 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`,
            disabled: isEditLocked,
            title: 'Dependencies'
          },
            React.createElement(LinkIcon, { className: 'w-5 h-5' })
          ),
          // Activity Log Button
          React.createElement('button', {
            onClick: () => {
              const key = ids.actionId;
              setShowActivityLog({ ...showActivityLog, [key]: !showActivityLog[key] });
            },
            className: `p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-slate-600 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`,
            disabled: isEditLocked,
            title: `Activity Log (${(action.activityLog || []).length})`
          },
            React.createElement(FileIcon, { className: 'w-5 h-5' })
          ),
          // Delete Button
          renderDeleteButton('action', ids, isDeletePending('action', ids), deleteItem, setDeleteConfirm, darkMode, isEditLocked, 'w-5 h-5')
        )
      ),
      // Content Area
      React.createElement('div', {
        className: `p-3 ${darkMode ? 'bg-slate-800/30' : 'bg-blue-50/20'}`
      },
        // Description
        React.createElement('textarea', {
          value: action.description || '',
          onChange: (e) => updateItem('action', ids, 'description', e.target.value),
          placeholder: 'Add detailed description...',
          className: `w-full px-3 py-2 text-sm border-2 rounded-lg transition-all focus:ring-2 mb-2 ${
            darkMode
              ? 'border-slate-600 bg-slate-800/50 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20'
              : 'border-gray-200 bg-white text-gray-800 focus:border-indigo-400 focus:ring-indigo-400/20'
          }`,
          rows: 3,
          disabled: isEditLocked
        }),
        // Dates and Assignee
        React.createElement('div', {
          className: 'flex gap-2 items-center text-xs mb-3'
        },
          React.createElement('label', {
            className: `${darkMode ? 'text-gray-400' : 'text-gray-600'} font-semibold`
          }, 'Dates:'),
          React.createElement('input', {
            type: 'date',
            value: action.startDate || '',
            onChange: (e) => updateItem('action', ids, 'startDate', e.target.value),
            className: `w-32 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded`,
            disabled: isEditLocked
          }),
          React.createElement('span', {
            className: darkMode ? 'text-gray-500' : 'text-gray-400'
          }, '→'),
          React.createElement('input', {
            type: 'date',
            value: action.finishDate || '',
            onChange: (e) => updateItem('action', ids, 'finishDate', e.target.value),
            className: `w-32 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded`,
            disabled: isEditLocked
          }),
          React.createElement('div', { className: 'ml-auto flex items-center gap-2' },
            React.createElement('label', {
              className: `${darkMode ? 'text-gray-400' : 'text-gray-600'} font-semibold`
            }, 'Assignee:'),
            React.createElement('input', {
              type: 'text',
              value: action.assignee || '',
              onChange: (e) => updateItem('action', ids, 'assignee', e.target.value),
              placeholder: 'Assignee',
              className: `w-28 px-2 py-1 text-xs border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white'} rounded`,
              disabled: isEditLocked
            })
          )
        ),
        // Activity Log Content
        (() => {
          const key = ids.actionId;
          const isLogExpanded = showActivityLog[key];
          const activities = action.activityLog || [];
          return isLogExpanded && React.createElement('div', { className: `mb-3 max-h-32 overflow-y-auto ${darkMode ? 'bg-slate-900/50' : 'bg-gray-50'} rounded p-2 space-y-1` },
            activities.slice().reverse().map((activity, i) =>
              React.createElement('div', { key: i, className: 'text-xs' },
                React.createElement('span', { className: `font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}` }, activity.user),
                React.createElement('span', { className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}` }, ` ${activity.details}`),
                React.createElement('span', { className: `text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'} ml-2` },
                  new Date(activity.timestamp).toLocaleString()
                )
              )
            )
          );
        })(),
        // Dependencies
        (action.dependencies || []).length > 0 && React.createElement('div', {
          className: 'mt-2 flex flex-wrap gap-1'
        }, renderDependencyTags(action, 'action', ids, allItems, darkMode, removeDependency, isEditLocked)),
        showDeps && renderDependencySelector(action, 'action', ids, allItems, darkMode, addDependency, isEditLocked)
      ),
      // Tasks
      isExpanded && React.createElement('div', {
        className: `p-4 ${darkMode ? 'bg-slate-900/30' : 'bg-gray-50/50'}`
      },
        action.tasks.map(task => renderTask(task, action.id)),
        // Add Task button
        !isEditLocked && React.createElement('button', {
          onClick: () => addTask(action.id),
          className: `w-full py-3 rounded-lg border-2 border-dashed font-bold transition-all shadow-sm hover:shadow-md text-sm ${
            darkMode
              ? 'border-blue-400/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:border-blue-400'
              : 'border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:border-blue-500'
          }`
        }, '+ Task')
      )
    );
  };

  const sortedActionPlan = getSortedActionPlan();

  return React.createElement('div', { className: 'space-y-4' },
    sortedActionPlan.map((action, index) => renderAction(action, index))
  );
}
