// js/components/Reporting.js

const { useState, useMemo } = React;
const { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

/**
 * Calculate RAG status based on finish date
 * (Copied from KanbanBoard.js for consistency)
 */
const calculateRAGStatus = (finishDate, isOnHold = false) => {
  if (isOnHold) {
    return {
      color: 'bg-yellow-500',
      label: 'Amber',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-500',
      chartColor: '#EAB308'
    };
  }

  if (!finishDate) {
    return {
      color: 'bg-green-500',
      label: 'Green',
      textColor: 'text-green-700',
      borderColor: 'border-green-500',
      chartColor: '#22C55E'
    };
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const finish = new Date(finishDate);
  finish.setHours(0, 0, 0, 0);

  const diffTime = finish - currentDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      color: 'bg-red-500',
      label: 'Red',
      textColor: 'text-red-700',
      borderColor: 'border-red-500',
      chartColor: '#EF4444'
    };
  } else if (diffDays <= 7) {
    return {
      color: 'bg-yellow-500',
      label: 'Amber',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-500',
      chartColor: '#EAB308'
    };
  } else {
    return {
      color: 'bg-green-500',
      label: 'Green',
      textColor: 'text-green-700',
      borderColor: 'border-green-500',
      chartColor: '#22C55E'
    };
  }
};

/**
 * Get project column from kanbanStatus
 */
const getProjectColumn = (project) => {
  const migrationMap = {
    'psd-prep': 'psdpre',
    'psd-ready': 'psdready',
    'approved': 'invapproved',
    'uat': 'uat',
    'done': 'done'
  };

  let kanbanStatus = project.kanbanStatus || 'backlog';

  if (migrationMap[kanbanStatus]) {
    kanbanStatus = migrationMap[kanbanStatus];
  }

  return kanbanStatus;
};

/**
 * Get relevant finish date for RAG calculation based on column
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
 * Get column display name
 */
const getColumnDisplayName = (columnKey) => {
  const columnNames = {
    'onhold': 'On Hold',
    'backlog': 'Backlog',
    'psdpre': 'PSD & Inv. Prop Pre',
    'psdready': 'PSD & Inv. Prop. Ready',
    'invapproved': 'Inv. Prop. Approved',
    'procurement': 'Procurement',
    'implementation': 'Implementation',
    'uat': 'UAT',
    'done': 'Done'
  };
  return columnNames[columnKey] || columnKey;
};

/**
 * Format date as DD/MM/YYYY
 */
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Calculate delay in days between two dates
 */
const calculateDelay = (actualFinish, plannedFinish) => {
  if (!actualFinish || !plannedFinish) return null;

  const actual = new Date(actualFinish);
  const planned = new Date(plannedFinish);

  const diffTime = actual - planned;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Reporting Component
 */
export function Reporting({
  filteredProjects,
  projects,
  isFilterActive,
  filterStartDate,
  filterEndDate,
  darkMode
}) {
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedRAGStatus, setSelectedRAGStatus] = useState(null);
  const [selectedKanbanStatus, setSelectedKanbanStatus] = useState(null);

  // Calculate all analytics data
  const analyticsData = useMemo(() => {
    // Get all unique divisions
    const divisions = [...new Set(filteredProjects.map(p => p.division).filter(Boolean))].sort();

    // Calculate RAG status for each project
    const projectsWithRAG = filteredProjects.map(project => {
      const column = getProjectColumn(project);
      const finishDate = getRelevantFinishDate(project, column);
      const isOnHold = column === 'onhold';
      const ragStatus = calculateRAGStatus(finishDate, isOnHold);

      return {
        ...project,
        column,
        ragStatus,
        finishDate
      };
    });

    // KPI Metrics
    const totalProjects = filteredProjects.length;
    const redCount = projectsWithRAG.filter(p => p.ragStatus.label === 'Red').length;
    const amberCount = projectsWithRAG.filter(p => p.ragStatus.label === 'Amber').length;
    const greenCount = projectsWithRAG.filter(p => p.ragStatus.label === 'Green').length;
    const onHoldCount = projectsWithRAG.filter(p => p.column === 'onhold').length;
    const completedCount = projectsWithRAG.filter(p => p.column === 'done').length;

    // Report 1: On Hold Projects by Division
    const onHoldByDivision = divisions.map(division => {
      const count = projectsWithRAG.filter(p =>
        p.division === division && p.column === 'onhold'
      ).length;
      return { division, count };
    }).filter(d => d.count > 0);

    // Report 2A: Amber/Red by Division (Stacked Bar)
    const ragByDivision = divisions.map(division => {
      const divisionProjects = projectsWithRAG.filter(p => p.division === division);
      return {
        division,
        Red: divisionProjects.filter(p => p.ragStatus.label === 'Red').length,
        Amber: divisionProjects.filter(p => p.ragStatus.label === 'Amber').length,
        total: divisionProjects.filter(p =>
          p.ragStatus.label === 'Red' || p.ragStatus.label === 'Amber'
        ).length
      };
    }).filter(d => d.total > 0);

    // Report 2B: RAG by Division and Kanban Status (Grouped Bar)
    const ragByDivisionAndStatus = divisions.map(division => {
      const divisionProjects = projectsWithRAG.filter(p =>
        p.division === division &&
        (p.ragStatus.label === 'Red' || p.ragStatus.label === 'Amber')
      );

      const kanbanColumns = ['backlog', 'psdpre', 'psdready', 'invapproved', 'procurement', 'implementation', 'uat'];
      const statusBreakdown = kanbanColumns.map(column => ({
        column: getColumnDisplayName(column),
        Red: divisionProjects.filter(p => p.column === column && p.ragStatus.label === 'Red').length,
        Amber: divisionProjects.filter(p => p.column === column && p.ragStatus.label === 'Amber').length
      })).filter(s => s.Red > 0 || s.Amber > 0);

      return {
        division,
        statusBreakdown,
        projects: divisionProjects
      };
    }).filter(d => d.projects.length > 0);

    // Report 2C: Heat Map Data
    const heatMapData = [];
    divisions.forEach(division => {
      const kanbanColumns = ['onhold', 'backlog', 'psdpre', 'psdready', 'invapproved', 'procurement', 'implementation', 'uat', 'done'];
      kanbanColumns.forEach(column => {
        const count = projectsWithRAG.filter(p =>
          p.division === division &&
          p.column === column &&
          (p.ragStatus.label === 'Red' || p.ragStatus.label === 'Amber')
        ).length;

        if (count > 0) {
          heatMapData.push({
            division,
            column: getColumnDisplayName(column),
            count,
            red: projectsWithRAG.filter(p =>
              p.division === division &&
              p.column === column &&
              p.ragStatus.label === 'Red'
            ).length,
            amber: projectsWithRAG.filter(p =>
              p.division === division &&
              p.column === column &&
              p.ragStatus.label === 'Amber'
            ).length
          });
        }
      });
    });

    // Report 4: Projects by Kanban Status
    const kanbanColumns = ['onhold', 'backlog', 'psdpre', 'psdready', 'invapproved', 'procurement', 'implementation', 'uat', 'done'];
    const projectsByKanban = kanbanColumns.map(column => ({
      status: getColumnDisplayName(column),
      count: projectsWithRAG.filter(p => p.column === column).length,
      columnKey: column
    })).filter(s => s.count > 0);

    // Report 5: Projects by Division
    const projectsByDivision = divisions.map(division => ({
      division,
      count: projectsWithRAG.filter(p => p.division === division).length
    }));

    // Report 6: Timeline Delays
    const projectsWithDelays = filteredProjects
      .map(project => {
        const actualFinish = project.implementation?.finish;
        const plannedFinish = project.actualDates?.finish;
        const delay = calculateDelay(actualFinish, plannedFinish);

        return {
          ...project,
          actualFinish,
          plannedFinish,
          delay
        };
      })
      .filter(p => p.delay !== null && p.delay !== 0)
      .sort((a, b) => (b.delay || 0) - (a.delay || 0));

    // Report 9: Monthly Trends
    const monthlyTrends = useMemo(() => {
      const monthlyData = {};

      filteredProjects.forEach(project => {
        // Track project starts (Implementation start)
        if (project.implementation?.start) {
          const startDate = new Date(project.implementation.start);
          const monthKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { month: monthKey, started: 0, completed: 0, inProgress: 0 };
          }
          monthlyData[monthKey].started++;
        }

        // Track project completions (Implementation finish)
        if (project.implementation?.finish) {
          const finishDate = new Date(project.implementation.finish);
          const monthKey = `${finishDate.getFullYear()}-${String(finishDate.getMonth() + 1).padStart(2, '0')}`;
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { month: monthKey, started: 0, completed: 0, inProgress: 0 };
          }
          monthlyData[monthKey].completed++;
        }
      });

      // Convert to array and sort by month
      const trendsArray = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

      // Calculate running in-progress count
      let runningInProgress = 0;
      trendsArray.forEach(item => {
        runningInProgress += item.started - item.completed;
        item.inProgress = Math.max(0, runningInProgress);
      });

      return trendsArray;
    }, [filteredProjects]);

    return {
      totalProjects,
      redCount,
      amberCount,
      greenCount,
      onHoldCount,
      completedCount,
      onHoldByDivision,
      ragByDivision,
      ragByDivisionAndStatus,
      heatMapData,
      projectsByKanban,
      projectsByDivision,
      projectsWithDelays,
      monthlyTrends,
      projectsWithRAG,
      divisions
    };
  }, [filteredProjects]);

  // Filter projects based on selections
  const filteredDataForTable = useMemo(() => {
    let filtered = analyticsData.projectsWithRAG;

    if (selectedDivision) {
      filtered = filtered.filter(p => p.division === selectedDivision);
    }

    if (selectedRAGStatus) {
      filtered = filtered.filter(p => p.ragStatus.label === selectedRAGStatus);
    }

    if (selectedKanbanStatus) {
      filtered = filtered.filter(p => p.column === selectedKanbanStatus);
    }

    return filtered;
  }, [analyticsData.projectsWithRAG, selectedDivision, selectedRAGStatus, selectedKanbanStatus]);

  // Reset filters
  const resetFilters = () => {
    setSelectedDivision(null);
    setSelectedRAGStatus(null);
    setSelectedKanbanStatus(null);
  };

  // KPI Card Component
  const KPICard = ({ title, value, percentage, color, icon }) => {
    return React.createElement('div', {
      className: `rounded-lg p-4 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-l-4 ${color} shadow-md`
    },
      React.createElement('div', {
        className: 'flex items-center justify-between'
      },
        React.createElement('div', null,
          React.createElement('div', {
            className: `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
          }, title),
          React.createElement('div', {
            className: `text-2xl font-bold mt-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
          }, value),
          percentage !== undefined && React.createElement('div', {
            className: `text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`
          }, `${percentage}% of total`)
        ),
        React.createElement('div', {
          className: `text-3xl opacity-20`
        }, icon)
      )
    );
  };

  // Data Table Component
  const DataTable = ({ data, columns, title }) => {
    if (!data || data.length === 0) {
      return React.createElement('div', {
        className: `text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`
      }, 'No data available');
    }

    return React.createElement('div', {
      className: `mt-4 rounded-lg border ${darkMode ? 'border-slate-600' : 'border-gray-200'} overflow-hidden`
    },
      title && React.createElement('div', {
        className: `px-4 py-2 font-semibold ${darkMode ? 'bg-slate-700 text-gray-200' : 'bg-gray-50 text-gray-700'} border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
      }, title),
      React.createElement('div', {
        className: 'overflow-x-auto'
      },
        React.createElement('table', {
          className: 'w-full text-sm'
        },
          React.createElement('thead', null,
            React.createElement('tr', {
              className: `${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`
            },
              columns.map((col, idx) =>
                React.createElement('th', {
                  key: idx,
                  className: `px-4 py-2 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
                }, col.header)
              )
            )
          ),
          React.createElement('tbody', null,
            data.map((row, rowIdx) =>
              React.createElement('tr', {
                key: rowIdx,
                className: `${darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'} ${rowIdx % 2 === 0 ? (darkMode ? 'bg-slate-800/50' : 'bg-white') : (darkMode ? 'bg-slate-800/30' : 'bg-gray-50/50')}`
              },
                columns.map((col, colIdx) =>
                  React.createElement('td', {
                    key: colIdx,
                    className: `px-4 py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`
                  }, col.render ? col.render(row) : row[col.key])
                )
              )
            )
          )
        )
      )
    );
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return React.createElement('div', {
        className: `${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-3`
      },
        React.createElement('p', {
          className: `font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
        }, label),
        payload.map((entry, index) =>
          React.createElement('p', {
            key: index,
            className: 'text-sm',
            style: { color: entry.color }
          }, `${entry.name}: ${entry.value}`)
        )
      );
    }
    return null;
  };

  // Chart colors
  const COLORS = {
    Red: '#EF4444',
    Amber: '#EAB308',
    Green: '#22C55E',
    Blue: '#3B82F6',
    Purple: '#A855F7',
    Teal: '#14B8A6'
  };

  return React.createElement('div', {
    className: 'space-y-6'
  },
    // Header
    React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h2', {
        className: `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, 'Reporting Dashboard'),
      React.createElement('p', {
        className: `mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, `Showing data for ${filteredProjects.length} of ${projects.length} projects${isFilterActive ? ' (Filtered)' : ''}`),

      // Active filters display
      (selectedDivision || selectedRAGStatus || selectedKanbanStatus) && React.createElement('div', {
        className: 'mt-4 flex flex-wrap gap-2 items-center'
      },
        React.createElement('span', {
          className: `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
        }, 'Active Filters:'),
        selectedDivision && React.createElement('span', {
          className: `px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} flex items-center gap-2`
        },
          `Division: ${selectedDivision}`,
          React.createElement('button', {
            onClick: () => setSelectedDivision(null),
            className: 'hover:text-red-500'
          }, '×')
        ),
        selectedRAGStatus && React.createElement('span', {
          className: `px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'} flex items-center gap-2`
        },
          `RAG: ${selectedRAGStatus}`,
          React.createElement('button', {
            onClick: () => setSelectedRAGStatus(null),
            className: 'hover:text-red-500'
          }, '×')
        ),
        selectedKanbanStatus && React.createElement('span', {
          className: `px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'} flex items-center gap-2`
        },
          `Status: ${getColumnDisplayName(selectedKanbanStatus)}`,
          React.createElement('button', {
            onClick: () => setSelectedKanbanStatus(null),
            className: 'hover:text-red-500'
          }, '×')
        ),
        React.createElement('button', {
          onClick: resetFilters,
          className: `px-3 py-1 rounded text-sm ${darkMode ? 'bg-red-900 text-red-200 hover:bg-red-800' : 'bg-red-100 text-red-800 hover:bg-red-200'}`
        }, 'Clear All')
      )
    ),

    // KPI Cards Section (Report 3)
    React.createElement('div', {
      className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'
    },
      React.createElement(KPICard, {
        title: 'Total Projects',
        value: analyticsData.totalProjects,
        color: 'border-blue-500',
        icon: '📊'
      }),
      React.createElement(KPICard, {
        title: 'Red RAG',
        value: analyticsData.redCount,
        percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.redCount / analyticsData.totalProjects) * 100) : 0,
        color: 'border-red-500',
        icon: '🔴'
      }),
      React.createElement(KPICard, {
        title: 'Amber RAG',
        value: analyticsData.amberCount,
        percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.amberCount / analyticsData.totalProjects) * 100) : 0,
        color: 'border-yellow-500',
        icon: '🟡'
      }),
      React.createElement(KPICard, {
        title: 'Green RAG',
        value: analyticsData.greenCount,
        percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.greenCount / analyticsData.totalProjects) * 100) : 0,
        color: 'border-green-500',
        icon: '🟢'
      }),
      React.createElement(KPICard, {
        title: 'On Hold',
        value: analyticsData.onHoldCount,
        percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.onHoldCount / analyticsData.totalProjects) * 100) : 0,
        color: 'border-orange-500',
        icon: '⏸️'
      }),
      React.createElement(KPICard, {
        title: 'Completed',
        value: analyticsData.completedCount,
        percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.completedCount / analyticsData.totalProjects) * 100) : 0,
        color: 'border-emerald-500',
        icon: '✅'
      })
    ),

    // SECTION 1: Risk Analysis
    React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h3', {
        className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, '🚨 Risk Analysis'),

      // Report 1: On Hold Projects by Division
      analyticsData.onHoldByDivision.length > 0 && React.createElement('div', {
        className: 'mb-8'
      },
        React.createElement('h4', {
          className: `text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
        }, 'On Hold Projects by Division'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(BarChart, {
            data: analyticsData.onHoldByDivision,
            layout: 'vertical',
            margin: { top: 5, right: 30, left: 120, bottom: 5 }
          },
            React.createElement(CartesianGrid, {
              strokeDasharray: '3 3',
              stroke: darkMode ? '#374151' : '#E5E7EB'
            }),
            React.createElement(XAxis, {
              type: 'number',
              stroke: darkMode ? '#9CA3AF' : '#6B7280'
            }),
            React.createElement(YAxis, {
              type: 'category',
              dataKey: 'division',
              stroke: darkMode ? '#9CA3AF' : '#6B7280'
            }),
            React.createElement(Tooltip, { content: React.createElement(CustomTooltip) }),
            React.createElement(Bar, {
              dataKey: 'count',
              fill: '#F97316',
              onClick: (data) => setSelectedDivision(data.division)
            })
          )
        ),
        React.createElement(DataTable, {
          title: 'On Hold Projects Details',
          data: analyticsData.onHoldByDivision,
          columns: [
            { header: 'Division', key: 'division' },
            { header: 'Count', key: 'count' }
          ]
        })
      ),

      // Report 2A: Amber/Red by Division (Stacked Bar)
      analyticsData.ragByDivision.length > 0 && React.createElement('div', {
        className: 'mb-8 mt-8'
      },
        React.createElement('h4', {
          className: `text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
        }, 'At-Risk Projects by Division (Red & Amber)'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(BarChart, {
            data: analyticsData.ragByDivision,
            margin: { top: 5, right: 30, left: 20, bottom: 5 }
          },
            React.createElement(CartesianGrid, {
              strokeDasharray: '3 3',
              stroke: darkMode ? '#374151' : '#E5E7EB'
            }),
            React.createElement(XAxis, {
              dataKey: 'division',
              stroke: darkMode ? '#9CA3AF' : '#6B7280',
              angle: -45,
              textAnchor: 'end',
              height: 100
            }),
            React.createElement(YAxis, {
              stroke: darkMode ? '#9CA3AF' : '#6B7280'
            }),
            React.createElement(Tooltip, { content: React.createElement(CustomTooltip) }),
            React.createElement(Legend),
            React.createElement(Bar, {
              dataKey: 'Red',
              stackId: 'a',
              fill: COLORS.Red,
              onClick: (data) => {
                setSelectedDivision(data.division);
                setSelectedRAGStatus('Red');
              }
            }),
            React.createElement(Bar, {
              dataKey: 'Amber',
              stackId: 'a',
              fill: COLORS.Amber,
              onClick: (data) => {
                setSelectedDivision(data.division);
                setSelectedRAGStatus('Amber');
              }
            })
          )
        ),
        React.createElement(DataTable, {
          title: 'At-Risk Projects by Division',
          data: analyticsData.ragByDivision,
          columns: [
            { header: 'Division', key: 'division' },
            { header: 'Red', key: 'Red' },
            { header: 'Amber', key: 'Amber' },
            { header: 'Total At-Risk', key: 'total' }
          ]
        })
      ),

      // Report 2B: RAG by Division and Kanban Status (Grouped Bars)
      analyticsData.ragByDivisionAndStatus.length > 0 && React.createElement('div', {
        className: 'mb-8 mt-8'
      },
        React.createElement('h4', {
          className: `text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
        }, 'At-Risk Projects by Division & Kanban Status'),
        analyticsData.ragByDivisionAndStatus.map((divData, idx) =>
          React.createElement('div', {
            key: idx,
            className: `mb-6 p-4 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`
          },
            React.createElement('h5', {
              className: `font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, divData.division),
            divData.statusBreakdown.length > 0 && React.createElement(ResponsiveContainer, {
              width: '100%',
              height: 250
            },
              React.createElement(BarChart, {
                data: divData.statusBreakdown,
                margin: { top: 5, right: 30, left: 20, bottom: 60 }
              },
                React.createElement(CartesianGrid, {
                  strokeDasharray: '3 3',
                  stroke: darkMode ? '#374151' : '#E5E7EB'
                }),
                React.createElement(XAxis, {
                  dataKey: 'column',
                  stroke: darkMode ? '#9CA3AF' : '#6B7280',
                  angle: -45,
                  textAnchor: 'end',
                  height: 80
                }),
                React.createElement(YAxis, {
                  stroke: darkMode ? '#9CA3AF' : '#6B7280'
                }),
                React.createElement(Tooltip, { content: React.createElement(CustomTooltip) }),
                React.createElement(Legend),
                React.createElement(Bar, {
                  dataKey: 'Red',
                  fill: COLORS.Red
                }),
                React.createElement(Bar, {
                  dataKey: 'Amber',
                  fill: COLORS.Amber
                })
              )
            )
          )
        )
      ),

      // Report 2C: Heat Map
      analyticsData.heatMapData.length > 0 && React.createElement('div', {
        className: 'mb-8 mt-8'
      },
        React.createElement('h4', {
          className: `text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
        }, 'At-Risk Projects Heat Map (Division × Kanban Status)'),
        React.createElement(DataTable, {
          title: 'Heat Map Data',
          data: analyticsData.heatMapData,
          columns: [
            { header: 'Division', key: 'division' },
            { header: 'Kanban Status', key: 'column' },
            {
              header: 'Total At-Risk',
              key: 'count',
              render: (row) => React.createElement('span', {
                className: `px-2 py-1 rounded ${
                  row.count >= 5 ? 'bg-red-500 text-white' :
                  row.count >= 3 ? 'bg-orange-500 text-white' :
                  'bg-yellow-500 text-white'
                }`
              }, row.count)
            },
            { header: 'Red', key: 'red' },
            { header: 'Amber', key: 'amber' }
          ]
        })
      )
    ),

    // SECTION 2: Distribution & Pipeline
    React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h3', {
        className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, '📈 Distribution & Pipeline'),

      React.createElement('div', {
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      },
        // Report 4: Projects by Kanban Status
        React.createElement('div', null,
          React.createElement('h4', {
            className: `text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
          }, 'Projects by Kanban Status'),
          React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
            React.createElement(BarChart, {
              data: analyticsData.projectsByKanban,
              margin: { top: 5, right: 30, left: 20, bottom: 80 }
            },
              React.createElement(CartesianGrid, {
                strokeDasharray: '3 3',
                stroke: darkMode ? '#374151' : '#E5E7EB'
              }),
              React.createElement(XAxis, {
                dataKey: 'status',
                stroke: darkMode ? '#9CA3AF' : '#6B7280',
                angle: -45,
                textAnchor: 'end',
                height: 100
              }),
              React.createElement(YAxis, {
                stroke: darkMode ? '#9CA3AF' : '#6B7280'
              }),
              React.createElement(Tooltip, { content: React.createElement(CustomTooltip) }),
              React.createElement(Bar, {
                dataKey: 'count',
                fill: COLORS.Blue,
                onClick: (data) => setSelectedKanbanStatus(data.columnKey)
              })
            )
          )
        ),

        // Report 5: Projects by Division (Pie Chart)
        React.createElement('div', null,
          React.createElement('h4', {
            className: `text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
          }, 'Projects by Division'),
          React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
            React.createElement(PieChart, null,
              React.createElement(Pie, {
                data: analyticsData.projectsByDivision,
                dataKey: 'count',
                nameKey: 'division',
                cx: '50%',
                cy: '50%',
                outerRadius: 100,
                label: (entry) => `${entry.division}: ${entry.count}`,
                onClick: (data) => setSelectedDivision(data.division)
              },
                analyticsData.projectsByDivision.map((entry, index) =>
                  React.createElement(Cell, {
                    key: `cell-${index}`,
                    fill: Object.values(COLORS)[index % Object.values(COLORS).length]
                  })
                )
              ),
              React.createElement(Tooltip)
            )
          )
        )
      ),

      // Combined table for distribution
      React.createElement('div', {
        className: 'mt-6'
      },
        React.createElement(DataTable, {
          title: 'Distribution Summary',
          data: analyticsData.projectsByDivision,
          columns: [
            { header: 'Division', key: 'division' },
            { header: 'Total Projects', key: 'count' },
            {
              header: '% of Total',
              render: (row) => `${Math.round((row.count / analyticsData.totalProjects) * 100)}%`
            }
          ]
        })
      )
    ),

    // SECTION 3: Timeline Performance (Report 6)
    analyticsData.projectsWithDelays.length > 0 && React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h3', {
        className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, '⏱️ Timeline Performance'),

      React.createElement('h4', {
        className: `text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, 'Project Delays (Implementation vs Initial Official Plan)'),

      React.createElement(ResponsiveContainer, { width: '100%', height: 400 },
        React.createElement(BarChart, {
          data: analyticsData.projectsWithDelays.slice(0, 20),
          layout: 'vertical',
          margin: { top: 5, right: 30, left: 150, bottom: 5 }
        },
          React.createElement(CartesianGrid, {
            strokeDasharray: '3 3',
            stroke: darkMode ? '#374151' : '#E5E7EB'
          }),
          React.createElement(XAxis, {
            type: 'number',
            stroke: darkMode ? '#9CA3AF' : '#6B7280',
            label: { value: 'Days', position: 'insideBottom', offset: -5 }
          }),
          React.createElement(YAxis, {
            type: 'category',
            dataKey: 'name',
            stroke: darkMode ? '#9CA3AF' : '#6B7280',
            width: 140
          }),
          React.createElement(Tooltip, { content: React.createElement(CustomTooltip) }),
          React.createElement(Bar, {
            dataKey: 'delay',
            fill: COLORS.Red,
            label: { position: 'right' }
          },
            analyticsData.projectsWithDelays.slice(0, 20).map((entry, index) =>
              React.createElement(Cell, {
                key: `cell-${index}`,
                fill: entry.delay >= 30 ? COLORS.Red : entry.delay >= 15 ? COLORS.Amber : COLORS.Green
              })
            )
          )
        )
      ),

      React.createElement(DataTable, {
        title: 'All Projects with Delays',
        data: analyticsData.projectsWithDelays,
        columns: [
          { header: 'Project', key: 'name' },
          { header: 'Division', key: 'division' },
          {
            header: 'Delay (Days)',
            render: (row) => React.createElement('span', {
              className: `px-2 py-1 rounded ${
                row.delay >= 30 ? 'bg-red-500 text-white' :
                row.delay >= 15 ? 'bg-yellow-500 text-white' :
                row.delay < 0 ? 'bg-green-500 text-white' :
                'bg-blue-500 text-white'
              }`
            }, row.delay > 0 ? `+${row.delay}` : row.delay)
          },
          {
            header: 'Actual Finish',
            render: (row) => formatDate(row.actualFinish)
          },
          {
            header: 'Planned Finish',
            render: (row) => formatDate(row.plannedFinish)
          }
        ]
      })
    ),

    // SECTION 4: Monthly Trends (Report 9)
    analyticsData.monthlyTrends.length > 0 && React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h3', {
        className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, '📊 Monthly Trends'),

      React.createElement('h4', {
        className: `text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, 'Project Activity Over Time'),

      React.createElement(ResponsiveContainer, { width: '100%', height: 400 },
        React.createElement(LineChart, {
          data: analyticsData.monthlyTrends,
          margin: { top: 5, right: 30, left: 20, bottom: 5 }
        },
          React.createElement(CartesianGrid, {
            strokeDasharray: '3 3',
            stroke: darkMode ? '#374151' : '#E5E7EB'
          }),
          React.createElement(XAxis, {
            dataKey: 'month',
            stroke: darkMode ? '#9CA3AF' : '#6B7280'
          }),
          React.createElement(YAxis, {
            stroke: darkMode ? '#9CA3AF' : '#6B7280'
          }),
          React.createElement(Tooltip, { content: React.createElement(CustomTooltip) }),
          React.createElement(Legend),
          React.createElement(Line, {
            type: 'monotone',
            dataKey: 'started',
            stroke: COLORS.Green,
            name: 'Projects Started',
            strokeWidth: 2
          }),
          React.createElement(Line, {
            type: 'monotone',
            dataKey: 'completed',
            stroke: COLORS.Blue,
            name: 'Projects Completed',
            strokeWidth: 2
          }),
          React.createElement(Line, {
            type: 'monotone',
            dataKey: 'inProgress',
            stroke: COLORS.Amber,
            name: 'In Progress',
            strokeWidth: 2
          })
        )
      ),

      React.createElement(DataTable, {
        title: 'Monthly Activity Details',
        data: analyticsData.monthlyTrends,
        columns: [
          { header: 'Month', key: 'month' },
          { header: 'Started', key: 'started' },
          { header: 'Completed', key: 'completed' },
          { header: 'In Progress', key: 'inProgress' }
        ]
      })
    ),

    // Filtered Projects Table (Interactive)
    (selectedDivision || selectedRAGStatus || selectedKanbanStatus) && React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h3', {
        className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, '🔍 Filtered Projects'),

      React.createElement(DataTable, {
        title: `Projects matching current filters (${filteredDataForTable.length} projects)`,
        data: filteredDataForTable,
        columns: [
          { header: 'Project', key: 'name' },
          { header: 'Division', key: 'division' },
          {
            header: 'Kanban Status',
            render: (row) => getColumnDisplayName(row.column)
          },
          {
            header: 'RAG Status',
            render: (row) => React.createElement('span', {
              className: `px-2 py-1 rounded text-white ${row.ragStatus.color}`
            }, row.ragStatus.label)
          },
          {
            header: 'Due Date',
            render: (row) => formatDate(row.finishDate)
          },
          { header: 'PM', key: 'projectManager' },
          { header: 'BP', key: 'businessPartner' }
        ]
      })
    )
  );
}
