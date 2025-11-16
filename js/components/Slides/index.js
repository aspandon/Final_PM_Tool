// js/components/Slides/index.js

import { SlideEditor } from './SlideEditor.js';
import { SlideViewer } from './SlideViewer.js';
import { Presentation, Eye, Edit } from '../../shared/icons/index.js';

const { useState, useEffect, useMemo } = React;

/**
 * Slides Component
 * Manages slide creation and viewing for projects under Implementation status
 */
export function Slides({ projects, darkMode }) {
  const [slidesData, setSlidesData] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'view'

  // Filter projects under Implementation status
  const implementationProjects = useMemo(() => {
    return projects.filter(p => {
      const status = p.kanbanStatus?.toLowerCase() || '';
      return status === 'implementation';
    });
  }, [projects]);

  // Load slides data from localStorage on mount
  useEffect(() => {
    const savedSlides = localStorage.getItem('projectSlides');
    if (savedSlides) {
      try {
        setSlidesData(JSON.parse(savedSlides));
      } catch (error) {
        console.error('Error loading slides data:', error);
      }
    }
  }, []);

  // Save slides data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('projectSlides', JSON.stringify(slidesData));
  }, [slidesData]);

  // Auto-select first project if none selected
  useEffect(() => {
    if (!selectedProjectId && implementationProjects.length > 0) {
      setSelectedProjectId(implementationProjects[0].id);
    }
  }, [selectedProjectId, implementationProjects]);

  const handleSaveSlide = (projectId, data) => {
    setSlidesData(prev => ({
      ...prev,
      [projectId]: data
    }));
  };

  const selectedProject = implementationProjects.find(p => p.id === selectedProjectId);
  const selectedSlideData = selectedProjectId ? slidesData[selectedProjectId] : null;

  return React.createElement('div', {
    className: 'space-y-6'
  },
    // Header
    React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h2', {
        className: `text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
      },
        React.createElement('div', {
          className: 'w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full'
        }),
        'Project Slides',
        React.createElement(Presentation, { className: 'w-7 h-7 ml-2' })
      ),
      React.createElement('p', {
        className: `mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, `Create presentation slides for ${implementationProjects.length} project${implementationProjects.length !== 1 ? 's' : ''} under Implementation`)
    ),

    // Check if there are any implementation projects
    implementationProjects.length === 0
      ? React.createElement('div', {
          className: `rounded-lg p-12 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md text-center`
        },
          React.createElement(Presentation, {
            className: `w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`
          }),
          React.createElement('h3', {
            className: `text-xl font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
          }, 'No Implementation Projects'),
          React.createElement('p', {
            className: `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
          }, 'There are no projects currently in Implementation status. Slides are only available for projects under Implementation.')
        )
      : React.createElement('div', null,
          // Project Selector and View Mode Toggle
          React.createElement('div', {
            className: `rounded-lg p-4 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md mb-6`
          },
            React.createElement('div', {
              className: 'flex flex-col md:flex-row md:items-center md:justify-between gap-4'
            },
              // Project Selector
              React.createElement('div', {
                className: 'flex-1'
              },
                React.createElement('label', {
                  className: `block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
                }, 'Select Project:'),
                React.createElement('select', {
                  className: `w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-gray-200'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`,
                  value: selectedProjectId || '',
                  onChange: (e) => setSelectedProjectId(e.target.value)
                },
                  implementationProjects.map((project, idx) =>
                    React.createElement('option', {
                      key: `project-${project.id || idx}`,
                      value: project.id
                    }, project.name)
                  )
                )
              ),

              // View Mode Toggle
              React.createElement('div', {
                className: 'flex gap-2'
              },
                React.createElement('button', {
                  onClick: () => setViewMode('edit'),
                  className: `px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    viewMode === 'edit'
                      ? darkMode
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-500 text-white'
                      : darkMode
                      ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`
                },
                  React.createElement(Edit, { className: 'w-4 h-4' }),
                  'Edit'
                ),
                React.createElement('button', {
                  onClick: () => setViewMode('view'),
                  className: `px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    viewMode === 'view'
                      ? darkMode
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-500 text-white'
                      : darkMode
                      ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`
                },
                  React.createElement(Eye, { className: 'w-4 h-4' }),
                  'View Slide'
                )
              )
            )
          ),

          // Content Area
          selectedProject && React.createElement('div', null,
            // Edit Mode - Show Editor
            viewMode === 'edit' && React.createElement(SlideEditor, {
              project: selectedProject,
              slideData: selectedSlideData,
              onSave: (data) => handleSaveSlide(selectedProjectId, data),
              darkMode
            }),

            // View Mode - Show Slide
            viewMode === 'view' && React.createElement('div', {
              className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-gray-100'} shadow-md`
            },
              React.createElement('div', {
                className: 'mb-4 flex items-center justify-between'
              },
                React.createElement('h3', {
                  className: `text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                }, 'Slide Preview'),
                React.createElement('button', {
                  onClick: () => {
                    // Future: Add export to PowerPoint functionality
                    alert('Export to PowerPoint feature coming soon!');
                  },
                  className: `px-4 py-2 rounded-lg font-semibold transition-colors ${
                    darkMode
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`
                }, 'Export to PowerPoint')
              ),
              React.createElement(SlideViewer, {
                project: selectedProject,
                slideData: selectedSlideData,
                darkMode
              })
            )
          )
        )
  );
}
