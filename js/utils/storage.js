// js/utils/storage.js

/**
 * Storage utility for persisting app data to Supabase with localStorage fallback
 */

import { supabase } from './supabaseClient.js';

const STORAGE_KEYS = {
  PROJECTS: 'pm_tool_projects',
  SETTINGS: 'pm_tool_settings',
  FILTERS: 'pm_tool_filters',
  ACTIONS: 'action_items_actions'
};

const SUPABASE_ID_KEY = 'supabase_data_id'; // Store the ID of the Supabase record

// ===== PROJECTS STORAGE =====

/**
 * Save projects to Supabase and localStorage
 * @param {Array} projects - Array of project objects
 */
export const saveProjects = async (projects) => {
  try {
    // Save to localStorage as cache
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    // Get existing Supabase record ID if any
    const existingId = localStorage.getItem(`${STORAGE_KEYS.PROJECTS}_${SUPABASE_ID_KEY}`);

    if (existingId) {
      // Update existing record
      const { data, error } = await supabase
        .from('projects')
        .update({ data: projects })
        .eq('id', existingId)
        .select();

      if (error) {
        console.error('Error updating projects in Supabase:', error);
        return true; // Still return true since localStorage worked
      }
      console.log('Projects updated in Supabase');
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('projects')
        .insert([{ data: projects }])
        .select();

      if (error) {
        console.error('Error inserting projects into Supabase:', error);
        return true; // Still return true since localStorage worked
      }

      // Store the ID for future updates
      if (data && data[0]) {
        localStorage.setItem(`${STORAGE_KEYS.PROJECTS}_${SUPABASE_ID_KEY}`, data[0].id);
        console.log('Projects saved to Supabase with ID:', data[0].id);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
};

/**
 * Load projects from Supabase (or localStorage fallback)
 * @returns {Array} Array of project objects or empty array
 */
export const loadProjects = async () => {
  try {
    // Try to load from Supabase first
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error loading projects from Supabase:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return stored ? JSON.parse(stored) : [];
    }

    if (data && data.length > 0) {
      const projects = data[0].data;
      // Cache in localStorage
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      localStorage.setItem(`${STORAGE_KEYS.PROJECTS}_${SUPABASE_ID_KEY}`, data[0].id);
      console.log('Projects loaded from Supabase');
      return projects;
    }

    // No data in Supabase, check localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading projects:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : [];
  }
};

// ===== SETTINGS STORAGE (localStorage only - no need for server) =====

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

// ===== FILTERS STORAGE (localStorage only - no need for server) =====

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

// ===== CLEAR DATA =====

/**
 * Clear all stored data from both Supabase and localStorage
 */
export const clearAllData = async () => {
  try {
    // Get Supabase ID
    const projectsId = localStorage.getItem(`${STORAGE_KEYS.PROJECTS}_${SUPABASE_ID_KEY}`);
    const actionsId = localStorage.getItem(`${STORAGE_KEYS.ACTIONS}_${SUPABASE_ID_KEY}`);

    // Delete from Supabase if exists
    if (projectsId) {
      await supabase.from('projects').delete().eq('id', projectsId);
    }
    if (actionsId) {
      await supabase.from('actions').delete().eq('id', actionsId);
    }

    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_${SUPABASE_ID_KEY}`);
    });

    console.log('All data cleared from Supabase and localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
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

// ===== ACTION ITEMS STORAGE =====

/**
 * Save actions to Supabase and localStorage
 * @param {Array} actions - Array of action objects
 */
export const saveActions = async (actions) => {
  try {
    // Save to localStorage as cache
    localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));

    // Get existing Supabase record ID if any
    const existingId = localStorage.getItem(`${STORAGE_KEYS.ACTIONS}_${SUPABASE_ID_KEY}`);

    if (existingId) {
      // Update existing record
      const { data, error } = await supabase
        .from('actions')
        .update({ data: actions })
        .eq('id', existingId)
        .select();

      if (error) {
        console.error('Error updating actions in Supabase:', error);
        return true; // Still return true since localStorage worked
      }
      console.log('Actions updated in Supabase');
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('actions')
        .insert([{ data: actions }])
        .select();

      if (error) {
        console.error('Error inserting actions into Supabase:', error);
        return true; // Still return true since localStorage worked
      }

      // Store the ID for future updates
      if (data && data[0]) {
        localStorage.setItem(`${STORAGE_KEYS.ACTIONS}_${SUPABASE_ID_KEY}`, data[0].id);
        console.log('Actions saved to Supabase with ID:', data[0].id);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving actions:', error);
    return false;
  }
};

/**
 * Load actions from Supabase (or localStorage fallback)
 * @returns {Array} Array of action objects or empty array
 */
export const loadActions = async () => {
  try {
    // Try to load from Supabase first
    const { data, error } = await supabase
      .from('actions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error loading actions from Supabase:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIONS);
      return stored ? JSON.parse(stored) : [];
    }

    if (data && data.length > 0) {
      const actions = data[0].data;
      // Cache in localStorage
      localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
      localStorage.setItem(`${STORAGE_KEYS.ACTIONS}_${SUPABASE_ID_KEY}`, data[0].id);
      console.log('Actions loaded from Supabase');
      return actions;
    }

    // No data in Supabase, check localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading actions:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIONS);
    return stored ? JSON.parse(stored) : [];
  }
};

/**
 * Clear all action items data from both Supabase and localStorage
 */
export const clearAllActions = async () => {
  try {
    // Get Supabase ID
    const actionsId = localStorage.getItem(`${STORAGE_KEYS.ACTIONS}_${SUPABASE_ID_KEY}`);

    // Delete from Supabase if exists
    if (actionsId) {
      await supabase.from('actions').delete().eq('id', actionsId);
    }

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.ACTIONS);
    localStorage.removeItem(`${STORAGE_KEYS.ACTIONS}_${SUPABASE_ID_KEY}`);

    console.log('Actions cleared from Supabase and localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing actions:', error);
    return false;
  }
};
