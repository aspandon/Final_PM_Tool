// js/utils/storage.js

/**
 * Storage utility for persisting app data to Supabase with localStorage fallback
 */

import { supabase } from './supabaseClient.js';

const STORAGE_KEYS = {
  PROJECTS: 'pm_tool_projects',
  SETTINGS: 'pm_tool_settings',
  FILTERS: 'pm_tool_filters',
  ACTIONS: 'action_items_actions',
  TASKS: 'pmtool_personal_tasks'
};

const SHARED_RECORD_KEY = 'shared_record_id'; // Track the shared record ID

// ===== PROJECTS STORAGE =====

/**
 * Save projects to Supabase and localStorage (shared record for all users)
 * @param {Array} projects - Array of project objects
 */
export const saveProjects = async (projects) => {
  try {
    // Save to localStorage as cache
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    // Get or find the shared record
    let sharedRecordId = localStorage.getItem(SHARED_RECORD_KEY);

    // If we don't have the shared record ID, try to find it
    if (!sharedRecordId) {
      const { data: existingRecords } = await supabase
        .from('projects')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1);

      if (existingRecords && existingRecords.length > 0) {
        sharedRecordId = existingRecords[0].id;
        localStorage.setItem(SHARED_RECORD_KEY, sharedRecordId);
      }
    }

    if (sharedRecordId) {
      // Update the shared record
      const { data, error } = await supabase
        .from('projects')
        .update({ data: projects })
        .eq('id', sharedRecordId)
        .select();

      if (error) {
        console.error('Error updating shared projects record in Supabase:', error);
        return true; // Still return true since localStorage worked
      }
      console.log('Shared projects record updated in Supabase');
    } else {
      // Create the shared record (first time)
      const { data, error } = await supabase
        .from('projects')
        .insert([{ data: projects }])
        .select();

      if (error) {
        console.error('Error creating shared projects record in Supabase:', error);
        return true; // Still return true since localStorage worked
      }

      // Store the shared record ID
      if (data && data[0]) {
        localStorage.setItem(SHARED_RECORD_KEY, data[0].id);
        console.log('Shared projects record created in Supabase with ID:', data[0].id);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
};

/**
 * Load projects from Supabase shared record (or localStorage fallback)
 * @returns {Array} Array of project objects or empty array
 */
export const loadProjects = async () => {
  try {
    // Load the shared record (oldest record = first created)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true }) // Get oldest first (shared record)
      .limit(1);

    if (error) {
      console.error('Error loading shared projects record from Supabase:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return stored ? JSON.parse(stored) : [];
    }

    if (data && data.length > 0) {
      const projects = data[0].data;
      // Cache the shared record ID
      localStorage.setItem(SHARED_RECORD_KEY, data[0].id);
      // Cache projects in localStorage
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      console.log('Shared projects record loaded from Supabase (ID:', data[0].id, ')');
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
    const defaults = {
      darkMode: false,
      hideProjectFields: false,
      activeTab: 'planner',
      kanban: {
        showRAG: true,
        showPM: true,
        showBP: true,
        showDivision: true
      }
    };

    if (!stored) return defaults;

    // Merge stored settings with defaults to ensure new settings exist
    const storedSettings = JSON.parse(stored);
    return {
      ...defaults,
      ...storedSettings,
      kanban: {
        ...defaults.kanban,
        ...(storedSettings.kanban || {})
      }
    };
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
    return {
      darkMode: false,
      hideProjectFields: false,
      activeTab: 'planner',
      kanban: {
        showRAG: true,
        showPM: true,
        showBP: true,
        showDivision: true
      }
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
    // Get shared record IDs
    const projectsId = localStorage.getItem(SHARED_RECORD_KEY);
    const actionsId = localStorage.getItem(`${SHARED_RECORD_KEY}_actions`);
    const tasksId = localStorage.getItem(`${SHARED_RECORD_KEY}_tasks`);

    // Delete from Supabase if exists
    if (projectsId) {
      await supabase.from('projects').delete().eq('id', projectsId);
    }
    if (actionsId) {
      await supabase.from('actions').delete().eq('id', actionsId);
    }
    if (tasksId) {
      await supabase.from('tasks').delete().eq('id', tasksId);
    }

    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem(SHARED_RECORD_KEY);
    localStorage.removeItem(`${SHARED_RECORD_KEY}_actions`);
    localStorage.removeItem(`${SHARED_RECORD_KEY}_tasks`);

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
 * Save actions to Supabase and localStorage (shared record for all users)
 * @param {Array} actions - Array of action objects
 */
export const saveActions = async (actions) => {
  try {
    // Save to localStorage as cache
    localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));

    // Get or find the shared record
    let sharedRecordId = localStorage.getItem(`${SHARED_RECORD_KEY}_actions`);

    // If we don't have the shared record ID, try to find it
    if (!sharedRecordId) {
      const { data: existingRecords } = await supabase
        .from('actions')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1);

      if (existingRecords && existingRecords.length > 0) {
        sharedRecordId = existingRecords[0].id;
        localStorage.setItem(`${SHARED_RECORD_KEY}_actions`, sharedRecordId);
      }
    }

    if (sharedRecordId) {
      // Update the shared record
      const { data, error } = await supabase
        .from('actions')
        .update({ data: actions })
        .eq('id', sharedRecordId)
        .select();

      if (error) {
        console.error('Error updating shared actions record in Supabase:', error);
        return true; // Still return true since localStorage worked
      }
      console.log('Shared actions record updated in Supabase');
    } else {
      // Create the shared record (first time)
      const { data, error } = await supabase
        .from('actions')
        .insert([{ data: actions }])
        .select();

      if (error) {
        console.error('Error creating shared actions record in Supabase:', error);
        return true; // Still return true since localStorage worked
      }

      // Store the shared record ID
      if (data && data[0]) {
        localStorage.setItem(`${SHARED_RECORD_KEY}_actions`, data[0].id);
        console.log('Shared actions record created in Supabase with ID:', data[0].id);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving actions:', error);
    return false;
  }
};

/**
 * Load actions from Supabase shared record (or localStorage fallback)
 * @returns {Array} Array of action objects or empty array
 */
export const loadActions = async () => {
  try {
    // Load the shared record (oldest record = first created)
    const { data, error } = await supabase
      .from('actions')
      .select('*')
      .order('created_at', { ascending: true }) // Get oldest first (shared record)
      .limit(1);

    if (error) {
      console.error('Error loading shared actions record from Supabase:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIONS);
      return stored ? JSON.parse(stored) : [];
    }

    if (data && data.length > 0) {
      const actions = data[0].data;
      // Cache the shared record ID
      localStorage.setItem(`${SHARED_RECORD_KEY}_actions`, data[0].id);
      // Cache actions in localStorage
      localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
      console.log('Shared actions record loaded from Supabase (ID:', data[0].id, ')');
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
    const actionsId = localStorage.getItem(`${SHARED_RECORD_KEY}_actions`);

    // Delete from Supabase if exists
    if (actionsId) {
      await supabase.from('actions').delete().eq('id', actionsId);
    }

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.ACTIONS);
    localStorage.removeItem(`${SHARED_RECORD_KEY}_actions`);

    console.log('Actions cleared from Supabase and localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing actions:', error);
    return false;
  }
};

// ===== PERSONAL TASKS STORAGE =====

/**
 * Save tasks to Supabase and localStorage (shared record for all users)
 * @param {Array} tasks - Array of task objects
 */
export const saveTasks = async (tasks) => {
  try {
    // Save to localStorage as cache
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

    // Get or find the shared record
    let sharedRecordId = localStorage.getItem(`${SHARED_RECORD_KEY}_tasks`);

    // If we don't have the shared record ID, try to find it
    if (!sharedRecordId) {
      const { data: existingRecords } = await supabase
        .from('tasks')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1);

      if (existingRecords && existingRecords.length > 0) {
        sharedRecordId = existingRecords[0].id;
        localStorage.setItem(`${SHARED_RECORD_KEY}_tasks`, sharedRecordId);
      }
    }

    if (sharedRecordId) {
      // Update the shared record
      const { data, error } = await supabase
        .from('tasks')
        .update({ data: tasks })
        .eq('id', sharedRecordId)
        .select();

      if (error) {
        console.error('Error updating shared tasks record in Supabase:', error);
        return true; // Still return true since localStorage worked
      }
      console.log('Shared tasks record updated in Supabase');
    } else {
      // Create the shared record (first time)
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ data: tasks }])
        .select();

      if (error) {
        console.error('Error creating shared tasks record in Supabase:', error);
        return true; // Still return true since localStorage worked
      }

      // Store the shared record ID
      if (data && data[0]) {
        localStorage.setItem(`${SHARED_RECORD_KEY}_tasks`, data[0].id);
        console.log('Shared tasks record created in Supabase with ID:', data[0].id);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
};

/**
 * Load tasks from Supabase shared record (or localStorage fallback)
 * @returns {Array} Array of task objects or empty array
 */
export const loadTasks = async () => {
  try {
    // Load the shared record (oldest record = first created)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true }) // Get oldest first (shared record)
      .limit(1);

    if (error) {
      console.error('Error loading shared tasks record from Supabase:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      return stored ? JSON.parse(stored) : [];
    }

    if (data && data.length > 0) {
      const tasks = data[0].data;
      // Cache the shared record ID
      localStorage.setItem(`${SHARED_RECORD_KEY}_tasks`, data[0].id);
      // Cache tasks in localStorage
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      console.log('Shared tasks record loaded from Supabase (ID:', data[0].id, ')');
      return tasks;
    }

    // No data in Supabase, check localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  }
};

/**
 * Clear all personal tasks data from both Supabase and localStorage
 */
export const clearAllTasks = async () => {
  try {
    // Get Supabase ID
    const tasksId = localStorage.getItem(`${SHARED_RECORD_KEY}_tasks`);

    // Delete from Supabase if exists
    if (tasksId) {
      await supabase.from('tasks').delete().eq('id', tasksId);
    }

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(`${SHARED_RECORD_KEY}_tasks`);

    console.log('Tasks cleared from Supabase and localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing tasks:', error);
    return false;
  }
};
