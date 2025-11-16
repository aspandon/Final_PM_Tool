// js/components/ActualsTimeline.js

/**
 * ActualsTimeline Component
 * Displays a comparison timeline showing Implementation (Actual), PM Plan, and Initial Official Plan dates
 * with delay calculations and visual indicators
 */

export function ActualsTimeline({
  filteredProjects,
  isFilterActive,
  filterStartDate,
  filterEndDate,
  darkMode
}) {
  // Filter projects that have at least one set of dates
  const projectsWithDates = filteredProjects.filter(p => 
    (p.implementation.start && p.implementation.finish) ||
    (p.plannedInvestment.start && p.plannedInvestment.finish) ||
    (p.actualDates.start && p.actualDates.finish)
  );

  if (projectsWithDates.length === 0) return null;

  /**
   * Get all dates from projects for timeline calculation
   */
  const getAllDates = () => {
    const allDates = [];
    projectsWithDates.forEach(p => {
      if (p.implementation.start) allDates.push(new Date(p.implementation.start));
      if (p.implementation.finish) allDates.push(new Date(p.implementation.finish));
      if (p.plannedInvestment.start) allDates.push(new Date(p.plannedInvestment.start));
      if (p.plannedInvestment.finish) allDates.push(new Date(p.plannedInvestment.finish));
      if (p.actualDates.start) allDates.push(new Date(p.actualDates.start));
      if (p.actualDates.finish) allDates.push(new Date(p.actualDates.finish));
    });
    return allDates;
  };

  /**
   * Get earliest and latest dates for timeline
   */
  const getTimelineBounds = () => {
    const allDates = getAllDates();
    
    let earliest, latest;
    
    if (isFilterActive && (filterStartDate || filterEndDate)) {
      earliest = filterStartDate ? new Date(filterStartDate) : new Date(Math.min(...allDates));
      latest = filterEndDate ? new Date(filterEndDate) : new Date(Math.max(...allDates));
    } else {
      earliest = new Date(Math.min(...allDates));
      latest = new Date(Math.max(...allDates));
    }
    
    return { earliest, latest };
  };

  /**
   * Generate month labels for timeline header
   */
  const generateMonthLabels = (earliest, latest) => {
    const months = [];
    const current = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    
    while (current <= latest) {
      months.push({
        label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        date: new Date(current)
      });
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  /**
   * Calculate bar position for timeline
   */
  const getPosition = (start, finish, earliest, latest) => {
    if (!start || !finish) return null;
    const s = new Date(start);
    const f = new Date(finish);
    const totalDays = Math.ceil((latest - earliest) / (1000 * 60 * 60 * 24)) + 1;
    const startOffset = Math.ceil((s - earliest) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((f - s) / (1000 * 60 * 60 * 24)) + 1;
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
      duration
    };
  };

  /**
   * Calculate delay between two date ranges
   */
  const calculateDelay = (baseStart, baseFinish, compareStart, compareFinish) => {
    if (!baseStart || !baseFinish || !compareStart || !compareFinish) return null;
    const baseS = new Date(baseStart);
    const baseF = new Date(baseFinish);
    const compS = new Date(compareStart);
    const compF = new Date(compareFinish);
    
    const startDelay = Math.ceil((compS - baseS) / (1000 * 60 * 60 * 24));
    const finishDelay = Math.ceil((compF - baseF) / (1000 * 60 * 60 * 24));
    
    return { startDelay, finishDelay };
  };

  /**
   * Create delay badge object
   */
  const createDelayBadge = (label, value, isDelay) => ({
    label,
    value: `${value > 0 ? '+' : ''}${value}d`,
    isDelay
  });

  /**
   * Generate month grid lines
   */
  const renderMonthLines = (months, earliest, totalDays) => {
    return months.map((month, i) => {
      const offset = Math.ceil((month.date - earliest) / (1000 * 60 * 60 * 24));
      const leftPosition = (offset / totalDays) * 100;
      
      return React.createElement('div', {
        key: i,
        className: `absolute top-0 bottom-0 w-px ${darkMode ? 'bg-slate-500' : 'bg-gray-300'}`,
        style: { left: `${leftPosition}%` }
      });
    });
  };

  const { earliest, latest } = getTimelineBounds();
  const months = generateMonthLabels(earliest, latest);
  const totalDays = Math.ceil((latest - earliest) / (1000 * 60 * 60 * 24)) + 1;

  return React.createElement('div', { className: 'border-t pt-6 mt-6' },
    // Header
    React.createElement('h2', {
      className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
    },
      React.createElement('div', {
        className: 'w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full'
      }),
      'Project Timeline Comparison: Implementation (Actual) vs PM Plan vs Initial Official Plan'
    ),

    // Container
    React.createElement('div', {
      className: `${darkMode ? 'bg-slate-800' : 'bg-white'} p-5 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-gray-200'} shadow-md`
    },
      // Legend
      React.createElement('div', {
        className: `flex gap-4 mb-3 p-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded border ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
      },
        React.createElement('div', { className: 'flex items-center gap-1' },
          React.createElement('div', { className: 'w-3 h-3 bg-purple-500 rounded' }),
          React.createElement('span', {
            className: `text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`
          }, 'Implementation (Actual)')
        ),
        React.createElement('div', { className: 'flex items-center gap-1' },
          React.createElement('div', { className: 'w-3 h-3 bg-green-500 rounded' }),
          React.createElement('span', {
            className: `text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`
          }, 'PM Plan (In. Proposal)')
        ),
        React.createElement('div', { className: 'flex items-center gap-1' },
          React.createElement('div', { className: 'w-3 h-3 bg-blue-500 rounded' }),
          React.createElement('span', {
            className: `text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`
          }, 'Initial Official Plan')
        )
      ),

      // Timeline container
      React.createElement('div', { className: 'overflow-x-auto' },
        React.createElement('div', { className: 'min-w-[1000px]' },
          // Month header
          React.createElement('div', { className: 'flex mb-2' },
            React.createElement('div', { className: 'w-64 flex-shrink-0' }),
            React.createElement('div', {
              className: `flex-1 flex border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} pb-1`
            },
              months.map((month, i) => 
                React.createElement('div', {
                  key: i,
                  className: `flex-1 text-xs ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-center font-semibold`
                }, month.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }))
              )
            )
          ),

          // Projects
          projectsWithDates.map((project, pIndex) => {
            const implPos = getPosition(project.implementation.start, project.implementation.finish, earliest, latest);
            const plannedPos = getPosition(project.plannedInvestment.start, project.plannedInvestment.finish, earliest, latest);
            const actualPos = getPosition(project.actualDates.start, project.actualDates.finish, earliest, latest);

            const implToPlanned = calculateDelay(
              project.implementation.start, 
              project.implementation.finish,
              project.plannedInvestment.start,
              project.plannedInvestment.finish
            );

            const plannedToActual = calculateDelay(
              project.plannedInvestment.start,
              project.plannedInvestment.finish,
              project.actualDates.start,
              project.actualDates.finish
            );

            const implToActual = calculateDelay(
              project.implementation.start,
              project.implementation.finish,
              project.actualDates.start,
              project.actualDates.finish
            );

            const startDelayBadges = [];
            const finishDelayBadges = [];
            const delayBadges = [];
            
            if (implToPlanned) {
              if (implToPlanned.startDelay !== 0) {
                startDelayBadges.push(createDelayBadge('I→P', implToPlanned.startDelay, implToPlanned.startDelay > 0));
              }
              if (implToPlanned.finishDelay !== 0) {
                finishDelayBadges.push(createDelayBadge('I→P', implToPlanned.finishDelay, implToPlanned.finishDelay > 0));
                delayBadges.push(createDelayBadge('I→P', implToPlanned.finishDelay, implToPlanned.finishDelay > 0));
              }
            }
            
            if (plannedToActual) {
              if (plannedToActual.startDelay !== 0) {
                startDelayBadges.push(createDelayBadge('P→A', plannedToActual.startDelay, plannedToActual.startDelay > 0));
              }
              if (plannedToActual.finishDelay !== 0) {
                finishDelayBadges.push(createDelayBadge('P→A', plannedToActual.finishDelay, plannedToActual.finishDelay > 0));
                delayBadges.push(createDelayBadge('P→A', plannedToActual.finishDelay, plannedToActual.finishDelay > 0));
              }
            }
            
            if (implToActual) {
              if (implToActual.startDelay !== 0) {
                startDelayBadges.push(createDelayBadge('I→A', implToActual.startDelay, implToActual.startDelay > 0));
              }
              if (implToActual.finishDelay !== 0) {
                finishDelayBadges.push(createDelayBadge('I→A', implToActual.finishDelay, implToActual.finishDelay > 0));
                delayBadges.push(createDelayBadge('I→A', implToActual.finishDelay, implToActual.finishDelay > 0));
              }
            }

            return React.createElement('div', {
              key: pIndex,
              className: `mb-4 ${darkMode ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-gray-50 border-gray-100'} rounded p-2 border`
            },
              // Project header with badges
              React.createElement('div', {
                className: 'flex items-center justify-between mb-2'
              },
                React.createElement('div', { className: 'flex-1 min-w-0' },
                  React.createElement('div', {
                    className: `text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                  }, project.name),
                  React.createElement('div', {
                    className: `text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                  }, project.division)
                ),
                React.createElement('div', { className: 'flex gap-2 ml-2 items-center' },
                  // Start delay badges
                  startDelayBadges.length > 0 && React.createElement('div', {
                    className: 'flex gap-1 items-center'
                  },
                    React.createElement('span', {
                      className: `text-[9px] ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-semibold`
                    }, 'Start:'),
                    startDelayBadges.map((badge, idx) =>
                      React.createElement('div', {
                        key: idx,
                        className: `text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                          badge.isDelay ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`,
                        title: `Start date difference - ${badge.label === 'I→P' ? 'Implementation to Planned' : badge.label === 'P→A' ? 'Planned to Actual' : 'Implementation to Actual'}: ${badge.value}`
                      },
                        React.createElement('span', { className: 'text-[9px] opacity-70' }, badge.label),
                        ' ',
                        badge.value
                      )
                    )
                  ),
                  // Finish delay badges
                  finishDelayBadges.length > 0 && React.createElement('div', {
                    className: 'flex gap-1 items-center'
                  },
                    React.createElement('span', {
                      className: `text-[9px] ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-semibold`
                    }, 'Finish:'),
                    finishDelayBadges.map((badge, idx) =>
                      React.createElement('div', {
                        key: idx,
                        className: `text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                          badge.isDelay ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`,
                        title: `Finish date difference - ${badge.label === 'I→P' ? 'Implementation to Planned' : badge.label === 'P→A' ? 'Planned to Actual' : 'Implementation to Actual'}: ${badge.value}`
                      },
                        React.createElement('span', { className: 'text-[9px] opacity-70' }, badge.label),
                        ' ',
                        badge.value
                      )
                    )
                  ),
                  // Total delay badges
                  delayBadges.length > 0 && React.createElement('div', {
                    className: 'flex gap-1 items-center'
                  },
                    React.createElement('span', {
                      className: `text-[9px] ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-semibold`
                    }, 'Total:'),
                    delayBadges.map((badge, idx) =>
                      React.createElement('div', {
                        key: idx,
                        className: `text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                          badge.isDelay ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`,
                        title: `Overall duration difference - ${badge.label === 'I→P' ? 'Implementation to Planned' : badge.label === 'P→A' ? 'Planned to Actual' : 'Implementation to Actual'}: ${badge.value}`
                      },
                        React.createElement('span', { className: 'text-[9px] opacity-70' }, badge.label),
                        ' ',
                        badge.value
                      )
                    )
                  )
                )
              ),

              // Timeline bars
              React.createElement('div', { className: 'space-y-0.5' },
                // Implementation bar
                implPos && React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement('div', {
                    className: `w-32 flex-shrink-0 text-[10px] ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`
                  }, 'Implementation (Actual)'),
                  React.createElement('div', {
                    className: `flex-1 relative h-3 rounded border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`
                  },
                    renderMonthLines(months, earliest, totalDays),
                    React.createElement('div', {
                      className: 'absolute rounded bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition cursor-pointer flex items-center justify-center text-white text-[8px] font-semibold shadow-md',
                      style: { 
                        left: implPos.left, 
                        width: implPos.width,
                        top: '1px',
                        height: '10px'
                      },
                      title: `Implementation (Actual): ${project.implementation.start} to ${project.implementation.finish} (${implPos.duration}d)`
                    }, `${implPos.duration}d`)
                  )
                ),
                // Planned bar
                plannedPos && React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement('div', {
                    className: `w-32 flex-shrink-0 text-[10px] ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`
                  }, 'PM Plan (In. Proposal)'),
                  React.createElement('div', {
                    className: `flex-1 relative h-3 rounded border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`
                  },
                    renderMonthLines(months, earliest, totalDays),
                    React.createElement('div', {
                      className: 'absolute rounded bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition cursor-pointer flex items-center justify-center text-white text-[8px] font-semibold shadow-md',
                      style: { 
                        left: plannedPos.left, 
                        width: plannedPos.width,
                        top: '1px',
                        height: '10px'
                      },
                      title: `PM Plan (In. Proposal): ${project.plannedInvestment.start} to ${project.plannedInvestment.finish} (${plannedPos.duration}d)`
                    }, `${plannedPos.duration}d`)
                  )
                ),
                // Actual bar
                actualPos && React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement('div', {
                    className: `w-32 flex-shrink-0 text-[10px] ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`
                  }, 'Initial Official Plan'),
                  React.createElement('div', {
                    className: `flex-1 relative h-3 rounded border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`
                  },
                    renderMonthLines(months, earliest, totalDays),
                    React.createElement('div', {
                      className: 'absolute rounded bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition cursor-pointer flex items-center justify-center text-white text-[8px] font-semibold shadow-md',
                      style: { 
                        left: actualPos.left, 
                        width: actualPos.width,
                        top: '1px',
                        height: '10px'
                      },
                      title: `Initial Official Plan: ${project.actualDates.start} to ${project.actualDates.finish} (${actualPos.duration}d)`
                    }, `${actualPos.duration}d`)
                  )
                )
              )
            );
          })
        )
      ),

      // Footer note
      React.createElement('div', {
        className: `mt-3 text-xs ${darkMode ? 'text-gray-300 bg-slate-700' : 'text-gray-600 bg-gray-50'} p-2 rounded`
      },
        React.createElement('strong', null, 'Understanding the Comparison:'),
        ' Each project shows overlapping date ranges. Delays are shown on the right (positive = delayed, negative = early). Hover over bars to see exact dates and durations.',
        isFilterActive && (filterStartDate || filterEndDate) && 
          ` Timeline is constrained to filtered date range: ${filterStartDate || 'Start'} to ${filterEndDate || 'End'}.`
      )
    )
  );
}