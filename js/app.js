// js/app.js
import { phases, colors, divisionColors, WORKING_DAYS_PER_MONTH } from './utils/constants.js';
import * as dateUtils from './utils/dateUtils.js';
import { exportToExcel, importFromExcel } from './utils/excelUtils.js';
import { calculateFTEChartData } from './utils/calculations.js';
import { saveProjects, loadProjects, saveFilters, loadFilters, clearAllData } from './utils/storage.js';
import { Header } from './components/Header.js';
import { MenuBar } from './components/MenuBar.js';
import { FilterPanel } from './components/FilterPanel.js';
import { ProjectForm } from './components/ProjectForm.js';
import { GanttTimeline } from './components/GanttTimeline.js';
import { DivisionsChart } from './components/DivisionsChart.js';
import { ResourcesChart } from './components/ResourcesChart.js';
import { ActualsTimeline } from './components/ActualsTimeline.js';

const { useState, useRef, useMemo, useEffect } = React;
const { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

function GanttChart() {
  // ===== STATE DECLARATIONS =====
  
  // Projects state
  const [projects, setProjects] = useState([]);
  
  // UI state
  const [hideProjectFields, setHideProjectFields] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [darkMode, setDarkMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('success'); // 'success', 'error', 'saving'
  
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

  // ===== AUTO-SAVE & PERSISTENCE =====

  /**
   * Load projects from Supabase/localStorage on mount
   */
  useEffect(() => {
    const loadData = async () => {
      const savedProjects = await loadProjects();
      if (savedProjects && savedProjects.length > 0) {
        setProjects(savedProjects);
        console.log('Loaded', savedProjects.length, 'projects');
      }
    };
    loadData();
  }, []);

  /**
   * Load filters from localStorage on mount
   */
  useEffect(() => {
    const savedFilters = loadFilters();
    if (savedFilters) {
      setFilterStartDate(savedFilters.filterStartDate || '');
      setFilterEndDate(savedFilters.filterEndDate || '');
      setFilterDivisions(savedFilters.filterDivisions || []);
      setSelectedProjects(savedFilters.selectedProjects || []);
      setSelectedPMs(savedFilters.selectedPMs || []);
      setSelectedBPs(savedFilters.selectedBPs || []);
      setShowExternalPM(savedFilters.showExternalPM !== undefined ? savedFilters.showExternalPM : true);
      setShowExternalQA(savedFilters.showExternalQA !== undefined ? savedFilters.showExternalQA : true);
      setPmBAU(savedFilters.pmBAU || '');
      setBpBAU(savedFilters.bpBAU || '');
      setIsFilterActive(savedFilters.isFilterActive || false);
      console.log('Loaded filters from localStorage');
    }
  }, []);

  /**
   * Auto-save projects whenever they change (to Supabase and localStorage)
   */
  useEffect(() => {
    if (projects.length > 0) {
      const saveData = async () => {
        try {
          setSaveStatus('saving');
          const success = await saveProjects(projects);
          if (success) {
            setSaveStatus('success');
            console.log('Auto-saved', projects.length, 'projects to Supabase');
          } else {
            setSaveStatus('error');
            console.error('Failed to save projects');
          }
        } catch (error) {
          setSaveStatus('error');
          console.error('Error during auto-save:', error);
        }
      };
      saveData();
    }
  }, [projects]);

  /**
   * Auto-save filters whenever they change
   */
  useEffect(() => {
    const filters = {
      filterStartDate,
      filterEndDate,
      filterDivisions,
      selectedProjects,
      selectedPMs,
      selectedBPs,
      showExternalPM,
      showExternalQA,
      pmBAU,
      bpBAU,
      isFilterActive
    };
    try {
      setSaveStatus('saving');
      const success = saveFilters(filters);
      if (success) {
        setSaveStatus('success');
        console.log('Auto-saved filters to localStorage');
      } else {
        setSaveStatus('error');
        console.error('Failed to save filters');
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('Error during filter auto-save:', error);
    }
  }, [filterStartDate, filterEndDate, filterDivisions, selectedProjects, selectedPMs, selectedBPs, showExternalPM, showExternalQA, pmBAU, bpBAU, isFilterActive]);

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

  /**
   * Clear all data from localStorage and reset app
   */
  const handleClearAll = () => {
    clearAllData();
    setProjects([]);

    // Reset all filter state
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

    console.log('All data and filters cleared from localStorage');
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
      className: `px-8 py-4 text-base font-bold rounded-t-xl transition-all transform shadow-md ${
        isActive
          ? darkMode
            ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-blue-400 border-b-4 border-blue-400 shadow-xl scale-105'
            : 'bg-gradient-to-br from-white to-blue-50 text-blue-700 border-b-4 border-blue-600 shadow-xl scale-105'
          : darkMode
            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:scale-102'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
      }`
    }, `${emoji} ${label}`);
  };

  /**
   * Render projects input view
   */
  const renderProjectsView = () => {
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
      )
    );
  };

  /**
   * Render planner timeline view
   */
  const renderPlannerView = () => {
    if (filteredProjects.length === 0) {
      return React.createElement('div', {
        className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
      },
        React.createElement('p', { className: 'text-lg mb-2' }, '📅 No projects to display'),
        React.createElement('p', { className: 'text-sm' }, 'Add projects to see the timeline')
      );
    }

    return React.createElement(GanttTimeline, {
      filteredProjects,
      phases,
      monthLabels,
      getBarPosition,
      getDaysDiff,
      getEarliestDate,
      getLatestDate,
      darkMode
    });
  };

  /**
   * Render Kanban board view
   */
  const renderKanbanView = () => {
    if (filteredProjects.length === 0) {
      return React.createElement('div', {
        className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
      },
        React.createElement('p', { className: 'text-lg mb-2' }, '📋 No Projects to Display'),
        React.createElement('p', { className: 'text-sm' }, 'Add projects to see them in Kanban board view')
      );
    }

    // Kanban columns based on project phases
    const kanbanColumns = [
      { id: 'backlog', title: 'Backlog', emoji: '📝', color: 'slate' },
      { id: 'psd-prep', title: 'PSD & Inv. Prop Pre', emoji: '📋', color: 'blue' },
      { id: 'psd-ready', title: 'PSD & Inv. Prop. Ready', emoji: '✅', color: 'cyan' },
      { id: 'approved', title: 'Inv. Prop. Approved', emoji: '👍', color: 'green' },
      { id: 'procurement', title: 'Procurement', emoji: '🛒', color: 'yellow' },
      { id: 'implementation', title: 'Implementation', emoji: '⚡', color: 'orange' },
      { id: 'uat', title: 'UAT', emoji: '🧪', color: 'purple' },
      { id: 'done', title: 'Done', emoji: '🎉', color: 'emerald' }
    ];

    // Get kanban status for a project (default to 'backlog' if not set)
    const getProjectStatus = (project) => {
      return project.kanbanStatus || 'backlog';
    };

    // Handle drag start
    const handleDragStart = (e, project, projectIndex) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', projectIndex.toString());
    };

    // Handle drag over
    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    // Handle drop
    const handleDrop = (e, columnId) => {
      e.preventDefault();
      const projectIndex = parseInt(e.dataTransfer.getData('text/plain'));

      // Update the project's kanban status
      updateProject(projectIndex, 'kanbanStatus', columnId);
    };

    const projectsByColumn = {};
    kanbanColumns.forEach(col => {
      projectsByColumn[col.id] = filteredProjects.filter(p => getProjectStatus(p) === col.id);
    });

    return React.createElement('div', {
      className: 'overflow-x-auto'
    },
      React.createElement('div', {
        className: 'flex gap-4 min-w-max pb-4'
      },
        kanbanColumns.map(column => {
          const columnProjects = projectsByColumn[column.id] || [];
          const colorClasses = {
            slate: darkMode ? 'border-slate-500 bg-slate-900/20' : 'border-slate-400 bg-slate-50',
            blue: darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-400 bg-blue-50',
            cyan: darkMode ? 'border-cyan-500 bg-cyan-900/20' : 'border-cyan-400 bg-cyan-50',
            green: darkMode ? 'border-green-500 bg-green-900/20' : 'border-green-400 bg-green-50',
            yellow: darkMode ? 'border-yellow-500 bg-yellow-900/20' : 'border-yellow-400 bg-yellow-50',
            orange: darkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-400 bg-orange-50',
            purple: darkMode ? 'border-purple-500 bg-purple-900/20' : 'border-purple-400 bg-purple-50',
            emerald: darkMode ? 'border-emerald-500 bg-emerald-900/20' : 'border-emerald-400 bg-emerald-50'
          };

          return React.createElement('div', {
            key: column.id,
            className: `flex-shrink-0 w-80 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg border-2 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`,
            onDragOver: handleDragOver,
            onDrop: (e) => handleDrop(e, column.id)
          },
            // Column Header
            React.createElement('div', {
              className: `p-4 border-b-2 ${colorClasses[column.color]}`
            },
              React.createElement('div', {
                className: 'flex items-center justify-between'
              },
                React.createElement('h3', {
                  className: `text-base font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                }, `${column.emoji} ${column.title}`),
                React.createElement('span', {
                  className: `px-2 py-1 text-xs font-bold rounded-full ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }, columnProjects.length)
              )
            ),
            // Column Content
            React.createElement('div', {
              className: 'p-3 space-y-3 min-h-[200px] max-h-[600px] overflow-y-auto'
            },
              columnProjects.length > 0
                ? columnProjects.map((project, idx) => {
                    const projectIndex = projects.indexOf(project);
                    return React.createElement('div', {
                      key: idx,
                      draggable: true,
                      onDragStart: (e) => handleDragStart(e, project, projectIndex),
                      className: `p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'} cursor-move transition-all shadow-sm hover:shadow-md`
                    },
                      React.createElement('div', {
                        className: `font-bold text-sm mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                      }, project.name || 'Untitled Project'),
                      React.createElement('div', {
                        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`
                      }, project.division || 'No Division'),
                      React.createElement('div', {
                        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex gap-3`
                      },
                        project.projectManager && React.createElement('span', null, `PM: ${project.projectManager}`),
                        project.businessPartner && React.createElement('span', null, `BP: ${project.businessPartner}`)
                      )
                    );
                  })
                : React.createElement('div', {
                    className: `text-center py-8 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`
                  }, 'No projects')
            )
          );
        })
      )
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

    return React.createElement(ResourcesChart, {
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
    });
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
        // Back to Hub button
        React.createElement('div', {
          className: 'mb-6'
        },
          React.createElement('a', {
            href: 'index.html',
            className: `inline-flex items-center gap-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium transition-colors`
          },
            React.createElement('svg', {
              className: 'w-5 h-5',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 2,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              viewBox: '0 0 24 24'
            },
              React.createElement('path', { d: 'm12 19-7-7 7-7' }),
              React.createElement('path', { d: 'M19 12H5' })
            ),
            'Back to Hub'
          )
        ),

        // Header
        React.createElement(Header, {
          darkMode
        }),

        // Hidden file input for import
        React.createElement('input', {
          ref: fileInputRef,
          type: 'file',
          accept: '.xlsx,.xls',
          onChange: handleImport,
          style: { display: 'none' }
        }),

        // Menu Bar
        React.createElement(MenuBar, {
          addProject,
          onImportClick: () => fileInputRef.current?.click(),
          exportToExcel: handleExport,
          onClearAll: handleClearAll,
          hideProjectFields,
          setHideProjectFields,
          darkMode,
          setDarkMode,
          saveStatus
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
          renderTabButton('projects', 'Projects', '📋'),
          renderTabButton('planner', 'Planner', '📅'),
          renderTabButton('kanban', 'Kanban', '📋'),
          renderTabButton('resources', 'Resources', '👥'),
          renderTabButton('overview', 'Divisions', '📊'),
          renderTabButton('actuals', 'Actuals Comparison', '📈')
        ),

        // Tab Content
        React.createElement('div', { className: 'mt-6' },
          activeTab === 'projects' && renderProjectsView(),
          activeTab === 'planner' && renderPlannerView(),
          activeTab === 'kanban' && renderKanbanView(),
          activeTab === 'overview' && renderOverviewView(),
          activeTab === 'resources' && renderResourcesView(),
          activeTab === 'actuals' && renderActualsView()
        )
      )
    )
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(GanttChart));