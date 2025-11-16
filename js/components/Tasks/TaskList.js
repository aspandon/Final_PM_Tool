// js/components/Tasks/TaskList.js
import { Edit, Trash, Plus } from '../../shared/icons/index.js';

const { useState } = React;

/**
 * TaskCard Component
 * Displays individual task with priority, due date, and action buttons
 */
const TaskCard = ({ task, darkMode, onEdit, onDelete }) => {
  // Priority badge colors
  const priorityColors = {
    'low': { bg: darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700', label: 'Low', border: 'border-blue-500' },
    'medium': { bg: darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700', label: 'Medium', border: 'border-yellow-500' },
    'high': { bg: darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-700', label: 'High', border: 'border-red-500' }
  };

  const priority = task.priority || 'medium';
  const priorityStyle = priorityColors[priority];

  // Calculate due date status
  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Overdue', color: darkMode ? 'text-red-400' : 'text-red-600', icon: '⚠️' };
    } else if (diffDays === 0) {
      return { label: 'Due today', color: darkMode ? 'text-orange-400' : 'text-orange-600', icon: '🔔' };
    } else if (diffDays <= 3) {
      return { label: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: darkMode ? 'text-yellow-400' : 'text-yellow-600', icon: '📅' };
    } else {
      return { label: `Due ${new Date(dueDate).toLocaleDateString()}`, color: darkMode ? 'text-gray-400' : 'text-gray-600', icon: '📅' };
    }
  };

  const dueDateStatus = getDueDateStatus(task.dueDate);

  return React.createElement('div', {
    className: `task-card ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'} rounded-lg p-4 mb-3 shadow-sm border-l-4 ${priorityStyle.border} cursor-move hover:shadow-md transition-all group relative`,
    draggable: true,
    onDragStart: (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('taskId', task.id);
      e.dataTransfer.setData('fromColumn', task.status);
    },
    onDragEnd: (e) => {
      // Clean up after drag
    }
  },
    // Task Title and Priority Badge
    React.createElement('div', {
      className: 'flex items-start gap-2 mb-2 pr-16'
    },
      React.createElement('div', {
        className: `font-semibold flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, task.title),
      React.createElement('span', {
        className: `px-2 py-1 rounded text-xs font-semibold ${priorityStyle.bg} whitespace-nowrap`
      }, priorityStyle.label)
    ),

    // Task Description (if exists)
    task.description && React.createElement('div', {
      className: `text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`
    }, task.description),

    // Due Date (if exists)
    dueDateStatus && React.createElement('div', {
      className: `text-xs mt-2 font-medium flex items-center gap-1 ${dueDateStatus.color}`
    },
      React.createElement('span', null, dueDateStatus.icon),
      React.createElement('span', null, dueDateStatus.label)
    ),

    // Action buttons
    React.createElement('div', {
      className: 'absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
      draggable: true,
      onDragStart: (e) => {
        e.preventDefault();
        e.stopPropagation();
      }
    },
      // Edit button
      React.createElement('button', {
        type: 'button',
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit(task);
        },
        onMouseDown: (e) => {
          e.stopPropagation();
        },
        className: `p-1.5 rounded-lg transition-all ${
          darkMode
            ? 'bg-slate-600 text-gray-400 hover:bg-blue-600 hover:text-white'
            : 'bg-gray-100 text-gray-400 hover:bg-blue-500 hover:text-white'
        }`,
        title: 'Edit Task'
      },
        React.createElement(Edit, { className: 'w-4 h-4' })
      ),
      // Delete button
      React.createElement('button', {
        type: 'button',
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (confirm('Are you sure you want to delete this task?')) {
            onDelete(task.id);
          }
        },
        onMouseDown: (e) => {
          e.stopPropagation();
        },
        className: `p-1.5 rounded-lg transition-all ${
          darkMode
            ? 'bg-slate-600 text-gray-400 hover:bg-red-600 hover:text-white'
            : 'bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white'
        }`,
        title: 'Delete Task'
      },
        React.createElement(Trash, { className: 'w-4 h-4' })
      )
    )
  );
};

/**
 * TaskColumn Component
 * Displays a column of tasks with drag-and-drop functionality
 */
export const TaskColumn = ({ title, tasks, status, darkMode, onDrop, onEdit, onDelete, onAddTask }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    const fromColumn = e.dataTransfer.getData('fromColumn');
    if (taskId && fromColumn !== status) {
      onDrop(taskId, status);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  // Column colors
  const columnColors = {
    'new': { bg: 'bg-slate-100', darkBg: 'bg-slate-800', accent: 'text-blue-600', darkAccent: 'text-blue-400' },
    'in-progress': { bg: 'bg-yellow-50', darkBg: 'bg-yellow-900/20', accent: 'text-yellow-600', darkAccent: 'text-yellow-400' },
    'done': { bg: 'bg-green-50', darkBg: 'bg-green-900/20', accent: 'text-green-600', darkAccent: 'text-green-400' }
  };

  const colors = columnColors[status];

  return React.createElement('div', {
    className: `flex-1 min-w-[300px] ${darkMode ? colors.darkBg : colors.bg} rounded-xl p-4 transition-all ${isDragOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop
  },
    // Column Header
    React.createElement('div', {
      className: 'flex items-center justify-between mb-4'
    },
      React.createElement('h3', {
        className: `font-bold text-lg ${darkMode ? colors.darkAccent : colors.accent}`
      }, title),
      React.createElement('div', {
        className: 'flex items-center gap-2'
      },
        React.createElement('span', {
          className: `${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-white text-gray-700'} px-2 py-1 rounded-full text-xs font-semibold`
        }, tasks.length),
        // Add button (only show in "New" column)
        status === 'new' && React.createElement('button', {
          onClick: onAddTask,
          className: `p-1.5 rounded-lg transition-all ${
            darkMode
              ? 'bg-slate-700 text-gray-400 hover:bg-blue-600 hover:text-white'
              : 'bg-white text-gray-400 hover:bg-blue-500 hover:text-white'
          }`,
          title: 'Add New Task'
        },
          React.createElement(Plus, { className: 'w-4 h-4' })
        )
      )
    ),

    // Tasks
    React.createElement('div', {
      className: 'space-y-3 min-h-[300px]'
    },
      tasks.length > 0
        ? tasks.map((task) =>
            React.createElement(TaskCard, {
              key: task.id,
              task,
              darkMode,
              onEdit,
              onDelete
            })
          )
        : React.createElement('div', {
            className: `text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`
          }, 'No tasks')
    )
  );
};
