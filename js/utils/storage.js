// js/utils/storage.js

/**
 * Storage utility for persisting app data to localStorage
 */

const STORAGE_KEYS = {
  PROJECTS: 'pm_tool_projects',
  SETTINGS: 'pm_tool_settings',
  FILTERS: 'pm_tool_filters'
};

/**
 * Save projects to localStorage
 * @param {Array} projects - Array of project objects
 */
export const saveProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return true;
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
    return false;
  }
};

/**
 * Load projects from localStorage
 * @returns {Array} Array of project objects or empty array
 */
export const loadProjects = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return [];
  }
};

/**
 * Save app settings to localStorage
 * @param {Object} settings - Settings object
 */
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
    return false;
  }
};

/**
 * Load app settings from localStorage
 * @returns {Object} Settings object or default settings
 */
export const loadSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : {
      darkMode: false,
      hideProjectFields: false,
      activeTab: 'planner'
    };
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
    return {
      darkMode: false,
      hideProjectFields: false,
      activeTab: 'planner'
    };
  }
};

/**
 * Save filter state to localStorage
 * @param {Object} filters - Filter state object
 */
export const saveFilters = (filters) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
    return true;
  } catch (error) {
    console.error('Error saving filters to localStorage:', error);
    return false;
  }
};

/**
 * Load filter state from localStorage
 * @returns {Object} Filter state object or default filters
 */
export const loadFilters = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FILTERS);
    return stored ? JSON.parse(stored) : {
      filterStartDate: '',
      filterEndDate: '',
      filterDivisions: [],
      selectedProjects: [],
      selectedPMs: [],
      selectedBPs: [],
      showExternalPM: true,
      showExternalQA: true,
      pmBAU: '',
      bpBAU: '',
      isFilterActive: false
    };
  } catch (error) {
    console.error('Error loading filters from localStorage:', error);
    return {
      filterStartDate: '',
      filterEndDate: '',
      filterDivisions: [],
      selectedProjects: [],
      selectedPMs: [],
      selectedBPs: [],
      showExternalPM: true,
      showExternalQA: true,
      pmBAU: '',
      bpBAU: '',
      isFilterActive: false
    };
  }
};

/**
 * Clear all stored data
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get storage usage information
 * @returns {Object} Object with used and available storage info
 */
export const getStorageInfo = () => {
  try {
    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });

    // Convert to KB
    const usedKB = (totalSize / 1024).toFixed(2);

    return {
      used: usedKB,
      unit: 'KB',
      keys: Object.keys(STORAGE_KEYS).length
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};
