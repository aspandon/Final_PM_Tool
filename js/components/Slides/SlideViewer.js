// js/components/Slides/SlideViewer.js

/**
 * Slide Viewer Component
 * Displays slide data in a PowerPoint-like format
 */
export function SlideViewer({ project, slideData, darkMode }) {
  if (!slideData) {
    return React.createElement('div', {
      className: `text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
    }, 'No slide data available. Please fill in the editor above.');
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const ragColorClass = (rag) => {
    switch (rag) {
      case 'Green': return 'bg-green-500 text-white';
      case 'Amber': return 'bg-yellow-500 text-white';
      case 'Red': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const riskColorClass = (assessment) => {
    switch (assessment) {
      case 'Low': return 'bg-green-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'High': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Slide container (16:9 aspect ratio like PowerPoint)
  return React.createElement('div', {
    className: 'w-full max-w-6xl mx-auto'
  },
    React.createElement('div', {
      className: `relative w-full bg-white shadow-2xl rounded-lg overflow-hidden`,
      style: { aspectRatio: '16/9' }
    },
      // Slide content
      React.createElement('div', {
        className: 'absolute inset-0 p-8 overflow-y-auto text-black',
        style: { fontSize: '10px' }
      },
        // Header Section
        React.createElement('div', {
          className: 'grid grid-cols-12 gap-2 mb-4 pb-2 border-b-2 border-blue-600'
        },
          // Left column - Project info
          React.createElement('div', { className: 'col-span-8 space-y-1' },
            // Project Name (large)
            React.createElement('div', { className: 'mb-2' },
              React.createElement('h1', {
                className: 'text-2xl font-bold text-blue-800'
              }, slideData.projectName || project.name)
            ),

            // Top row - 3 columns
            React.createElement('div', { className: 'grid grid-cols-3 gap-2' },
              React.createElement('div', null,
                React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'SAP ID'),
                React.createElement('div', { className: 'text-sm font-bold' }, slideData.sapId || '-')
              ),
              React.createElement('div', null,
                React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'JIRA ID'),
                React.createElement('div', { className: 'text-sm font-bold' }, slideData.jiraId || '-')
              ),
              React.createElement('div', null,
                React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'PM/BP'),
                React.createElement('div', { className: 'text-sm font-bold' }, slideData.pmBp || '-')
              )
            ),

            // Second row - 3 columns (aligned with top)
            React.createElement('div', { className: 'grid grid-cols-3 gap-2' },
              React.createElement('div', null,
                React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'Business Owner'),
                React.createElement('div', { className: 'text-sm font-bold' }, slideData.businessOwner || '-')
              ),
              React.createElement('div', null,
                React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'Involved Divisions'),
                React.createElement('div', { className: 'text-sm font-bold' }, slideData.involvedDivisions || '-')
              ),
              React.createElement('div', null,
                React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'Project Status'),
                React.createElement('div', { className: 'text-sm font-bold' }, slideData.projectStatus || '-')
              )
            )
          ),

          // Right column - RAG Status & Project Details
          React.createElement('div', { className: 'col-span-4' },
            // RAG Status (4 boxes)
            React.createElement('div', { className: 'grid grid-cols-4 gap-1 mb-2' },
              ['Overall', 'Schedule', 'Cost', 'Scope'].map(category => {
                const fieldName = `rag${category}`;
                const ragValue = slideData[fieldName] || 'Green';
                return React.createElement('div', { key: category, className: 'text-center' },
                  React.createElement('div', { className: 'text-xs font-semibold text-gray-600 mb-1' }, category),
                  React.createElement('div', {
                    className: `px-2 py-1 rounded font-bold text-sm ${ragColorClass(ragValue)}`
                  }, ragValue.charAt(0))
                );
              })
            ),

            // Project details
            React.createElement('div', { className: 'space-y-1' },
              React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
                React.createElement('div', null,
                  React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'Baseline Budget'),
                  React.createElement('div', { className: 'text-sm font-bold' }, slideData.baselineBudget || '-')
                ),
                React.createElement('div', null,
                  React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'Work Completed (%)'),
                  React.createElement('div', { className: 'text-sm font-bold' }, slideData.workCompleted || '0')
                )
              ),
              React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
                React.createElement('div', null,
                  React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'Planned Finish Date'),
                  React.createElement('div', { className: 'text-sm font-bold' }, formatDate(slideData.plannedCompletionDate))
                ),
                React.createElement('div', null,
                  React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'Planned Start Date'),
                  React.createElement('div', { className: 'text-sm font-bold' }, formatDate(slideData.plannedStartDate))
                )
              )
            )
          )
        ),

        // Main content area - 2 columns
        React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
          // Left Column
          React.createElement('div', { className: 'space-y-3' },
            // Project Scope
            React.createElement('div', {
              className: 'border border-gray-300 rounded p-2 bg-blue-50'
            },
              React.createElement('h3', {
                className: 'text-sm font-bold text-blue-800 mb-1'
              }, 'Project Scope'),
              React.createElement('div', {
                className: 'text-xs text-gray-800',
                style: { lineHeight: '1.3' }
              }, slideData.projectScope || 'No scope defined')
            ),

            // Activities Performed & Milestones Achieved
            React.createElement('div', {
              className: 'border border-gray-300 rounded p-2 bg-green-50'
            },
              React.createElement('h3', {
                className: 'text-sm font-bold text-green-800 mb-1'
              }, 'Activities Performed & Milestones Achieved'),
              React.createElement('div', {
                className: 'text-xs text-gray-800 rich-text-content',
                style: { lineHeight: '1.3' },
                dangerouslySetInnerHTML: { __html: slideData.activitiesPerformed || 'No activities recorded' }
              })
            ),

            // Major Action Items
            React.createElement('div', {
              className: 'border border-gray-300 rounded p-2 bg-yellow-50'
            },
              React.createElement('h3', {
                className: 'text-sm font-bold text-yellow-800 mb-1'
              }, 'Major Action Items - Upcoming Activities - Comments'),
              React.createElement('div', {
                className: 'text-xs text-gray-800 rich-text-content',
                style: { lineHeight: '1.3' },
                dangerouslySetInnerHTML: { __html: slideData.majorActions || 'No actions recorded' }
              })
            )
          ),

          // Right Column
          React.createElement('div', { className: 'space-y-3' },
            // Phases/Milestones/Deliverables Table
            React.createElement('div', {
              className: 'border border-gray-300 rounded overflow-hidden'
            },
              React.createElement('div', {
                className: 'bg-purple-600 text-white px-2 py-1'
              },
                React.createElement('h3', { className: 'text-sm font-bold' }, 'Phases/Milestones/Deliverables')
              ),
              React.createElement('table', { className: 'w-full text-xs' },
                React.createElement('thead', {
                  className: 'bg-purple-100'
                },
                  React.createElement('tr', null,
                    React.createElement('th', { className: 'border border-gray-300 px-1 py-0.5 text-left font-semibold' }, 'Phase'),
                    React.createElement('th', { className: 'border border-gray-300 px-1 py-0.5 text-center font-semibold w-12' }, 'R/A/G'),
                    React.createElement('th', { className: 'border border-gray-300 px-1 py-0.5 text-left font-semibold w-20' }, 'Est. Delivery'),
                    React.createElement('th', { className: 'border border-gray-300 px-1 py-0.5 text-left font-semibold' }, 'Remarks')
                  )
                ),
                React.createElement('tbody', null,
                  slideData.phases && slideData.phases.length > 0
                    ? slideData.phases.map((phase, index) =>
                        React.createElement('tr', { key: index },
                          React.createElement('td', { className: 'border border-gray-300 px-1 py-0.5' }, phase.description),
                          React.createElement('td', {
                            className: `border border-gray-300 px-1 py-0.5 text-center font-bold ${ragColorClass(phase.ragStatus)}`
                          }, phase.ragStatus.charAt(0)),
                          React.createElement('td', { className: 'border border-gray-300 px-1 py-0.5' }, formatDate(phase.deliveryDate)),
                          React.createElement('td', { className: 'border border-gray-300 px-1 py-0.5' }, phase.remarks)
                        )
                      )
                    : React.createElement('tr', null,
                        React.createElement('td', {
                          colSpan: 4,
                          className: 'border border-gray-300 px-1 py-2 text-center text-gray-500'
                        }, 'No phases defined')
                      )
                )
              )
            ),

            // Risks Table
            React.createElement('div', {
              className: 'border border-gray-300 rounded overflow-hidden'
            },
              React.createElement('div', {
                className: 'bg-red-600 text-white px-2 py-1'
              },
                React.createElement('h3', { className: 'text-sm font-bold' }, 'Risk')
              ),
              React.createElement('table', { className: 'w-full text-xs' },
                React.createElement('thead', {
                  className: 'bg-red-100'
                },
                  React.createElement('tr', null,
                    React.createElement('th', { className: 'border border-gray-300 px-1 py-0.5 text-left font-semibold' }, 'Risk'),
                    React.createElement('th', { className: 'border border-gray-300 px-1 py-0.5 text-center font-semibold w-16' }, 'Assessment'),
                    React.createElement('th', { className: 'border border-gray-300 px-1 py-0.5 text-left font-semibold' }, 'Control')
                  )
                ),
                React.createElement('tbody', null,
                  slideData.risks && slideData.risks.length > 0
                    ? slideData.risks.map((risk, index) =>
                        React.createElement('tr', { key: index },
                          React.createElement('td', { className: 'border border-gray-300 px-1 py-0.5' }, risk.description),
                          React.createElement('td', {
                            className: `border border-gray-300 px-1 py-0.5 text-center font-bold ${riskColorClass(risk.assessment)}`
                          }, risk.assessment.charAt(0)),
                          React.createElement('td', { className: 'border border-gray-300 px-1 py-0.5' }, risk.control)
                        )
                      )
                    : React.createElement('tr', null,
                        React.createElement('td', {
                          colSpan: 3,
                          className: 'border border-gray-300 px-1 py-2 text-center text-gray-500'
                        }, 'No risks defined')
                      )
                )
              )
            )
          )
        ),

        // Footer - Slide number
        React.createElement('div', {
          className: 'absolute bottom-2 right-4 text-xs text-gray-500'
        }, '1/1')
      )
    )
  );
}
