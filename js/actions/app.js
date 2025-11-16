// js/actions/app.js
import { saveActions, loadActions, clearAllActions } from '../utils/storage.js';
import { exportActionsToExcel, importActionsFromExcel } from './actionsExcelUtils.js';
import { Header } from './components/Header.js';
import { MenuBar } from './components/MenuBar.js';
import { ActionForm } from './components/ActionForm.js';

const { useState, useRef, useEffect } = React;

function ActionItemsApp() {
  // ===== STATE DECLARATIONS =====

  // Actions state
  const [actions, setActions] = useState([]);

  // UI state
  const [hideActionFields, setHideActionFields] = useState(false);
  const [activeTab, setActiveTab] = useState('actions');
  const [darkMode, setDarkMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('success'); // 'success', 'error', 'saving'

  // Ref for file input
  const fileInputRef = useRef(null);

  // ===== AUTO-SAVE & PERSISTENCE =====

  /**
   * Load actions from Supabase/localStorage on mount
   */
  useEffect(() => {
    const loadData = async () => {
      const savedActions = await loadActions();
      if (savedActions && savedActions.length > 0) {
        setActions(savedActions);
        console.log('Loaded', savedActions.length, 'actions');
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
        const latestActions = await loadActions();
        if (latestActions && latestActions.length > 0) {
          // Check if data has actually changed by comparing JSON strings
          const currentJSON = JSON.stringify(actions);
          const latestJSON = JSON.stringify(latestActions);

          if (currentJSON !== latestJSON) {
            console.log('🔄 Auto-refresh: New data detected from Supabase');
            setActions(latestActions);
          }
        }
      } catch (error) {
        console.error('Error during auto-refresh:', error);
      }
    }, 45000); // Refresh every 45 seconds

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, [actions]);

  /**
   * Auto-save actions whenever they change (to Supabase and localStorage)
   */
  useEffect(() => {
    if (actions.length > 0) {
      const saveData = async () => {
        try {
          setSaveStatus('saving');
          const success = await saveActions(actions);
          if (success) {
            setSaveStatus('success');
            console.log('Auto-saved', actions.length, 'actions to Supabase');
          } else {
            setSaveStatus('error');
            console.error('Failed to save actions');
          }
        } catch (error) {
          setSaveStatus('error');
          console.error('Error during auto-save:', error);
        }
      };
      saveData();
    }
  }, [actions]);

  // ===== ACTION MANAGEMENT FUNCTIONS =====

  /**
   * Add a new empty action
   */
  const addAction = () => {
    const newAction = {
      title: '',
      department: '',
      classification: 'Action',
      progress: '0%',
      initiativeOwner: '',
      scope: '',
      teamMembers: '',
      investmentNeed: '',
      valueCapture: '',
      keyAchievements: '',
      activities: []
    };
    setActions([...actions, newAction]);
  };

  /**
   * Update an action field
   */
  const updateAction = (index, field, value) => {
    const updatedActions = [...actions];
    updatedActions[index][field] = value;
    setActions(updatedActions);
  };

  /**
   * Delete an action
   */
  const deleteAction = (index) => {
    if (confirm('Are you sure you want to delete this action?')) {
      const updatedActions = actions.filter((_, i) => i !== index);
      setActions(updatedActions);
    }
  };

  /**
   * Add a new activity to an action
   */
  const addActivity = (actionIndex) => {
    const updatedActions = [...actions];
    if (!updatedActions[actionIndex].activities) {
      updatedActions[actionIndex].activities = [];
    }
    updatedActions[actionIndex].activities.push({
      title: '',
      startDate: '',
      finishDate: '',
      progress: '0%',
      keyAchievements: ''
    });
    setActions(updatedActions);
  };

  /**
   * Update an activity field
   */
  const updateActivity = (actionIndex, activityIndex, field, value) => {
    const updatedActions = [...actions];
    updatedActions[actionIndex].activities[activityIndex][field] = value;
    setActions(updatedActions);
  };

  /**
   * Delete an activity from an action
   */
  const deleteActivity = (actionIndex, activityIndex) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      const updatedActions = [...actions];
      updatedActions[actionIndex].activities = updatedActions[actionIndex].activities.filter((_, i) => i !== activityIndex);
      setActions(updatedActions);
    }
  };

  // ===== EXCEL IMPORT/EXPORT FUNCTIONS =====

  const handleExport = () => {
    exportActionsToExcel(actions);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importActionsFromExcel(file, (importedActions) => {
        setActions(importedActions);
      });
    }
    e.target.value = '';
  };

  /**
   * Clear all data from localStorage and reset app
   */
  const handleClearAll = () => {
    clearAllActions();
    setActions([]);
    console.log('All actions cleared from localStorage');
  };

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
            ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-indigo-400 border-b-4 border-indigo-400 shadow-xl scale-105'
            : 'bg-gradient-to-br from-white to-indigo-50 text-indigo-700 border-b-4 border-indigo-600 shadow-xl scale-105'
          : darkMode
            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:scale-102'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
      }`
    }, `${emoji} ${label}`);
  };

  /**
   * Render actions entry view
   */
  const renderActionsView = () => {
    return React.createElement('div', null,
      // Action forms (only show if not hidden or if no actions)
      !hideActionFields && React.createElement('div', {
        className: 'space-y-4'
      },
        actions.length > 0
          ? actions.map((action, aIndex) => {
              return React.createElement(ActionForm, {
                key: aIndex,
                action,
                aIndex,
                updateAction,
                deleteAction,
                addActivity,
                updateActivity,
                deleteActivity,
                darkMode
              });
            })
          : React.createElement('div', {
              className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
            },
              React.createElement('p', { className: 'text-lg mb-2' }, '✓ No actions yet'),
              React.createElement('p', { className: 'text-sm' }, 'Click "Add Action" from the Files menu to create your first action item')
            )
      )
    );
  };

  /**
   * Render circular progress indicator
   */
  const renderCircularProgress = (progressPercent, size = 80) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(100, Math.max(0, progressPercent));
    const offset = circumference - (progress / 100) * circumference;

    return React.createElement('div', {
      className: 'relative inline-flex items-center justify-center',
      style: { width: `${size}px`, height: `${size}px` }
    },
      // SVG Circle
      React.createElement('svg', {
        className: 'transform -rotate-90',
        width: size,
        height: size
      },
        // Background circle
        React.createElement('circle', {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          stroke: darkMode ? '#334155' : '#e5e7eb',
          strokeWidth: strokeWidth,
          fill: 'none'
        }),
        // Progress circle
        React.createElement('circle', {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          stroke: 'url(#gradient)',
          strokeWidth: strokeWidth,
          fill: 'none',
          strokeLinecap: 'round',
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          style: { transition: 'stroke-dashoffset 0.5s ease' }
        }),
        // Gradient definition
        React.createElement('defs', null,
          React.createElement('linearGradient', {
            id: 'gradient',
            x1: '0%',
            y1: '0%',
            x2: '100%',
            y2: '100%'
          },
            React.createElement('stop', {
              offset: '0%',
              style: { stopColor: '#6366f1', stopOpacity: 1 }
            }),
            React.createElement('stop', {
              offset: '100%',
              style: { stopColor: '#a855f7', stopOpacity: 1 }
            })
          )
        )
      ),
      // Percentage text in center
      React.createElement('div', {
        className: 'absolute inset-0 flex items-center justify-center'
      },
        React.createElement('span', {
          className: `text-base font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
        }, `${progress}%`)
      )
    );
  };

  /**
   * Render Slides view - presentation format for all actions
   */
  const renderSlidesView = () => {
    if (actions.length === 0) {
      return React.createElement('div', {
        className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
      },
        React.createElement('p', { className: 'text-lg mb-2' }, '📊 No Actions to Display'),
        React.createElement('p', { className: 'text-sm' }, 'Add actions from the Actions tab to see them as presentation slides here')
      );
    }

    return React.createElement('div', {
      className: 'space-y-6'
    },
      actions.map((action, index) => {
        // Calculate progress percentage for display
        const progressValue = parseInt(action.progress) || 0;

        return React.createElement('div', {
          key: index,
          className: `${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl border ${darkMode ? 'border-slate-700' : 'border-gray-200'} overflow-hidden`
        },
          // Slide Header
          React.createElement('div', {
            className: `p-6 bg-gradient-to-r ${darkMode ? 'from-indigo-900 to-purple-900' : 'from-indigo-500 to-purple-600'}`
          },
            // Action Title
            React.createElement('h2', {
              className: 'text-3xl font-bold text-white mb-4'
            }, action.title || 'Untitled Action'),

            // Progress Bar
            React.createElement('div', null,
              React.createElement('div', {
                className: 'flex items-center justify-between mb-2'
              },
                React.createElement('h3', {
                  className: 'text-base font-semibold text-white/90'
                }, '📈 Progress'),
                React.createElement('span', {
                  className: 'text-xl font-bold text-white'
                }, `${progressValue}%`)
              ),
              React.createElement('div', {
                className: 'w-full h-3 rounded-full overflow-hidden bg-white/20'
              },
                React.createElement('div', {
                  className: 'h-full bg-white transition-all duration-300',
                  style: { width: action.progress || '0%' }
                })
              )
            )
          ),

          // Slide Content
          React.createElement('div', {
            className: 'p-6'
          },
            // Two-column layout
            React.createElement('div', {
              className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
            },
              // Left Column
              React.createElement('div', {
                className: 'space-y-6'
              },
                // Initiative Owner
                action.initiativeOwner && React.createElement('div', null,
                  React.createElement('h3', {
                    className: `text-lg font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
                  }, '👤 Initiative Owner'),
                  React.createElement('p', {
                    className: `${darkMode ? 'text-gray-300' : 'text-gray-700'}`
                  }, action.initiativeOwner)
                ),

                // Team Members
                action.teamMembers && React.createElement('div', null,
                  React.createElement('h3', {
                    className: `text-lg font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
                  }, '👥 Team Members'),
                  React.createElement('div', {
                    className: `${darkMode ? 'text-gray-300' : 'text-gray-700'} prose prose-sm max-w-none`,
                    dangerouslySetInnerHTML: { __html: action.teamMembers }
                  })
                ),

                // Investment Need
                action.investmentNeed && React.createElement('div', null,
                  React.createElement('h3', {
                    className: `text-lg font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
                  }, '💰 Investment Need'),
                  React.createElement('div', {
                    className: `${darkMode ? 'text-gray-300' : 'text-gray-700'} prose prose-sm max-w-none`,
                    dangerouslySetInnerHTML: { __html: action.investmentNeed }
                  })
                ),

                // Key Achievements
                action.keyAchievements && React.createElement('div', null,
                  React.createElement('h3', {
                    className: `text-lg font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
                  }, '🏆 Key Achievements'),
                  React.createElement('div', {
                    className: `${darkMode ? 'text-gray-300' : 'text-gray-700'} prose prose-sm max-w-none`,
                    dangerouslySetInnerHTML: { __html: action.keyAchievements }
                  })
                )
              ),

              // Right Column
              React.createElement('div', {
                className: 'space-y-6'
              },
                // Scope
                action.scope && React.createElement('div', null,
                  React.createElement('h3', {
                    className: `text-lg font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
                  }, '🎯 Scope'),
                  React.createElement('div', {
                    className: `${darkMode ? 'text-gray-300' : 'text-gray-700'} prose prose-sm max-w-none`,
                    dangerouslySetInnerHTML: { __html: action.scope }
                  })
                ),

                // Value Capture
                action.valueCapture && React.createElement('div', null,
                  React.createElement('h3', {
                    className: `text-lg font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
                  }, '💎 Value Capture'),
                  React.createElement('div', {
                    className: `${darkMode ? 'text-gray-300' : 'text-gray-700'} prose prose-sm max-w-none`,
                    dangerouslySetInnerHTML: { __html: action.valueCapture }
                  })
                )
              )
            ),

            // Activities Section (Full Width)
            action.activities && action.activities.length > 0 && React.createElement('div', {
              className: 'mt-6 pt-6 border-t ' + (darkMode ? 'border-slate-700' : 'border-gray-200')
            },
              React.createElement('h3', {
                className: `text-lg font-bold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
              }, '📋 Activities'),
              React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                action.activities.map((activity, actIdx) => {
                  const activityProgress = parseInt(activity.progress) || 0;

                  return React.createElement('div', {
                    key: actIdx,
                    className: `p-4 rounded-lg border ${darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-indigo-50 border-indigo-200'}`
                  },
                    // Activity title
                    React.createElement('h4', {
                      className: `font-bold text-lg mb-3 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`
                    }, activity.title || `Activity ${actIdx + 1}`),

                    // Timeline with circular progress
                    (activity.startDate || activity.finishDate) && React.createElement('div', {
                      className: 'mb-2 flex items-center gap-4'
                    },
                      // Timeline info
                      React.createElement('div', {
                        className: 'flex-1'
                      },
                        React.createElement('p', {
                          className: `text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                        }, '📅 Timeline:'),
                        React.createElement('div', {
                          className: `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} ml-4`
                        },
                          activity.startDate && React.createElement('div', null, `Start: ${activity.startDate}`),
                          activity.finishDate && React.createElement('div', null, `Finish: ${activity.finishDate}`)
                        )
                      ),
                      // Circular progress indicator
                      React.createElement('div', {
                        className: 'flex-shrink-0'
                      }, renderCircularProgress(activityProgress, 70))
                    ),

                    // Activity Key Achievements
                    activity.keyAchievements && React.createElement('div', null,
                      React.createElement('p', {
                        className: `text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                      }, '🏆 Key Achievements:'),
                      React.createElement('div', {
                        className: `${darkMode ? 'text-gray-300' : 'text-gray-700'} prose prose-sm max-w-none ml-4`,
                        dangerouslySetInnerHTML: { __html: activity.keyAchievements }
                      })
                    )
                  );
                })
              )
            )
          )
        );
      })
    );
  };

  /**
   * Render Gantt view - timeline chart for all actions and activities
   */
  const renderGanttView = () => {
    if (actions.length === 0) {
      return React.createElement('div', {
        className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
      },
        React.createElement('p', { className: 'text-lg mb-2' }, '📅 No Actions to Display'),
        React.createElement('p', { className: 'text-sm' }, 'Add actions with activities and dates from the Actions tab to see the timeline here')
      );
    }

    // Helper function to calculate bar width and position
    const calculateBarMetrics = (startDate, finishDate, minDate, maxDate) => {
      if (!startDate || !finishDate || !minDate || !maxDate) return null;

      const start = new Date(startDate);
      const finish = new Date(finishDate);
      const min = new Date(minDate);
      const max = new Date(maxDate);

      const totalDays = (max - min) / (1000 * 60 * 60 * 24);
      const startOffset = (start - min) / (1000 * 60 * 60 * 24);
      const duration = (finish - start) / (1000 * 60 * 60 * 24);

      const leftPercent = (startOffset / totalDays) * 100;
      const widthPercent = (duration / totalDays) * 100;

      return { left: leftPercent, width: widthPercent };
    };

    // Find min and max dates across all actions and activities
    let minDate = null;
    let maxDate = null;

    actions.forEach(action => {
      if (action.activities && action.activities.length > 0) {
        action.activities.forEach(activity => {
          if (activity.startDate) {
            const startDate = new Date(activity.startDate);
            if (!minDate || startDate < minDate) minDate = startDate;
          }
          if (activity.finishDate) {
            const finishDate = new Date(activity.finishDate);
            if (!maxDate || finishDate > maxDate) maxDate = finishDate;
          }
        });
      }
    });

    if (!minDate || !maxDate) {
      return React.createElement('div', {
        className: `text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
      },
        React.createElement('p', { className: 'text-lg mb-2' }, '📅 No Timeline Data'),
        React.createElement('p', { className: 'text-sm' }, 'Add start and finish dates to activities to see the Gantt timeline')
      );
    }

    // Helper function to get quarter from date
    const getQuarter = (date) => {
      const month = date.getMonth();
      return Math.floor(month / 3) + 1;
    };

    // Generate year and quarter markers
    const quarterMarkers = [];
    const startYear = minDate.getFullYear();
    const startQuarter = getQuarter(minDate);
    const endYear = maxDate.getFullYear();
    const endQuarter = getQuarter(maxDate);

    // Create quarter start dates
    let currentYear = startYear;
    let currentQuarter = startQuarter;

    while (currentYear < endYear || (currentYear === endYear && currentQuarter <= endQuarter)) {
      const quarterStartMonth = (currentQuarter - 1) * 3;
      const quarterDate = new Date(currentYear, quarterStartMonth, 1);

      quarterMarkers.push({
        date: quarterDate,
        year: currentYear,
        quarter: currentQuarter,
        label: `Q${currentQuarter}`
      });

      // Move to next quarter
      currentQuarter++;
      if (currentQuarter > 4) {
        currentQuarter = 1;
        currentYear++;
      }
    }

    // Group markers by year for header display
    const yearGroups = [];
    let currentYearGroup = null;

    quarterMarkers.forEach((marker, idx) => {
      if (!currentYearGroup || currentYearGroup.year !== marker.year) {
        currentYearGroup = {
          year: marker.year,
          quarters: [],
          startIdx: idx
        };
        yearGroups.push(currentYearGroup);
      }
      currentYearGroup.quarters.push(marker);
    });

    return React.createElement('div', {
      className: `${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`
    },
      // Gantt Header
      React.createElement('div', {
        className: 'mb-6'
      },
        React.createElement('h2', {
          className: `text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mb-2`
        }, '📅 Project Timeline'),
        React.createElement('p', {
          className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
        }, `Timeline: ${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`)
      ),

      // Timeline grid
      React.createElement('div', {
        className: 'overflow-x-auto'
      },
        React.createElement('div', {
          className: 'min-w-[1000px]'
        },
          // Year and Quarter headers
          React.createElement('div', {
            className: `grid gap-4 mb-2`,
            style: { gridTemplateColumns: '250px 1fr' }
          },
            React.createElement('div', {
              className: `font-bold text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
            }, 'Actions'),
            // Year headers
            React.createElement('div', {
              className: 'relative'
            },
              yearGroups.map((yearGroup, idx) => {
                const totalQuarters = quarterMarkers.length;
                const yearQuarterCount = yearGroup.quarters.length;
                const leftPercent = (yearGroup.startIdx / totalQuarters) * 100;
                const widthPercent = (yearQuarterCount / totalQuarters) * 100;

                return React.createElement('div', {
                  key: idx,
                  className: `absolute text-center font-bold text-base ${darkMode ? 'text-indigo-400' : 'text-indigo-700'} border-b-2 ${darkMode ? 'border-indigo-600' : 'border-indigo-400'}`,
                  style: {
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    paddingBottom: '4px'
                  }
                }, yearGroup.year);
              })
            )
          ),

          // Quarter headers
          React.createElement('div', {
            className: `grid gap-4 mb-4 pb-3 border-b-2 ${darkMode ? 'border-slate-600' : 'border-gray-300'}`,
            style: { gridTemplateColumns: '250px 1fr' }
          },
            React.createElement('div'), // Empty space for action column
            React.createElement('div', {
              className: 'grid',
              style: { gridTemplateColumns: `repeat(${quarterMarkers.length}, 1fr)` }
            },
              quarterMarkers.map((marker, idx) => {
                return React.createElement('div', {
                  key: idx,
                  className: `text-center text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} px-2`
                }, marker.label);
              })
            )
          ),

          // Actions and Activities
          actions.map((action, actionIdx) => {
            const hasActivities = action.activities && action.activities.length > 0;
            const activitiesWithDates = hasActivities
              ? action.activities.filter(a => a.startDate && a.finishDate)
              : [];

            if (activitiesWithDates.length === 0) return null;

            const actionProgress = parseInt(action.progress) || 0;

            return React.createElement('div', {
              key: actionIdx,
              className: `mb-4 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
            },
              // Action row with name and timeline
              React.createElement('div', {
                className: `grid gap-4 mb-2`,
                style: { gridTemplateColumns: '250px 1fr' }
              },
                // Action name with progress
                React.createElement('div', {
                  className: `flex items-center gap-3 p-2 rounded ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`
                },
                  React.createElement('div', {
                    className: 'flex-1'
                  },
                    React.createElement('h3', {
                      className: `font-bold text-sm ${darkMode ? 'text-indigo-300' : 'text-indigo-700'} truncate`
                    }, action.title || `Action ${actionIdx + 1}`),
                    React.createElement('span', {
                      className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                    }, `${actionProgress}% complete`)
                  )
                ),

                // Timeline area with quarter grid
                React.createElement('div', {
                  className: 'relative h-12 flex items-center'
                },
                  // Quarter grid lines
                  React.createElement('div', {
                    className: 'grid absolute inset-0',
                    style: { gridTemplateColumns: `repeat(${quarterMarkers.length}, 1fr)` }
                  },
                    quarterMarkers.map((marker, idx) => {
                      return React.createElement('div', {
                        key: idx,
                        className: `border-r ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
                      });
                    })
                  )
                )
              ),

              // Activities for this action
              activitiesWithDates.map((activity, activityIdx) => {
                const metrics = calculateBarMetrics(
                  activity.startDate,
                  activity.finishDate,
                  minDate,
                  maxDate
                );

                if (!metrics) return null;

                const progressValue = parseInt(activity.progress) || 0;

                return React.createElement('div', {
                  key: activityIdx,
                  className: `grid gap-4 mb-2`,
                  style: { gridTemplateColumns: '250px 1fr' }
                },
                  // Activity name (indented)
                  React.createElement('div', {
                    className: `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center pl-6`
                  },
                    React.createElement('span', {
                      className: 'truncate'
                    }, `↳ ${activity.title || `Activity ${activityIdx + 1}`}`)
                  ),

                  // Timeline bar
                  React.createElement('div', {
                    className: 'relative h-8 flex items-center'
                  },
                    // Quarter grid lines
                    React.createElement('div', {
                      className: 'grid absolute inset-0',
                      style: { gridTemplateColumns: `repeat(${quarterMarkers.length}, 1fr)` }
                    },
                      quarterMarkers.map((marker, idx) => {
                        return React.createElement('div', {
                          key: idx,
                          className: `border-r ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
                        });
                      })
                    ),

                    // Activity bar with progress
                    React.createElement('div', {
                      className: `absolute h-5 rounded overflow-hidden shadow-md ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}`,
                      style: {
                        left: `${metrics.left}%`,
                        width: `${metrics.width}%`
                      }
                    },
                      // Progress fill
                      React.createElement('div', {
                        className: 'h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300',
                        style: { width: `${progressValue}%` }
                      }),
                      // Percentage label
                      React.createElement('div', {
                        className: 'absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference'
                      }, `${progressValue}%`)
                    )
                  )
                );
              }),

              // Separator line between actions
              React.createElement('div', {
                className: `mt-3 mb-3 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
              })
            );
          })
        )
      )
    );
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
            className: `inline-flex items-center gap-2 ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} font-medium transition-colors`
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
          addAction,
          onImportClick: () => fileInputRef.current?.click(),
          exportToExcel: handleExport,
          onClearAll: handleClearAll,
          hideActionFields,
          setHideActionFields,
          darkMode,
          setDarkMode,
          saveStatus
        }),

        // Tabs
        React.createElement('div', {
          className: 'flex gap-2 mb-6 border-b-2 ' + (darkMode ? 'border-slate-700' : 'border-gray-200')
        },
          renderTabButton('actions', 'Actions', '✓'),
          renderTabButton('slides', 'Slides', '📊'),
          renderTabButton('gantt', 'Gantt', '📅')
        ),

        // Tab Content
        React.createElement('div', { className: 'mt-6' },
          activeTab === 'actions' && renderActionsView(),
          activeTab === 'slides' && renderSlidesView(),
          activeTab === 'gantt' && renderGanttView()
        )
      )
    )
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ActionItemsApp));