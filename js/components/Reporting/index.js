// js/components/Reporting/index.js

const { useState, useMemo } = React;

// Import sub-components
import { DataTable } from './ReportingTables.js';
import { TimelinePerformanceChart } from './ReportingCharts.js';
import { ActiveFiltersDisplay } from './ReportingFilters.js';
import {
  KPICardsGrid,
  RiskAlertCardsGrid,
  PipelineStatusCardsGrid,
  TeamMemberCard
} from './ReportingSummary.js';
import { Target, TrendingUp, Users, User } from '../../shared/icons/index.js';

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
 * Main Reporting Component
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
  const [selectedBPorPM, setSelectedBPorPM] = useState(null); // { type: 'bp'|'pm', name: string }

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

    // Risk Alert Metrics - New Day-Based Logic
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Calculate days until deadline for each project
    const projectsWithDays = projectsWithRAG.map(p => {
      if (!p.finishDate) return { ...p, daysUntilDeadline: null };
      const finishDate = new Date(p.finishDate);
      finishDate.setHours(0, 0, 0, 0);
      const daysUntilDeadline = Math.ceil((finishDate - currentDate) / (1000 * 60 * 60 * 24));
      return { ...p, daysUntilDeadline };
    });

    // OVERDUE RISK: Projects past their deadline (< 0 days)
    const overdueRiskProjects = projectsWithDays.filter(p =>
      p.daysUntilDeadline !== null && p.daysUntilDeadline < 0 && p.column !== 'onhold' && p.column !== 'done'
    );
    const overdueRiskCount = overdueRiskProjects.length;

    // CRITICAL RISK: 0-4 days until deadline
    const criticalRiskProjects = projectsWithDays.filter(p =>
      p.daysUntilDeadline !== null && p.daysUntilDeadline >= 0 && p.daysUntilDeadline <= 4 && p.column !== 'onhold' && p.column !== 'done'
    );
    const criticalRiskCount = criticalRiskProjects.length;

    // HIGH RISK: 5-14 days until deadline
    const highRiskProjects = projectsWithDays.filter(p =>
      p.daysUntilDeadline !== null && p.daysUntilDeadline >= 5 && p.daysUntilDeadline <= 14 && p.column !== 'onhold' && p.column !== 'done'
    );
    const highRiskCount = highRiskProjects.length;

    // MEDIUM RISK: 10-15 days until deadline (note: overlaps with high at 10-14, high takes priority in display)
    const mediumRiskProjects = projectsWithDays.filter(p =>
      p.daysUntilDeadline !== null && p.daysUntilDeadline >= 10 && p.daysUntilDeadline <= 15 && p.column !== 'onhold' && p.column !== 'done'
    );
    const mediumRiskCount = mediumRiskProjects.length;

    // LOW RISK: On Hold projects + 16-21 days until deadline
    const lowRiskProjects = projectsWithDays.filter(p =>
      p.column === 'onhold' || (p.daysUntilDeadline !== null && p.daysUntilDeadline >= 16 && p.daysUntilDeadline <= 21 && p.column !== 'done')
    );
    const lowRiskCount = lowRiskProjects.length;
    const onHoldRiskCount = onHoldCount; // Keep for backwards compatibility

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

    // Report: Projects by Business Partner and Project Manager (Active projects only)
    const activeStatuses = ['psdpre', 'psdready', 'invapproved', 'procurement', 'implementation', 'uat'];
    const activeProjects = projectsWithRAG.filter(p => activeStatuses.includes(p.column));

    // Group by Business Partner
    const projectsByBP = {};
    activeProjects.forEach(project => {
      const bp = project.businessPartner || 'Unassigned';
      if (!projectsByBP[bp]) {
        projectsByBP[bp] = [];
      }
      projectsByBP[bp].push(project);
    });

    // Group by Project Manager
    const projectsByPM = {};
    activeProjects.forEach(project => {
      const pm = project.projectManager || 'Unassigned';
      if (!projectsByPM[pm]) {
        projectsByPM[pm] = [];
      }
      projectsByPM[pm].push(project);
    });

    // Convert to arrays and sort by project count
    const bpSummary = Object.entries(projectsByBP)
      .map(([bp, projects]) => ({
        name: bp,
        projects: projects,
        count: projects.length
      }))
      .sort((a, b) => b.count - a.count);

    const pmSummary = Object.entries(projectsByPM)
      .map(([pm, projects]) => ({
        name: pm,
        projects: projects,
        count: projects.length
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalProjects,
      redCount,
      amberCount,
      greenCount,
      onHoldCount,
      completedCount,
      overdueRiskCount,
      overdueRiskProjects,
      criticalRiskCount,
      criticalRiskProjects,
      highRiskCount,
      highRiskProjects,
      mediumRiskCount,
      mediumRiskProjects,
      lowRiskCount,
      lowRiskProjects,
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
      allKanbanColumns,
      bpSummary,
      pmSummary,
      activeProjects
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
      case 'overdue':
        return analyticsData.overdueRiskProjects;
      case 'critical':
        return analyticsData.criticalRiskProjects;
      case 'high':
        return analyticsData.highRiskProjects;
      case 'medium':
        return analyticsData.mediumRiskProjects;
      case 'low':
        return analyticsData.lowRiskProjects;
      case 'onhold':
        return analyticsData.projectsWithRAG.filter(p => p.column === 'onhold');
      default:
        return [];
    }
  }, [selectedRiskAlert, analyticsData]);

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

  return React.createElement('div', {
    className: 'space-y-6'
  },
    // Header - Matching Actions Tab Style
    React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h2', {
        className: `text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
      },
        React.createElement('div', {
          className: 'w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full'
        }),
        'Reporting Dashboard'
      ),
      React.createElement('p', {
        className: `mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, `Showing data for ${filteredProjects.length} of ${projects.length} projects`),

      // Active filters display
      React.createElement(ActiveFiltersDisplay, {
        selectedDivision,
        selectedRAGStatus,
        selectedKanbanStatus,
        setSelectedDivision,
        setSelectedRAGStatus,
        setSelectedKanbanStatus,
        resetFilters,
        getColumnDisplayName,
        darkMode
      })
    ),

    // KPI Cards Section (Report 3)
    React.createElement(KPICardsGrid, {
      analyticsData,
      selectedKPIFilter,
      handleKPICardClick,
      darkMode
    }),

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
          ],
          darkMode
        })
      )
    ),

    // SECTION 1: Risk Analysis
    React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h3', {
        className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center gap-2`
      },
        React.createElement(Target, { className: 'w-7 h-7' }),
        'Risk Analysis'
      ),

      // Risk Alert Cards
      React.createElement(RiskAlertCardsGrid, {
        analyticsData,
        selectedRiskAlert,
        handleRiskAlertClick,
        darkMode
      }),

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
            selectedRiskAlert === 'overdue' ? `OVERDUE RISK: Past Deadline (${riskAlertFilteredProjects.length} projects)` :
            selectedRiskAlert === 'critical' ? `CRITICAL RISK: 0-4 Days (${riskAlertFilteredProjects.length} projects)` :
            selectedRiskAlert === 'high' ? `HIGH RISK: 5-14 Days (${riskAlertFilteredProjects.length} projects)` :
            selectedRiskAlert === 'medium' ? `MEDIUM RISK: 10-15 Days (${riskAlertFilteredProjects.length} projects)` :
            selectedRiskAlert === 'low' ? `LOW RISK: On Hold + 16-21 Days (${riskAlertFilteredProjects.length} projects)` :
            `Projects (${riskAlertFilteredProjects.length})`
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
                render: (row) => {
                  const statusText = getColumnDisplayName(row.column);
                  // Make "On Hold" bold and yellow when showing onhold risk alert
                  if (selectedRiskAlert === 'onhold' && row.column === 'onhold') {
                    return React.createElement('span', {
                      className: `font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`
                    }, statusText);
                  }
                  return statusText;
                }
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
            ],
            darkMode
          })
        )
      )
    ),

    // SECTION 2: Distribution & Pipeline
    React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h3', {
        className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center gap-2`
      },
        React.createElement(TrendingUp, { className: 'w-7 h-7' }),
        'Distribution & Pipeline'
      ),

      // Pipeline Status Cards Grid
      React.createElement(PipelineStatusCardsGrid, {
        analyticsData,
        selectedPipelineStatus,
        handlePipelineStatusClick,
        darkMode
      }),

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

        // All projects in this status (moved to top)
        React.createElement('div', {
          className: 'p-4'
        },
          React.createElement('div', null,
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
              ],
              darkMode
            })
          ),

          // Division breakdown and summary stats
          React.createElement('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'
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
                ],
                darkMode
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
          )
        )
      )
    ),

    // SECTION 3: Active Projects by Business Partner & Project Manager
    React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
      React.createElement('h3', {
        className: `text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center gap-2`
      },
        React.createElement(Users, { className: 'w-7 h-7' }),
        'Active Projects by Team'
      ),
      React.createElement('p', {
        className: `mb-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, `Showing ${analyticsData.activeProjects.length} active projects currently being worked on (excluding On Hold, Backlog, and Done)`),

      // Summary Cards Section (Top Row)
      React.createElement('div', {
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'
      },
        // All Projects by Project Manager Card
        React.createElement('div', {
          className: `rounded-lg p-6 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-2 border-purple-500 shadow-lg`
        },
          React.createElement('div', {
            className: 'flex items-center gap-3 mb-4'
          },
            React.createElement('div', {
              className: 'w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center'
            },
              React.createElement(User, { className: 'w-6 h-6 text-white' })
            ),
            React.createElement('div', null,
              React.createElement('h5', {
                className: `text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, 'All Projects by Project Manager'),
              React.createElement('p', {
                className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              }, `${analyticsData.pmSummary.length} Project Managers managing ${analyticsData.activeProjects.length} active projects`)
            )
          ),
          React.createElement('div', {
            className: 'space-y-2 max-h-64 overflow-y-auto'
          },
            analyticsData.pmSummary.length > 0
              ? analyticsData.pmSummary.map((pm, idx) =>
                  React.createElement('div', {
                    key: idx,
                    className: `p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-100'} flex items-center justify-between cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all`,
                    onClick: () => setSelectedBPorPM({ type: 'pm', name: pm.name })
                  },
                    React.createElement('div', {
                      className: 'flex-1'
                    },
                      React.createElement('div', {
                        className: `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                      }, pm.name),
                      React.createElement('div', {
                        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`
                      }, pm.projects.slice(0, 2).map(p => p.name).join(', ') + (pm.projects.length > 2 ? ` +${pm.projects.length - 2} more` : ''))
                    ),
                    React.createElement('div', {
                      className: `text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`
                    }, pm.count)
                  )
                )
              : React.createElement('div', {
                  className: `text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                }, 'No Project Managers assigned')
          )
        ),

        // All Projects by Business Partner Card
        React.createElement('div', {
          className: `rounded-lg p-6 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-2 border-blue-500 shadow-lg`
        },
          React.createElement('div', {
            className: 'flex items-center gap-3 mb-4'
          },
            React.createElement('div', {
              className: 'w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'
            },
              React.createElement(Users, { className: 'w-6 h-6 text-white' })
            ),
            React.createElement('div', null,
              React.createElement('h5', {
                className: `text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, 'All Projects by Business Partner'),
              React.createElement('p', {
                className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              }, `${analyticsData.bpSummary.length} Business Partners managing ${analyticsData.activeProjects.length} active projects`)
            )
          ),
          React.createElement('div', {
            className: 'space-y-2 max-h-64 overflow-y-auto'
          },
            analyticsData.bpSummary.length > 0
              ? analyticsData.bpSummary.map((bp, idx) =>
                  React.createElement('div', {
                    key: idx,
                    className: `p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-100'} flex items-center justify-between cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all`,
                    onClick: () => setSelectedBPorPM({ type: 'bp', name: bp.name })
                  },
                    React.createElement('div', {
                      className: 'flex-1'
                    },
                      React.createElement('div', {
                        className: `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                      }, bp.name),
                      React.createElement('div', {
                        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`
                      }, bp.projects.slice(0, 2).map(p => p.name).join(', ') + (bp.projects.length > 2 ? ` +${bp.projects.length - 2} more` : ''))
                    ),
                    React.createElement('div', {
                      className: `text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                    }, bp.count)
                  )
                )
              : React.createElement('div', {
                  className: `text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                }, 'No Business Partners assigned')
          )
        )
      ),

      // Consolidated View Cards Section (Bottom Row)
      React.createElement('div', {
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'
      },
        // Consolidated: All Active Projects Grouped by Project Manager
        React.createElement('div', {
          className: `rounded-lg p-6 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-2 border-purple-500 shadow-lg`
        },
          React.createElement('div', {
            className: 'flex items-center gap-3 mb-4'
          },
            React.createElement('div', {
              className: 'w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center'
            },
              React.createElement(User, { className: 'w-6 h-6 text-white' })
            ),
            React.createElement('div', null,
              React.createElement('h5', {
                className: `text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, 'Consolidated View: Projects by PM'),
              React.createElement('p', {
                className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              }, `All ${analyticsData.activeProjects.length} active projects grouped by Project Manager`)
            )
          ),
          React.createElement('div', {
            className: 'max-h-96 overflow-y-auto'
          },
            analyticsData.pmSummary.length > 0
              ? analyticsData.pmSummary.map((pm, pmIdx) =>
                  React.createElement('div', {
                    key: pmIdx,
                    className: `mb-4 ${pmIdx !== analyticsData.pmSummary.length - 1 ? 'pb-4 border-b ' + (darkMode ? 'border-slate-600' : 'border-gray-200') : ''}`
                  },
                    React.createElement('div', {
                      className: `flex items-center justify-between mb-2 cursor-pointer hover:opacity-80`,
                      onClick: () => setSelectedBPorPM({ type: 'pm', name: pm.name })
                    },
                      React.createElement('div', {
                        className: `text-md font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`
                      }, pm.name),
                      React.createElement('div', {
                        className: `px-3 py-1 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white text-sm font-bold`
                      }, `${pm.count} projects`)
                    ),
                    React.createElement('div', {
                      className: 'space-y-1'
                    },
                      pm.projects.map((project, projIdx) =>
                        React.createElement('div', {
                          key: projIdx,
                          className: `p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'} flex items-center justify-between`
                        },
                          React.createElement('div', {
                            className: 'flex-1'
                          },
                            React.createElement('div', {
                              className: `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                            }, project.name),
                            React.createElement('div', {
                              className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`
                            }, `${project.division || 'N/A'} • ${getColumnDisplayName(project.column)}`)
                          ),
                          React.createElement('div', {
                            className: `px-2 py-1 rounded text-xs font-semibold text-white ${project.ragStatus.color}`
                          }, project.ragStatus.label)
                        )
                      )
                    )
                  )
                )
              : React.createElement('div', {
                  className: `text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                }, 'No Project Managers assigned')
          )
        ),

        // Consolidated: All Active Projects Grouped by Business Partner
        React.createElement('div', {
          className: `rounded-lg p-6 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-2 border-blue-500 shadow-lg`
        },
          React.createElement('div', {
            className: 'flex items-center gap-3 mb-4'
          },
            React.createElement('div', {
              className: 'w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'
            },
              React.createElement(Users, { className: 'w-6 h-6 text-white' })
            ),
            React.createElement('div', null,
              React.createElement('h5', {
                className: `text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, 'Consolidated View: Projects by BP'),
              React.createElement('p', {
                className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              }, `All ${analyticsData.activeProjects.length} active projects grouped by Business Partner`)
            )
          ),
          React.createElement('div', {
            className: 'max-h-96 overflow-y-auto'
          },
            analyticsData.bpSummary.length > 0
              ? analyticsData.bpSummary.map((bp, bpIdx) =>
                  React.createElement('div', {
                    key: bpIdx,
                    className: `mb-4 ${bpIdx !== analyticsData.bpSummary.length - 1 ? 'pb-4 border-b ' + (darkMode ? 'border-slate-600' : 'border-gray-200') : ''}`
                  },
                    React.createElement('div', {
                      className: `flex items-center justify-between mb-2 cursor-pointer hover:opacity-80`,
                      onClick: () => setSelectedBPorPM({ type: 'bp', name: bp.name })
                    },
                      React.createElement('div', {
                        className: `text-md font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                      }, bp.name),
                      React.createElement('div', {
                        className: `px-3 py-1 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white text-sm font-bold`
                      }, `${bp.count} projects`)
                    ),
                    React.createElement('div', {
                      className: 'space-y-1'
                    },
                      bp.projects.map((project, projIdx) =>
                        React.createElement('div', {
                          key: projIdx,
                          className: `p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'} flex items-center justify-between`
                        },
                          React.createElement('div', {
                            className: 'flex-1'
                          },
                            React.createElement('div', {
                              className: `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                            }, project.name),
                            React.createElement('div', {
                              className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`
                            }, `${project.division || 'N/A'} • ${getColumnDisplayName(project.column)}`)
                          ),
                          React.createElement('div', {
                            className: `px-2 py-1 rounded text-xs font-semibold text-white ${project.ragStatus.color}`
                          }, project.ragStatus.label)
                        )
                      )
                    )
                  )
                )
              : React.createElement('div', {
                  className: `text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                }, 'No Business Partners assigned')
          )
        )
      ),

      // Consolidated Project List Cards Section (Third Row - All Projects in Single List)
      React.createElement('div', {
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'
      },
        // All Active Projects - PM View (Single Consolidated List)
        React.createElement('div', {
          className: `rounded-lg p-6 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-2 border-purple-500 shadow-lg`
        },
          React.createElement('div', {
            className: 'flex items-center gap-3 mb-4'
          },
            React.createElement('div', {
              className: 'w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center'
            },
              React.createElement(User, { className: 'w-6 h-6 text-white' })
            ),
            React.createElement('div', null,
              React.createElement('h5', {
                className: `text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, 'All Active Projects - PM View'),
              React.createElement('p', {
                className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              }, `Complete list of ${analyticsData.activeProjects.length} active projects with their Project Managers`)
            )
          ),
          React.createElement('div', {
            className: 'max-h-96 overflow-y-auto'
          },
            analyticsData.activeProjects.length > 0
              ? React.createElement('div', {
                  className: 'space-y-2'
                },
                  analyticsData.activeProjects.map((project, idx) =>
                    React.createElement('div', {
                      key: idx,
                      className: `p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-100'} hover:ring-2 hover:ring-purple-500 transition-all`
                    },
                      React.createElement('div', {
                        className: 'flex items-center justify-between'
                      },
                        React.createElement('div', {
                          className: 'flex-1'
                        },
                          React.createElement('div', {
                            className: `text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                          }, project.name),
                          React.createElement('div', {
                            className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`
                          }, `${project.division || 'N/A'} • ${getColumnDisplayName(project.column)}`),
                          React.createElement('div', {
                            className: `text-xs font-semibold mt-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`
                          }, `PM: ${project.projectManager || 'Unassigned'}`)
                        ),
                        React.createElement('div', {
                          className: `px-2 py-1 rounded text-xs font-semibold text-white ${project.ragStatus.color}`
                        }, project.ragStatus.label)
                      )
                    )
                  )
                )
              : React.createElement('div', {
                  className: `text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                }, 'No active projects')
          )
        ),

        // All Active Projects - BP View (Single Consolidated List)
        React.createElement('div', {
          className: `rounded-lg p-6 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-2 border-blue-500 shadow-lg`
        },
          React.createElement('div', {
            className: 'flex items-center gap-3 mb-4'
          },
            React.createElement('div', {
              className: 'w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'
            },
              React.createElement(Users, { className: 'w-6 h-6 text-white' })
            ),
            React.createElement('div', null,
              React.createElement('h5', {
                className: `text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, 'All Active Projects - BP View'),
              React.createElement('p', {
                className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
              }, `Complete list of ${analyticsData.activeProjects.length} active projects with their Business Partners`)
            )
          ),
          React.createElement('div', {
            className: 'max-h-96 overflow-y-auto'
          },
            analyticsData.activeProjects.length > 0
              ? React.createElement('div', {
                  className: 'space-y-2'
                },
                  analyticsData.activeProjects.map((project, idx) =>
                    React.createElement('div', {
                      key: idx,
                      className: `p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-100'} hover:ring-2 hover:ring-blue-500 transition-all`
                    },
                      React.createElement('div', {
                        className: 'flex items-center justify-between'
                      },
                        React.createElement('div', {
                          className: 'flex-1'
                        },
                          React.createElement('div', {
                            className: `text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                          }, project.name),
                          React.createElement('div', {
                            className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`
                          }, `${project.division || 'N/A'} • ${getColumnDisplayName(project.column)}`),
                          React.createElement('div', {
                            className: `text-xs font-semibold mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                          }, `BP: ${project.businessPartner || 'Unassigned'}`)
                        ),
                        React.createElement('div', {
                          className: `px-2 py-1 rounded text-xs font-semibold text-white ${project.ragStatus.color}`
                        }, project.ragStatus.label)
                      )
                    )
                  )
                )
              : React.createElement('div', {
                  className: `text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                }, 'No active projects')
          )
        )
      ),

      // Expandable section for selected BP/PM details
      selectedBPorPM && React.createElement('div', {
        className: `mt-6 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} shadow-lg border-2 border-blue-500`
      },
        // Header with title and close button
        React.createElement('div', {
          className: `flex items-center justify-between p-4 ${darkMode ? 'bg-slate-600 border-b border-slate-500' : 'bg-blue-50 border-b border-blue-200'}`
        },
          React.createElement('h3', {
            className: `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
          }, `${selectedBPorPM.type === 'bp' ? 'Business Partner' : 'Project Manager'}: ${selectedBPorPM.name}`),
          React.createElement('button', {
            onClick: () => setSelectedBPorPM(null),
            className: `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${darkMode ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }, 'Close ✕')
        ),
        // Projects table
        React.createElement('div', {
          className: 'p-4'
        },
          React.createElement(DataTable, {
            data: selectedBPorPM.type === 'bp'
              ? analyticsData.bpSummary.find(bp => bp.name === selectedBPorPM.name)?.projects || []
              : analyticsData.pmSummary.find(pm => pm.name === selectedBPorPM.name)?.projects || [],
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
            ],
            darkMode
          })
        )
      )
    ),

    // SECTION 4: Timeline Performance (Report 6)
    analyticsData.projectsWithDelays.length > 0 && React.createElement(TimelinePerformanceChart, {
      projectsWithDelays: analyticsData.projectsWithDelays,
      darkMode
    }),

    // Timeline delays table
    analyticsData.projectsWithDelays.length > 0 && React.createElement('div', {
      className: `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`
    },
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
        ],
        darkMode
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
        ],
        darkMode
      })
    )
  );
}
