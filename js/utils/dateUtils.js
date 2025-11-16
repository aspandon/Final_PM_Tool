// js/utils/dateUtils.js

/**
 * Calculate the number of days between two dates (inclusive)
 * @param {string|Date} start - Start date
 * @param {string|Date} end - End date
 * @returns {number} Number of days
 */
export const getDaysDiff = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Get the earliest date from all project phases
 * @param {Array} projects - Array of project objects
 * @param {Array} phases - Array of phase definitions
 * @param {boolean} isFilterActive - Whether date filter is active
 * @param {string} filterStartDate - Filter start date (if active)
 * @returns {Date} Earliest date found
 */
export const getEarliestDate = (projects, phases, isFilterActive, filterStartDate) => {
  if (isFilterActive && filterStartDate) {
    return new Date(filterStartDate);
  }
  
  let earliest = null;
  projects.forEach(p => {
    phases.forEach(phase => {
      if (p[phase.key].start) {
        const date = new Date(p[phase.key].start);
        if (!earliest || date < earliest) earliest = date;
      }
    });
  });
  return earliest || new Date();
};

/**
 * Get the latest date from all project phases
 * @param {Array} projects - Array of project objects
 * @param {Array} phases - Array of phase definitions
 * @param {boolean} isFilterActive - Whether date filter is active
 * @param {string} filterEndDate - Filter end date (if active)
 * @returns {Date} Latest date found
 */
export const getLatestDate = (projects, phases, isFilterActive, filterEndDate) => {
  if (isFilterActive && filterEndDate) {
    return new Date(filterEndDate);
  }
  
  let latest = null;
  projects.forEach(p => {
    phases.forEach(phase => {
      if (p[phase.key].finish) {
        const date = new Date(p[phase.key].finish);
        if (!latest || date > latest) latest = date;
      }
    });
  });
  return latest || new Date();
};

/**
 * Generate month labels for timeline display
 * @param {Date} startDate - Timeline start date
 * @param {Date} endDate - Timeline end date
 * @returns {Array} Array of month objects with label and date
 */
export const generateMonthLabels = (startDate, endDate) => {
  const months = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  
  while (current <= endDate) {
    months.push({
      label: current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      date: new Date(current)
    });
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
};

/**
 * Calculate bar position and width for Gantt chart timeline
 * @param {string} startDate - Phase start date
 * @param {string} finishDate - Phase finish date
 * @param {Date} earliest - Earliest date in timeline
 * @param {Date} latest - Latest date in timeline
 * @param {boolean} isFilterActive - Whether date filter is active
 * @param {string} filterStartDate - Filter start date
 * @param {string} filterEndDate - Filter end date
 * @returns {Object} Position object with left, width, and visible properties
 */
export const getBarPosition = (
  startDate, 
  finishDate, 
  earliest, 
  latest, 
  isFilterActive, 
  filterStartDate, 
  filterEndDate
) => {
  if (!startDate || !finishDate) {
    return { left: 0, width: 0, visible: false };
  }
  
  const totalDays = getDaysDiff(earliest, latest);
  const start = new Date(startDate);
  const finish = new Date(finishDate);
  
  // Check if phase is outside filter range
  if (isFilterActive) {
    const filterStart = new Date(filterStartDate || earliest);
    const filterEnd = new Date(filterEndDate || latest);
    
    if (finish < filterStart || start > filterEnd) {
      return { left: 0, width: 0, visible: false };
    }
  }
  
  const startOffset = getDaysDiff(earliest, start) - 1;
  const duration = getDaysDiff(start, finish);
  
  const left = (startOffset / totalDays) * 100;
  const width = (duration / totalDays) * 100;
  
  return { 
    left: `${Math.max(0, left)}%`, 
    width: `${width}%`, 
    visible: true 
  };
};

/**
 * Format a date as YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Check if a date is within a range
 * @param {Date} date - Date to check
 * @param {Date} rangeStart - Start of range
 * @param {Date} rangeEnd - End of range
 * @returns {boolean} True if date is within range
 */
export const isDateInRange = (date, rangeStart, rangeEnd) => {
  const d = new Date(date);
  const start = new Date(rangeStart);
  const end = new Date(rangeEnd);
  
  return d >= start && d <= end;
};

/**
 * Get all months between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Array of Date objects representing the 1st of each month
 */
export const getMonthsBetween = (startDate, endDate) => {
  const months = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  
  while (current <= end) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
};

/**
 * Calculate delay between two date ranges
 * @param {string} baseStart - Base period start date
 * @param {string} baseFinish - Base period finish date
 * @param {string} compareStart - Comparison period start date
 * @param {string} compareFinish - Comparison period finish date
 * @returns {Object|null} Object with startDelay and finishDelay in days, or null if invalid
 */
export const calculateDelay = (baseStart, baseFinish, compareStart, compareFinish) => {
  if (!baseStart || !baseFinish || !compareStart || !compareFinish) {
    return null;
  }
  
  const baseS = new Date(baseStart);
  const baseF = new Date(baseFinish);
  const compS = new Date(compareStart);
  const compF = new Date(compareFinish);
  
  const startDelay = Math.ceil((compS - baseS) / (1000 * 60 * 60 * 24));
  const finishDelay = Math.ceil((compF - baseF) / (1000 * 60 * 60 * 24));
  
  return { startDelay, finishDelay };
};

/**
 * Get today's date with time set to midnight
 * @returns {Date} Today's date at 00:00:00
 */
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Check if a phase has finished (finish date is before today)
 * @param {string} finishDate - Phase finish date
 * @returns {boolean} True if phase is complete
 */
export const isPhaseComplete = (finishDate) => {
  if (!finishDate) return false;
  
  const today = getToday();
  const finish = new Date(finishDate);
  finish.setHours(0, 0, 0, 0);
  
  return finish < today;
};

/**
 * Get the number of working days in a month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {number} Number of working days (excluding weekends)
 */
export const getWorkingDaysInMonth = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  let workingDays = 0;
  
  const current = new Date(startDate);
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workingDays;
};

/**
 * Parse a date string in various formats
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  // Try standard YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) return date;
  }
  
  // Try other common formats
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) return date;
  
  return null;
};