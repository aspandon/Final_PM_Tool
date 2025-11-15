// js/components/Tasks/index.js
import { saveTasks, loadTasks } from '../../utils/storage.js';
import { TaskColumn } from './TaskList.js';
import { TaskForm } from './TaskForm.js';
import { Plus } from '../../shared/icons/index.js';

const { useState, useEffect } = React;

/**
 * Main Tasks Component
 * Orchestrates task management with Supabase sync
 */
export const Tasks = ({ darkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from Supabase/localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      const savedTasks = await loadTasks();
      if (savedTasks && savedTasks.length > 0) {
        setTasks(savedTasks);
        console.log('Loaded', savedTasks.length, 'personal tasks');
      }
    };
    loadData();
  }, []);

  // Save tasks to Supabase and localStorage whenever they change
  useEffect(() => {
    if (tasks.length >= 0) {
      const saveData = async () => {
        const success = await saveTasks(tasks);
        if (success) {
          console.log('Auto-saved', tasks.length, 'personal tasks to Supabase');
        } else {
          console.error('Failed to save personal tasks');
        }
      };
      saveData();
    }
  }, [tasks]);

  // Auto-refresh: Periodically fetch latest data from Supabase
  // Runs every 45 seconds to check for updates from other users
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        const latestTasks = await loadTasks();
        if (latestTasks && latestTasks.length >= 0) {
          // Check if data has actually changed by comparing JSON strings
          const currentJSON = JSON.stringify(tasks);
          const latestJSON = JSON.stringify(latestTasks);

          if (currentJSON !== latestJSON) {
            console.log('🔄 Auto-refresh: New tasks data detected from Supabase');
            setTasks(latestTasks);
          }
        }
      } catch (error) {
        console.error('Error during tasks auto-refresh:', error);
      }
    }, 45000); // Refresh every 45 seconds

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
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
          React.createElement(Plus, { className: 'w-5 h-5' }),
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
    showModal && React.createElement(TaskForm, {
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
