// js/components/Tasks.js
const { useState, useEffect } = React;

/**
 * Task Modal Component
 * Modal for adding and editing tasks
 */
const TaskModal = ({ task, darkMode, onClose, onSave }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [priority, setPriority] = useState(task ? task.priority || 'medium' : 'medium');
  const [dueDate, setDueDate] = useState(task ? task.dueDate || '' : '');
  const titleInputRef = React.useRef(null);

  // Focus title input when modal opens
  React.useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }
    onSave({ title: title.trim(), description: description.trim(), priority, dueDate });
    onClose();
  };

  const handleKeyDown = (e) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSave();
    }
    // Close on Escape
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return React.createElement('div', {
    className: 'fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4',
    onClick: onClose
  },
    React.createElement('div', {
      className: `${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden`,
      onClick: (e) => e.stopPropagation()
    },
      // Modal Header
      React.createElement('div', {
        className: `flex items-center justify-between p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
      },
        React.createElement('div', {
          className: 'flex items-center gap-3'
        },
          React.createElement('div', {
            className: 'p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl'
          },
            React.createElement('svg', {
              className: 'w-6 h-6 text-white',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 2,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              viewBox: '0 0 24 24'
            },
              React.createElement('path', { d: 'M12 5v14' }),
              React.createElement('path', { d: 'M5 12h14' })
            )
          ),
          React.createElement('h2', {
            className: `text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
          }, task ? 'Edit Task' : 'New Task')
        ),
        React.createElement('button', {
          onClick: onClose,
          className: `p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`
        },
          React.createElement('svg', {
            className: 'w-5 h-5',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            viewBox: '0 0 24 24'
          },
            React.createElement('path', { d: 'M18 6 6 18' }),
            React.createElement('path', { d: 'm6 6 12 12' })
          )
        )
      ),

      // Modal Content
      React.createElement('div', {
        className: `p-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
      },
        // Title Input
        React.createElement('div', { className: 'mb-4' },
          React.createElement('label', {
            className: `block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
          }, 'Task Title *'),
          React.createElement('input', {
            ref: titleInputRef,
            type: 'text',
            value: title,
            onChange: (e) => setTitle(e.target.value),
            onKeyDown: handleKeyDown,
            placeholder: 'Enter task title...',
            className: `w-full px-4 py-3 rounded-lg border ${
              darkMode
                ? 'bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`
          })
        ),

        // Description Input
        React.createElement('div', { className: 'mb-4' },
          React.createElement('label', {
            className: `block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
          }, 'Description'),
          React.createElement('textarea', {
            value: description,
            onChange: (e) => setDescription(e.target.value),
            onKeyDown: handleKeyDown,
            placeholder: 'Add details about this task...\n\nTip: Press Ctrl+Enter to save',
            className: `w-full h-32 px-4 py-3 rounded-lg border ${
              darkMode
                ? 'bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`
          })
        ),

        // Priority Selector
        React.createElement('div', { className: 'mb-2' },
          React.createElement('label', {
            className: `block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
          }, 'Priority'),
          React.createElement('div', {
            className: 'flex gap-3'
          },
            // Low Priority
            React.createElement('button', {
              type: 'button',
              onClick: () => setPriority('low'),
              className: `flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                priority === 'low'
                  ? darkMode
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                    : 'bg-blue-500 text-white ring-2 ring-blue-400'
                  : darkMode
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`
            }, 'Low'),
            // Medium Priority
            React.createElement('button', {
              type: 'button',
              onClick: () => setPriority('medium'),
              className: `flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                priority === 'medium'
                  ? darkMode
                    ? 'bg-yellow-600 text-white ring-2 ring-yellow-400'
                    : 'bg-yellow-500 text-white ring-2 ring-yellow-400'
                  : darkMode
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`
            }, 'Medium'),
            // High Priority
            React.createElement('button', {
              type: 'button',
              onClick: () => setPriority('high'),
              className: `flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                priority === 'high'
                  ? darkMode
                    ? 'bg-red-600 text-white ring-2 ring-red-400'
                    : 'bg-red-500 text-white ring-2 ring-red-400'
                  : darkMode
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`
            }, 'High')
          )
        ),

        // Due Date Input
        React.createElement('div', { className: 'mb-2' },
          React.createElement('label', {
            className: `block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
          }, 'Due Date'),
          React.createElement('input', {
            type: 'date',
            value: dueDate,
            onChange: (e) => setDueDate(e.target.value),
            className: `w-full px-4 py-3 rounded-lg border ${
              darkMode
                ? 'bg-slate-700 border-slate-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`
          })
        ),

        React.createElement('p', {
          className: `text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`
        }, 'Press Ctrl+Enter (Cmd+Enter on Mac) to save quickly')
      ),

      // Modal Actions
      React.createElement('div', {
        className: `flex gap-3 p-6 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
      },
        React.createElement('button', {
          onClick: onClose,
          className: `flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
            darkMode
              ? 'bg-slate-700 text-gray-200 hover:bg-slate-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`
        }, 'Cancel'),
        React.createElement('button', {
          onClick: handleSave,
          className: 'flex-1 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md'
        }, task ? 'Update Task' : 'Add Task')
      )
    )
  );
};

/**
 * TaskCard Component
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
        React.createElement('svg', {
          className: 'w-4 h-4',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          viewBox: '0 0 24 24'
        },
          React.createElement('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
          React.createElement('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
        )
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
        React.createElement('svg', {
          className: 'w-4 h-4',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          viewBox: '0 0 24 24'
        },
          React.createElement('path', { d: 'M3 6h18' }),
          React.createElement('path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }),
          React.createElement('path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' })
        )
      )
    )
  );
};

/**
 * TaskColumn Component
 */
const TaskColumn = ({ title, tasks, status, darkMode, onDrop, onEdit, onDelete, onAddTask }) => {
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
          React.createElement('svg', {
            className: 'w-4 h-4',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            viewBox: '0 0 24 24'
          },
            React.createElement('path', { d: 'M5 12h14' }),
            React.createElement('path', { d: 'M12 5v14' })
          )
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

/**
 * Main Tasks Component
 */
export const Tasks = ({ darkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('pmtool_personal_tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed);
        console.log('Loaded', parsed.length, 'personal tasks from localStorage');
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length >= 0) {
      localStorage.setItem('pmtool_personal_tasks', JSON.stringify(tasks));
      console.log('Saved', tasks.length, 'personal tasks to localStorage');
    }
  }, [tasks]);

  // Add or update task
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, ...taskData }
          : task
      ));
    } else {
      // Add new task
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        status: 'new',
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
    }
    setEditingTask(null);
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Move task between columns
  const handleDrop = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus }
        : task
    ));
  };

  // Open modal for adding new task
  const handleAddTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  // Open modal for editing existing task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  // Group tasks by status
  const tasksByStatus = {
    'new': tasks.filter(t => t.status === 'new'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    'done': tasks.filter(t => t.status === 'done')
  };

  const columns = [
    { key: 'new', title: 'New' },
    { key: 'in-progress', title: 'In Progress' },
    { key: 'done', title: 'Done' }
  ];

  return React.createElement('div', {
    className: 'w-full'
  },
    // Header
    React.createElement('div', {
      className: 'mb-6'
    },
      React.createElement('div', {
        className: 'flex items-center justify-between'
      },
        React.createElement('div', null,
          React.createElement('h2', {
            className: `text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
          },
            React.createElement('div', {
              className: 'w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full'
            }),
            'Personal Tasks'
          ),
          React.createElement('p', {
            className: `mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
          }, 'Manage your personal tasks. Drag and drop cards to move them between columns.')
        ),
        React.createElement('button', {
          onClick: handleAddTask,
          className: 'px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md font-medium flex items-center gap-2'
        },
          React.createElement('svg', {
            className: 'w-5 h-5',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            viewBox: '0 0 24 24'
          },
            React.createElement('path', { d: 'M5 12h14' }),
            React.createElement('path', { d: 'M12 5v14' })
          ),
          'Add Task'
        )
      )
    ),

    // Kanban Columns
    React.createElement('div', {
      className: 'flex gap-4 overflow-x-auto pb-4'
    },
      columns.map(column =>
        React.createElement(TaskColumn, {
          key: column.key,
          title: column.title,
          tasks: tasksByStatus[column.key],
          status: column.key,
          darkMode,
          onDrop: handleDrop,
          onEdit: handleEditTask,
          onDelete: handleDeleteTask,
          onAddTask: handleAddTask
        })
      )
    ),

    // Task Modal
    showModal && React.createElement(TaskModal, {
      task: editingTask,
      darkMode,
      onClose: () => {
        setShowModal(false);
        setEditingTask(null);
      },
      onSave: handleSaveTask
    })
  );
};
