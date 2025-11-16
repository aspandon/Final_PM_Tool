// js/components/ActionPlan/ActionPlanGantt.js

/**
 * ActionPlanGantt Component
 * Interactive Gantt chart for Action Plans with:
 * - Draggable bars to change dates
 * - Visual dependency lines
 * - Red lines when dependencies are violated
 * - Autopilot feature for automatic task arrangement
 */

export function ActionPlanGantt({ actionPlan, darkMode, onUpdate, statuses, priorities, isEditLocked }) {
  console.log('📈 [ActionPlanGantt] Component loaded - NEW GANTT VIEW VERSION 2.0');

  const [draggedItem, setDraggedItem] = React.useState(null);
  const [dragStartX, setDragStartX] = React.useState(null);
  const [dragType, setDragType] = React.useState(null); // 'move', 'resize-start', 'resize-end'
  const [viewFilters, setViewFilters] = React.useState({
    showActions: true,
    showTasks: true,
    showSubtasks: true
  });
  const [autopilotResult, setAutopilotResult] = React.useState(null);
  const [undoHistory, setUndoHistory] = React.useState([]); // Stack of previous states (max 20)
  const [svgReady, setSvgReady] = React.useState(false);

  // Force re-render when component mounts to get proper dimensions
  React.useEffect(() => {
    setSvgReady(true);
  }, []);

  // Toggle filter
  const toggleFilter = (filterKey) => {
    setViewFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  // Undo functionality
  const saveToHistory = () => {
    setUndoHistory(prev => {
      const newHistory = [...prev, JSON.parse(JSON.stringify(actionPlan))];
      // Keep only last 20 states
      return newHistory.slice(-20);
    });
  };

  const undo = () => {
    if (undoHistory.length === 0) return;

    const previousState = undoHistory[undoHistory.length - 1];
    const newHistory = undoHistory.slice(0, -1);

    setUndoHistory(newHistory);
    onUpdate(previousState);
  };

  // Get all items with their dates
  const getAllItems = () => {
    const items = [];

    console.log('[ActionPlanGantt] View filters:', viewFilters);
    console.log('[ActionPlanGantt] Action plan data:', actionPlan);

    actionPlan.forEach(action => {
      if (viewFilters.showActions) {
        items.push({
          ...action,
          type: 'action',
          itemId: action.id,
          itemName: action.name,
          actionId: action.id,
          dependencies: action.dependencies || []
        });
        console.log('[ActionPlanGantt] Added Action:', action.name);
      }

      if (action.tasks) {
        action.tasks.forEach(task => {
          if (viewFilters.showTasks) {
            items.push({
              ...task,
              type: 'task',
              itemId: task.id,
              itemName: task.name,
              actionName: action.name,
              actionId: action.id,
              taskId: task.id,
              dependencies: task.dependencies || []
            });
            console.log('[ActionPlanGantt] Added Task:', task.name);
          }

          if (task.subtasks && viewFilters.showSubtasks) {
            task.subtasks.forEach(subtask => {
              items.push({
                ...subtask,
                type: 'subtask',
                itemId: subtask.id,
                itemName: subtask.name,
                actionName: action.name,
                taskName: task.name,
                actionId: action.id,
                taskId: task.id,
                subtaskId: subtask.id,
                dependencies: subtask.dependencies || []
              });
              console.log('[ActionPlanGantt] Added Subtask:', subtask.name);
            });
          }
        });
      }
    });

    console.log('[ActionPlanGantt] All items:', items);
    return items;
  };

  // Get date range for timeline
  const getDateRange = () => {
    const items = getAllItems();
    let earliest = null;
    let latest = null;

    items.forEach(item => {
      const start = item.startDate;
      const finish = item.finishDate || item.dueDate;

      if (start) {
        const startDate = new Date(start);
        if (!earliest || startDate < earliest) {
          earliest = startDate;
        }
      }

      if (finish) {
        const finishDate = new Date(finish);
        if (!latest || finishDate > latest) {
          latest = finishDate;
        }
      }
    });

    // Add padding
    if (earliest && latest) {
      earliest = new Date(earliest);
      latest = new Date(latest);
      earliest.setDate(earliest.getDate() - 7);
      latest.setDate(latest.getDate() + 7);
    } else {
      // Default to current month if no dates
      earliest = new Date();
      earliest.setDate(1);
      latest = new Date();
      latest.setMonth(latest.getMonth() + 3);
    }

    return { earliest, latest };
  };

  // Calculate days between dates
  const getDaysDiff = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Get bar position and width
  const getBarPosition = (startDate, finishDate, earliest, totalDays) => {
    if (!startDate || !finishDate) {
      return { visible: false };
    }

    const start = new Date(startDate);
    const finish = new Date(finishDate);

    const offset = getDaysDiff(earliest, start) - 1;
    const duration = getDaysDiff(start, finish);

    const left = `${(offset / totalDays) * 100}%`;
    const width = `${(duration / totalDays) * 100}%`;

    return { visible: true, left, width, offset, duration };
  };

  // Check if dependency is violated
  const isDependencyViolated = (item, allItems) => {
    if (!item.dependencies || item.dependencies.length === 0) return false;
    if (!item.startDate) return false;

    const itemStart = new Date(item.startDate);

    for (const depId of item.dependencies) {
      const depItem = allItems.find(i => i.itemId === depId);
      if (depItem && depItem.finishDate) {
        const depFinish = new Date(depItem.finishDate);
        if (itemStart < depFinish) {
          return true;
        }
      }
    }

    return false;
  };

  // Mouse event handlers for resize
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggedItem || !dragStartX || !dragType || dragType === 'move') return;
      // Visual feedback during resize - handled by CSS
    };

    const handleMouseUp = (e) => {
      if (!draggedItem || !dragStartX || !dragType || dragType === 'move') return;

      // Find the timeline element to calculate width
      const timelineElement = document.querySelector('.gantt-timeline-area');
      if (!timelineElement) return;

      const rect = timelineElement.getBoundingClientRect();
      const items = getAllItems();
      const { earliest } = getDateRange();
      const totalDays = getDaysDiff(earliest, getDateRange().latest);

      handleBarDragEnd(e, rect.width, earliest, totalDays);
    };

    if (draggedItem && dragType && dragType !== 'move') {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedItem, dragStartX, dragType]);

  // Handle resize handle mouse down
  const handleResizeStart = (e, item, type) => {
    if (isEditLocked) return;
    e.stopPropagation();
    e.preventDefault();

    saveToHistory(); // Save state before change
    setDraggedItem(item);
    setDragStartX(e.clientX);
    setDragType(type); // 'resize-start' or 'resize-end'
  };

  // Handle bar drag start
  const handleBarDragStart = (e, item, barElement) => {
    if (isEditLocked) return;

    saveToHistory(); // Save state before change
    setDraggedItem(item);
    setDragStartX(e.clientX);
    setDragType('move');
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag
  const handleBarDrag = (e) => {
    if (!draggedItem || !dragStartX || e.clientX === 0) return;
    // Visual feedback could be added here
  };

  // Handle drag end (for both move and resize)
  const handleBarDragEnd = (e, timelineWidth, earliest, totalDays) => {
    if (!draggedItem || !dragStartX || isEditLocked) {
      setDraggedItem(null);
      setDragStartX(null);
      setDragType(null);
      return;
    }

    const deltaX = e.clientX - dragStartX;
    const deltaPercent = (deltaX / timelineWidth) * 100;
    const deltaDays = Math.round((deltaPercent / 100) * totalDays);

    if (deltaDays !== 0) {
      const oldStart = new Date(draggedItem.startDate);
      const oldFinish = new Date(draggedItem.finishDate || draggedItem.dueDate);

      let newStart = new Date(oldStart);
      let newFinish = new Date(oldFinish);

      if (dragType === 'move') {
        // Move both dates
        newStart.setDate(newStart.getDate() + deltaDays);
        newFinish.setDate(newFinish.getDate() + deltaDays);
      } else if (dragType === 'resize-start') {
        // Resize start date
        newStart.setDate(newStart.getDate() + deltaDays);
        // Ensure start is before finish
        if (newStart >= newFinish) {
          newStart = new Date(newFinish);
          newStart.setDate(newStart.getDate() - 1);
        }
      } else if (dragType === 'resize-end') {
        // Resize end date
        newFinish.setDate(newFinish.getDate() + deltaDays);
        // Ensure finish is after start
        if (newFinish <= newStart) {
          newFinish = new Date(newStart);
          newFinish.setDate(newFinish.getDate() + 1);
        }
      }

      // Update the item dates
      updateItemDates(draggedItem, newStart, newFinish);
    }

    setDraggedItem(null);
    setDragStartX(null);
    setDragType(null);
  };

  // Update item dates in action plan
  const updateItemDates = (item, newStart, newFinish) => {
    const startDateStr = newStart.toISOString().split('T')[0];
    const finishDateStr = newFinish.toISOString().split('T')[0];

    const newActionPlan = actionPlan.map(action => {
      if (item.type === 'action' && action.id === item.actionId) {
        return {
          ...action,
          startDate: startDateStr,
          finishDate: finishDateStr
        };
      }

      if (item.type === 'task' && action.id === item.actionId) {
        return {
          ...action,
          tasks: action.tasks.map(task => {
            if (task.id === item.taskId) {
              return {
                ...task,
                startDate: startDateStr,
                finishDate: finishDateStr,
                dueDate: finishDateStr
              };
            }
            return task;
          })
        };
      }

      if (item.type === 'subtask' && action.id === item.actionId) {
        return {
          ...action,
          tasks: action.tasks.map(task => {
            if (task.id === item.taskId) {
              return {
                ...task,
                subtasks: task.subtasks.map(subtask => {
                  if (subtask.id === item.subtaskId) {
                    return {
                      ...subtask,
                      startDate: startDateStr,
                      finishDate: finishDateStr,
                      dueDate: finishDateStr
                    };
                  }
                  return subtask;
                })
              };
            }
            return task;
          })
        };
      }

      return action;
    });

    onUpdate(newActionPlan);
  };

  // Autopilot: Rearrange tasks to fit in action timeframe
  const runAutopilot = () => {
    if (isEditLocked) return;

    saveToHistory(); // Save state before autopilot changes

    const newActionPlan = [...actionPlan];
    let allFit = true;
    const issues = [];

    newActionPlan.forEach(action => {
      if (!action.startDate || !action.finishDate) {
        issues.push(`Action "${action.name}" has no dates set`);
        allFit = false;
        return;
      }

      const actionStart = new Date(action.startDate);
      const actionFinish = new Date(action.finishDate);

      // Sort tasks by dependencies (topological sort)
      const sortedTasks = topologicalSort(action.tasks);

      if (!sortedTasks) {
        issues.push(`Action "${action.name}" has circular task dependencies`);
        allFit = false;
        return;
      }

      let currentDate = new Date(actionStart);

      sortedTasks.forEach(task => {
        // Calculate task duration
        let taskDuration = 1; // Default 1 day
        if (task.startDate && task.finishDate) {
          taskDuration = getDaysDiff(task.startDate, task.finishDate);
        }

        // Set task start date
        const taskStart = new Date(currentDate);
        const taskFinish = new Date(currentDate);
        taskFinish.setDate(taskFinish.getDate() + taskDuration - 1);

        // Check if task fits in action timeframe
        if (taskFinish > actionFinish) {
          issues.push(`Task "${task.name}" in action "${action.name}" exceeds action timeframe`);
          allFit = false;
        }

        // Update task dates
        task.startDate = taskStart.toISOString().split('T')[0];
        task.finishDate = taskFinish.toISOString().split('T')[0];
        task.dueDate = taskFinish.toISOString().split('T')[0];

        // Arrange subtasks if any
        if (task.subtasks && task.subtasks.length > 0) {
          const sortedSubtasks = topologicalSort(task.subtasks);

          if (!sortedSubtasks) {
            issues.push(`Task "${task.name}" has circular subtask dependencies`);
            allFit = false;
            return;
          }

          let subtaskDate = new Date(taskStart);

          sortedSubtasks.forEach(subtask => {
            let subtaskDuration = 1;
            if (subtask.startDate && subtask.finishDate) {
              subtaskDuration = getDaysDiff(subtask.startDate, subtask.finishDate);
            }

            const subtaskStart = new Date(subtaskDate);
            const subtaskFinish = new Date(subtaskDate);
            subtaskFinish.setDate(subtaskFinish.getDate() + subtaskDuration - 1);

            if (subtaskFinish > taskFinish) {
              issues.push(`Subtask "${subtask.name}" exceeds task "${task.name}" timeframe`);
              allFit = false;
            }

            subtask.startDate = subtaskStart.toISOString().split('T')[0];
            subtask.finishDate = subtaskFinish.toISOString().split('T')[0];
            subtask.dueDate = subtaskFinish.toISOString().split('T')[0];

            subtaskDate.setDate(subtaskDate.getDate() + subtaskDuration);
          });
        }

        // Move to next task start date
        currentDate.setDate(currentDate.getDate() + taskDuration);
      });
    });

    if (allFit) {
      onUpdate(newActionPlan);
      setAutopilotResult({ success: true, message: 'Autopilot successfully rearranged all tasks and subtasks!' });
    } else {
      setAutopilotResult({
        success: false,
        message: 'Autopilot cannot accommodate all tasks in the requested Action timeframe. Issues:\n' + issues.join('\n')
      });
    }
  };

  // Topological sort for dependency ordering
  const topologicalSort = (items) => {
    const sorted = [];
    const visited = new Set();
    const temp = new Set();

    const visit = (item) => {
      if (temp.has(item.id)) return false; // Circular dependency
      if (visited.has(item.id)) return true;

      temp.add(item.id);

      const deps = item.dependencies || [];
      for (const depId of deps) {
        const depItem = items.find(i => i.id === depId);
        if (depItem && !visit(depItem)) {
          return false;
        }
      }

      temp.delete(item.id);
      visited.add(item.id);
      sorted.push(item);
      return true;
    };

    for (const item of items) {
      if (!visited.has(item.id)) {
        if (!visit(item)) {
          return null; // Circular dependency detected
        }
      }
    }

    return sorted;
  };

  // Get month labels for header
  const getMonthLabels = (earliest, latest) => {
    const months = [];
    const current = new Date(earliest);
    current.setDate(1);

    while (current <= latest) {
      months.push({
        label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        date: new Date(current)
      });
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  };

  // Render dependency lines with professional curved connectors - REDESIGNED
  const renderDependencyLines = (allItems, earliest, totalDays, timelineRef) => {
    if (!timelineRef.current || !svgReady) return null;

    // Get the timeline container element and find its width
    const timelineContainer = timelineRef.current;
    const timelineRect = timelineContainer.getBoundingClientRect();

    // Calculate actual timeline width (subtract the 256px label column)
    const timelineWidth = timelineRect.width - 256;

    if (!timelineWidth || timelineWidth <= 0) {
      console.log('[Gantt] Timeline width not ready:', timelineWidth);
      return null;
    }

    console.log('[Gantt] Rendering dependency lines, timeline width:', timelineWidth);

    const paths = [];

    allItems.forEach((item, itemIndex) => {
      if (!item.dependencies || item.dependencies.length === 0) return;
      if (!item.startDate) return;

      item.dependencies.forEach(depId => {
        const depItem = allItems.find(i => i.itemId === depId);
        const depIndex = allItems.findIndex(i => i.itemId === depId);

        if (!depItem || !depItem.finishDate || depIndex === -1) return;

        const isViolated = isDependencyViolated(item, allItems);

        // Calculate bar positions in PIXELS
        const depFinish = new Date(depItem.finishDate || depItem.dueDate);
        const itemStart = new Date(item.startDate);

        // Get the pixel position at the END of the dependency bar (right edge)
        const depFinishOffset = getDaysDiff(earliest, depFinish);
        const x1 = (depFinishOffset / totalDays) * timelineWidth;

        // Get the pixel position at the START of the dependent item bar (left edge)
        const itemStartOffset = getDaysDiff(earliest, itemStart) - 1;
        const x2 = (itemStartOffset / totalDays) * timelineWidth;

        // Y positions: bars are h-6 (24px) with top-1 (4px), center is at index * 40 + 16
        const y1 = depIndex * 40 + 16; // Center of dependency bar
        const y2 = itemIndex * 40 + 16; // Center of dependent item bar

        // Create BPMN-style orthogonal connector (right angles only)
        // Exit horizontally from source, turn vertically, enter horizontally to target
        const horizontalGap = Math.abs(x2 - x1);
        const verticalGap = Math.abs(y2 - y1);

        let pathData;

        if (verticalGap < 5) {
          // Same row - simple horizontal line
          pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
        } else {
          // Different rows - orthogonal connector with right angles
          const turnPoint = x1 + Math.min(horizontalGap * 0.5, 40); // Turn point distance from source

          // Path: horizontal → vertical → horizontal (L-shape or Z-shape)
          pathData = `M ${x1} ${y1} L ${turnPoint} ${y1} L ${turnPoint} ${y2} L ${x2} ${y2}`;
        }

        paths.push({
          key: `${depItem.itemId}-${item.itemId}`,
          pathData,
          isViolated,
          x1,
          y1,
          x2,
          y2
        });

        console.log(`[Gantt] BPMN Connector: ${depItem.itemName} → ${item.itemName}`, {
          depFinish: depFinish.toISOString().split('T')[0],
          itemStart: itemStart.toISOString().split('T')[0],
          from: `(${Math.round(x1)}, ${y1})`,
          to: `(${Math.round(x2)}, ${y2})`,
          type: verticalGap < 5 ? 'horizontal' : 'orthogonal'
        });
      });
    });

    console.log(`[Gantt] Total paths generated: ${paths.length}`);
    return paths;
  };

  const items = getAllItems();

  if (items.length === 0) {
    return React.createElement('div', {
      className: `text-center py-12 ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'} rounded-xl border-2 ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
    },
      React.createElement('p', {
        className: `text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
      }, 'No items to display in Gantt view'),
      React.createElement('p', {
        className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
      }, 'Add actions, tasks, or subtasks with dates to see them on the timeline')
    );
  }

  const { earliest, latest } = getDateRange();
  const totalDays = getDaysDiff(earliest, latest);
  const monthLabels = getMonthLabels(earliest, latest);

  // Type-specific styling
  const typeStyles = {
    action: {
      color: darkMode ? 'bg-blue-600' : 'bg-blue-500',
      label: 'Action'
    },
    task: {
      color: darkMode ? 'bg-green-600' : 'bg-green-500',
      label: 'Task'
    },
    subtask: {
      color: darkMode ? 'bg-purple-600' : 'bg-purple-500',
      label: 'Subtask'
    }
  };

  const timelineRef = React.useRef(null);

  return React.createElement('div', { className: 'space-y-4' },
    // Filter Toggles and Autopilot
    React.createElement('div', {
      className: `flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'}`
    },
      React.createElement('div', { className: 'flex items-center gap-3' },
        React.createElement('span', {
          className: `text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
        }, 'Show:'),

        // Actions Toggle
        React.createElement('button', {
          onClick: () => toggleFilter('showActions'),
          className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewFilters.showActions
              ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              : darkMode ? 'bg-slate-700 text-gray-400 hover:bg-slate-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
          } cursor-pointer`
        }, 'Actions'),

        // Tasks Toggle
        React.createElement('button', {
          onClick: () => toggleFilter('showTasks'),
          className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewFilters.showTasks
              ? darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
              : darkMode ? 'bg-slate-700 text-gray-400 hover:bg-slate-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
          } cursor-pointer`
        }, 'Tasks'),

        // Subtasks Toggle
        React.createElement('button', {
          onClick: () => toggleFilter('showSubtasks'),
          className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewFilters.showSubtasks
              ? darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
              : darkMode ? 'bg-slate-700 text-gray-400 hover:bg-slate-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
          } cursor-pointer`
        }, 'Subtasks')
      ),

      // Right side buttons
      React.createElement('div', { className: 'flex items-center gap-3' },
        // Undo Button
        !isEditLocked && React.createElement('button', {
          onClick: undo,
          disabled: undoHistory.length === 0,
          className: `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            undoHistory.length === 0
              ? darkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : darkMode
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md transform hover:scale-105'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md transform hover:scale-105'
          }`
        },
          React.createElement('svg', {
            className: 'w-4 h-4',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            viewBox: '0 0 24 24'
          },
            React.createElement('path', { d: 'M3 7v6h6' }),
            React.createElement('path', { d: 'M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13' })
          ),
          `Undo (${undoHistory.length})`
        ),

        // Autopilot Button
        !isEditLocked && React.createElement('button', {
          onClick: runAutopilot,
          className: `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
            darkMode
              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-md'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md'
          }`
        },
          React.createElement('svg', {
            className: 'w-4 h-4',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            viewBox: '0 0 24 24'
          },
            React.createElement('path', { d: 'M13 10V3L4 14h7v7l9-11h-7z' })
          ),
          'Autopilot'
        )
      )
    ),

    // Autopilot Result Message
    autopilotResult && React.createElement('div', {
      className: `p-4 rounded-lg border-2 ${
        autopilotResult.success
          ? darkMode ? 'bg-green-900/30 border-green-500 text-green-300' : 'bg-green-50 border-green-500 text-green-800'
          : darkMode ? 'bg-red-900/30 border-red-500 text-red-300' : 'bg-red-50 border-red-500 text-red-800'
      }`
    },
      React.createElement('div', { className: 'flex items-start justify-between' },
        React.createElement('div', null,
          React.createElement('div', { className: 'font-bold mb-1' },
            autopilotResult.success ? '✓ Success' : '✗ Cannot Proceed'
          ),
          React.createElement('div', { className: 'text-sm whitespace-pre-line' }, autopilotResult.message)
        ),
        React.createElement('button', {
          onClick: () => setAutopilotResult(null),
          className: `text-2xl leading-none ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
        }, '×')
      )
    ),

    // Gantt Chart
    React.createElement('div', {
      className: `overflow-x-auto ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-4 border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
    },
      React.createElement('div', {
        ref: timelineRef,
        className: 'min-w-[1200px]'
      },
        // Month header
        React.createElement('div', { className: 'flex mb-2' },
          React.createElement('div', { className: 'w-64 flex-shrink-0' }),
          React.createElement('div', {
            className: `flex-1 flex border-b ${darkMode ? 'border-slate-600' : 'border-gray-300'} pb-1`
          },
            monthLabels.map((month, i) =>
              React.createElement('div', {
                key: i,
                className: `flex-1 text-xs ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-center font-semibold`
              }, month.label)
            )
          )
        ),

        // Items
        React.createElement('div', { className: 'relative' },
          // Dependency lines (SVG overlay)
          React.createElement('svg', {
            className: 'absolute top-0 left-64 pointer-events-none',
            style: {
              width: 'calc(100% - 16rem)',
              height: items.length * 40,
              overflow: 'visible',
              zIndex: 10
            },
            preserveAspectRatio: 'none'
          },
            // Define filters and markers
            React.createElement('defs', null,
              // Drop shadow for depth
              React.createElement('filter', {
                id: 'dependency-shadow',
                x: '-50%',
                y: '-50%',
                width: '200%',
                height: '200%'
              },
                React.createElement('feGaussianBlur', {
                  in: 'SourceAlpha',
                  stdDeviation: 2
                }),
                React.createElement('feOffset', {
                  dx: 0,
                  dy: 1,
                  result: 'offsetblur'
                }),
                React.createElement('feComponentTransfer', null,
                  React.createElement('feFuncA', {
                    type: 'linear',
                    slope: 0.3
                  })
                ),
                React.createElement('feMerge', null,
                  React.createElement('feMergeNode'),
                  React.createElement('feMergeNode', {
                    in: 'SourceGraphic'
                  })
                )
              ),
              // Valid dependency arrow (green)
              React.createElement('marker', {
                id: 'arrowhead-valid',
                markerWidth: 12,
                markerHeight: 12,
                refX: 11,
                refY: 6,
                orient: 'auto',
                markerUnits: 'userSpaceOnUse'
              },
                React.createElement('path', {
                  d: 'M 0 0 L 12 6 L 0 12 L 3 6 Z',
                  fill: darkMode ? '#10b981' : '#059669',
                  stroke: darkMode ? '#10b981' : '#059669',
                  strokeWidth: 0.5,
                  strokeLinejoin: 'round'
                })
              ),
              // Violated dependency arrow (red)
              React.createElement('marker', {
                id: 'arrowhead-violated',
                markerWidth: 12,
                markerHeight: 12,
                refX: 11,
                refY: 6,
                orient: 'auto',
                markerUnits: 'userSpaceOnUse'
              },
                React.createElement('path', {
                  d: 'M 0 0 L 12 6 L 0 12 L 3 6 Z',
                  fill: darkMode ? '#ef4444' : '#dc2626',
                  stroke: darkMode ? '#ef4444' : '#dc2626',
                  strokeWidth: 0.5,
                  strokeLinejoin: 'round'
                })
              )
            ),
            // Render BPMN-style orthogonal paths
            (renderDependencyLines(items, earliest, totalDays, timelineRef) || []).map(path => {
              const strokeColor = path.isViolated
                ? (darkMode ? '#ef4444' : '#dc2626')
                : (darkMode ? '#10b981' : '#059669');
              const markerEnd = path.isViolated ? 'url(#arrowhead-violated)' : 'url(#arrowhead-valid)';

              return React.createElement('path', {
                key: path.key,
                d: path.pathData,
                fill: 'none',
                stroke: strokeColor,
                strokeWidth: 2.5,
                opacity: 1,
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                markerEnd: markerEnd,
                filter: 'url(#dependency-shadow)',
                style: {
                  transition: 'all 0.3s ease'
                }
              });
            })
          ),

          // Item rows
          items.map((item, index) => {
            const position = getBarPosition(
              item.startDate,
              item.finishDate || item.dueDate,
              earliest,
              totalDays
            );

            const isViolated = isDependencyViolated(item, items);
            const typeStyle = typeStyles[item.type];
            const statusInfo = statuses[item.status || 'not-started'];
            const priorityInfo = priorities[item.priority || 'medium'];

            return React.createElement('div', {
              key: `${item.type}-${item.itemId}`,
              className: 'flex items-center mb-1 h-10'
            },
              // Item info column
              React.createElement('div', {
                className: 'w-64 flex-shrink-0 pr-2 flex items-center gap-2'
              },
                React.createElement('span', {
                  className: `px-2 py-0.5 rounded text-[9px] font-bold text-white ${typeStyle.color}`
                }, typeStyle.label),
                React.createElement('div', { className: 'flex-1 min-w-0' },
                  React.createElement('div', {
                    className: `text-[11px] font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} truncate`,
                    title: item.itemName
                  }, item.itemName),
                  item.type === 'task' && React.createElement('div', {
                    className: `text-[9px] ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`
                  }, item.actionName),
                  item.type === 'subtask' && React.createElement('div', {
                    className: `text-[9px] ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`
                  }, `${item.taskName}`)
                ),
                item.priority && React.createElement('span', {
                  className: `${priorityInfo.text} text-xs`
                }, priorityInfo.icon)
              ),

              // Timeline area
              React.createElement('div', {
                className: `gantt-timeline-area flex-1 relative h-8 ${darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'} rounded border`
              },
                // Month grid lines
                monthLabels.map((month, i) => {
                  const offset = getDaysDiff(earliest, month.date) - 1;
                  const leftPosition = (offset / totalDays) * 100;
                  return React.createElement('div', {
                    key: i,
                    className: `absolute top-0 bottom-0 w-px ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`,
                    style: { left: `${leftPosition}%` }
                  });
                }),

                // Bar
                position.visible && React.createElement('div', {
                  draggable: !isEditLocked,
                  onDragStart: (e) => handleBarDragStart(e, item),
                  onDrag: handleBarDrag,
                  onDragEnd: (e) => {
                    const rect = e.currentTarget.parentElement.getBoundingClientRect();
                    handleBarDragEnd(e, rect.width, earliest, totalDays);
                  },
                  className: `group absolute h-6 top-1 ${typeStyle.color} rounded-lg flex items-center justify-center text-white text-[10px] font-semibold transition shadow-sm ${
                    isViolated ? 'ring-2 ring-red-500' : ''
                  } ${!isEditLocked ? 'cursor-move hover:opacity-90 hover:shadow-md' : 'cursor-default'}`,
                  style: {
                    left: position.left,
                    width: position.width
                  },
                  title: `${item.itemName}\n${item.startDate} to ${item.finishDate || item.dueDate}\nDuration: ${position.duration} days${isViolated ? '\n⚠️ Dependency violation!' : ''}`
                },
                  // Left resize handle
                  !isEditLocked && React.createElement('div', {
                    onMouseDown: (e) => handleResizeStart(e, item, 'resize-start'),
                    className: `absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'bg-white/30 hover:bg-white/50' : 'bg-black/20 hover:bg-black/40'}`,
                    title: 'Drag to resize start date'
                  }),

                  // Bar content
                  React.createElement('span', null, `${position.duration}d`),
                  isViolated && React.createElement('span', {
                    className: 'ml-1 text-red-300'
                  }, '⚠️'),

                  // Right resize handle
                  !isEditLocked && React.createElement('div', {
                    onMouseDown: (e) => handleResizeStart(e, item, 'resize-end'),
                    className: `absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'bg-white/30 hover:bg-white/50' : 'bg-black/20 hover:bg-black/40'}`,
                    title: 'Drag to resize end date'
                  })
                )
              )
            );
          })
        )
      )
    ),

    // Legend
    React.createElement('div', {
      className: `flex gap-4 items-center p-3 rounded-lg ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'}`
    },
      React.createElement('span', {
        className: `text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
      }, 'Legend:'),
      React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('div', {
          className: 'w-12 h-3 bg-green-500 rounded'
        }),
        React.createElement('span', {
          className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
        }, 'Valid dependency')
      ),
      React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('div', {
          className: 'w-12 h-3 bg-red-500 rounded'
        }),
        React.createElement('span', {
          className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
        }, 'Violated dependency')
      ),
      React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('div', {
          className: 'w-12 h-3 bg-blue-500 rounded ring-2 ring-red-500'
        }),
        React.createElement('span', {
          className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
        }, 'Item with violation')
      ),
      !isEditLocked && React.createElement('span', {
        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-auto`
      }, '💡 Drag bars to change dates')
    )
  );
}