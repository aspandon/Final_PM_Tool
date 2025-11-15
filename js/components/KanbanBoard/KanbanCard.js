// js/components/KanbanBoard/KanbanCard.js

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
 * KanbanCard Component
 * Individual project card with drag-and-drop support
 */
export const KanbanCard = ({ project, column, darkMode, kanbanSettings, onOpenNotes, onEditProject }) => {
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

    // Date info (conditional - only show when date exists)
    finishDate && React.createElement('div', {
      className: `text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
    }, `Due: ${formatDate(finishDate)}`)
  );
};
