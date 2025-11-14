// js/components/Reporting.js

const { useState, useMemo } = React;
const { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

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
  const [selectedKPIFilter, setSelectedKPIFilter] = useState(null); // 'total', 'red', 'amber', 'green', 'onhold', 'completed'
  const [selectedRiskAlert, setSelectedRiskAlert] = useState(null); // 'critical', 'high', 'medium', 'onhold'
  const [selectedPipelineStatus, setSelectedPipelineStatus] = useState(null); // kanban status key

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

    // Risk Alert Metrics
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Critical: Red projects expiring within 7 days
    const criticalRiskProjects = projectsWithRAG.filter(p => {
      if (p.ragStatus.label !== 'Red' || !p.finishDate) return false;
      const finishDate = new Date(p.finishDate);
      finishDate.setHours(0, 0, 0, 0);
      const daysUntilDeadline = Math.ceil((finishDate - currentDate) / (1000 * 60 * 60 * 24));
      return daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
    });

    const criticalRiskCount = criticalRiskProjects.length;
    const highRiskCount = redCount; // All red projects
    const mediumRiskCount = amberCount; // All amber projects
    const onHoldRiskCount = onHoldCount; // All on-hold projects

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

    // Report 2B: RAG by Division and Kanban Status (Combined)
    // Create combined data for single chart with all divisions
    const ragByDivisionAndStatusCombined = [];
    const kanbanColumns = ['backlog', 'psdpre', 'psdready', 'invapproved', 'procurement', 'implementation', 'uat'];

    divisions.forEach(division => {
      kanbanColumns.forEach(column => {
        const divisionProjects = projectsWithRAG.filter(p =>
          p.division === division &&
          p.column === column &&
          (p.ragStatus.label === 'Red' || p.ragStatus.label === 'Amber')
        );

        if (divisionProjects.length > 0) {
          ragByDivisionAndStatusCombined.push({
            key: `${division}-${column}`,
            division,
            kanbanStatus: getColumnDisplayName(column),
            Red: divisionProjects.filter(p => p.ragStatus.label === 'Red').length,
            Amber: divisionProjects.filter(p => p.ragStatus.label === 'Amber').length
          });
        }
      });
    });

    // Report 2C: Heat Map Data
    const heatMapData = [];
    const allKanbanColumns = ['onhold', 'backlog', 'psdpre', 'psdready', 'invapproved', 'procurement', 'implementation', 'uat', 'done'];

    divisions.forEach(division => {
      allKanbanColumns.forEach(column => {
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

    // Report 4: Projects by Kanban Status with Division Breakdown
    const projectsByKanban = allKanbanColumns.map(column => {
      const columnProjects = projectsWithRAG.filter(p => p.column === column);
      const count = columnProjects.length;

      // Calculate division breakdown for this status
      const divisionBreakdown = divisions.map(division => ({
        division,
        count: columnProjects.filter(p => p.division === division).length
      }))
      .filter(d => d.count > 0)
      .sort((a, b) => b.count - a.count); // Sort by count descending

      return {
        status: getColumnDisplayName(column),
        count,
        columnKey: column,
        topDivisions: divisionBreakdown.slice(0, 3), // Top 3 divisions
        allDivisions: divisionBreakdown
      };
    }).filter(s => s.count > 0);

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

    const monthlyTrends = trendsArray;

    return {
      totalProjects,
      redCount,
      amberCount,
      greenCount,
      onHoldCount,
      completedCount,
      criticalRiskCount,
      criticalRiskProjects,
      highRiskCount,
      mediumRiskCount,
      onHoldRiskCount,
      onHoldByDivision,
      ragByDivision,
      ragByDivisionAndStatusCombined,
      heatMapData,
      projectsByKanban,
      projectsByDivision,
      projectsWithDelays,
      monthlyTrends,
      projectsWithRAG,
      divisions,
      allKanbanColumns
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

  // Handle KPI card click
  const handleKPICardClick = (filterType) => {
    // Toggle: if same card clicked, close it; otherwise open new one
    setSelectedKPIFilter(selectedKPIFilter === filterType ? null : filterType);
  };

  // Get filtered projects based on selected KPI
  const kpiFilteredProjects = useMemo(() => {
    if (!selectedKPIFilter) return [];

    switch (selectedKPIFilter) {
      case 'total':
        return analyticsData.projectsWithRAG;
      case 'red':
        return analyticsData.projectsWithRAG.filter(p => p.ragStatus.label === 'Red');
      case 'amber':
        return analyticsData.projectsWithRAG.filter(p => p.ragStatus.label === 'Amber');
      case 'green':
        return analyticsData.projectsWithRAG.filter(p => p.ragStatus.label === 'Green');
      case 'onhold':
        return analyticsData.projectsWithRAG.filter(p => p.column === 'onhold');
      case 'completed':
        return analyticsData.projectsWithRAG.filter(p => p.column === 'done');
      default:
        return [];
    }
  }, [selectedKPIFilter, analyticsData.projectsWithRAG]);

  // Handle Risk Alert card click
  const handleRiskAlertClick = (alertType) => {
    setSelectedRiskAlert(selectedRiskAlert === alertType ? null : alertType);
  };

  // Handle Pipeline Status card click
  const handlePipelineStatusClick = (statusKey) => {
    setSelectedPipelineStatus(selectedPipelineStatus === statusKey ? null : statusKey);
  };

  // Get filtered projects based on selected risk alert
  const riskAlertFilteredProjects = useMemo(() => {
    if (!selectedRiskAlert) return [];

    switch (selectedRiskAlert) {
      case 'critical':
        return analyticsData.criticalRiskProjects;
      case 'high':
        return analyticsData.projectsWithRAG.filter(p => p.ragStatus.label === 'Red');
      case 'medium':
        return analyticsData.projectsWithRAG.filter(p => p.ragStatus.label === 'Amber');
      case 'onhold':
        return analyticsData.projectsWithRAG.filter(p => p.column === 'onhold');
      default:
        return [];
    }
  }, [selectedRiskAlert, analyticsData.projectsWithRAG, analyticsData.criticalRiskProjects]);

  // Get division breakdown and projects for selected pipeline status
  const pipelineStatusData = useMemo(() => {
    if (!selectedPipelineStatus) return null;

    const statusData = analyticsData.projectsByKanban.find(s => s.columnKey === selectedPipelineStatus);
    if (!statusData) return null;

    const projects = analyticsData.projectsWithRAG.filter(p => p.column === selectedPipelineStatus);

    return {
      ...statusData,
      projects
    };
  }, [selectedPipelineStatus, analyticsData.projectsByKanban, analyticsData.projectsWithRAG]);

  // KPI Card Component
  const KPICard = ({ title, value, percentage, color, icon, filterType, onClick }) => {
    const isSelected = selectedKPIFilter === filterType;
    return React.createElement('div', {
      className: `rounded-lg p-4 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-l-4 ${color} shadow-md cursor-pointer transition-all transform hover:scale-105 hover:shadow-xl ${isSelected ? 'ring-2 ring-blue-500 scale-105' : ''}`,
      onClick: () => onClick(filterType)
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

  // Pipeline Status Card Component
  const PipelineStatusCard = ({ status, count, percentage, columnKey, topDivisions, onClick }) => {
    const isSelected = selectedPipelineStatus === columnKey;

    // Define status colors and icons
    const statusStyles = {
      'onhold': { color: 'border-orange-500', icon: '⏸️', gradient: 'from-orange-500 to-orange-600' },
      'backlog': { color: 'border-gray-500', icon: '📋', gradient: 'from-gray-500 to-gray-600' },
      'psdpre': { color: 'border-blue-500', icon: '📝', gradient: 'from-blue-500 to-blue-600' },
      'psdready': { color: 'border-cyan-500', icon: '✅', gradient: 'from-cyan-500 to-cyan-600' },
      'invapproved': { color: 'border-green-500', icon: '💰', gradient: 'from-green-500 to-green-600' },
      'procurement': { color: 'border-yellow-500', icon: '🛒', gradient: 'from-yellow-500 to-yellow-600' },
      'implementation': { color: 'border-purple-500', icon: '⚙️', gradient: 'from-purple-500 to-purple-600' },
      'uat': { color: 'border-pink-500', icon: '🧪', gradient: 'from-pink-500 to-pink-600' },
      'done': { color: 'border-emerald-500', icon: '🎉', gradient: 'from-emerald-500 to-emerald-600' }
    };

    const style = statusStyles[columnKey] || { color: 'border-gray-500', icon: '📊', gradient: 'from-gray-500 to-gray-600' };

    return React.createElement('div', {
      className: `relative rounded-xl p-6 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-2 ${style.color} shadow-lg cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl ${isSelected ? 'ring-4 ring-blue-500 scale-105' : ''}`,
      onClick: () => onClick(columnKey)
    },
      // Icon badge
      React.createElement('div', {
        className: `absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br ${style.gradient} rounded-full flex items-center justify-center text-2xl shadow-lg`
      }, style.icon),

      // Main content
      React.createElement('div', {
        className: 'mb-4'
      },
        React.createElement('div', {
          className: `text-sm font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`
        }, status),
        React.createElement('div', {
          className: `text-4xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-1`
        }, count),
        React.createElement('div', {
          className: `text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`
        }, `${percentage}% of total`)
      ),

      // Progress ring or bar
      React.createElement('div', {
        className: 'mb-4'
      },
        React.createElement('div', {
          className: `w-full h-2 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full overflow-hidden`
        },
          React.createElement('div', {
            className: `h-full bg-gradient-to-r ${style.gradient} transition-all duration-500`,
            style: { width: `${Math.min(percentage, 100)}%` }
          })
        )
      ),

      // Top 3 divisions
      topDivisions && topDivisions.length > 0 && React.createElement('div', {
        className: 'space-y-1'
      },
        React.createElement('div', {
          className: `text-xs font-semibold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`
        }, 'Top Divisions'),
        topDivisions.map((div, idx) =>
          React.createElement('div', {
            key: idx,
            className: 'flex items-center justify-between text-sm'
          },
            React.createElement('span', {
              className: `${darkMode ? 'text-gray-300' : 'text-gray-700'} truncate flex-1`
            }, `${idx + 1}. ${div.division}`),
            React.createElement('span', {
              className: `font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'} ml-2`
            }, div.count)
          )
        )
      ),

      // Click hint
      React.createElement('div', {
        className: `mt-4 pt-4 border-t ${darkMode ? 'border-slate-600' : 'border-gray-200'} text-center`
      },
        React.createElement('span', {
          className: `text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`
        }, isSelected ? '↑ Click to close' : '↓ Click for full breakdown')
      )
    );
  };

  // Risk Alert Card Component
  const RiskAlertCard = ({ title, value, severity, icon, alertType, onClick }) => {
    const isSelected = selectedRiskAlert === alertType;
    const isCritical = alertType === 'critical';

    // Define severity styles
    const severityStyles = {
      critical: {
        border: 'border-red-600',
        bg: darkMode ? 'bg-red-900/30' : 'bg-red-50',
        text: darkMode ? 'text-red-300' : 'text-red-700',
        icon: '🚨',
        pulse: 'animate-pulse'
      },
      high: {
        border: 'border-red-500',
        bg: darkMode ? 'bg-red-900/20' : 'bg-red-50/70',
        text: darkMode ? 'text-red-400' : 'text-red-600',
        icon: '🔴',
        pulse: ''
      },
      medium: {
        border: 'border-orange-500',
        bg: darkMode ? 'bg-orange-900/20' : 'bg-orange-50',
        text: darkMode ? 'text-orange-400' : 'text-orange-600',
        icon: '⚠️',
        pulse: ''
      },
      low: {
        border: 'border-yellow-500',
        bg: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
        text: darkMode ? 'text-yellow-400' : 'text-yellow-600',
        icon: '⏸️',
        pulse: ''
      }
    };

    const style = severityStyles[severity];

    return React.createElement('div', {
      className: `rounded-lg p-4 ${style.bg} border-2 ${style.border} shadow-lg cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl ${isSelected ? 'ring-4 ring-blue-500 scale-105' : ''} ${isCritical && !isSelected ? style.pulse : ''}`,
      onClick: () => onClick(alertType)
    },
      React.createElement('div', {
        className: 'flex items-center justify-between'
      },
        React.createElement('div', null,
          React.createElement('div', {
            className: `text-xs font-bold uppercase tracking-wide ${style.text} mb-1`
          }, severity.toUpperCase() + ' RISK'),
          React.createElement('div', {
            className: `text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`
          }, title),
          React.createElement('div', {
            className: `text-3xl font-bold ${style.text}`
          }, value)
        ),
        React.createElement('div', {
          className: `text-4xl ${isCritical ? style.pulse : ''}`
        }, style.icon)
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
        icon: '📊',
        filterType: 'total',
        onClick: handleKPICardClick
      }),
      React.createElement(KPICard, {
        title: 'Red RAG',
        value: analyticsData.redCount,
        percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.redCount / analyticsData.totalProjects) * 100) : 0,
        color: 'border-red-500',
        icon: '🔴',
        filterType: 'red',
        onClick: handleKPICardClick
      }),
      React.createElement(KPICard, {
        title: 'Amber RAG',
        value: analyticsData.amberCount,
        percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.amberCount / analyticsData.totalProjects) * 100) : 0,
        color: 'border-yellow-500',
        icon: '🟡',
        filterType: 'amber',
        onClick: handleKPICardClick
      }),
      React.createElement(KPICard, {
        title: 'Green RAG',
        value: analyticsData.greenCount,
        percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.greenCount / analyticsData.totalProjects) * 100) : 0,
        color: 'border-green-500',
        icon: '🟢',
        filterType: 'green',
        onClick: handleKPICardClick
      }),
      React.createElement(KPICard, {
        title: 'On Hold',
        value: analyticsData.onHoldCount,
        percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.onHoldCount / analyticsData.totalProjects) * 100) : 0,
        color: 'border-orange-500',
        icon: '⏸️',
        filterType: 'onhold',
        onClick: handleKPICardClick
      }),
      React.createElement(KPICard, {
        title: 'Completed',
        value: analyticsData.completedCount,
        percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.completedCount / analyticsData.totalProjects) * 100) : 0,
        color: 'border-emerald-500',
        icon: '✅',
        filterType: 'completed',
        onClick: handleKPICardClick
      })
    ),

    // Expandable section for KPI details
    selectedKPIFilter && React.createElement('div', {
      className: `mt-6 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg border-2 border-blue-500`
    },
      // Header with title and close button
      React.createElement('div', {
        className: `flex items-center justify-between p-4 ${darkMode ? 'bg-slate-700 border-b border-slate-600' : 'bg-blue-50 border-b border-blue-200'}`
      },
        React.createElement('h3', {
          className: `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
        },
          selectedKPIFilter === 'total' ? `All Projects (${kpiFilteredProjects.length})` :
          selectedKPIFilter === 'red' ? `Red RAG Projects (${kpiFilteredProjects.length})` :
          selectedKPIFilter === 'amber' ? `Amber RAG Projects (${kpiFilteredProjects.length})` :
          selectedKPIFilter === 'green' ? `Green RAG Projects (${kpiFilteredProjects.length})` :
          selectedKPIFilter === 'onhold' ? `On Hold Projects (${kpiFilteredProjects.length})` :
          selectedKPIFilter === 'completed' ? `Completed Projects (${kpiFilteredProjects.length})` : ''
        ),
        React.createElement('button', {
          onClick: () => setSelectedKPIFilter(null),
          className: `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${darkMode ? 'bg-slate-600 text-gray-200 hover:bg-slate-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
        }, 'Close ✕')
      ),
      // Projects table
      React.createElement('div', {
        className: 'p-4'
      },
        React.createElement(DataTable, {
          data: kpiFilteredProjects,
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
                className: `px-2 py-1 rounded text-white text-xs font-semibold ${row.ragStatus.color}`
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
    ),

    // SECTION 1: Risk Analysis
    React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h3', {
        className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, '🚨 Risk Analysis'),

      // Risk Alert Cards
      React.createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'
      },
        React.createElement(RiskAlertCard, {
          title: 'Expiring ≤ 7 Days',
          value: analyticsData.criticalRiskCount,
          severity: 'critical',
          alertType: 'critical',
          onClick: handleRiskAlertClick
        }),
        React.createElement(RiskAlertCard, {
          title: 'All Red Projects',
          value: analyticsData.highRiskCount,
          severity: 'high',
          alertType: 'high',
          onClick: handleRiskAlertClick
        }),
        React.createElement(RiskAlertCard, {
          title: 'All Amber Projects',
          value: analyticsData.mediumRiskCount,
          severity: 'medium',
          alertType: 'medium',
          onClick: handleRiskAlertClick
        }),
        React.createElement(RiskAlertCard, {
          title: 'On Hold Projects',
          value: analyticsData.onHoldRiskCount,
          severity: 'low',
          alertType: 'onhold',
          onClick: handleRiskAlertClick
        })
      ),

      // Expandable section for Risk Alert details
      selectedRiskAlert && React.createElement('div', {
        className: `mb-6 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} shadow-lg border-2 ${
          selectedRiskAlert === 'critical' ? 'border-red-600' :
          selectedRiskAlert === 'high' ? 'border-red-500' :
          selectedRiskAlert === 'medium' ? 'border-orange-500' :
          'border-yellow-500'
        }`
      },
        // Header with title and close button
        React.createElement('div', {
          className: `flex items-center justify-between p-4 ${
            selectedRiskAlert === 'critical' ? (darkMode ? 'bg-red-900/30' : 'bg-red-50') :
            selectedRiskAlert === 'high' ? (darkMode ? 'bg-red-900/20' : 'bg-red-50/70') :
            selectedRiskAlert === 'medium' ? (darkMode ? 'bg-orange-900/20' : 'bg-orange-50') :
            (darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50')
          } border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
        },
          React.createElement('h3', {
            className: `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
          },
            selectedRiskAlert === 'critical' ? `🚨 Critical Risk Projects (${riskAlertFilteredProjects.length})` :
            selectedRiskAlert === 'high' ? `🔴 High Risk Projects (${riskAlertFilteredProjects.length})` :
            selectedRiskAlert === 'medium' ? `⚠️ Medium Risk Projects (${riskAlertFilteredProjects.length})` :
            `⏸️ On Hold Projects (${riskAlertFilteredProjects.length})`
          ),
          React.createElement('button', {
            onClick: () => setSelectedRiskAlert(null),
            className: `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${darkMode ? 'bg-slate-600 text-gray-200 hover:bg-slate-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }, 'Close ✕')
        ),
        // Projects table
        React.createElement('div', {
          className: 'p-4'
        },
          React.createElement(DataTable, {
            data: riskAlertFilteredProjects,
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
                  className: `px-2 py-1 rounded text-white text-xs font-semibold ${row.ragStatus.color}`
                }, row.ragStatus.label)
              },
              {
                header: 'Due Date',
                render: (row) => formatDate(row.finishDate)
              },
              {
                header: 'Days Until Deadline',
                render: (row) => {
                  if (!row.finishDate) return '-';
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  const finish = new Date(row.finishDate);
                  finish.setHours(0, 0, 0, 0);
                  const days = Math.ceil((finish - now) / (1000 * 60 * 60 * 24));
                  const color = days < 0 ? 'text-red-600 font-bold' : days <= 7 ? 'text-orange-600 font-bold' : 'text-gray-700';
                  return React.createElement('span', { className: color },
                    days < 0 ? `${Math.abs(days)} days overdue` : `${days} days`
                  );
                }
              },
              { header: 'PM', key: 'projectManager' },
              { header: 'BP', key: 'businessPartner' }
            ]
          })
        )
      )
    ),

    // SECTION 2: Distribution & Pipeline
    React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h3', {
        className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, '📈 Distribution & Pipeline'),

      // Pipeline Status Cards Grid
      React.createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6'
      },
        analyticsData.projectsByKanban.map((statusData, index) =>
          React.createElement(PipelineStatusCard, {
            key: statusData.columnKey,
            status: statusData.status,
            count: statusData.count,
            percentage: analyticsData.totalProjects > 0 ? Math.round((statusData.count / analyticsData.totalProjects) * 100) : 0,
            columnKey: statusData.columnKey,
            topDivisions: statusData.topDivisions,
            onClick: handlePipelineStatusClick
          })
        )
      ),

      // Expandable section for Pipeline Status details
      pipelineStatusData && React.createElement('div', {
        className: `mt-6 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} shadow-lg border-2 border-blue-500`
      },
        // Header with title and close button
        React.createElement('div', {
          className: `flex items-center justify-between p-4 ${darkMode ? 'bg-slate-600 border-b border-slate-500' : 'bg-blue-50 border-b border-blue-200'}`
        },
          React.createElement('h3', {
            className: `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
          }, `${pipelineStatusData.status} - Full Division Breakdown (${pipelineStatusData.count} projects)`),
          React.createElement('button', {
            onClick: () => setSelectedPipelineStatus(null),
            className: `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${darkMode ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }, 'Close ✕')
        ),

        // Division breakdown table
        React.createElement('div', {
          className: 'p-4'
        },
          React.createElement('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'
          },
            // Division breakdown chart
            React.createElement('div', null,
              React.createElement('h4', {
                className: `text-md font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, 'Division Distribution'),
              React.createElement(DataTable, {
                data: pipelineStatusData.allDivisions,
                columns: [
                  { header: 'Division', key: 'division' },
                  { header: 'Projects', key: 'count' },
                  {
                    header: '% of Status',
                    render: (row) => `${Math.round((row.count / pipelineStatusData.count) * 100)}%`
                  }
                ]
              })
            ),

            // Summary stats
            React.createElement('div', {
              className: 'space-y-4'
            },
              React.createElement('h4', {
                className: `text-md font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, 'Summary Statistics'),
              React.createElement('div', {
                className: `p-4 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'} border ${darkMode ? 'border-slate-500' : 'border-gray-200'}`
              },
                React.createElement('div', {
                  className: 'space-y-3'
                },
                  React.createElement('div', {
                    className: 'flex items-center justify-between'
                  },
                    React.createElement('span', {
                      className: `${darkMode ? 'text-gray-300' : 'text-gray-600'}`
                    }, 'Total Projects:'),
                    React.createElement('span', {
                      className: `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                    }, pipelineStatusData.count)
                  ),
                  React.createElement('div', {
                    className: 'flex items-center justify-between'
                  },
                    React.createElement('span', {
                      className: `${darkMode ? 'text-gray-300' : 'text-gray-600'}`
                    }, 'Divisions Involved:'),
                    React.createElement('span', {
                      className: `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                    }, pipelineStatusData.allDivisions.length)
                  ),
                  React.createElement('div', {
                    className: 'flex items-center justify-between'
                  },
                    React.createElement('span', {
                      className: `${darkMode ? 'text-gray-300' : 'text-gray-600'}`
                    }, '% of Total Portfolio:'),
                    React.createElement('span', {
                      className: `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                    }, `${Math.round((pipelineStatusData.count / analyticsData.totalProjects) * 100)}%`)
                  ),
                  React.createElement('div', {
                    className: 'flex items-center justify-between'
                  },
                    React.createElement('span', {
                      className: `${darkMode ? 'text-gray-300' : 'text-gray-600'}`
                    }, 'Top Division:'),
                    React.createElement('span', {
                      className: `font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                    }, pipelineStatusData.allDivisions[0]?.division || 'N/A')
                  )
                )
              )
            )
          ),

          // All projects in this status
          React.createElement('div', {
            className: 'mt-6'
          },
            React.createElement('h4', {
              className: `text-md font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, 'All Projects in this Status'),
            React.createElement(DataTable, {
              data: pipelineStatusData.projects,
              columns: [
                { header: 'Project', key: 'name' },
                { header: 'Division', key: 'division' },
                {
                  header: 'RAG Status',
                  render: (row) => React.createElement('span', {
                    className: `px-2 py-1 rounded text-white text-xs font-semibold ${row.ragStatus.color}`
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
        )
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
