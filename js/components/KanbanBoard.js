// js/components/KanbanBoard.js
const { useState, useMemo, useRef } = React;

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
    case 'backlog':
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
 * NotesModal Component
 * Modal for viewing and editing project notes
 */
const NotesModal = ({ project, darkMode, onClose, onSave, position }) => {
  const [notes, setNotes] = useState(project.notes || '');
  const textareaRef = useRef(null);
  const modalRef = useRef(null);
  const [modalStyle, setModalStyle] = useState({});

  // Calculate modal position based on click position
  React.useEffect(() => {
    if (modalRef.current && position) {
      const modal = modalRef.current;
      const modalRect = modal.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Modal dimensions
      const modalWidth = 600; // max-w-2xl is approximately 600px
      const modalHeight = Math.min(modalRect.height, viewportHeight * 0.8);

      // Center the modal in the viewport, but try to keep it near the click position
      let left = position.x + 20; // Start 20px to the right of click
      let top = position.y;

      // If modal would go off right edge, position it to the left of click
      if (left + modalWidth > viewportWidth - 20) {
        left = position.x - modalWidth - 20;
      }

      // If still off screen on the left, center it horizontally
      if (left < 20) {
        left = Math.max(20, (viewportWidth - modalWidth) / 2);
      }

      // Adjust vertical position to keep modal in viewport
      // Try to center it vertically in the viewport
      const idealTop = (viewportHeight - modalHeight) / 2;

      // But if the click was near the top or bottom, adjust accordingly
      if (position.y < viewportHeight / 3) {
        // Click was in top third - position modal below
        top = Math.min(position.y, idealTop);
      } else if (position.y > (viewportHeight * 2) / 3) {
        // Click was in bottom third - position modal above
        top = Math.max(position.y - modalHeight, idealTop);
      } else {
        // Click was in middle - center the modal
        top = idealTop;
      }

      // Final boundary checks
      if (top < 20) {
        top = 20;
      }
      if (top + modalHeight > viewportHeight - 20) {
        top = viewportHeight - modalHeight - 20;
      }

      setModalStyle({
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        maxWidth: '600px',
        width: 'calc(100% - 40px)',
        maxHeight: '80vh'
      });
    }
  }, [position]);

  // Focus textarea when modal opens
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  const handleKeyDown = (e) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSave();
    }
  };

  return React.createElement('div', {
    className: 'fixed inset-0 bg-black/30 z-[100]',
    onClick: onClose
  },
    React.createElement('div', {
      ref: modalRef,
      className: `${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden flex flex-col`,
      style: modalStyle,
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
              React.createElement('path', { d: 'M12 20h9' }),
              React.createElement('path', { d: 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' })
            )
          ),
          React.createElement('div', null,
            React.createElement('h2', {
              className: `text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, 'Project Notes'),
            React.createElement('p', {
              className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }, project.name)
          )
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
        className: `p-6 flex-1 overflow-y-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
      },
        React.createElement('textarea', {
          ref: textareaRef,
          value: notes,
          onChange: (e) => setNotes(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder: 'Add notes about this project...\n\nTip: Press Ctrl+Enter to save',
          className: `w-full h-64 px-4 py-3 rounded-lg border ${
            darkMode
              ? 'bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm`,
          style: { minHeight: '300px' }
        }),
        React.createElement('p', {
          className: `text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`
        }, `${notes.length} characters`)
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
        }, 'Save Notes')
      )
    )
  );
};

/**
 * KanbanCard Component
 */
const KanbanCard = ({ project, column, darkMode, onStatusChange, kanbanSettings, onOpenNotes, onEditProject }) => {
  // Default kanban settings if not provided
  const settings = kanbanSettings || {
    showRAG: true,
    showPM: true,
    showBP: true,
    showDivision: true
  };

  const isOnHold = column === 'onhold';
  const isDone = column === 'done';
  const finishDate = getRelevantFinishDate(project, column);

  // Log what column and dates we're using
  console.log(`Card [${project.name}] in column [${column}]: finishDate=${finishDate}, project.psd?.finish=${project.psd?.finish}, project.investment?.finish=${project.investment?.finish}`);

  // Done projects don't need RAG status, or can show N/A
  const ragStatus = isDone
    ? { color: 'bg-gray-400', label: 'N/A', textColor: 'text-gray-700', borderColor: 'border-gray-400' }
    : calculateRAGStatus(finishDate, isOnHold, project.name);

  const hasNotes = project.notes && project.notes.trim().length > 0;

  return React.createElement('div', {
    className: `kanban-card ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'} rounded-lg p-4 mb-3 shadow-sm border-l-4 ${ragStatus.borderColor} cursor-move relative`,
    draggable: true,
    onDragStart: (e) => {
      e.dataTransfer.setData('projectName', project.name);
      e.dataTransfer.setData('fromColumn', column);
    }
  },
    // Action buttons container (top-right corner)
    React.createElement('div', {
      className: 'absolute top-2 right-2 flex flex-col gap-1'
    },
      // Notes Icon Button
      React.createElement('button', {
        type: 'button',
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenNotes(project, e);
        },
        className: `p-1.5 rounded-lg transition-all flex-shrink-0 ${
          hasNotes
            ? darkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700 notes-icon-pulse'
              : 'bg-blue-500 text-white hover:bg-blue-600 notes-icon-pulse'
            : darkMode
              ? 'bg-slate-600 text-gray-400 hover:bg-slate-500 hover:text-gray-300'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
        }`,
        title: hasNotes ? 'View/Edit Notes' : 'Add Notes'
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
          React.createElement('path', { d: 'M12 20h9' }),
          React.createElement('path', { d: 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' })
        ),
        // Badge indicator when notes exist
        hasNotes && React.createElement('span', {
          className: 'absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white'
        })
      ),
      // Edit Icon Button
      React.createElement('button', {
        type: 'button',
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          onEditProject(project.name);
        },
        className: `p-1.5 rounded-lg transition-all flex-shrink-0 ${
          darkMode
            ? 'bg-slate-600 text-gray-400 hover:bg-indigo-600 hover:text-white'
            : 'bg-gray-100 text-gray-400 hover:bg-indigo-500 hover:text-white'
        }`,
        title: 'Edit in Projects Tab'
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
      )
    ),

    // Project Name
    React.createElement('div', {
      className: `font-semibold mb-2 pr-8 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
    }, project.name || 'Untitled Project'),

    // Division (conditional)
    settings.showDivision && project.division && React.createElement('div', {
      className: `text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
    }, `Division: ${project.division}`),

    // Project Manager (conditional)
    settings.showPM && project.projectManager && React.createElement('div', {
      className: `text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
    }, `PM: ${project.projectManager}`),

    // Business Partner (conditional)
    settings.showBP && project.businessPartner && React.createElement('div', {
      className: `text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
    }, `BP: ${project.businessPartner}`),

    // Date info with RAG status (conditional)
    settings.showRAG && finishDate && React.createElement('div', {
      className: `flex items-center justify-between mt-2`
    },
      React.createElement('span', {
        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, `Due: ${formatDate(finishDate)}`),
      React.createElement('span', {
        className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ragStatus.color} text-white`
      }, ragStatus.label)
    )
  );
};

/**
 * KanbanColumn Component
 */
const KanbanColumn = ({ title, projects, column, darkMode, onDrop, kanbanSettings, onOpenNotes, onEditProject }) => {
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
              darkMode,
              kanbanSettings,
              onOpenNotes,
              onEditProject
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
export const KanbanBoard = ({ projects, updateProjectByName, navigateToProject, darkMode, kanbanSettings }) => {
  const { useEffect, useRef } = React;

  // Refs for scroll synchronization
  const topScrollRef = useRef(null);
  const contentScrollRef = useRef(null);

  // Modal state for notes
  const [notesModalProject, setNotesModalProject] = useState(null);
  const [notesModalPosition, setNotesModalPosition] = useState(null);

  // Default kanban settings if not provided
  const settings = kanbanSettings || {
    showRAG: true,
    showPM: true,
    showBP: true,
    showDivision: true
  };

  // Handle opening notes modal
  const handleOpenNotes = (project, event) => {
    // Get the button's position
    const rect = event.currentTarget.getBoundingClientRect();
    setNotesModalPosition({
      x: rect.right,
      y: rect.top
    });
    setNotesModalProject(project);
  };

  // Handle closing notes modal
  const handleCloseNotes = () => {
    setNotesModalProject(null);
    setNotesModalPosition(null);
  };

  // Handle saving notes
  const handleSaveNotes = (notes) => {
    if (!notesModalProject) return;
    updateProjectByName(notesModalProject.name, 'notes', notes);
  };

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

    projects.forEach(project => {
      if (project.kanbanStatus && migrationMap[project.kanbanStatus]) {
        console.log(`Migrating project "${project.name}" from "${project.kanbanStatus}" to "${migrationMap[project.kanbanStatus]}"`);
        updateProjectByName(project.name, 'kanbanStatus', migrationMap[project.kanbanStatus]);
      }
    });
  }, []); // Run only once on mount

  // Sync scrollbars between top scroller and content
  useEffect(() => {
    const topScroll = topScrollRef.current;
    const contentScroll = contentScrollRef.current;

    if (!topScroll || !contentScroll) return;

    const syncTopToContent = (e) => {
      contentScroll.scrollLeft = e.target.scrollLeft;
    };

    const syncContentToTop = (e) => {
      topScroll.scrollLeft = e.target.scrollLeft;
    };

    topScroll.addEventListener('scroll', syncTopToContent);
    contentScroll.addEventListener('scroll', syncContentToTop);

    return () => {
      topScroll.removeEventListener('scroll', syncTopToContent);
      contentScroll.removeEventListener('scroll', syncContentToTop);
    };
  }, [projects.length]); // Re-sync when projects change

  const columns = [
    { key: 'onhold', title: 'On Hold' },
    { key: 'backlog', title: 'Backlog' },
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
    updateProjectByName(projectName, 'kanbanStatus', toColumn);
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

    // Top scrollbar wrapper
    React.createElement('div', {
      ref: topScrollRef,
      className: 'overflow-x-auto mb-2',
      style: { overflowY: 'hidden', height: '20px' }
    },
      React.createElement('div', {
        style: { width: `${columns.length * 320 + (columns.length - 1) * 16}px`, height: '1px' }
      })
    ),

    // Kanban Columns
    React.createElement('div', {
      ref: contentScrollRef,
      className: 'flex gap-4 overflow-x-auto',
      style: { overflowY: 'hidden' }
    },
      columns.map(column =>
        React.createElement(KanbanColumn, {
          key: column.key,
          title: column.title,
          projects: projectsByColumn[column.key],
          column: column.key,
          darkMode,
          onDrop: handleDrop,
          kanbanSettings: settings,
          onOpenNotes: handleOpenNotes,
          onEditProject: navigateToProject
        })
      )
    ),

    // Notes Modal
    notesModalProject && React.createElement(NotesModal, {
      project: notesModalProject,
      darkMode,
      onClose: handleCloseNotes,
      onSave: handleSaveNotes,
      position: notesModalPosition
    })
  );
};
