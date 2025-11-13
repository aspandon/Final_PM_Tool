// js/components/KanbanBoard.js
const { useState, useMemo } = React;

/**
 * Calculate RAG status based on finish date
 * @param {string} finishDate - The finish date to check
 * @param {boolean} isOnHold - Whether the project is on hold
 * @param {string} projectName - Project name for debugging
 * @returns {object} RAG status with color and label
 */
const calculateRAGStatus = (finishDate, isOnHold = false, projectName = '') => {
  // On Hold always gets Amber status
  if (isOnHold) {
    return {
      color: 'bg-yellow-500',
      label: 'Amber',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-500'
    };
  }

  // If no finish date, return Green (no urgency)
  if (!finishDate) {
    console.log(`RAG [${projectName}]: No finish date - Green`);
    return {
      color: 'bg-green-500',
      label: 'Green',
      textColor: 'text-green-700',
      borderColor: 'border-green-500'
    };
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const finish = new Date(finishDate);
  finish.setHours(0, 0, 0, 0);

  const diffTime = finish - currentDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  console.log(`RAG [${projectName}]: finishDate=${finishDate}, diffDays=${diffDays}`);

  if (diffDays < 0) {
    // Past due - Red
    return {
      color: 'bg-red-500',
      label: 'Red',
      textColor: 'text-red-700',
      borderColor: 'border-red-500'
    };
  } else if (diffDays <= 7) {
    // Due within 7 days - Amber
    return {
      color: 'bg-yellow-500',
      label: 'Amber',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-500'
    };
  } else {
    // More than 7 days - Green
    return {
      color: 'bg-green-500',
      label: 'Green',
      textColor: 'text-green-700',
      borderColor: 'border-green-500'
    };
  }
};

/**
 * Determine which column a project belongs to
 * Uses kanbanStatus field for manual column placement via drag-and-drop
 */
const getProjectColumn = (project) => {
  // Migration map for old column keys to new ones
  const migrationMap = {
    'psd-prep': 'psdpre',
    'psd-ready': 'psdready',
    'approved': 'invapproved',
    'uat': 'uat',
    'done': 'done'
  };

  let kanbanStatus = project.kanbanStatus || 'backlog';

  // Migrate old column keys to new format
  if (migrationMap[kanbanStatus]) {
    kanbanStatus = migrationMap[kanbanStatus];
  }

  return kanbanStatus;
};

/**
 * Get the relevant finish date for RAG status based on column
 */
const getRelevantFinishDate = (project, column) => {
  switch (column) {
    case 'psdpre':
    case 'psdready':
      return project.psd?.finish;
    case 'invapproved':
      return project.investment?.finish;
    case 'procurement':
      return project.procurement?.finish;
    case 'implementation':
    case 'uat':
      return project.implementation?.finish;
    default:
      return null;
  }
};

/**
 * Format date as DD/MM/YYYY
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * KanbanCard Component
 */
const KanbanCard = ({ project, column, darkMode, onStatusChange }) => {
  const isOnHold = column === 'onhold';
  const isDone = column === 'done';
  const finishDate = getRelevantFinishDate(project, column);

  // Log what column and dates we're using
  console.log(`Card [${project.name}] in column [${column}]: finishDate=${finishDate}, project.psd?.finish=${project.psd?.finish}, project.investment?.finish=${project.investment?.finish}`);

  // Done projects don't need RAG status, or can show N/A
  const ragStatus = isDone
    ? { color: 'bg-gray-400', label: 'N/A', textColor: 'text-gray-700', borderColor: 'border-gray-400' }
    : calculateRAGStatus(finishDate, isOnHold, project.name);

  return React.createElement('div', {
    className: `${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'} rounded-lg p-4 mb-3 shadow-sm border-l-4 ${ragStatus.borderColor} hover:shadow-md transition-shadow cursor-move`,
    draggable: true,
    onDragStart: (e) => {
      e.dataTransfer.setData('projectName', project.name);
      e.dataTransfer.setData('fromColumn', column);
    }
  },
    // Project Name
    React.createElement('div', {
      className: `font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
    }, project.name || 'Untitled Project'),

    // Division
    project.division && React.createElement('div', {
      className: `text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
    }, `Division: ${project.division}`),

    // RAG Status Badge
    React.createElement('div', {
      className: 'flex items-center justify-between mt-3 pt-3 border-t ' + (darkMode ? 'border-slate-600' : 'border-gray-200')
    },
      React.createElement('span', {
        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, 'RAG Status:'),
      React.createElement('span', {
        className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ragStatus.color} text-white`
      }, ragStatus.label)
    ),

    // Date info
    finishDate && React.createElement('div', {
      className: `text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
    }, `Due: ${formatDate(finishDate)}`)
  );
};

/**
 * KanbanColumn Component
 */
const KanbanColumn = ({ title, projects, column, darkMode, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const projectName = e.dataTransfer.getData('projectName');
    const fromColumn = e.dataTransfer.getData('fromColumn');
    if (projectName && fromColumn !== column) {
      onDrop(projectName, column);
    }
  };

  return React.createElement('div', {
    className: `flex-shrink-0 w-80 ${darkMode ? 'bg-slate-800' : 'bg-gray-50'} rounded-xl p-4 ${isDragOver ? 'ring-2 ring-blue-500' : ''}`,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop
  },
    // Column Header
    React.createElement('div', {
      className: 'flex items-center justify-between mb-4'
    },
      React.createElement('h3', {
        className: `font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, title),
      React.createElement('span', {
        className: `${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-white text-gray-700'} px-2 py-1 rounded-full text-xs font-semibold`
      }, projects.length)
    ),

    // Cards
    React.createElement('div', {
      className: 'space-y-3 min-h-[200px]'
    },
      projects.length > 0
        ? projects.map((project, idx) =>
            React.createElement(KanbanCard, {
              key: idx,
              project,
              column,
              darkMode
            })
          )
        : React.createElement('div', {
            className: `text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`
          }, 'No projects')
    )
  );
};

/**
 * Main KanbanBoard Component
 */
export const KanbanBoard = ({ projects, setProjects, darkMode }) => {
  const { useEffect } = React;

  // Safety check: ensure projects is an array
  if (!projects || !Array.isArray(projects)) {
    console.warn('KanbanBoard: projects is not an array', projects);
    return React.createElement('div', {
      className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
    },
      React.createElement('p', { className: 'text-lg mb-2' }, '⚠️ Unable to load Kanban board'),
      React.createElement('p', { className: 'text-sm' }, 'Projects data is invalid. Please refresh the page.')
    );
  }

  // One-time migration: Convert old kanbanStatus values to new format
  useEffect(() => {
    const migrationMap = {
      'psd-prep': 'psdpre',
      'psd-ready': 'psdready',
      'approved': 'invapproved'
    };

    let needsMigration = false;
    const migratedProjects = projects.map(project => {
      if (project.kanbanStatus && migrationMap[project.kanbanStatus]) {
        needsMigration = true;
        console.log(`Migrating project "${project.name}" from "${project.kanbanStatus}" to "${migrationMap[project.kanbanStatus]}"`);
        return { ...project, kanbanStatus: migrationMap[project.kanbanStatus] };
      }
      return project;
    });

    if (needsMigration) {
      console.log('Migrating old kanbanStatus values to new format...');
      setProjects(migratedProjects);
    }
  }, []); // Run only once on mount

  const columns = [
    { key: 'backlog', title: 'Backlog' },
    { key: 'onhold', title: 'On Hold' },
    { key: 'psdpre', title: 'PSD & Inv. Prop Pre' },
    { key: 'psdready', title: 'PSD & Inv. Prop. Ready' },
    { key: 'invapproved', title: 'Inv. Prop. Approved' },
    { key: 'procurement', title: 'Procurement' },
    { key: 'implementation', title: 'Implementation' },
    { key: 'uat', title: 'UAT' },
    { key: 'done', title: 'Done' }
  ];

  // Group projects by column
  const projectsByColumn = useMemo(() => {
    const grouped = {
      backlog: [],
      onhold: [],
      psdpre: [],
      psdready: [],
      invapproved: [],
      procurement: [],
      implementation: [],
      uat: [],
      done: []
    };

    try {
      projects.forEach(project => {
        if (!project) return; // Skip null/undefined projects

        const column = getProjectColumn(project);
        // Safety check: if column doesn't exist in grouped, default to backlog
        if (grouped[column]) {
          grouped[column].push(project);
        } else {
          // Unknown column - default to backlog (migration will fix this)
          grouped['backlog'].push(project);
        }
      });
    } catch (error) {
      console.error('KanbanBoard: Error grouping projects', error);
    }

    return grouped;
  }, [projects]);

  // Handle drag and drop to move projects between columns
  const handleDrop = (projectName, toColumn) => {
    const updatedProjects = projects.map(project => {
      if (project.name === projectName) {
        // Update project's kanbanStatus to the new column
        return { ...project, kanbanStatus: toColumn };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  return React.createElement('div', {
    className: 'w-full'
  },
    // Kanban Board Header
    React.createElement('div', {
      className: 'mb-6'
    },
      React.createElement('h2', {
        className: `text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
      },
        React.createElement('div', {
          className: 'w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full'
        }),
        'Kanban Board'
      ),
      React.createElement('p', {
        className: `mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, 'Drag and drop cards to move projects between columns. RAG status is automatically calculated based on project deadlines.')
    ),

    // Legend
    React.createElement('div', {
      className: `mb-4 p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
    },
      React.createElement('div', {
        className: 'flex items-center gap-6'
      },
        React.createElement('span', {
          className: `text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
        }, 'RAG Status:'),
        React.createElement('div', {
          className: 'flex items-center gap-2'
        },
          React.createElement('span', {
            className: 'inline-block w-3 h-3 rounded-full bg-green-500'
          }),
          React.createElement('span', {
            className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
          }, 'Green: >7 days to deadline')
        ),
        React.createElement('div', {
          className: 'flex items-center gap-2'
        },
          React.createElement('span', {
            className: 'inline-block w-3 h-3 rounded-full bg-yellow-500'
          }),
          React.createElement('span', {
            className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
          }, 'Amber: ≤7 days to deadline')
        ),
        React.createElement('div', {
          className: 'flex items-center gap-2'
        },
          React.createElement('span', {
            className: 'inline-block w-3 h-3 rounded-full bg-red-500'
          }),
          React.createElement('span', {
            className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
          }, 'Red: Past deadline')
        )
      )
    ),

    // Kanban Columns
    React.createElement('div', {
      className: 'flex gap-4 overflow-x-auto pb-4'
    },
      columns.map(column =>
        React.createElement(KanbanColumn, {
          key: column.key,
          title: column.title,
          projects: projectsByColumn[column.key],
          column: column.key,
          darkMode,
          onDrop: handleDrop
        })
      )
    )
  );
};
