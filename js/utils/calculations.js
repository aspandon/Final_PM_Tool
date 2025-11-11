// js/utils/calculations.js

import { WORKING_DAYS_PER_MONTH } from './constants.js';
import { getDaysDiff } from './dateUtils.js';

/**
 * Calculate FTE (Full-Time Equivalent) chart data for Project Managers and Business Partners
 * @param {Array} filteredProjects - Filtered array of projects
 * @param {Date} earliestDate - Earliest date in timeline
 * @param {Date} latestDate - Latest date in timeline
 * @param {string} pmBAU - PM BAU allocation (FTE per month)
 * @param {string} bpBAU - BP BAU allocation (FTE per month)
 * @param {boolean} isFilterActive - Whether filters are active
 * @param {string} filterStartDate - Filter start date
 * @param {string} filterEndDate - Filter end date
 * @returns {Array} Chart data with monthly FTE values
 */
export const calculateFTEChartData = (
  filteredProjects,
  earliestDate,
  latestDate,
  pmBAU,
  bpBAU,
  isFilterActive,
  filterStartDate,
  filterEndDate
) => {
  const monthlyData = {};

  // Initialize monthly data structure
  const earliest = (isFilterActive && filterStartDate) 
    ? new Date(filterStartDate) 
    : new Date(earliestDate);
  const latest = (isFilterActive && filterEndDate) 
    ? new Date(filterEndDate) 
    : new Date(latestDate);
  
  earliest.setDate(1);
  earliest.setHours(0, 0, 0, 0);
  latest.setDate(1);
  latest.setHours(0, 0, 0, 0);
  
  let curr = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  while (curr <= latest) {
    const monthKey = curr.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthlyData[monthKey] = { 
      month: monthKey, 
      date: new Date(curr), 
      pm: 0, 
      bp: 0 
    };
    curr.setMonth(curr.getMonth() + 1);
  }

  // Get active team members
  const activePMs = [...new Set(filteredProjects.map(p => p.projectManager).filter(pm => pm))];
  const activeBPs = [...new Set(filteredProjects.map(p => p.businessPartner).filter(bp => bp))];

  // Calculate PM allocation during Implementation phase
  filteredProjects.forEach(project => {
    if (project.pmAllocation && project.implementation.start && project.implementation.finish) {
      const pmAlloc = parseFloat(project.pmAllocation) || 0;
      const start = new Date(project.implementation.start);
      const finish = new Date(project.implementation.finish);
      
      if (finish >= earliest && start <= latest) {
        let c = new Date(Math.max(start.getFullYear(), earliest.getFullYear()), 
                        Math.max(start.getMonth(), earliest.getMonth()), 1);
        const endDate = new Date(Math.min(finish.getFullYear(), latest.getFullYear()), 
                        Math.min(finish.getMonth(), latest.getMonth()) + 1, 0);
        
        while (c <= endDate) {
          const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          if (monthlyData[monthKey]) {
            const monthStart = new Date(Math.max(c, start, earliest));
            const monthEnd = new Date(c.getFullYear(), c.getMonth() + 1, 0);
            const effectiveEnd = new Date(Math.min(monthEnd, finish, latest));
            
            if (monthStart <= effectiveEnd) {
              const daysInMonth = Math.ceil((effectiveEnd - monthStart) / (1000 * 60 * 60 * 24)) + 1;
              monthlyData[monthKey].pm += pmAlloc * daysInMonth;
            }
          }
          
          c.setMonth(c.getMonth() + 1);
        }
      }
    }

    // Calculate BP allocation during PSD phase
    if (project.bpAllocation && project.psd.start && project.psd.finish) {
      const bpAlloc = parseFloat(project.bpAllocation) || 0;
      const start = new Date(project.psd.start);
      const finish = new Date(project.psd.finish);
      
      if (finish >= earliest && start <= latest) {
        let c = new Date(Math.max(start.getFullYear(), earliest.getFullYear()), 
                        Math.max(start.getMonth(), earliest.getMonth()), 1);
        const endDate = new Date(Math.min(finish.getFullYear(), latest.getFullYear()), 
                        Math.min(finish.getMonth(), latest.getMonth()) + 1, 0);
        
        while (c <= endDate) {
          const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          if (monthlyData[monthKey]) {
            const monthStart = new Date(Math.max(c, start, earliest));
            const monthEnd = new Date(c.getFullYear(), c.getMonth() + 1, 0);
            const effectiveEnd = new Date(Math.min(monthEnd, finish, latest));
            
            if (monthStart <= effectiveEnd) {
              const daysInMonth = Math.ceil((effectiveEnd - monthStart) / (1000 * 60 * 60 * 24)) + 1;
              monthlyData[monthKey].bp += bpAlloc * daysInMonth;
            }
          }
          
          c.setMonth(c.getMonth() + 1);
        }
      }
    }

    // Calculate BP allocation during BP Implementation phase
    if (project.bpImplementationAllocation && project.bpImplementation.start && project.bpImplementation.finish) {
      const bpImplAlloc = parseFloat(project.bpImplementationAllocation) || 0;
      const start = new Date(project.bpImplementation.start);
      const finish = new Date(project.bpImplementation.finish);
      
      if (finish >= earliest && start <= latest) {
        let c = new Date(Math.max(start.getFullYear(), earliest.getFullYear()), 
                        Math.max(start.getMonth(), earliest.getMonth()), 1);
        const endDate = new Date(Math.min(finish.getFullYear(), latest.getFullYear()), 
                        Math.min(finish.getMonth(), latest.getMonth()) + 1, 0);
        
        while (c <= endDate) {
          const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          if (monthlyData[monthKey]) {
            const monthStart = new Date(Math.max(c, start, earliest));
            const monthEnd = new Date(c.getFullYear(), c.getMonth() + 1, 0);
            const effectiveEnd = new Date(Math.min(monthEnd, finish, latest));
            
            if (monthStart <= effectiveEnd) {
              const daysInMonth = Math.ceil((effectiveEnd - monthStart) / (1000 * 60 * 60 * 24)) + 1;
              monthlyData[monthKey].bp += bpImplAlloc * daysInMonth;
            }
          }
          
          c.setMonth(c.getMonth() + 1);
        }
      }
    }
  });

  // Add BAU allocation
  if (pmBAU || bpBAU) {
    const pmBAUValue = parseFloat(pmBAU) || 0;
    const bpBAUValue = parseFloat(bpBAU) || 0;
    
    Object.keys(monthlyData).forEach(monthKey => {
      monthlyData[monthKey].pm += activePMs.length * pmBAUValue * WORKING_DAYS_PER_MONTH;
      monthlyData[monthKey].bp += activeBPs.length * bpBAUValue * WORKING_DAYS_PER_MONTH;
    });
  }

  // Convert to chart data format
  return Object.values(monthlyData)
    .sort((a, b) => a.date - b.date)
    .map(item => ({
      month: item.month,
      'Project Managers': Math.round((item.pm / WORKING_DAYS_PER_MONTH) * 100) / 100,
      'Business Partners': Math.round((item.bp / WORKING_DAYS_PER_MONTH) * 100) / 100
    }));
};

/**
 * Calculate person-specific allocation data for resources view
 * @param {Array} filteredProjects - Filtered array of projects
 * @param {Date} earliestDate - Earliest date in timeline
 * @param {Date} latestDate - Latest date in timeline
 * @param {string} pmBAU - PM BAU allocation (FTE per month)
 * @param {string} bpBAU - BP BAU allocation (FTE per month)
 * @param {boolean} isFilterActive - Whether filters are active
 * @param {string} filterStartDate - Filter start date
 * @param {string} filterEndDate - Filter end date
 * @returns {Array} Chart data with per-person FTE values
 */
export const calculatePersonAllocation = (
  filteredProjects,
  earliestDate,
  latestDate,
  pmBAU,
  bpBAU,
  isFilterActive,
  filterStartDate,
  filterEndDate
) => {
  const personData = {};

  const earliest = (isFilterActive && filterStartDate) 
    ? new Date(filterStartDate) 
    : new Date(earliestDate);
  const latest = (isFilterActive && filterEndDate) 
    ? new Date(filterEndDate) 
    : new Date(latestDate);
  
  let curr = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  while (curr <= latest) {
    const monthKey = curr.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    personData[monthKey] = { 
      month: monthKey, 
      date: new Date(curr),
      totalPM: 0,
      totalBP: 0
    };
    curr.setMonth(curr.getMonth() + 1);
  }

  // Calculate PM allocation per person during Implementation phase
  filteredProjects.forEach(project => {
    if (project.projectManager && project.pmAllocation && project.implementation.start && project.implementation.finish) {
      const pmAlloc = parseFloat(project.pmAllocation) || 0;
      const start = new Date(project.implementation.start);
      const finish = new Date(project.implementation.finish);
      
      let c = new Date(start.getFullYear(), start.getMonth(), 1);
      while (c <= finish) {
        const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!personData[monthKey]) {
          personData[monthKey] = { month: monthKey, date: new Date(c), totalPM: 0, totalBP: 0 };
        }
        
        if (!personData[monthKey][project.projectManager]) {
          personData[monthKey][project.projectManager] = 0;
        }
        
        const monthStart = new Date(Math.max(c, start));
        const monthEnd = new Date(c.getFullYear(), c.getMonth() + 1, 0);
        const effectiveEnd = new Date(Math.min(monthEnd, finish));
        
        if (monthStart <= effectiveEnd) {
          const daysInMonth = Math.ceil((effectiveEnd - monthStart) / (1000 * 60 * 60 * 24)) + 1;
          const manDays = pmAlloc * daysInMonth;
          personData[monthKey][project.projectManager] += manDays;
          personData[monthKey].totalPM += manDays;
        }
        
        c.setMonth(c.getMonth() + 1);
      }
    }

    // Calculate BP allocation per person during PSD phase
    if (project.businessPartner && project.bpAllocation && project.psd.start && project.psd.finish) {
      const bpAlloc = parseFloat(project.bpAllocation) || 0;
      const start = new Date(project.psd.start);
      const finish = new Date(project.psd.finish);
      
      let c = new Date(start.getFullYear(), start.getMonth(), 1);
      while (c <= finish) {
        const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!personData[monthKey]) {
          personData[monthKey] = { month: monthKey, date: new Date(c), totalPM: 0, totalBP: 0 };
        }
        
        if (!personData[monthKey][project.businessPartner]) {
          personData[monthKey][project.businessPartner] = 0;
        }
        
        const monthStart = new Date(Math.max(c, start));
        const monthEnd = new Date(c.getFullYear(), c.getMonth() + 1, 0);
        const effectiveEnd = new Date(Math.min(monthEnd, finish));
        
        if (monthStart <= effectiveEnd) {
          const daysInMonth = Math.ceil((effectiveEnd - monthStart) / (1000 * 60 * 60 * 24)) + 1;
          const manDays = bpAlloc * daysInMonth;
          personData[monthKey][project.businessPartner] += manDays;
          personData[monthKey].totalBP += manDays;
        }
        
        c.setMonth(c.getMonth() + 1);
      }
    }

    // Calculate BP allocation per person during BP Implementation phase
    if (project.businessPartner && project.bpImplementationAllocation && project.bpImplementation.start && project.bpImplementation.finish) {
      const bpImplAlloc = parseFloat(project.bpImplementationAllocation) || 0;
      const start = new Date(project.bpImplementation.start);
      const finish = new Date(project.bpImplementation.finish);
      
      let c = new Date(start.getFullYear(), start.getMonth(), 1);
      while (c <= finish) {
        const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!personData[monthKey]) {
          personData[monthKey] = { month: monthKey, date: new Date(c), totalPM: 0, totalBP: 0 };
        }
        
        if (!personData[monthKey][project.businessPartner]) {
          personData[monthKey][project.businessPartner] = 0;
        }
        
        const monthStart = new Date(Math.max(c, start));
        const monthEnd = new Date(c.getFullYear(), c.getMonth() + 1, 0);
        const effectiveEnd = new Date(Math.min(monthEnd, finish));
        
        if (monthStart <= effectiveEnd) {
          const daysInMonth = Math.ceil((effectiveEnd - monthStart) / (1000 * 60 * 60 * 24)) + 1;
          const manDays = bpImplAlloc * daysInMonth;
          personData[monthKey][project.businessPartner] += manDays;
          personData[monthKey].totalBP += manDays;
        }
        
        c.setMonth(c.getMonth() + 1);
      }
    }
  });

  const activePMs = [...new Set(filteredProjects.map(p => p.projectManager).filter(pm => pm))];
  const activeBPs = [...new Set(filteredProjects.map(p => p.businessPartner).filter(bp => bp))];

  // Add BAU allocation
  if (pmBAU || bpBAU) {
    const pmBAUValue = parseFloat(pmBAU) || 0;
    const bpBAUValue = parseFloat(bpBAU) || 0;
    
    Object.keys(personData).forEach(monthKey => {
      activePMs.forEach(pm => {
        if (!personData[monthKey][pm]) {
          personData[monthKey][pm] = 0;
        }
        const bauManDays = pmBAUValue * WORKING_DAYS_PER_MONTH;
        personData[monthKey][pm] += bauManDays;
        personData[monthKey].totalPM += bauManDays;
      });
      
      activeBPs.forEach(bp => {
        if (!personData[monthKey][bp]) {
          personData[monthKey][bp] = 0;
        }
        const bauManDays = bpBAUValue * WORKING_DAYS_PER_MONTH;
        personData[monthKey][bp] += bauManDays;
        personData[monthKey].totalBP += bauManDays;
      });
    });
  }

  // Convert to chart data format
  return Object.values(personData)
    .sort((a, b) => a.date - b.date)
    .map(item => {
      const result = { 
        month: item.month,
        'Total PM FTE': Math.round((item.totalPM / WORKING_DAYS_PER_MONTH) * 100) / 100,
        'Total BP FTE': Math.round((item.totalBP / WORKING_DAYS_PER_MONTH) * 100) / 100
      };
      [...activePMs, ...activeBPs].forEach(person => {
        result[person] = Math.round(((item[person] || 0) / WORKING_DAYS_PER_MONTH) * 100) / 100;
      });
      return result;
    });
};

/**
 * Calculate number of projects in progress per division per month
 * @param {Array} filteredProjects - Filtered array of projects
 * @param {Array} phases - Array of phase definitions
 * @param {Date} earliestDate - Earliest date in timeline
 * @param {Date} latestDate - Latest date in timeline
 * @param {boolean} isFilterActive - Whether filters are active
 * @param {string} filterStartDate - Filter start date
 * @param {string} filterEndDate - Filter end date
 * @returns {Object} Object with chartData array and divisions array
 */
export const calculateProjectsInProgress = (
  filteredProjects,
  phases,
  earliestDate,
  latestDate,
  isFilterActive,
  filterStartDate,
  filterEndDate
) => {
  const monthlyData = {};
  const divisions = [...new Set(filteredProjects.map(p => p.division).filter(d => d))];
  
  const earliest = (isFilterActive && filterStartDate) 
    ? new Date(filterStartDate) 
    : new Date(earliestDate);
  const latest = (isFilterActive && filterEndDate) 
    ? new Date(filterEndDate) 
    : new Date(latestDate);
  
  earliest.setDate(1);
  earliest.setHours(0, 0, 0, 0);
  latest.setDate(1);
  latest.setHours(0, 0, 0, 0);
  
  let curr = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  while (curr <= latest) {
    const monthKey = curr.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthlyData[monthKey] = { 
      month: monthKey, 
      date: new Date(curr)
    };
    divisions.forEach(div => {
      monthlyData[monthKey][div] = 0;
    });
    curr.setMonth(curr.getMonth() + 1);
  }

  // Count projects in progress for each division
  filteredProjects.forEach(project => {
    if (!project.division) return;
    
    let projectStart = null;
    let projectFinish = null;
    
    // Find earliest start and latest finish across all phases
    phases.forEach(phase => {
      if (project[phase.key].start) {
        const phaseStart = new Date(project[phase.key].start);
        if (!projectStart || phaseStart < projectStart) {
          projectStart = phaseStart;
        }
      }
      if (project[phase.key].finish) {
        const phaseFinish = new Date(project[phase.key].finish);
        if (!projectFinish || phaseFinish > projectFinish) {
          projectFinish = phaseFinish;
        }
      }
    });
    
    if (projectStart && projectFinish) {
      const c = new Date(Math.max(projectStart.getFullYear(), earliest.getFullYear()), 
                        Math.max(projectStart.getMonth(), earliest.getMonth()), 1);
      const endDate = new Date(Math.min(projectFinish.getFullYear(), latest.getFullYear()), 
                        Math.min(projectFinish.getMonth(), latest.getMonth()) + 1, 0);
      
      let curr2 = new Date(c);
      while (curr2 <= endDate) {
        const monthKey = curr2.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const monthStart = new Date(curr2.getFullYear(), curr2.getMonth(), 1);
        const monthEnd = new Date(curr2.getFullYear(), curr2.getMonth() + 1, 0);
        
        // Check if project is active during this month
        if (projectStart <= monthEnd && projectFinish >= monthStart) {
          if (monthlyData[monthKey]) {
            monthlyData[monthKey][project.division]++;
          }
        }
        
        curr2.setMonth(curr2.getMonth() + 1);
      }
    }
  });

  // Convert to chart data format
  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.date - b.date)
    .map(item => {
      const result = { month: item.month };
      divisions.forEach(div => {
        result[div] = item[div] || 0;
      });
      return result;
    });

  return { chartData, divisions };
};

/**
 * Calculate resource effort data including external resources
 * @param {Array} filteredProjects - Filtered array of projects
 * @param {Array} filteredProjectsForExternal - Projects filtered for external resources
 * @param {Date} earliestDate - Earliest date in timeline
 * @param {Date} latestDate - Latest date in timeline
 * @param {string} pmBAU - PM BAU allocation (FTE per month)
 * @param {string} bpBAU - BP BAU allocation (FTE per month)
 * @param {boolean} isFilterActive - Whether filters are active
 * @param {string} filterStartDate - Filter start date
 * @param {string} filterEndDate - Filter end date
 * @returns {Object} Object with chartData, maxValue, activePMs, and activeBPs
 */
export const calculateResourceEffort = (
  filteredProjects,
  filteredProjectsForExternal,
  earliestDate,
  latestDate,
  pmBAU,
  bpBAU,
  isFilterActive,
  filterStartDate,
  filterEndDate
) => {
  const effortData = {};
  
  const earliest = (isFilterActive && filterStartDate) 
    ? new Date(filterStartDate) 
    : new Date(earliestDate);
  const latest = (isFilterActive && filterEndDate) 
    ? new Date(filterEndDate) 
    : new Date(latestDate);
  
  earliest.setDate(1);
  earliest.setHours(0, 0, 0, 0);
  latest.setDate(1);
  latest.setHours(0, 0, 0, 0);
  
  let curr = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  const activePMs = [...new Set(filteredProjects.map(p => p.projectManager).filter(pm => pm))];
  const activeBPs = [...new Set(filteredProjects.map(p => p.businessPartner).filter(bp => bp))];
  
  while (curr <= latest) {
    const monthKey = curr.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    effortData[monthKey] = { 
      month: monthKey, 
      date: new Date(curr),
      pmExternal: 0,
      qaExternal: 0
    };
    activePMs.forEach(pm => {
      effortData[monthKey][pm] = 0;
    });
    activeBPs.forEach(bp => {
      effortData[monthKey][bp] = 0;
    });
    curr.setMonth(curr.getMonth() + 1);
  }

  // Calculate PM effort during Implementation phase
  filteredProjects.forEach(project => {
    if (project.projectManager && project.pmAllocation && project.implementation.start && project.implementation.finish) {
      const pmAlloc = parseFloat(project.pmAllocation) || 0;
      const start = new Date(project.implementation.start);
      const finish = new Date(project.implementation.finish);
      
      start.setHours(0, 0, 0, 0);
      finish.setHours(0, 0, 0, 0);
      
      if (finish >= earliest && start <= latest) {
        let c = new Date(Math.max(start.getTime(), earliest.getTime()));
        c.setDate(1);
        c.setHours(0, 0, 0, 0);
        
        const finalMonth = new Date(Math.min(finish.getTime(), latest.getTime()));
        finalMonth.setDate(1);
        finalMonth.setHours(0, 0, 0, 0);
        
        while (c <= finalMonth) {
          const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          if (effortData[monthKey]) {
            effortData[monthKey][project.projectManager] += pmAlloc;
          }
          
          c.setMonth(c.getMonth() + 1);
        }
      }
    }
  });

  // Calculate BP effort during PSD phase
  filteredProjects.forEach(project => {
    if (project.businessPartner && project.bpAllocation && project.psd.start && project.psd.finish) {
      const bpAlloc = parseFloat(project.bpAllocation) || 0;
      const start = new Date(project.psd.start);
      const finish = new Date(project.psd.finish);
      
      start.setHours(0, 0, 0, 0);
      finish.setHours(0, 0, 0, 0);
      
      if (finish >= earliest && start <= latest) {
        let c = new Date(Math.max(start.getTime(), earliest.getTime()));
        c.setDate(1);
        c.setHours(0, 0, 0, 0);
        
        const finalMonth = new Date(Math.min(finish.getTime(), latest.getTime()));
        finalMonth.setDate(1);
        finalMonth.setHours(0, 0, 0, 0);
        
        while (c <= finalMonth) {
          const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          if (effortData[monthKey]) {
            effortData[monthKey][project.businessPartner] += bpAlloc;
          }
          
          c.setMonth(c.getMonth() + 1);
        }
      }
    }
  });

  // Calculate BP effort during BP Implementation phase
  filteredProjects.forEach(project => {
    if (project.businessPartner && project.bpImplementationAllocation && project.bpImplementation.start && project.bpImplementation.finish) {
      const bpImplAlloc = parseFloat(project.bpImplementationAllocation) || 0;
      const start = new Date(project.bpImplementation.start);
      const finish = new Date(project.bpImplementation.finish);
      
      start.setHours(0, 0, 0, 0);
      finish.setHours(0, 0, 0, 0);
      
      if (finish >= earliest && start <= latest) {
        let c = new Date(Math.max(start.getTime(), earliest.getTime()));
        c.setDate(1);
        c.setHours(0, 0, 0, 0);
        
        const finalMonth = new Date(Math.min(finish.getTime(), latest.getTime()));
        finalMonth.setDate(1);
        finalMonth.setHours(0, 0, 0, 0);
        
        while (c <= finalMonth) {
          const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          if (effortData[monthKey]) {
            effortData[monthKey][project.businessPartner] += bpImplAlloc;
          }
          
          c.setMonth(c.getMonth() + 1);
        }
      }
    }
  });

  // Calculate PM External effort
  filteredProjectsForExternal.forEach(project => {
    if (project.pmExternalAllocation && project.implementation.start && project.implementation.finish) {
      const pmExtAlloc = parseFloat(project.pmExternalAllocation) || 0;
      if (pmExtAlloc > 0) {
        const start = new Date(project.implementation.start);
        const finish = new Date(project.implementation.finish);
        
        start.setHours(0, 0, 0, 0);
        finish.setHours(0, 0, 0, 0);
        
        if (finish >= earliest && start <= latest) {
          let c = new Date(Math.max(start.getTime(), earliest.getTime()));
          c.setDate(1);
          c.setHours(0, 0, 0, 0);
          
          const finalMonth = new Date(Math.min(finish.getTime(), latest.getTime()));
          finalMonth.setDate(1);
          finalMonth.setHours(0, 0, 0, 0);
          
          while (c <= finalMonth) {
            const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (effortData[monthKey]) {
              effortData[monthKey].pmExternal += pmExtAlloc;
            }
            
            c.setMonth(c.getMonth() + 1);
          }
        }
      }
    }
  });

  // Calculate QA External effort
  filteredProjectsForExternal.forEach(project => {
    if (project.qaExternalAllocation && project.implementation.start && project.implementation.finish) {
      const qaExtAlloc = parseFloat(project.qaExternalAllocation) || 0;
      if (qaExtAlloc > 0) {
        const start = new Date(project.implementation.start);
        const finish = new Date(project.implementation.finish);
        
        start.setHours(0, 0, 0, 0);
        finish.setHours(0, 0, 0, 0);
        
        if (finish >= earliest && start <= latest) {
          let c = new Date(Math.max(start.getTime(), earliest.getTime()));
          c.setDate(1);
          c.setHours(0, 0, 0, 0);
          
          const finalMonth = new Date(Math.min(finish.getTime(), latest.getTime()));
          finalMonth.setDate(1);
          finalMonth.setHours(0, 0, 0, 0);
          
          while (c <= finalMonth) {
            const monthKey = c.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (effortData[monthKey]) {
              effortData[monthKey].qaExternal += qaExtAlloc;
            }
            
            c.setMonth(c.getMonth() + 1);
          }
        }
      }
    }
  });

  // Add BAU allocation
  if (pmBAU) {
    const pmBAUValue = parseFloat(pmBAU) || 0;
    
    Object.keys(effortData).forEach(monthKey => {
      activePMs.forEach(pm => {
        effortData[monthKey][pm] += pmBAUValue;
      });
    });
  }

  if (bpBAU) {
    const bpBAUValue = parseFloat(bpBAU) || 0;
    
    Object.keys(effortData).forEach(monthKey => {
      activeBPs.forEach(bp => {
        effortData[monthKey][bp] += bpBAUValue;
      });
    });
  }

  // Convert to chart data format
  const chartData = Object.values(effortData)
    .sort((a, b) => a.date - b.date)
    .map(item => {
      const result = { month: item.month };
      
      let totalPM = 0;
      activePMs.forEach(pm => {
        const pmValue = Math.round((item[pm] || 0) * 100) / 100;
        result[`${pm} (PM)`] = pmValue;
        totalPM += pmValue;
      });
      
      let totalBP = 0;
      activeBPs.forEach(bp => {
        const bpValue = Math.round((item[bp] || 0) * 100) / 100;
        result[`${bp} (BP)`] = bpValue;
        totalBP += bpValue;
      });
      
      result['Total PM'] = Math.round(totalPM * 100) / 100;
      result['Total BP'] = Math.round(totalBP * 100) / 100;
      result['PM External'] = Math.round((item.pmExternal || 0) * 100) / 100;
      result['QA External'] = Math.round((item.qaExternal || 0) * 100) / 100;
      
      return result;
    });

  return { chartData, activePMs, activeBPs };
};