// js/components/ResourcesChart.js

/**
 * ResourcesChart Component
 * Displays a line chart showing FTE (Full-Time Equivalent) effort per person over time
 * including Project Managers, Business Partners, and External Resources
 */

export function ResourcesChart({
  filteredProjects,
  filteredProjectsForExternal,
  earliestDate,
  latestDate,
  isFilterActive,
  filterStartDate,
  filterEndDate,
  pmBAU,
  bpBAU,
  showExternalPM,
  showExternalQA,
  darkMode,
  colors
}) {
  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  /**
   * Calculate resource effort data
   */
  const calculateResourceEffort = () => {
    const effortData = {};
    
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
    
    // Get unique team members
    const activePMs = [...new Set(filteredProjects.map(p => p.projectManager).filter(pm => pm))];
    const activeBPs = [...new Set(filteredProjects.map(p => p.businessPartner).filter(bp => bp))];
    
    // Initialize monthly data
    let curr = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    while (curr <= latest) {
      const monthKey = curr.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      effortData[monthKey] = { 
        month: monthKey, 
        date: new Date(curr),
        pmExternal: 0,
        qaExternal: 0
      };
      activePMs.forEach(pm => {
        effortData[monthKey][pm] = 0;
      });
      activeBPs.forEach(bp => {
        effortData[monthKey][bp] = 0;
      });
      curr.setMonth(curr.getMonth() + 1);
    }

    // Calculate PM effort during Implementation phase
    filteredProjects.forEach(project => {
      if (project.projectManager && project.pmAllocation && project.implementation.start && project.implementation.finish) {
        const pmAlloc = parseFloat(project.pmAllocation) || 0;
        const start = new Date(project.implementation.start);
        const finish = new Date(project.implementation.finish);
        
        start.setHours(0, 0, 0, 0);
        finish.setHours(0, 0, 0, 0);
        
        if (finish >= earliest && start <= latest) {
          let c = new Date(Math.max(start.getTime(), earliest.getTime()));
          c.setDate(1);
          c.setHours(0, 0, 0, 0);
          
          const finalMonth = new Date(Math.min(finish.getTime(), latest.getTime()));
          finalMonth.setDate(1);
          finalMonth.setHours(0, 0, 0, 0);
          
          while (c <= finalMonth) {
            const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (effortData[monthKey]) {
              effortData[monthKey][project.projectManager] += pmAlloc;
            }
            
            c.setMonth(c.getMonth() + 1);
          }
        }
      }
    });

    // Calculate BP effort during PSD phase
    filteredProjects.forEach(project => {
      if (project.businessPartner && project.bpAllocation && project.psd.start && project.psd.finish) {
        const bpAlloc = parseFloat(project.bpAllocation) || 0;
        const start = new Date(project.psd.start);
        const finish = new Date(project.psd.finish);
        
        start.setHours(0, 0, 0, 0);
        finish.setHours(0, 0, 0, 0);
        
        if (finish >= earliest && start <= latest) {
          let c = new Date(Math.max(start.getTime(), earliest.getTime()));
          c.setDate(1);
          c.setHours(0, 0, 0, 0);
          
          const finalMonth = new Date(Math.min(finish.getTime(), latest.getTime()));
          finalMonth.setDate(1);
          finalMonth.setHours(0, 0, 0, 0);
          
          while (c <= finalMonth) {
            const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (effortData[monthKey]) {
              effortData[monthKey][project.businessPartner] += bpAlloc;
            }
            
            c.setMonth(c.getMonth() + 1);
          }
        }
      }
    });

    // Calculate BP effort during BP Implementation phase
    filteredProjects.forEach(project => {
      if (project.businessPartner && project.bpImplementationAllocation && project.bpImplementation.start && project.bpImplementation.finish) {
        const bpImplAlloc = parseFloat(project.bpImplementationAllocation) || 0;
        const start = new Date(project.bpImplementation.start);
        const finish = new Date(project.bpImplementation.finish);
        
        start.setHours(0, 0, 0, 0);
        finish.setHours(0, 0, 0, 0);
        
        if (finish >= earliest && start <= latest) {
          let c = new Date(Math.max(start.getTime(), earliest.getTime()));
          c.setDate(1);
          c.setHours(0, 0, 0, 0);
          
          const finalMonth = new Date(Math.min(finish.getTime(), latest.getTime()));
          finalMonth.setDate(1);
          finalMonth.setHours(0, 0, 0, 0);
          
          while (c <= finalMonth) {
            const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (effortData[monthKey]) {
              effortData[monthKey][project.businessPartner] += bpImplAlloc;
            }
            
            c.setMonth(c.getMonth() + 1);
          }
        }
      }
    });

    // Calculate PM External effort
    filteredProjectsForExternal.forEach(project => {
      if (project.pmExternalAllocation && project.implementation.start && project.implementation.finish) {
        const pmExtAlloc = parseFloat(project.pmExternalAllocation) || 0;
        if (pmExtAlloc > 0) {
          const start = new Date(project.implementation.start);
          const finish = new Date(project.implementation.finish);
          
          start.setHours(0, 0, 0, 0);
          finish.setHours(0, 0, 0, 0);
          
          if (finish >= earliest && start <= latest) {
            let c = new Date(Math.max(start.getTime(), earliest.getTime()));
            c.setDate(1);
            c.setHours(0, 0, 0, 0);
            
            const finalMonth = new Date(Math.min(finish.getTime(), latest.getTime()));
            finalMonth.setDate(1);
            finalMonth.setHours(0, 0, 0, 0);
            
            while (c <= finalMonth) {
              const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
              
              if (effortData[monthKey]) {
                effortData[monthKey].pmExternal += pmExtAlloc;
              }
              
              c.setMonth(c.getMonth() + 1);
            }
          }
        }
      }
    });

    // Calculate QA External effort
    filteredProjectsForExternal.forEach(project => {
      if (project.qaExternalAllocation && project.implementation.start && project.implementation.finish) {
        const qaExtAlloc = parseFloat(project.qaExternalAllocation) || 0;
        if (qaExtAlloc > 0) {
          const start = new Date(project.implementation.start);
          const finish = new Date(project.implementation.finish);
          
          start.setHours(0, 0, 0, 0);
          finish.setHours(0, 0, 0, 0);
          
          if (finish >= earliest && start <= latest) {
            let c = new Date(Math.max(start.getTime(), earliest.getTime()));
            c.setDate(1);
            c.setHours(0, 0, 0, 0);
            
            const finalMonth = new Date(Math.min(finish.getTime(), latest.getTime()));
            finalMonth.setDate(1);
            finalMonth.setHours(0, 0, 0, 0);
            
            while (c <= finalMonth) {
              const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
              
              if (effortData[monthKey]) {
                effortData[monthKey].qaExternal += qaExtAlloc;
              }
              
              c.setMonth(c.getMonth() + 1);
            }
          }
        }
      }
    });

    // Add BAU allocation
    if (pmBAU) {
      const pmBAUValue = parseFloat(pmBAU) || 0;
      
      Object.keys(effortData).forEach(monthKey => {
        activePMs.forEach(pm => {
          effortData[monthKey][pm] += pmBAUValue;
        });
      });
    }

    if (bpBAU) {
      const bpBAUValue = parseFloat(bpBAU) || 0;
      
      Object.keys(effortData).forEach(monthKey => {
        activeBPs.forEach(bp => {
          effortData[monthKey][bp] += bpBAUValue;
        });
      });
    }

    // Convert to chart data format
    const chartData = Object.values(effortData)
      .sort((a, b) => a.date - b.date)
      .map(item => {
        const result = { month: item.month };
        
        let totalPM = 0;
        activePMs.forEach(pm => {
          const pmValue = Math.round((item[pm] || 0) * 100) / 100;
          result[`${pm} (PM)`] = pmValue;
          totalPM += pmValue;
        });
        
        let totalBP = 0;
        activeBPs.forEach(bp => {
          const bpValue = Math.round((item[bp] || 0) * 100) / 100;
          result[`${bp} (BP)`] = bpValue;
          totalBP += bpValue;
        });
        
        result['Total PM'] = Math.round(totalPM * 100) / 100;
        result['Total BP'] = Math.round(totalBP * 100) / 100;
        result['PM External'] = Math.round((item.pmExternal || 0) * 100) / 100;
        result['QA External'] = Math.round((item.qaExternal || 0) * 100) / 100;
        
        return result;
      });

    return { chartData, activePMs, activeBPs };
  };

  const { chartData, activePMs, activeBPs } = calculateResourceEffort();

  // Don't render if no data
  if (filteredProjects.length === 0 || (activePMs.length === 0 && activeBPs.length === 0 && !showExternalPM && !showExternalQA)) {
    return null;
  }

  // Calculate max value for Y-axis
  const maxValue = Math.max(
    ...chartData.map(item => {
      let max = 0;
      activePMs.forEach(pm => {
        max = Math.max(max, item[`${pm} (PM)`] || 0);
      });
      activeBPs.forEach(bp => {
        max = Math.max(max, item[`${bp} (BP)`] || 0);
      });
      max = Math.max(max, item['Total PM'] || 0, item['Total BP'] || 0);
      if (showExternalPM) {
        max = Math.max(max, item['PM External'] || 0);
      }
      if (showExternalQA) {
        max = Math.max(max, item['QA External'] || 0);
      }
      return max;
    })
  );
  const yAxisMax = Math.ceil(maxValue * 1.1 * 4) / 4; // Round up to nearest 0.25 with 10% padding

  return React.createElement('div', { className: 'border-t pt-6 mt-6' },
    // Header
    React.createElement('h2', {
      className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
    },
      React.createElement('div', {
        className: 'w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full'
      }),
      'Resource Effort per Person (FTE)'
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
              value: 'FTE (Full-Time Equivalent)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: darkMode ? '#e5e7eb' : '#374151' }
            },
            style: { fontSize: '12px', fill: darkMode ? '#e5e7eb' : '#374151' },
            stroke: darkMode ? '#94a3b8' : '#9ca3af',
            domain: [0, yAxisMax]
          }),
          React.createElement(Tooltip, {
            contentStyle: { 
              fontSize: '12px', 
              backgroundColor: darkMode ? '#1e293b' : '#ffffff', 
              border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
              color: darkMode ? '#e5e7eb' : '#374151'
            },
            formatter: (value) => `${value} FTE`,
            labelStyle: { color: darkMode ? '#e5e7eb' : '#374151' }
          }),
          React.createElement(Legend, {
            wrapperStyle: { fontSize: '12px', color: darkMode ? '#e5e7eb' : '#374151' },
            iconType: 'line'
          }),

          // Total PM Line (thick)
          React.createElement(Line, {
            key: 'total-pm',
            type: 'monotone',
            dataKey: 'Total PM',
            stroke: '#1e40af',
            strokeWidth: 5,
            dot: { r: 6, fill: '#1e40af', strokeWidth: 2, stroke: '#fff' },
            activeDot: { r: 8 }
          }),

          // Total BP Line (thick)
          React.createElement(Line, {
            key: 'total-bp',
            type: 'monotone',
            dataKey: 'Total BP',
            stroke: '#047857',
            strokeWidth: 5,
            dot: { r: 6, fill: '#047857', strokeWidth: 2, stroke: '#fff' },
            activeDot: { r: 8 }
          }),

          // PM External Line (medium-thick)
          showExternalPM && React.createElement(Line, {
            key: 'pm-external',
            type: 'monotone',
            dataKey: 'PM External',
            stroke: '#dc2626',
            strokeWidth: 4,
            dot: { r: 5, fill: '#dc2626', strokeWidth: 2, stroke: '#fff' },
            activeDot: { r: 7 }
          }),

          // QA External Line (medium-thick)
          showExternalQA && React.createElement(Line, {
            key: 'qa-external',
            type: 'monotone',
            dataKey: 'QA External',
            stroke: '#ea580c',
            strokeWidth: 4,
            dot: { r: 5, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' },
            activeDot: { r: 7 }
          }),

          // Individual PM Lines (thin)
          ...activePMs.map((pm, idx) =>
            React.createElement(Line, {
              key: `pm-${pm}`,
              type: 'monotone',
              dataKey: `${pm} (PM)`,
              stroke: colors[idx % colors.length],
              strokeWidth: 2,
              dot: { r: 3 },
              activeDot: { r: 5 }
            })
          ),

          // Individual BP Lines (thin, dashed)
          ...activeBPs.map((bp, idx) =>
            React.createElement(Line, {
              key: `bp-${bp}`,
              type: 'monotone',
              dataKey: `${bp} (BP)`,
              stroke: colors[(activePMs.length + idx) % colors.length],
              strokeWidth: 2,
              strokeDasharray: '5 5',
              dot: { r: 3 },
              activeDot: { r: 5 }
            })
          )
        )
      ),

      // Information section
      React.createElement('div', { className: 'mt-4 space-y-2' },
        // Legend explanation
        React.createElement('div', {
          className: `text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
        },
          React.createElement('div', { className: 'mb-2' },
            React.createElement('strong', null, 'Consolidated Totals (thick lines):'),
            React.createElement('div', { className: 'ml-4 mt-1' },
              React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement('div', { className: 'w-4 h-1 bg-blue-900' }),
                React.createElement('span', null, 'Total PM - sum of all Project Managers')
              ),
              React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement('div', { className: 'w-4 h-1 bg-green-800' }),
                React.createElement('span', null, 'Total BP - sum of all Business Partners')
              )
            )
          ),
          (showExternalPM || showExternalQA) && React.createElement('div', { className: 'mb-2' },
            React.createElement('strong', null, 'External Resources (medium-thick lines) - toggle in Project Manager filter:'),
            React.createElement('div', { className: 'ml-4 mt-1' },
              showExternalPM && React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement('div', { className: 'w-4 h-1 bg-red-600' }),
                React.createElement('span', null, 'PM External - cumulative external PM resources (Implementation Phase)')
              ),
              showExternalQA && React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement('div', { className: 'w-4 h-1 bg-orange-600' }),
                React.createElement('span', null, 'QA External - cumulative external QA resources (Implementation Phase)')
              )
            )
          ),
          activePMs.length > 0 && React.createElement('div', null,
            React.createElement('strong', null, 'Project Managers (thin solid lines):'),
            ' ',
            activePMs.join(', ')
          ),
          activeBPs.length > 0 && React.createElement('div', null,
            React.createElement('strong', null, 'Business Partners (thin dashed lines):'),
            ' ',
            activeBPs.join(', ')
          )
        ),

        // Note
        React.createElement('div', {
          className: `text-xs ${darkMode ? 'text-gray-300 bg-slate-700' : 'text-gray-600 bg-gray-50'} p-2 rounded`
        },
          React.createElement('strong', null, 'Note:'),
          ' This chart shows cumulative effort allocation in FTE (Full-Time Equivalent). For each month within a phase\'s date range, the full FTE allocation is added cumulatively. PMs: work during Project Implementation phase (PM Allocation FTE is summed across all their projects for each month). BPs: work during PSD & Inv. Proposal Preparation phase (BP Allocation) and BP Implementation phase (BP Implementation Allocation), with FTEs summed across all projects they\'re assigned to. External Resources: PM External and QA External work during the Implementation Phase (CAPEX Reg) and are tracked separately from internal resources, summed across all filtered projects. Use the Project Manager filter to show/hide external resources.',
          (pmBAU || bpBAU) && React.createElement('span', null,
            ' BAU allocation is added: ',
            pmBAU && `PM BAU = ${pmBAU} FTE/month`,
            pmBAU && bpBAU && ', ',
            bpBAU && `BP BAU = ${bpBAU} FTE/month`,
            '.'
          ),
          isFilterActive && React.createElement('span', null,
            ' The view is limited to filtered projects and date range.'
          )
        )
      )
    )
  );
}