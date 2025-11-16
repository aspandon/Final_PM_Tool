// js/components/DivisionsChart.js

/**
 * DivisionsChart Component
 * Displays a line chart showing the number of projects in progress per division over time
 */

export function DivisionsChart({
  filteredProjects,
  phases,
  earliestDate,
  latestDate,
  isFilterActive,
  filterStartDate,
  filterEndDate,
  darkMode,
  divisionColors
}) {
  // Calculate projects in progress data
  const calculateProjectsInProgress = () => {
    const monthlyData = {};
    const divisions = [...new Set(filteredProjects.map(p => p.division).filter(d => d))];
    
    if (divisions.length === 0) {
      return { chartData: [], divisions: [] };
    }
    
    const earliest = (isFilterActive && filterStartDate) 
      ? new Date(filterStartDate) 
      : new Date(earliestDate);
    const latest = (isFilterActive && filterEndDate) 
      ? new Date(filterEndDate) 
      : new Date(latestDate);
    
    earliest.setDate(1);
    earliest.setHours(0, 0, 0, 0);
    latest.setDate(1);
    latest.setHours(0, 0, 0, 0);
    
    let curr = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    while (curr <= latest) {
      const monthKey = curr.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { 
        month: monthKey, 
        date: new Date(curr)
      };
      divisions.forEach(div => {
        monthlyData[monthKey][div] = 0;
      });
      curr.setMonth(curr.getMonth() + 1);
    }

    // Count projects in progress for each division
    filteredProjects.forEach(project => {
      if (!project.division) return;
      
      let projectStart = null;
      let projectFinish = null;
      
      // Find earliest start and latest finish across all phases
      phases.forEach(phase => {
        if (project[phase.key].start) {
          const phaseStart = new Date(project[phase.key].start);
          if (!projectStart || phaseStart < projectStart) {
            projectStart = phaseStart;
          }
        }
        if (project[phase.key].finish) {
          const phaseFinish = new Date(project[phase.key].finish);
          if (!projectFinish || phaseFinish > projectFinish) {
            projectFinish = phaseFinish;
          }
        }
      });
      
      if (projectStart && projectFinish) {
        const c = new Date(Math.max(projectStart.getFullYear(), earliest.getFullYear()), 
                          Math.max(projectStart.getMonth(), earliest.getMonth()), 1);
        const endDate = new Date(Math.min(projectFinish.getFullYear(), latest.getFullYear()), 
                          Math.min(projectFinish.getMonth(), latest.getMonth()) + 1, 0);
        
        let curr2 = new Date(c);
        while (curr2 <= endDate) {
          const monthKey = curr2.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          const monthStart = new Date(curr2.getFullYear(), curr2.getMonth(), 1);
          const monthEnd = new Date(curr2.getFullYear(), curr2.getMonth() + 1, 0);
          
          // Check if project is active during this month
          if (projectStart <= monthEnd && projectFinish >= monthStart) {
            if (monthlyData[monthKey]) {
              monthlyData[monthKey][project.division]++;
            }
          }
          
          curr2.setMonth(curr2.getMonth() + 1);
        }
      }
    });

    // Convert to chart data format
    const chartData = Object.values(monthlyData)
      .sort((a, b) => a.date - b.date)
      .map(item => {
        const result = { month: item.month };
        divisions.forEach(div => {
          result[div] = item[div] || 0;
        });
        return result;
      });

    return { chartData, divisions };
  };

  const { chartData, divisions } = calculateProjectsInProgress();

  // Don't render if no data
  if (filteredProjects.length === 0 || chartData.length === 0 || divisions.length === 0) {
    return null;
  }

  // Access Recharts components from global scope
  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  return React.createElement('div', { className: 'border-t pt-6 mt-6' },
    // Header
    React.createElement('h2', {
      className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
    },
      React.createElement('div', {
        className: 'w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full'
      }),
      'Projects in Progress Per Division (including preparatory phases)'
    ),

    // Chart container
    React.createElement('div', {
      className: `${darkMode ? 'bg-slate-800' : 'bg-white'} p-5 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-gray-200'} shadow-md`
    },
      React.createElement(ResponsiveContainer, { width: '100%', height: 400 },
        React.createElement(LineChart, {
          data: chartData,
          margin: { top: 5, right: 30, left: 20, bottom: 5 }
        },
          React.createElement(CartesianGrid, {
            strokeDasharray: '3 3',
            stroke: darkMode ? '#475569' : '#e5e7eb'
          }),
          React.createElement(XAxis, {
            dataKey: 'month',
            angle: -45,
            textAnchor: 'end',
            height: 80,
            style: { fontSize: '12px', fill: darkMode ? '#e5e7eb' : '#374151' },
            stroke: darkMode ? '#94a3b8' : '#9ca3af'
          }),
          React.createElement(YAxis, {
            label: { 
              value: 'Number of Projects in Progress', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: darkMode ? '#e5e7eb' : '#374151' }
            },
            style: { fontSize: '12px', fill: darkMode ? '#e5e7eb' : '#374151' },
            stroke: darkMode ? '#94a3b8' : '#9ca3af',
            allowDecimals: false
          }),
          React.createElement(Tooltip, {
            contentStyle: { 
              fontSize: '12px', 
              backgroundColor: darkMode ? '#1e293b' : '#ffffff', 
              border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
              color: darkMode ? '#e5e7eb' : '#374151'
            },
            formatter: (value) => `${value} projects`,
            labelStyle: { color: darkMode ? '#e5e7eb' : '#374151' }
          }),
          React.createElement(Legend, {
            wrapperStyle: { fontSize: '12px', color: darkMode ? '#e5e7eb' : '#374151' },
            iconType: 'line'
          }),
          // Create a Line for each division
          ...divisions.map((division, idx) =>
            React.createElement(Line, {
              key: division,
              type: 'monotone',
              dataKey: division,
              stroke: divisionColors[idx % divisionColors.length],
              strokeWidth: 3,
              dot: { r: 4 },
              activeDot: { r: 6 }
            })
          )
        )
      ),

      // Information section
      React.createElement('div', { className: 'mt-4 space-y-2' },
        // Divisions tracked
        React.createElement('div', {
          className: `text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
        },
          React.createElement('strong', null, 'Divisions tracked:'),
          ' ',
          divisions.join(', ')
        ),

        // Note
        React.createElement('div', {
          className: `text-xs ${darkMode ? 'text-gray-300 bg-slate-700' : 'text-gray-600 bg-gray-50'} p-2 rounded`
        },
          React.createElement('strong', null, 'Note:'),
          ' This chart shows the number of projects in progress each month per division. A project is considered "in progress" during any month that falls between its earliest start date and latest finish date across all phases.',
          isFilterActive && (filterStartDate || filterEndDate) && 
            ` The view is limited to the filtered date range: ${filterStartDate || 'Start'} to ${filterEndDate || 'End'}.`
        )
      )
    )
  );
}