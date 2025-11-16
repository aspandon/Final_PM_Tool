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
      // Check if PptxGenJS is available
      if (typeof PptxGenJS === 'undefined' && typeof window.PptxGenJS === 'undefined') {
        console.error('PptxGenJS library is not loaded');
        alert('PowerPoint library is not loaded. Please refresh the page and try again.');
        return;
      }

      const PptxGen = window.PptxGenJS || PptxGenJS;
      const pptx = new PptxGen();
      const slide = pptx.addSlide();

      // Header - Project Name
      slide.addText(slideData.projectName || project.name, {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 18, bold: true, color: '0070C0',
        align: 'left'
      });

      // Blue line separator
      slide.addShape('rect', {
        x: 0.5, y: 0.85, w: 9, h: 0.03,
        fill: '0070C0'
      });

      // Top section - Project Info (left) and RAG Status (right)
      let yPos = 1.0;
      const labelFontSize = 8;
      const valueFontSize = 9;

      // Row 1: SAP ID, JIRA ID, PM/BP (left side - 3 columns)
      const col1X = 0.5, col2X = 2.8, col3X = 5.1;
      const colW = 2.2;

      slide.addText('SAP ID', { x: col1X, y: yPos, w: colW, h: 0.2, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.sapId || '-', { x: col1X, y: yPos + 0.15, w: colW, h: 0.2, fontSize: valueFontSize, bold: true });

      slide.addText('JIRA ID', { x: col2X, y: yPos, w: colW, h: 0.2, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.jiraId || '-', { x: col2X, y: yPos + 0.15, w: colW, h: 0.2, fontSize: valueFontSize, bold: true });

      slide.addText('PM/BP', { x: col3X, y: yPos, w: colW, h: 0.2, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.pmBp || '-', { x: col3X, y: yPos + 0.15, w: colW, h: 0.2, fontSize: valueFontSize, bold: true });

      yPos += 0.45;

      // Row 2: Business Owner, Involved Divisions, Baseline Budget
      slide.addText('Business Owner', { x: col1X, y: yPos, w: colW, h: 0.2, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.businessOwner || '-', { x: col1X, y: yPos + 0.15, w: colW, h: 0.2, fontSize: valueFontSize, bold: true });

      slide.addText('Involved Divisions', { x: col2X, y: yPos, w: colW, h: 0.2, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.involvedDivisions || '-', { x: col2X, y: yPos + 0.15, w: colW, h: 0.3, fontSize: 7, bold: true, breakLine: true });

      slide.addText('Baseline Budget', { x: col3X, y: yPos, w: colW, h: 0.2, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.baselineBudget || '-', { x: col3X, y: yPos + 0.15, w: colW, h: 0.2, fontSize: valueFontSize, bold: true });

      // Right side - RAG Status (horizontal layout)
      const ragStartX = 7.5;
      const ragY = 1.0;
      const ragW = 0.6;
      const ragH = 0.25;
      const ragGap = 0.05;

      ['Overall', 'Schedule', 'Cost', 'Scope'].forEach((category, idx) => {
        const fieldName = `rag${category}`;
        const ragValue = slideData[fieldName] || 'Green';
        const xPos = ragStartX + (idx * (ragW + ragGap));

        // Label above
        slide.addText(category, {
          x: xPos, y: ragY - 0.12, w: ragW, h: 0.12,
          fontSize: 6, bold: true, color: '666666', align: 'center'
        });
        // Colored box
        slide.addShape('rect', {
          x: xPos, y: ragY, w: ragW, h: ragH,
          fill: getRagColor(ragValue)
        });
        // Letter
        slide.addText(ragValue.charAt(0), {
          x: xPos, y: ragY, w: ragW, h: ragH,
          fontSize: 10, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle'
        });
      });

      // Right side - Additional Details (below RAG boxes)
      let rightYPos = ragY + ragH + 0.1;
      const detailsX = 7.5;
      const rightCol1W = 1.2;
      const rightCol2W = 1.2;

      // Row 1: Project Status, Work Completed
      slide.addText('Project Status', { x: detailsX, y: rightYPos, w: rightCol1W, h: 0.2, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(slideData.projectStatus || '-', { x: detailsX, y: rightYPos + 0.13, w: rightCol1W, h: 0.2, fontSize: 7, bold: true });

      slide.addText('Work Completed (%)', { x: detailsX + rightCol1W + 0.15, y: rightYPos, w: rightCol2W, h: 0.2, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(String(slideData.workCompleted || '0') + '%', { x: detailsX + rightCol1W + 0.15, y: rightYPos + 0.13, w: rightCol2W, h: 0.2, fontSize: 7, bold: true });

      rightYPos += 0.4;

      // Row 2: Planned Finish Date, Planned Start Date
      slide.addText('Planned Finish Date', { x: detailsX, y: rightYPos, w: rightCol1W, h: 0.2, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(formatDate(slideData.plannedCompletionDate), { x: detailsX, y: rightYPos + 0.13, w: rightCol1W, h: 0.2, fontSize: 7, bold: true });

      slide.addText('Planned Start Date', { x: detailsX + rightCol1W + 0.15, y: rightYPos, w: rightCol2W, h: 0.2, fontSize: labelFontSize, bold: true, color: '666666' });
      slide.addText(formatDate(slideData.plannedStartDate), { x: detailsX + rightCol1W + 0.15, y: rightYPos + 0.13, w: rightCol2W, h: 0.2, fontSize: 7, bold: true });

      // Main content area - 2 columns
      yPos = 2.1;
      const leftColX = 0.5;
      const leftColW = 3.6;
      const rightColX = 4.2;
      const rightColW = 3.2;

      // Project Scope
      slide.addShape('rect', {
        x: leftColX, y: yPos, w: leftColW, h: 0.28,
        fill: 'D6EAF8'
      });
      slide.addText('Project Scope', {
        x: leftColX + 0.05, y: yPos + 0.02, w: leftColW - 0.1, h: 0.24,
        fontSize: 9, bold: true, color: '0070C0', align: 'left', valign: 'middle'
      });
      slide.addText(stripHtml(slideData.projectScope) || 'No scope defined', {
        x: leftColX + 0.05, y: yPos + 0.3, w: leftColW - 0.1, h: 0.85,
        fontSize: 7, color: '000000', align: 'left', valign: 'top'
      });

      // Activities Performed
      yPos += 1.2;
      slide.addShape('rect', {
        x: leftColX, y: yPos, w: leftColW, h: 0.28,
        fill: 'D5F4E6'
      });
      slide.addText('Activities Performed & Milestones Achieved', {
        x: leftColX + 0.05, y: yPos + 0.02, w: leftColW - 0.1, h: 0.24,
        fontSize: 9, bold: true, color: '229954', align: 'left', valign: 'middle'
      });
      slide.addText(stripHtml(slideData.activitiesPerformed) || 'No activities recorded', {
        x: leftColX + 0.05, y: yPos + 0.3, w: leftColW - 0.1, h: 1.05,
        fontSize: 7, color: '000000', align: 'left', valign: 'top'
      });

      // Major Action Items
      yPos += 1.4;
      slide.addShape('rect', {
        x: leftColX, y: yPos, w: leftColW, h: 0.28,
        fill: 'FEF5E7'
      });
      slide.addText('Major Action Items - Upcoming Activities - Comments', {
        x: leftColX + 0.05, y: yPos + 0.02, w: leftColW - 0.1, h: 0.24,
        fontSize: 9, bold: true, color: 'D68910', align: 'left', valign: 'middle'
      });
      slide.addText(stripHtml(slideData.majorActions) || 'No actions recorded', {
        x: leftColX + 0.05, y: yPos + 0.3, w: leftColW - 0.1, h: 0.85,
        fontSize: 7, color: '000000', align: 'left', valign: 'top'
      });

      // Phases/Milestones Table
      let tableYPos = 2.1;
      const phaseRows = [
        [
          { text: 'Phase', options: { bold: true, fontSize: 7, fill: { color: 'E8DAEF' }, color: '000000' } },
          { text: 'R/A/G', options: { bold: true, fontSize: 7, fill: { color: 'E8DAEF' }, color: '000000' } },
          { text: 'Est. Delivery', options: { bold: true, fontSize: 7, fill: { color: 'E8DAEF' }, color: '000000' } },
          { text: 'Remarks', options: { bold: true, fontSize: 7, fill: { color: 'E8DAEF' }, color: '000000' } }
        ]
      ];

      if (slideData.phases && slideData.phases.length > 0) {
        slideData.phases.forEach(phase => {
          phaseRows.push([
            { text: phase.description || '', options: { fontSize: 6 } },
            { text: phase.ragStatus?.charAt(0) || 'G', options: { fontSize: 7, bold: true, fill: { color: getRagColor(phase.ragStatus) }, color: 'FFFFFF', align: 'center' } },
            { text: formatDate(phase.deliveryDate), options: { fontSize: 6 } },
            { text: phase.remarks || '', options: { fontSize: 6 } }
          ]);
        });
      } else {
        phaseRows.push([
          { text: 'No phases defined', options: { fontSize: 6, color: '999999' } },
          { text: '', options: { fontSize: 6 } },
          { text: '', options: { fontSize: 6 } },
          { text: '', options: { fontSize: 6 } }
        ]);
      }

      slide.addShape('rect', {
        x: rightColX, y: tableYPos, w: rightColW, h: 0.28,
        fill: '884EA0'
      });
      slide.addText('Phases/Milestones/Deliverables', {
        x: rightColX + 0.05, y: tableYPos + 0.02, w: rightColW - 0.1, h: 0.24,
        fontSize: 9, bold: true, color: 'FFFFFF', align: 'left', valign: 'middle'
      });

      slide.addTable(phaseRows, {
        x: rightColX, y: tableYPos + 0.3, w: rightColW, h: 2.15,
        border: { pt: 1, color: 'CCCCCC' },
        colW: [1.15, 0.4, 0.75, 0.9]
      });

      // Risks Table
      tableYPos += 2.55;
      const riskRows = [
        [
          { text: 'Risk', options: { bold: true, fontSize: 7, fill: { color: 'F5B7B1' }, color: '000000' } },
          { text: 'Assessment', options: { bold: true, fontSize: 7, fill: { color: 'F5B7B1' }, color: '000000' } },
          { text: 'Control', options: { bold: true, fontSize: 7, fill: { color: 'F5B7B1' }, color: '000000' } }
        ]
      ];

      if (slideData.risks && slideData.risks.length > 0) {
        slideData.risks.forEach(risk => {
          riskRows.push([
            { text: risk.description || '', options: { fontSize: 6 } },
            { text: risk.assessment?.charAt(0) || 'L', options: { fontSize: 7, bold: true, fill: { color: getRiskColor(risk.assessment) }, color: 'FFFFFF', align: 'center' } },
            { text: risk.control || '', options: { fontSize: 6 } }
          ]);
        });
      } else {
        riskRows.push([
          { text: 'No risks defined', options: { fontSize: 6, color: '999999' } },
          { text: '', options: { fontSize: 6 } },
          { text: '', options: { fontSize: 6 } }
        ]);
      }

      slide.addShape('rect', {
        x: rightColX, y: tableYPos, w: rightColW, h: 0.28,
        fill: 'C0392B'
      });
      slide.addText('Risk', {
        x: rightColX + 0.05, y: tableYPos + 0.02, w: rightColW - 0.1, h: 0.24,
        fontSize: 9, bold: true, color: 'FFFFFF', align: 'left', valign: 'middle'
      });

      slide.addTable(riskRows, {
        x: rightColX, y: tableYPos + 0.3, w: rightColW, h: 2.05,
        border: { pt: 1, color: 'CCCCCC' },
        colW: [1.15, 0.5, 1.55]
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

  // Listen for export event
  React.useEffect(() => {
    const handleExportEvent = () => {
      exportToPowerPoint();
    };
    window.addEventListener('exportPowerPoint', handleExportEvent);
    return () => window.removeEventListener('exportPowerPoint', handleExportEvent);
  }, [slideData, project]);

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
