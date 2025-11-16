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

  const getRagColor = (rag) => {
    switch (rag) {
      case 'Green': return '00B050';
      case 'Amber': return 'FFC000';
      case 'Red': return 'FF0000';
      default: return '808080';
    }
  };

  const getRiskColor = (assessment) => {
    switch (assessment) {
      case 'Low': return '00B050';
      case 'Medium': return 'FFC000';
      case 'High': return 'FF0000';
      default: return '808080';
    }
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const exportToPowerPoint = async () => {
    try {
      const pptx = new PptxGenJS();
      const slide = pptx.addSlide();

      // Header - Project Name
      slide.addText(slideData.projectName || project.name, {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 24, bold: true, color: '0070C0',
        align: 'left'
      });

      // Blue line separator
      slide.addShape('rect', {
        x: 0.5, y: 0.85, w: 9, h: 0.05,
        fill: '0070C0'
      });

      // Left column - Project Info
      let yPos = 1.0;
      const labelFontSize = 9;
      const valueFontSize = 10;
      const lineHeight = 0.35;

      // Row 1: SAP ID, JIRA ID, PM/BP
      slide.addText('SAP ID', { x: 0.5, y: yPos, w: 2.5, h: 0.3, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.sapId || '-', { x: 0.5, y: yPos + 0.15, w: 2.5, h: 0.3, fontSize: valueFontSize, bold: true });

      slide.addText('JIRA ID', { x: 3.2, y: yPos, w: 2.5, h: 0.3, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.jiraId || '-', { x: 3.2, y: yPos + 0.15, w: 2.5, h: 0.3, fontSize: valueFontSize, bold: true });

      slide.addText('PM/BP', { x: 5.9, y: yPos, w: 2.5, h: 0.3, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.pmBp || '-', { x: 5.9, y: yPos + 0.15, w: 2.5, h: 0.3, fontSize: valueFontSize, bold: true });

      yPos += 0.6;

      // Row 2: Business Owner, Involved Divisions, Baseline Budget
      slide.addText('Business Owner', { x: 0.5, y: yPos, w: 2.5, h: 0.3, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.businessOwner || '-', { x: 0.5, y: yPos + 0.15, w: 2.5, h: 0.3, fontSize: valueFontSize, bold: true });

      slide.addText('Involved Divisions', { x: 3.2, y: yPos, w: 2.5, h: 0.3, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.involvedDivisions || '-', { x: 3.2, y: yPos + 0.15, w: 2.5, h: 0.3, fontSize: valueFontSize, bold: true });

      slide.addText('Baseline Budget', { x: 5.9, y: yPos, w: 2.5, h: 0.3, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.baselineBudget || '-', { x: 5.9, y: yPos + 0.15, w: 2.5, h: 0.3, fontSize: valueFontSize, bold: true });

      // Right column - RAG Status
      const ragX = 8.6;
      const ragY = 1.0;
      const ragW = 0.6;
      const ragH = 0.3;
      const ragGap = 0.1;

      ['Overall', 'Schedule', 'Cost', 'Scope'].forEach((category, idx) => {
        const fieldName = `rag${category}`;
        const ragValue = slideData[fieldName] || 'Green';
        const yOffset = ragY + (idx * (ragH + ragGap));

        slide.addText(category, {
          x: ragX, y: yOffset - 0.15, w: ragW, h: 0.15,
          fontSize: 8, bold: true, color: '666666', align: 'center'
        });
        slide.addShape('rect', {
          x: ragX, y: yOffset, w: ragW, h: ragH,
          fill: getRagColor(ragValue)
        });
        slide.addText(ragValue.charAt(0), {
          x: ragX, y: yOffset, w: ragW, h: ragH,
          fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle'
        });
      });

      // Right column - Additional Details
      let rightYPos = 2.5;
      slide.addText('Project Status', { x: 8.6, y: rightYPos, w: 1.3, h: 0.3, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.projectStatus || '-', { x: 8.6, y: rightYPos + 0.15, w: 1.3, h: 0.3, fontSize: valueFontSize, bold: true });

      rightYPos += 0.5;
      slide.addText('Work Completed (%)', { x: 8.6, y: rightYPos, w: 1.3, h: 0.3, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(String(slideData.workCompleted || '0'), { x: 8.6, y: rightYPos + 0.15, w: 1.3, h: 0.3, fontSize: valueFontSize, bold: true });

      rightYPos += 0.5;
      slide.addText('Planned Finish Date', { x: 8.6, y: rightYPos, w: 1.3, h: 0.3, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(formatDate(slideData.plannedCompletionDate), { x: 8.6, y: rightYPos + 0.15, w: 1.3, h: 0.3, fontSize: valueFontSize, bold: true });

      rightYPos += 0.5;
      slide.addText('Planned Start Date', { x: 8.6, y: rightYPos, w: 1.3, h: 0.3, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(formatDate(slideData.plannedStartDate), { x: 8.6, y: rightYPos + 0.15, w: 1.3, h: 0.3, fontSize: valueFontSize, bold: true });

      // Main content area - 2 columns
      yPos = 2.5;
      const leftColX = 0.5;
      const leftColW = 3.8;
      const rightColX = 4.5;
      const rightColW = 4.0;

      // Project Scope
      slide.addShape('rect', {
        x: leftColX, y: yPos, w: leftColW, h: 0.35,
        fill: 'D6EAF8'
      });
      slide.addText('Project Scope', {
        x: leftColX, y: yPos, w: leftColW, h: 0.35,
        fontSize: 11, bold: true, color: '0070C0', align: 'left', valign: 'middle',
        margin: [0, 0.1, 0, 0]
      });
      slide.addText(slideData.projectScope || 'No scope defined', {
        x: leftColX, y: yPos + 0.4, w: leftColW, h: 0.8,
        fontSize: 9, color: '000000', align: 'left', valign: 'top',
        margin: [0.1, 0.1, 0.1, 0.1]
      });

      // Activities Performed
      yPos += 1.3;
      slide.addShape('rect', {
        x: leftColX, y: yPos, w: leftColW, h: 0.35,
        fill: 'D5F4E6'
      });
      slide.addText('Activities Performed & Milestones Achieved', {
        x: leftColX, y: yPos, w: leftColW, h: 0.35,
        fontSize: 11, bold: true, color: '229954', align: 'left', valign: 'middle',
        margin: [0, 0.1, 0, 0]
      });
      slide.addText(stripHtml(slideData.activitiesPerformed) || 'No activities recorded', {
        x: leftColX, y: yPos + 0.4, w: leftColW, h: 1.2,
        fontSize: 9, color: '000000', align: 'left', valign: 'top',
        margin: [0.1, 0.1, 0.1, 0.1]
      });

      // Major Action Items
      yPos += 1.7;
      slide.addShape('rect', {
        x: leftColX, y: yPos, w: leftColW, h: 0.35,
        fill: 'FEF5E7'
      });
      slide.addText('Major Action Items - Upcoming Activities - Comments', {
        x: leftColX, y: yPos, w: leftColW, h: 0.35,
        fontSize: 11, bold: true, color: 'D68910', align: 'left', valign: 'middle',
        margin: [0, 0.1, 0, 0]
      });
      slide.addText(stripHtml(slideData.majorActions) || 'No actions recorded', {
        x: leftColX, y: yPos + 0.4, w: leftColW, h: 1.0,
        fontSize: 9, color: '000000', align: 'left', valign: 'top',
        margin: [0.1, 0.1, 0.1, 0.1]
      });

      // Phases/Milestones Table
      yPos = 2.5;
      const phaseRows = [
        [
          { text: 'Phase', options: { bold: true, fontSize: 9, fill: { color: 'E8DAEF' }, color: '000000' } },
          { text: 'R/A/G', options: { bold: true, fontSize: 9, fill: { color: 'E8DAEF' }, color: '000000' } },
          { text: 'Est. Delivery', options: { bold: true, fontSize: 9, fill: { color: 'E8DAEF' }, color: '000000' } },
          { text: 'Remarks', options: { bold: true, fontSize: 9, fill: { color: 'E8DAEF' }, color: '000000' } }
        ]
      ];

      if (slideData.phases && slideData.phases.length > 0) {
        slideData.phases.forEach(phase => {
          phaseRows.push([
            { text: phase.description || '', options: { fontSize: 8 } },
            { text: phase.ragStatus?.charAt(0) || 'G', options: { fontSize: 8, bold: true, fill: { color: getRagColor(phase.ragStatus) }, color: 'FFFFFF', align: 'center' } },
            { text: formatDate(phase.deliveryDate), options: { fontSize: 8 } },
            { text: phase.remarks || '', options: { fontSize: 8 } }
          ]);
        });
      } else {
        phaseRows.push([
          { text: 'No phases defined', options: { fontSize: 8, color: '999999', colspan: 4 } }
        ]);
      }

      slide.addShape('rect', {
        x: rightColX, y: yPos, w: rightColW, h: 0.35,
        fill: '884EA0'
      });
      slide.addText('Phases/Milestones/Deliverables', {
        x: rightColX, y: yPos, w: rightColW, h: 0.35,
        fontSize: 11, bold: true, color: 'FFFFFF', align: 'left', valign: 'middle',
        margin: [0, 0.1, 0, 0]
      });

      slide.addTable(phaseRows, {
        x: rightColX, y: yPos + 0.4, w: rightColW, h: 2.0,
        border: { pt: 1, color: 'CCCCCC' },
        colW: [1.6, 0.5, 0.9, 1.0]
      });

      // Risks Table
      yPos += 2.5;
      const riskRows = [
        [
          { text: 'Risk', options: { bold: true, fontSize: 9, fill: { color: 'F5B7B1' }, color: '000000' } },
          { text: 'Assessment', options: { bold: true, fontSize: 9, fill: { color: 'F5B7B1' }, color: '000000' } },
          { text: 'Control', options: { bold: true, fontSize: 9, fill: { color: 'F5B7B1' }, color: '000000' } }
        ]
      ];

      if (slideData.risks && slideData.risks.length > 0) {
        slideData.risks.forEach(risk => {
          riskRows.push([
            { text: risk.description || '', options: { fontSize: 8 } },
            { text: risk.assessment?.charAt(0) || 'L', options: { fontSize: 8, bold: true, fill: { color: getRiskColor(risk.assessment) }, color: 'FFFFFF', align: 'center' } },
            { text: risk.control || '', options: { fontSize: 8 } }
          ]);
        });
      } else {
        riskRows.push([
          { text: 'No risks defined', options: { fontSize: 8, color: '999999', colspan: 3 } }
        ]);
      }

      slide.addShape('rect', {
        x: rightColX, y: yPos, w: rightColW, h: 0.35,
        fill: 'C0392B'
      });
      slide.addText('Risk', {
        x: rightColX, y: yPos, w: rightColW, h: 0.35,
        fontSize: 11, bold: true, color: 'FFFFFF', align: 'left', valign: 'middle',
        margin: [0, 0.1, 0, 0]
      });

      slide.addTable(riskRows, {
        x: rightColX, y: yPos + 0.4, w: rightColW, h: 1.8,
        border: { pt: 1, color: 'CCCCCC' },
        colW: [1.6, 0.8, 1.6]
      });

      // Save the presentation
      const fileName = `${slideData.projectName || project.name || 'Project'}_Slide.pptx`;
      await pptx.writeFile({ fileName });

      console.log('PowerPoint exported successfully!');
    } catch (error) {
      console.error('Error exporting to PowerPoint:', error);
      alert('Failed to export to PowerPoint. Please try again.');
    }
  };

  // Slide container (16:9 aspect ratio like PowerPoint)
  return React.createElement('div', {
    className: 'w-full max-w-6xl mx-auto space-y-4'
  },
    // Export Button
    React.createElement('div', {
      className: 'flex justify-end'
    },
      React.createElement('button', {
        onClick: exportToPowerPoint,
        className: `px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
          darkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`
      },
        React.createElement('svg', {
          className: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          viewBox: '0 0 24 24'
        },
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            d: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          })
        ),
        'Export to PowerPoint'
      )
    ),
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
                React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'Baseline Budget'),
                React.createElement('div', { className: 'text-sm font-bold' }, slideData.baselineBudget || '-')
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
                  React.createElement('div', { className: 'text-xs font-semibold text-gray-600' }, 'Project Status'),
                  React.createElement('div', { className: 'text-sm font-bold' }, slideData.projectStatus || '-')
                ),
                React.createElement('div', null,
                  React.createElement('div', { className: 'text-xs font-semibold text-gray-600 mb-1' }, 'Work Completed (%)'),
                  React.createElement('div', { className: 'flex items-center gap-2' },
                    // Progress bar background
                    React.createElement('div', {
                      className: 'flex-1 h-4 bg-gray-200 rounded-full overflow-hidden'
                    },
                      // Progress bar fill
                      React.createElement('div', {
                        className: 'h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300',
                        style: { width: `${Math.min(100, Math.max(0, slideData.workCompleted || 0))}%` }
                      })
                    ),
                    // Percentage text
                    React.createElement('div', { className: 'text-sm font-bold text-blue-700 min-w-[2.5rem] text-right' },
                      `${slideData.workCompleted || 0}%`
                    )
                  )
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
