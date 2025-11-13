// js/components/KanbanBoard.js
const { useState, useMemo } = React;

/**
 * Calculate RAG status based on finish date
 * @param {string} finishDate - The finish date to check
 * @param {boolean} isOnHold - Whether the project is on hold
 * @returns {object} RAG status with color and label
 */
const calculateRAGStatus = (finishDate, isOnHold = false) => {
  // On Hold always gets Amber status
  if (isOnHold) {
    return {
      color: 'bg-yellow-500',
      label: 'Amber',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-500'
    };
  }

  // If no finish date, return neutral
  if (!finishDate) {
    return {
      color: 'bg-gray-400',
      label: 'N/A',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-400'
    };
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const finish = new Date(finishDate);
  finish.setHours(0, 0, 0, 0);

  const diffTime = finish - currentDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
 * Projects progress through columns in order:
 * Backlog -> On Hold (if set) -> PSD Pre -> PSD Ready -> Inv Approved -> Procurement -> Implementation
 */
const getProjectColumn = (project) => {
  // Check if project has status field (for On Hold) - this takes precedence
  if (project.status === 'onhold') {
    return 'onhold';
  }

  // Check phases in reverse order (most advanced phase determines column)
  // This ensures a project appears in its current/most advanced stage

  // If implementation has started, it's in Implementation
  if (project.implementation?.start && project.implementation.start !== '') {
    return 'implementation';
  }

  // If procurement has started (and implementation hasn't), it's in Procurement
  if (project.procurement?.start && project.procurement.start !== '') {
    return 'procurement';
  }

  // If investment is approved/finished (and procurement hasn't started), it's in Inv Approved
  if (project.investment?.finish && project.investment.finish !== '') {
    return 'invapproved';
  }

  // If PSD is finished (and investment hasn't finished), it's in PSD Ready
  if (project.psd?.finish && project.psd.finish !== '') {
    return 'psdready';
  }

  // If PSD has started (but not finished), it's in PSD Pre
  if (project.psd?.start && project.psd.start !== '') {
    return 'psdpre';
  }

  // Default to backlog if no phases have started
  return 'backlog';
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
      return project.implementation?.finish;
    default:
      return null;
  }
};

/**
 * KanbanCard Component
 */
const KanbanCard = ({ project, column, darkMode, onStatusChange }) => {
  const isOnHold = column === 'onhold';
  const finishDate = getRelevantFinishDate(project, column);
  const ragStatus = calculateRAGStatus(finishDate, isOnHold);

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
    }, `Due: ${new Date(finishDate).toLocaleDateString()}`)
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
  const columns = [
    { key: 'backlog', title: 'Backlog' },
    { key: 'onhold', title: 'On Hold' },
    { key: 'psdpre', title: 'PSD & Inv. Prop Pre' },
    { key: 'psdready', title: 'PSD & Inv. Prop. Ready' },
    { key: 'invapproved', title: 'Inv. Prop. Approved' },
    { key: 'procurement', title: 'Procurement' },
    { key: 'implementation', title: 'Implementation and UAT' }
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
      implementation: []
    };

    projects.forEach(project => {
      const column = getProjectColumn(project);
      grouped[column].push(project);
    });

    return grouped;
  }, [projects]);

  // Handle drag and drop to move projects between columns
  const handleDrop = (projectName, toColumn) => {
    const updatedProjects = projects.map(project => {
      if (project.name === projectName) {
        // Update project status based on target column
        if (toColumn === 'onhold') {
          return { ...project, status: 'onhold' };
        } else {
          // Remove onhold status if moving to another column
          const { status, ...rest } = project;
          return rest;
        }
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
