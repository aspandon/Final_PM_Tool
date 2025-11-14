// js/app.js
import { phases, colors, divisionColors, WORKING_DAYS_PER_MONTH } from './utils/constants.js';
import * as dateUtils from './utils/dateUtils.js';
import { exportToExcel, importFromExcel } from './utils/excelUtils.js';
import { calculateFTEChartData } from './utils/calculations.js';
import { saveProjects, loadProjects, saveFilters, loadFilters, clearAllData, loadSettings, saveSettings } from './utils/storage.js';
import { Header } from './components/Header.js';
import { MenuBar } from './components/MenuBar.js';
import { FilterPanel } from './components/FilterPanel.js';
import { ProjectForm } from './components/ProjectForm.js';
import { GanttTimeline } from './components/GanttTimeline.js';
import { DivisionsChart } from './components/DivisionsChart.js';
import { ResourcesChart } from './components/ResourcesChart.js';
import { ActualsTimeline } from './components/ActualsTimeline.js';
import { Reporting } from './components/Reporting.js';
import { KanbanBoard } from './components/KanbanBoard.js';
import { Tasks } from './components/Tasks.js';

const { useState, useRef, useMemo, useEffect } = React;
const { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

function GanttChart() {
  // Modern Icon Components
  const FolderKanban = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z' }),
    React.createElement('path', { d: 'M8 10v4' }),
    React.createElement('path', { d: 'M12 10v2' }),
    React.createElement('path', { d: 'M16 10v6' })
  );

  const Calendar = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('rect', { width: '18', height: '18', x: '3', y: '4', rx: '2', ry: '2' }),
    React.createElement('line', { x1: '16', x2: '16', y1: '2', y2: '6' }),
    React.createElement('line', { x1: '8', x2: '8', y1: '2', y2: '6' }),
    React.createElement('line', { x1: '3', x2: '21', y1: '10', y2: '10' })
  );

  const LayoutDashboard = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('rect', { width: '7', height: '9', x: '3', y: '3', rx: '1' }),
    React.createElement('rect', { width: '7', height: '5', x: '14', y: '3', rx: '1' }),
    React.createElement('rect', { width: '7', height: '9', x: '14', y: '12', rx: '1' }),
    React.createElement('rect', { width: '7', height: '5', x: '3', y: '16', rx: '1' })
  );

  const Users = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
    React.createElement('circle', { cx: '9', cy: '7', r: '4' }),
    React.createElement('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
    React.createElement('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
  );

  const PieChart = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M21.21 15.89A10 10 0 1 1 8 2.83' }),
    React.createElement('path', { d: 'M22 12A10 10 0 0 0 12 2v10z' })
  );

  const TrendingUp = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('polyline', { points: '22 7 13.5 15.5 8.5 10.5 2 17' }),
    React.createElement('polyline', { points: '16 7 22 7 22 13' })
  );

  const FileText = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
    React.createElement('polyline', { points: '14 2 14 8 20 8' }),
    React.createElement('line', { x1: '16', x2: '8', y1: '13', y2: '13' }),
    React.createElement('line', { x1: '16', x2: '8', y1: '17', y2: '17' }),
    React.createElement('polyline', { points: '10 9 9 9 8 9' })
  );

  const CheckSquare = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('polyline', { points: '9 11 12 14 22 4' }),
    React.createElement('path', { d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' })
  );

  const Lock = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2' }),
    React.createElement('path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' })
  );

  const Unlock = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2' }),
    React.createElement('path', { d: 'M7 11V7a5 5 0 0 1 9.9-1' })
  );

  // ===== STATE DECLARATIONS =====
  
  // Projects state
  const [projects, setProjects] = useState([]);
  
  // UI state
  const [hideProjectFields, setHideProjectFields] = useState(false);
  const [isEditLocked, setIsEditLocked] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [darkMode, setDarkMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('success'); // 'success', 'error', 'saving'
  const [kanbanSettings, setKanbanSettings] = useState({
    showRAG: true,
    showPM: true,
    showBP: true,
    showDivision: true
  });
  
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

  // Ref to track previous project count for data loss detection
  const previousProjectCount = useRef(0);

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
   * Auto-refresh: Periodically fetch latest data from Supabase
   * Runs every 45 seconds to check for updates from other users
   */
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        const latestProjects = await loadProjects();
        if (latestProjects && latestProjects.length > 0) {
          // Check if data has actually changed by comparing JSON strings
          const currentJSON = JSON.stringify(projects);
          const latestJSON = JSON.stringify(latestProjects);

          if (currentJSON !== latestJSON) {
            console.log('🔄 Auto-refresh: New data detected from Supabase');
            setProjects(latestProjects);
          }
        }
      } catch (error) {
        console.error('Error during auto-refresh:', error);
      }
    }, 45000); // Refresh every 45 seconds

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, [projects]);

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
   * Load settings from localStorage on mount
   */
  useEffect(() => {
    const savedSettings = loadSettings();
    if (savedSettings) {
      setDarkMode(savedSettings.darkMode || false);
      setHideProjectFields(savedSettings.hideProjectFields || false);
      if (savedSettings.kanban) {
        setKanbanSettings(savedSettings.kanban);
      }
      console.log('Loaded settings from localStorage');
    }
  }, []);

  /**
   * Auto-save settings whenever they change
   */
  useEffect(() => {
    const settings = {
      darkMode,
      hideProjectFields,
      activeTab,
      kanban: kanbanSettings
    };
    saveSettings(settings);
  }, [darkMode, hideProjectFields, activeTab, kanbanSettings]);

  /**
   * Auto-save projects whenever they change (to Supabase and localStorage)
   * Includes data loss prevention: won't save if project count drops dramatically
   */
  useEffect(() => {
    if (projects.length > 0) {
      // Data loss prevention check
      const prevCount = previousProjectCount.current;
      const currentCount = projects.length;

      // If this is the first load, just set the count and save
      if (prevCount === 0) {
        previousProjectCount.current = currentCount;
      } else {
        // Check if project count dropped dramatically (more than 50% AND by more than 10 projects)
        const percentageRemaining = (currentCount / prevCount) * 100;
        const projectsLost = prevCount - currentCount;

        if (percentageRemaining < 50 && projectsLost > 10) {
          // CRITICAL: Potential data loss detected!
          console.error('🚨 DATA LOSS PREVENTION: Refusing to save!');
          console.error(`Previous count: ${prevCount}, Current count: ${currentCount}`);
          console.error(`This would delete ${projectsLost} projects (${(100 - percentageRemaining).toFixed(1)}% loss)`);

          setSaveStatus('error');
          alert(`⚠️ DATA LOSS PREVENTED!\n\nYour project count dropped from ${prevCount} to ${currentCount}.\nAuto-save has been blocked to prevent data loss.\n\nPlease refresh the page and try again.`);
          return; // Don't save!
        }

        // Update the count for next time
        previousProjectCount.current = currentCount;
      }

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
   * Update a project by name (used by Kanban board)
   * This ensures we update the project in the full projects array, not filtered
   */
  const updateProjectByName = (projectName, field, value) => {
    const updatedProjects = projects.map(project => {
      if (project.name === projectName) {
        return { ...project, [field]: value };
      }
      return project;
    });
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
  const renderTabButton = (tabName, label, IconComponent) => {
    const isActive = activeTab === tabName;
    return React.createElement('button', {
      key: tabName,
      onClick: () => setActiveTab(tabName),
      className: `px-4 py-2 text-base font-semibold rounded-t-lg tab-button flex items-center gap-2 ${
        isActive ? 'active' : ''
      } ${
        isActive
          ? darkMode
            ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-blue-400 border-b-4 border-blue-400 shadow-xl glow'
            : 'bg-gradient-to-br from-white to-blue-50 text-blue-700 border-b-4 border-blue-600 shadow-xl glow'
          : darkMode
            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`
    },
      React.createElement(IconComponent, { className: 'w-5 h-5' }),
      label
    );
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
                key: `${actualIndex}-${isEditLocked ? 'locked' : 'unlocked'}`,
                project,
                pIndex: actualIndex,
                updateProject,
                updatePhase,
                deleteProject,
                phases,
                darkMode,
                isEditLocked
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
   * Navigate to a specific project in the Projects tab
   */
  const navigateToProject = (projectName) => {
    // Switch to Projects tab
    setActiveTab('projects');

    // Use setTimeout to ensure the tab has switched before scrolling
    setTimeout(() => {
      // Find the project index in the full projects array
      const projectIndex = projects.findIndex(p => p.name === projectName);

      if (projectIndex !== -1) {
        // Find the project card element and scroll to it
        const projectCards = document.querySelectorAll('.card-modern');
        if (projectCards[projectIndex]) {
          projectCards[projectIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          // Add a temporary highlight effect
          projectCards[projectIndex].style.transition = 'box-shadow 0.3s ease';
          projectCards[projectIndex].style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';

          setTimeout(() => {
            projectCards[projectIndex].style.boxShadow = '';
          }, 2000);
        }
      }
    }, 100);
  };

  /**
   * Render Kanban board view
   */
  const renderKanbanView = () => {
    return React.createElement(KanbanBoard, {
      projects: filteredProjects,
      updateProjectByName: updateProjectByName,
      navigateToProject: navigateToProject,
      darkMode: darkMode,
      kanbanSettings: kanbanSettings
    });
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

  /**
   * Render reporting view
   */
  const renderReportingView = () => {
    return React.createElement(Reporting, {
      filteredProjects,
      projects,
      isFilterActive,
      filterStartDate,
      filterEndDate,
      darkMode
    });
  };

  /**
   * Render tasks view
   */
  const renderTasksView = () => {
    return React.createElement(Tasks, {
      darkMode
    });
  };

  // ===== MAIN RENDER =====
  
  return React.createElement('div', {
    className: `min-h-screen theme-transition ${darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`
  },
    React.createElement('div', {
      className: 'max-w-[1800px] mx-auto p-6'
    },
      React.createElement('div', {
        className: `${darkMode ? 'bg-slate-800/90' : 'bg-white/80'} backdrop-blur-xl rounded-2xl shadow-2xl border ${darkMode ? 'border-slate-700' : 'border-white/50'} p-6 theme-transition`
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
          kanbanSettings,
          setKanbanSettings,
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
          renderTabButton('projects', 'Projects', FolderKanban),
          renderTabButton('planner', 'Planner', Calendar),
          renderTabButton('kanban', 'Kanban', LayoutDashboard),
          renderTabButton('tasks', 'Tasks', CheckSquare),
          renderTabButton('resources', 'Resources', Users),
          renderTabButton('overview', 'Divisions', PieChart),
          renderTabButton('actuals', 'Actuals', TrendingUp),
          renderTabButton('reporting', 'Reporting', FileText),

          // Lock/Unlock button - only visible on Projects tab
          activeTab === 'projects' && React.createElement('button', {
            onClick: () => setIsEditLocked(!isEditLocked),
            className: `ml-auto px-4 py-2 text-base rounded-t-lg lock-button btn-modern flex items-center gap-2 ${
              darkMode
                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 border-b-4 ' + (isEditLocked ? 'border-red-400 glow-red' : 'border-green-400 glow-green')
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-b-4 ' + (isEditLocked ? 'border-red-500 glow-red' : 'border-green-500 glow-green')
            }`,
            title: isEditLocked ? 'Unlock editing' : 'Lock editing'
          },
            React.createElement(isEditLocked ? Lock : Unlock, { className: 'w-5 h-5' })
          )
        ),

        // Tab Content
        React.createElement('div', { className: 'mt-6' },
          activeTab === 'projects' && renderProjectsView(),
          activeTab === 'planner' && renderPlannerView(),
          activeTab === 'kanban' && renderKanbanView(),
          activeTab === 'tasks' && renderTasksView(),
          activeTab === 'overview' && renderOverviewView(),
          activeTab === 'resources' && renderResourcesView(),
          activeTab === 'actuals' && renderActualsView(),
          activeTab === 'reporting' && renderReportingView()
        )
      )
    )
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(GanttChart));