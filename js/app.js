// js/app.js
import { phases, colors, divisionColors, WORKING_DAYS_PER_MONTH } from './utils/constants.js';
import * as dateUtils from './utils/dateUtils.js';
import { exportToExcel, importFromExcel } from './utils/excelUtils.js';
import { calculateFTEChartData } from './utils/calculations.js';
import { Header } from './components/Header.js';
import { FilterPanel } from './components/FilterPanel.js';
import { ProjectForm } from './components/ProjectForm.js';
import { GanttTimeline } from './components/GanttTimeline.js';
import { ResourcesChart } from './components/ResourcesChart.js';
import { DivisionsChart } from './components/DivisionsChart.js';
import { ActualsTimeline } from './components/ActualsTimeline.js';

const { useState, useRef, useMemo } = React;
const { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

function GanttChart() {
  // ===== STATE DECLARATIONS =====
  
  // Projects state
  const [projects, setProjects] = useState([]);
  
  // UI state
  const [hideProjectFields, setHideProjectFields] = useState(false);
  const [activeTab, setActiveTab] = useState('planner');
  const [darkMode, setDarkMode] = useState(false);
  
  // Filter state
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDivisions, setFilterDivisions] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedPMs, setSelectedPMs] = useState([]);
  const [selectedBPs, setSelectedBPs] = useState([]);
  const [showExternalPM, setShowExternalPM] = useState(true);
  const [showExternalQA, setShowExternalQA] = useState(true);
  const [pmBAU, setPmBAU] = useState('');
  const [bpBAU, setBpBAU] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);
  
  // Ref for file input
  const fileInputRef = useRef(null);

  // ===== PROJECT MANAGEMENT FUNCTIONS =====
  
  /**
   * Add a new empty project
   */
  const addProject = () => {
    const newProject = {
      name: '',
      division: '',
      projectManager: '',
      pmAllocation: '',
      businessPartner: '',
      bpAllocation: '',
      bpImplementationAllocation: '',
      pmExternalAllocation: '',
      qaExternalAllocation: '',
      bpImplementation: { start: '', finish: '' },
      plannedInvestment: { start: '', finish: '' },
      actualDates: { start: '', finish: '' },
      psd: { start: '', finish: '' },
      investment: { start: '', finish: '' },
      procurement: { start: '', finish: '' },
      implementation: { start: '', finish: '' }
    };
    setProjects([...projects, newProject]);
  };

  /**
   * Update a project field
   */
  const updateProject = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  /**
   * Update a phase's start or finish date
   */
  const updatePhase = (index, phase, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][phase][field] = value;
    setProjects(updatedProjects);
  };

  /**
   * Delete a project
   */
  const deleteProject = (index) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      setProjects(updatedProjects);
    }
  };

  // ===== EXCEL IMPORT/EXPORT FUNCTIONS =====
  
  const handleExport = () => {
    exportToExcel(projects);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    importFromExcel(file, (importedProjects) => {
      setProjects(importedProjects);
    });
    e.target.value = '';
  };

  // ===== FILTER FUNCTIONS =====
  
  /**
   * Apply the current filters
   */
  const applyFilter = () => {
    setIsFilterActive(true);
  };

  /**
   * Clear all filters
   */
  const clearFilter = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterDivisions([]);
    setSelectedProjects([]);
    setSelectedPMs([]);
    setSelectedBPs([]);
    setShowExternalPM(true);
    setShowExternalQA(true);
    setPmBAU('');
    setBpBAU('');
    setIsFilterActive(false);
  };

  // ===== COMPUTED VALUES =====
  
  /**
   * Get unique divisions from all projects
   */
  const uniqueDivisions = useMemo(() => {
    return [...new Set(projects.map(p => p.division).filter(d => d))];
  }, [projects]);

  /**
   * Get unique project managers
   */
  const uniquePMs = useMemo(() => {
    return [...new Set(projects.map(p => p.projectManager).filter(pm => pm))];
  }, [projects]);

  /**
   * Get unique business partners
   */
  const uniqueBPs = useMemo(() => {
    return [...new Set(projects.map(p => p.businessPartner).filter(bp => bp))];
  }, [projects]);

  /**
   * Get available projects for dropdown (with division info)
   */
  const availableProjectsForDropdown = useMemo(() => {
    return projects.map(p => ({
      name: p.name,
      division: p.division
    })).filter(p => p.name);
  }, [projects]);

  /**
   * Apply filters to get filtered projects
   */
  const filteredProjects = useMemo(() => {
    if (!isFilterActive) return projects;

    return projects.filter(project => {
      // Division filter
      if (filterDivisions.length > 0 && !filterDivisions.includes(project.division)) {
        return false;
      }

      // Project filter
      if (selectedProjects.length > 0 && !selectedProjects.includes(project.name)) {
        return false;
      }

      // PM filter
      if (selectedPMs.length > 0 && !selectedPMs.includes(project.projectManager)) {
        return false;
      }

      // BP filter
      if (selectedBPs.length > 0 && !selectedBPs.includes(project.businessPartner)) {
        return false;
      }

      // Date range filter - check if any phase overlaps with filter range
      if (filterStartDate || filterEndDate) {
        const filterStart = filterStartDate ? new Date(filterStartDate) : null;
        const filterEnd = filterEndDate ? new Date(filterEndDate) : null;

        let hasOverlap = false;
        phases.forEach(phase => {
          if (project[phase.key].start && project[phase.key].finish) {
            const phaseStart = new Date(project[phase.key].start);
            const phaseFinish = new Date(project[phase.key].finish);

            const startsBeforeFilterEnd = !filterEnd || phaseStart <= filterEnd;
            const endsAfterFilterStart = !filterStart || phaseFinish >= filterStart;

            if (startsBeforeFilterEnd && endsAfterFilterStart) {
              hasOverlap = true;
            }
          }
        });

        if (!hasOverlap) return false;
      }

      return true;
    });
  }, [projects, isFilterActive, filterDivisions, selectedProjects, selectedPMs, selectedBPs, filterStartDate, filterEndDate]);

  /**
   * Filtered projects including external resources (when filters exclude PMs/BPs)
   */
  const filteredProjectsForExternal = useMemo(() => {
    if (!isFilterActive) return projects;

    return projects.filter(project => {
      // Division filter
      if (filterDivisions.length > 0 && !filterDivisions.includes(project.division)) {
        return false;
      }

      // Project filter
      if (selectedProjects.length > 0 && !selectedProjects.includes(project.name)) {
        return false;
      }

      // Date range filter
      if (filterStartDate || filterEndDate) {
        const filterStart = filterStartDate ? new Date(filterStartDate) : null;
        const filterEnd = filterEndDate ? new Date(filterEndDate) : null;

        let hasOverlap = false;
        phases.forEach(phase => {
          if (project[phase.key].start && project[phase.key].finish) {
            const phaseStart = new Date(project[phase.key].start);
            const phaseFinish = new Date(project[phase.key].finish);

            const startsBeforeFilterEnd = !filterEnd || phaseStart <= filterEnd;
            const endsAfterFilterStart = !filterStart || phaseFinish >= filterStart;

            if (startsBeforeFilterEnd && endsAfterFilterStart) {
              hasOverlap = true;
            }
          }
        });

        if (!hasOverlap) return false;
      }

      return true;
    });
  }, [projects, isFilterActive, filterDivisions, selectedProjects, filterStartDate, filterEndDate]);

  // ===== TIMELINE CALCULATIONS =====
  
  const earliest = dateUtils.getEarliestDate(filteredProjects, phases, isFilterActive, filterStartDate);
  const latest = dateUtils.getLatestDate(filteredProjects, phases, isFilterActive, filterEndDate);
  const monthLabels = dateUtils.generateMonthLabels(earliest, latest);

  /**
   * Calculate bar position for Gantt timeline
   */
  const getBarPosition = (startDate, finishDate) => {
    return dateUtils.getBarPosition(
      startDate,
      finishDate,
      earliest,
      latest,
      isFilterActive,
      filterStartDate,
      filterEndDate
    );
  };

  /**
   * Get days difference between two dates
   */
  const getDaysDiff = (start, end) => {
    return dateUtils.getDaysDiff(start, end);
  };

  /**
   * Get earliest date (wrapper)
   */
  const getEarliestDate = () => earliest;

  /**
   * Get latest date (wrapper)
   */
  const getLatestDate = () => latest;

  // ===== CHART DATA CALCULATIONS =====
  
  /**
   * Calculate FTE chart data for overview
   */
  const fteChartData = useMemo(() => {
    if (filteredProjects.length === 0) return [];
    return calculateFTEChartData(
      filteredProjects,
      earliest,
      latest,
      pmBAU,
      bpBAU,
      isFilterActive,
      filterStartDate,
      filterEndDate
    );
  }, [filteredProjects, earliest, latest, pmBAU, bpBAU, isFilterActive, filterStartDate, filterEndDate]);

  // ===== RENDER FUNCTIONS =====

  /**
   * Render tab button
   */
  const renderTabButton = (tabName, label, emoji) => {
    const isActive = activeTab === tabName;
    return React.createElement('button', {
      key: tabName,
      onClick: () => setActiveTab(tabName),
      className: `px-6 py-3 text-sm font-semibold rounded-t-xl transition-all transform ${
        isActive
          ? darkMode
            ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400 shadow-lg'
            : 'bg-white text-blue-600 border-b-2 border-blue-500 shadow-lg'
          : darkMode
            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`
    }, `${emoji} ${label}`);
  };

  /**
   * Render project planner view
   */
  const renderPlannerView = () => {
    return React.createElement('div', null,
      // Project forms (only show if not hidden or if no projects)
      !hideProjectFields && React.createElement('div', {
        className: 'mb-6 space-y-4'
      },
        filteredProjects.length > 0 
          ? filteredProjects.map((project, pIndex) => {
              const actualIndex = projects.indexOf(project);
              return React.createElement(ProjectForm, {
                key: actualIndex,
                project,
                pIndex: actualIndex,
                updateProject,
                updatePhase,
                deleteProject,
                phases,
                darkMode
              });
            })
          : React.createElement('div', {
              className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
            },
              React.createElement('p', { className: 'text-lg mb-2' }, '📋 No projects yet'),
              React.createElement('p', { className: 'text-sm' }, 'Click "Add" to create your first project')
            )
      ),

      // Gantt Timeline
      filteredProjects.length > 0 && React.createElement(GanttTimeline, {
        filteredProjects,
        phases,
        monthLabels,
        getBarPosition,
        getDaysDiff,
        getEarliestDate,
        getLatestDate,
        darkMode
      })
    );
  };

  /**
   * Render resources view
   */
  const renderResourcesView = () => {
    if (filteredProjects.length === 0) {
      return React.createElement('div', {
        className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
      },
        React.createElement('p', { className: 'text-lg' }, '📊 No projects to display')
      );
    }

    return React.createElement('div', null,
      // Resources Chart (per person)
      React.createElement(ResourcesChart, {
        filteredProjects,
        filteredProjectsForExternal,
        earliestDate: earliest,
        latestDate: latest,
        isFilterActive,
        filterStartDate,
        filterEndDate,
        pmBAU,
        bpBAU,
        showExternalPM,
        showExternalQA,
        darkMode,
        colors
      })
    );
  };

  /**
   * Render overview with consolidated metrics
   */
  const renderOverviewView = () => {
    if (filteredProjects.length === 0) {
      return React.createElement('div', {
        className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
      },
        React.createElement('p', { className: 'text-lg' }, '📊 No projects to display')
      );
    }

    return React.createElement('div', null,
      // Consolidated FTE Chart
      React.createElement('div', { className: 'mb-6' },
        React.createElement('h2', {
          className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`
        },
          React.createElement('div', {
            className: 'w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full'
          }),
          'Consolidated Resource Effort (FTE)'
        ),
        React.createElement('div', {
          className: `${darkMode ? 'bg-slate-800' : 'bg-white'} p-5 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-gray-200'} shadow-md`
        },
          React.createElement(ResponsiveContainer, { width: '100%', height: 400 },
            React.createElement(LineChart, {
              data: fteChartData,
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
                stroke: darkMode ? '#94a3b8' : '#9ca3af'
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
                wrapperStyle: { fontSize: '12px', color: darkMode ? '#e5e7eb' : '#374151' }
              }),
              React.createElement(Line, {
                type: 'monotone',
                dataKey: 'Project Managers',
                stroke: '#3b82f6',
                strokeWidth: 3,
                dot: { r: 4 },
                activeDot: { r: 6 }
              }),
              React.createElement(Line, {
                type: 'monotone',
                dataKey: 'Business Partners',
                stroke: '#10b981',
                strokeWidth: 3,
                dot: { r: 4 },
                activeDot: { r: 6 }
              })
            )
          ),
          React.createElement('div', {
            className: `mt-3 text-xs ${darkMode ? 'text-gray-300 bg-slate-700' : 'text-gray-600 bg-gray-50'} p-2 rounded`
          },
            React.createElement('strong', null, 'Note:'),
            ' This chart shows consolidated team effort. PMs work during Implementation phase, BPs work during PSD preparation and BP Implementation phase. Values are shown in FTE (Full-Time Equivalent).',
            (pmBAU || bpBAU) && React.createElement('span', null,
              ' BAU allocation included: ',
              pmBAU && `PM BAU = ${pmBAU} FTE/month`,
              pmBAU && bpBAU && ', ',
              bpBAU && `BP BAU = ${bpBAU} FTE/month`,
              '.'
            )
          )
        )
      ),

      // Divisions Chart
      React.createElement(DivisionsChart, {
        filteredProjects,
        phases,
        earliestDate: earliest,
        latestDate: latest,
        isFilterActive,
        filterStartDate,
        filterEndDate,
        darkMode,
        divisionColors
      })
    );
  };

  /**
   * Render actuals comparison view
   */
  const renderActualsView = () => {
    return React.createElement(ActualsTimeline, {
      filteredProjects,
      isFilterActive,
      filterStartDate,
      filterEndDate,
      darkMode
    });
  };

  // ===== MAIN RENDER =====
  
  return React.createElement('div', {
    className: `min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} transition-colors duration-300`
  },
    React.createElement('div', {
      className: 'max-w-[1800px] mx-auto p-6'
    },
      React.createElement('div', {
        className: `${darkMode ? 'bg-slate-800/90' : 'bg-white/80'} backdrop-blur-xl rounded-2xl shadow-2xl border ${darkMode ? 'border-slate-700' : 'border-white/50'} p-6`
      },
        // Header
        React.createElement(Header, {
          addProject,
          hideProjectFields,
          setHideProjectFields,
          onImportClick: () => fileInputRef.current?.click(),
          exportToExcel: handleExport,
          darkMode,
          setDarkMode
        }),

        // Hidden file input for import
        React.createElement('input', {
          ref: fileInputRef,
          type: 'file',
          accept: '.xlsx,.xls',
          onChange: handleImport,
          style: { display: 'none' }
        }),

        // Filter Panel
        React.createElement(FilterPanel, {
          filterStartDate,
          setFilterStartDate,
          filterEndDate,
          setFilterEndDate,
          filterDivisions,
          setFilterDivisions,
          selectedProjects,
          setSelectedProjects,
          selectedPMs,
          setSelectedPMs,
          selectedBPs,
          setSelectedBPs,
          showExternalPM,
          setShowExternalPM,
          showExternalQA,
          setShowExternalQA,
          pmBAU,
          setPmBAU,
          bpBAU,
          setBpBAU,
          isFilterActive,
          applyFilter,
          clearFilter,
          uniqueDivisions,
          uniquePMs,
          uniqueBPs,
          availableProjectsForDropdown,
          darkMode,
          hideProjectFields,
          projects,
          phases
        }),

        // Tabs
        React.createElement('div', {
          className: 'flex gap-2 mb-6 border-b-2 ' + (darkMode ? 'border-slate-700' : 'border-gray-200')
        },
          renderTabButton('planner', 'Projects & Planner', '📋'),
          renderTabButton('resources', 'Resources', '👥'),
          renderTabButton('overview', 'Overview', '📊'),
          renderTabButton('actuals', 'Actuals Comparison', '📈')
        ),

        // Tab Content
        React.createElement('div', { className: 'mt-6' },
          activeTab === 'planner' && renderPlannerView(),
          activeTab === 'resources' && renderResourcesView(),
          activeTab === 'overview' && renderOverviewView(),
          activeTab === 'actuals' && renderActualsView()
        )
      )
    )
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(GanttChart));