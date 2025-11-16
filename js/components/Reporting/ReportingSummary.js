// js/components/Reporting/ReportingSummary.js

import {
  PauseCircle,
  Inbox,
  FileEdit,
  CheckSquare,
  DollarSign,
  ShoppingCart,
  Settings,
  Flask,
  PartyPopper,
  FolderKanban,
  TrendingUp,
  Target,
  Activity,
  Users,
  User
} from '../../shared/icons/index.js';

/**
 * ReportingSummary Component
 *
 * Summary statistics cards including KPI metrics, risk alerts, and pipeline status.
 * Displays total projects, phases, resources, and interactive cards.
 *
 * Props:
 * - analyticsData: Object containing all analytics calculations
 * - selectedKPIFilter: Currently selected KPI filter
 * - selectedRiskAlert: Currently selected risk alert
 * - selectedPipelineStatus: Currently selected pipeline status
 * - handleKPICardClick: Function to handle KPI card clicks
 * - handleRiskAlertClick: Function to handle risk alert card clicks
 * - handlePipelineStatusClick: Function to handle pipeline status card clicks
 * - darkMode: Boolean for dark mode styling
 */

/**
 * KPI Card Component
 */
export function KPICard({ title, value, percentage, color, Icon, filterType, onClick, selectedKPIFilter, darkMode }) {
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
      Icon && React.createElement(Icon, {
        className: `w-12 h-12 opacity-20 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      })
    )
  );
}

/**
 * Risk Alert Card Component
 */
export function RiskAlertCard({ title, value, severity, Icon, alertType, onClick, selectedRiskAlert, darkMode }) {
  const isSelected = selectedRiskAlert === alertType;
  const isCritical = alertType === 'critical';

  // Define severity styles
  const severityStyles = {
    overdue: {
      border: 'border-red-700',
      bg: darkMode ? 'bg-red-950/40' : 'bg-red-100',
      text: darkMode ? 'text-red-200' : 'text-red-800',
      pulse: 'animate-pulse'
    },
    critical: {
      border: 'border-red-600',
      bg: darkMode ? 'bg-red-900/30' : 'bg-red-50',
      text: darkMode ? 'text-red-300' : 'text-red-700',
      pulse: 'animate-pulse'
    },
    high: {
      border: 'border-red-500',
      bg: darkMode ? 'bg-red-900/20' : 'bg-red-50/70',
      text: darkMode ? 'text-red-400' : 'text-red-600',
      pulse: ''
    },
    medium: {
      border: 'border-orange-500',
      bg: darkMode ? 'bg-orange-900/20' : 'bg-orange-50',
      text: darkMode ? 'text-orange-400' : 'text-orange-600',
      pulse: ''
    },
    low: {
      border: 'border-yellow-500',
      bg: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
      text: darkMode ? 'text-yellow-400' : 'text-yellow-600',
      pulse: ''
    }
  };

  const style = severityStyles[severity];
  const isOverdue = alertType === 'overdue';

  return React.createElement('div', {
    className: `rounded-lg p-4 ${style.bg} border-2 ${style.border} shadow-lg cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl ${isSelected ? 'ring-4 ring-blue-500 scale-105' : ''} ${(isCritical || isOverdue) && !isSelected ? style.pulse : ''}`,
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
      Icon && React.createElement(Icon, {
        className: `w-12 h-12 ${style.text} ${(isCritical || isOverdue) ? style.pulse : ''}`
      })
    )
  );
}

/**
 * Pipeline Status Card Component
 */
export function PipelineStatusCard({
  status,
  count,
  percentage,
  columnKey,
  topDivisions,
  onClick,
  selectedPipelineStatus,
  darkMode
}) {
  const isSelected = selectedPipelineStatus === columnKey;

  // Define status colors and icon components
  const statusStyles = {
    'onhold': { color: 'border-orange-500', Icon: PauseCircle, gradient: 'from-orange-500 to-orange-600' },
    'backlog': { color: 'border-gray-500', Icon: Inbox, gradient: 'from-gray-500 to-gray-600' },
    'psdpre': { color: 'border-blue-500', Icon: FileEdit, gradient: 'from-blue-500 to-blue-600' },
    'psdready': { color: 'border-cyan-500', Icon: CheckSquare, gradient: 'from-cyan-500 to-cyan-600' },
    'invapproved': { color: 'border-green-500', Icon: DollarSign, gradient: 'from-green-500 to-green-600' },
    'procurement': { color: 'border-yellow-500', Icon: ShoppingCart, gradient: 'from-yellow-500 to-yellow-600' },
    'implementation': { color: 'border-purple-500', Icon: Settings, gradient: 'from-purple-500 to-purple-600' },
    'uat': { color: 'border-pink-500', Icon: Flask, gradient: 'from-pink-500 to-pink-600' },
    'done': { color: 'border-emerald-500', Icon: PartyPopper, gradient: 'from-emerald-500 to-emerald-600' }
  };

  const style = statusStyles[columnKey] || { color: 'border-gray-500', Icon: Inbox, gradient: 'from-gray-500 to-gray-600' };

  return React.createElement('div', {
    className: `relative rounded-xl p-6 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-2 ${style.color} shadow-lg cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl ${isSelected ? 'ring-4 ring-blue-500 scale-105' : ''}`,
    onClick: () => onClick(columnKey)
  },
    // Icon badge
    React.createElement('div', {
      className: `absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br ${style.gradient} rounded-full flex items-center justify-center shadow-lg`
    },
      React.createElement(style.Icon, { className: 'w-6 h-6 text-white' })
    ),

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
}

/**
 * KPI Cards Grid Section
 */
export function KPICardsGrid({ analyticsData, selectedKPIFilter, handleKPICardClick, darkMode }) {
  return React.createElement('div', {
    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'
  },
    React.createElement(KPICard, {
      title: 'Total Projects',
      value: analyticsData.totalProjects,
      color: 'border-blue-500',
      Icon: FolderKanban,
      filterType: 'total',
      onClick: handleKPICardClick,
      selectedKPIFilter,
      darkMode
    }),
    React.createElement(KPICard, {
      title: 'Red RAG',
      value: analyticsData.redCount,
      percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.redCount / analyticsData.totalProjects) * 100) : 0,
      color: 'border-red-500',
      Icon: Target,
      filterType: 'red',
      onClick: handleKPICardClick,
      selectedKPIFilter,
      darkMode
    }),
    React.createElement(KPICard, {
      title: 'Amber RAG',
      value: analyticsData.amberCount,
      percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.amberCount / analyticsData.totalProjects) * 100) : 0,
      color: 'border-yellow-500',
      Icon: Target,
      filterType: 'amber',
      onClick: handleKPICardClick,
      selectedKPIFilter,
      darkMode
    }),
    React.createElement(KPICard, {
      title: 'Green RAG',
      value: analyticsData.greenCount,
      percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.greenCount / analyticsData.totalProjects) * 100) : 0,
      color: 'border-green-500',
      Icon: CheckSquare,
      filterType: 'green',
      onClick: handleKPICardClick,
      selectedKPIFilter,
      darkMode
    }),
    React.createElement(KPICard, {
      title: 'On Hold',
      value: analyticsData.onHoldCount,
      percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.onHoldCount / analyticsData.totalProjects) * 100) : 0,
      color: 'border-orange-500',
      Icon: PauseCircle,
      filterType: 'onhold',
      onClick: handleKPICardClick,
      selectedKPIFilter,
      darkMode
    }),
    React.createElement(KPICard, {
      title: 'Completed',
      value: analyticsData.completedCount,
      percentage: analyticsData.totalProjects > 0 ? Math.round((analyticsData.completedCount / analyticsData.totalProjects) * 100) : 0,
      color: 'border-emerald-500',
      Icon: CheckSquare,
      filterType: 'completed',
      onClick: handleKPICardClick,
      selectedKPIFilter,
      darkMode
    })
  );
}

/**
 * Risk Alert Cards Grid Section
 */
export function RiskAlertCardsGrid({ analyticsData, selectedRiskAlert, handleRiskAlertClick, darkMode }) {
  return React.createElement('div', {
    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6'
  },
    React.createElement(RiskAlertCard, {
      title: 'Past Deadline',
      value: analyticsData.overdueRiskCount,
      severity: 'overdue',
      Icon: Activity,
      alertType: 'overdue',
      onClick: handleRiskAlertClick,
      selectedRiskAlert,
      darkMode
    }),
    React.createElement(RiskAlertCard, {
      title: '0-4 Days',
      value: analyticsData.criticalRiskCount,
      severity: 'critical',
      Icon: Target,
      alertType: 'critical',
      onClick: handleRiskAlertClick,
      selectedRiskAlert,
      darkMode
    }),
    React.createElement(RiskAlertCard, {
      title: '5-14 Days',
      value: analyticsData.highRiskCount,
      severity: 'high',
      Icon: Target,
      alertType: 'high',
      onClick: handleRiskAlertClick,
      selectedRiskAlert,
      darkMode
    }),
    React.createElement(RiskAlertCard, {
      title: '10-15 Days',
      value: analyticsData.mediumRiskCount,
      severity: 'medium',
      Icon: Target,
      alertType: 'medium',
      onClick: handleRiskAlertClick,
      selectedRiskAlert,
      darkMode
    }),
    React.createElement(RiskAlertCard, {
      title: 'On Hold + 16-21 Days',
      value: analyticsData.lowRiskCount,
      severity: 'low',
      Icon: PauseCircle,
      alertType: 'low',
      onClick: handleRiskAlertClick,
      selectedRiskAlert,
      darkMode
    })
  );
}

/**
 * Pipeline Status Cards Grid Section
 */
export function PipelineStatusCardsGrid({
  analyticsData,
  selectedPipelineStatus,
  handlePipelineStatusClick,
  darkMode
}) {
  return React.createElement('div', {
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
        onClick: handlePipelineStatusClick,
        selectedPipelineStatus,
        darkMode
      })
    )
  );
}

/**
 * Team Member Card Component (for BP/PM in Active Projects section)
 * Similar to Pipeline cards but smaller
 */
export function TeamMemberCard({
  name,
  count,
  projects,
  totalActive,
  type,
  isSelected,
  onClick,
  darkMode
}) {
  const Icon = type === 'bp' ? Users : User;
  const gradient = type === 'bp' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600';
  const borderColor = type === 'bp' ? 'border-blue-500' : 'border-purple-500';

  return React.createElement('div', {
    className: `relative rounded-lg p-4 ${darkMode ? 'bg-slate-700' : 'bg-white'} border-2 ${borderColor} shadow-md cursor-pointer transition-all transform hover:scale-105 hover:shadow-xl ${isSelected ? 'ring-4 ring-blue-500 scale-105' : ''}`,
    onClick
  },
    // Icon badge
    React.createElement('div', {
      className: `absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-lg`
    },
      React.createElement(Icon, { className: 'w-5 h-5 text-white' })
    ),

    // Main content
    React.createElement('div', {
      className: 'mb-3'
    },
      React.createElement('div', {
        className: `text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1 truncate pr-8`
      }, name),
      React.createElement('div', {
        className: `text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
      }, count),
      React.createElement('div', {
        className: `text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`
      }, `${Math.round((count / totalActive) * 100)}% of active`)
    ),

    // Progress bar
    React.createElement('div', {
      className: 'mb-3'
    },
      React.createElement('div', {
        className: `w-full h-1.5 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full overflow-hidden`
      },
        React.createElement('div', {
          className: `h-full bg-gradient-to-r ${gradient} transition-all duration-500`,
          style: { width: `${Math.min((count / totalActive) * 100, 100)}%` }
        })
      )
    ),

    // Project previews
    projects && projects.length > 0 && React.createElement('div', {
      className: 'space-y-1'
    },
      projects.slice(0, 2).map((project, idx) =>
        React.createElement('div', {
          key: idx,
          className: `text-xs px-2 py-1 rounded ${darkMode ? 'bg-slate-600 text-gray-300' : 'bg-gray-100 text-gray-700'} truncate`,
          title: project.name
        }, `• ${project.name}`)
      ),
      projects.length > 2 && React.createElement('div', {
        className: `text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} pl-2`
      }, `+${projects.length - 2} more...`)
    )
  );
}
