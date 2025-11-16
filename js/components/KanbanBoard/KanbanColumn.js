// js/components/KanbanBoard/KanbanColumn.js
import { KanbanCard } from './KanbanCard.js';

const { useState } = React;

/**
 * KanbanColumn Component
 * Represents a single column in the Kanban board with drag-and-drop support
 */
export const KanbanColumn = ({ title, projects, column, darkMode, onDrop, kanbanSettings, onOpenNotes, onEditProject }) => {
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
