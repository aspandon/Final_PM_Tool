// js/components/GanttTimeline.js

/**
 * GanttTimeline Component
 * Displays a Gantt chart visualization of projects with their phases across a timeline
 */

export function GanttTimeline({
  filteredProjects,
  phases,
  monthLabels,
  getBarPosition,
  getDaysDiff,
  getEarliestDate,
  getLatestDate,
  darkMode
}) {
  if (filteredProjects.length === 0) return null;

  const earliest = getEarliestDate();
  const latest = getLatestDate();
  const totalDays = getDaysDiff(earliest, latest);

  /**
   * Get today's position on the timeline
   */
  const getTodayPosition = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (today >= earliest && today <= latest) {
      const offset = getDaysDiff(earliest, today) - 1;
      const leftPosition = (offset / totalDays) * 100;
      return leftPosition;
    }
    return null;
  };

  /**
   * Check if a phase is before today (completed)
   */
  const isPhaseBeforeToday = (finishDate) => {
    if (!finishDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const phaseFinish = new Date(finishDate);
    phaseFinish.setHours(0, 0, 0, 0);
    return phaseFinish < today;
  };

  /**
   * Render month grid lines
   */
  const renderMonthLines = () => {
    return monthLabels.map((month, i) => {
      const offset = getDaysDiff(earliest, month.date) - 1;
      const leftPosition = (offset / totalDays) * 100;
      
      return React.createElement('div', {
        key: i,
        className: `absolute top-0 bottom-0 w-px ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`,
        style: { left: `${leftPosition}%` }
      });
    });
  };

  const todayPosition = getTodayPosition();

  return React.createElement('div', { className: 'border-t pt-6' },
    // Header
    React.createElement('h2', {
      className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
    },
      React.createElement('div', {
        className: 'w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full'
      }),
      'Projects Timeline'
    ),

    // Phase Legend
    React.createElement('div', {
      className: `mb-4 flex gap-3 flex-wrap items-center ${darkMode ? 'bg-slate-800/50' : 'bg-blue-50/50'} p-3 rounded-lg border ${darkMode ? 'border-slate-600' : 'border-blue-200'}`
    },
      phases.map((phase) =>
        React.createElement('div', {
          key: phase.key,
          className: 'flex items-center gap-1.5'
        },
          React.createElement('div', {
            className: `w-3 h-3 ${phase.color} rounded shadow-sm`
          }),
          React.createElement('span', {
            className: `text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-black'}`
          }, phase.label)
        )
      )
    ),

    // Chart container
    React.createElement('div', {
      className: `overflow-x-auto ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-md p-4 border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
    },
      React.createElement('div', { className: 'min-w-[1000px]' },
        // Month header row
        React.createElement('div', { className: 'flex mb-2' },
          // Empty space for project names
          React.createElement('div', { className: 'w-40 flex-shrink-0' }),
          // Month labels
          React.createElement('div', {
            className: `flex-1 flex border-b ${darkMode ? 'border-slate-600' : 'border-gray-300'} pb-1`
          },
            monthLabels.map((month, i) =>
              React.createElement('div', {
                key: i,
                className: `flex-1 text-xs ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-center font-semibold`
              }, month.label)
            )
          )
        ),

        // Project rows
        filteredProjects.map((project, pIndex) =>
          React.createElement('div', {
            key: pIndex,
            className: 'flex items-center mb-1'
          },
            // Project name column
            React.createElement('div', {
              className: 'w-40 flex-shrink-0 pr-2'
            },
              React.createElement('div', {
                className: `text-[11px] font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} truncate`
              }, project.name),
              React.createElement('div', {
                className: `text-[9px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              }, project.division)
            ),

            // Timeline area
            React.createElement('div', {
              className: `flex-1 relative h-5 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} rounded border`
            },
              // Month grid lines
              renderMonthLines(),

              // Today indicator (red line)
              todayPosition !== null && React.createElement('div', {
                className: `absolute top-0 bottom-0 w-0.5 ${darkMode ? 'bg-red-400' : 'bg-red-500'} z-10`,
                style: { left: `${todayPosition}%` },
                title: `Today: ${new Date().toLocaleDateString()}`
              }),

              // Phase bars
              phases.map((phase) => {
                if (!project[phase.key].start || !project[phase.key].finish) return null;
                
                const position = getBarPosition(
                  project[phase.key].start,
                  project[phase.key].finish
                );
                
                if (!position.visible) return null;

                const isComplete = isPhaseBeforeToday(project[phase.key].finish);
                const duration = getDaysDiff(
                  project[phase.key].start,
                  project[phase.key].finish
                );

                return React.createElement('div', {
                  key: phase.key,
                  className: `absolute h-full ${phase.color} rounded flex items-center justify-center text-white text-[10px] font-semibold hover:opacity-90 transition cursor-pointer`,
                  style: {
                    left: position.left,
                    width: position.width,
                    opacity: isComplete ? 0.3 : 1
                  },
                  title: `${phase.label}: ${project[phase.key].start} to ${project[phase.key].finish}`
                }, `${duration}d`);
              })
            )
          )
        )
      )
    )
  );
}