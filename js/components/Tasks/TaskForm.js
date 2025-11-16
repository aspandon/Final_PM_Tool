// js/components/Tasks/TaskForm.js
import { Plus, X } from '../../shared/icons/index.js';

const { useState } = React;

/**
 * TaskForm Component
 * Modal for adding and editing tasks
 */
export const TaskForm = ({ task, darkMode, onClose, onSave }) => {
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
            React.createElement(Plus, { className: 'w-6 h-6 text-white' })
          ),
          React.createElement('h2', {
            className: `text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
          }, task ? 'Edit Task' : 'New Task')
        ),
        React.createElement('button', {
          onClick: onClose,
          className: `p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`
        },
          React.createElement(X, { className: 'w-5 h-5' })
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
