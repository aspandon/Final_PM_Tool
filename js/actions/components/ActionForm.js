// js/actions/components/ActionForm.js

/**
 * ActionForm Component
 * Form for individual action items with all required fields
 */

export function ActionForm({
  action,
  aIndex,
  updateAction,
  deleteAction,
  addActivity,
  updateActivity,
  deleteActivity,
  darkMode
}) {
  const { useRef } = React;

  const Trash2 = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M3 6h18' }),
    React.createElement('path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }),
    React.createElement('path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }),
    React.createElement('line', { x1: '10', x2: '10', y1: '11', y2: '17' }),
    React.createElement('line', { x1: '14', x2: '14', y1: '11', y2: '17' })
  );

  // Icon components for formatting toolbar
  const Bold = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z' }),
    React.createElement('path', { d: 'M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z' })
  );

  const List = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('line', { x1: '8', x2: '21', y1: '6', y2: '6' }),
    React.createElement('line', { x1: '8', x2: '21', y1: '12', y2: '12' }),
    React.createElement('line', { x1: '8', x2: '21', y1: '18', y2: '18' }),
    React.createElement('line', { x1: '3', x2: '3.01', y1: '6', y2: '6' }),
    React.createElement('line', { x1: '3', x2: '3.01', y1: '12', y2: '12' }),
    React.createElement('line', { x1: '3', x2: '3.01', y1: '18', y2: '18' })
  );

  const ListOrdered = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('line', { x1: '10', x2: '21', y1: '6', y2: '6' }),
    React.createElement('line', { x1: '10', x2: '21', y1: '12', y2: '12' }),
    React.createElement('line', { x1: '10', x2: '21', y1: '18', y2: '18' }),
    React.createElement('path', { d: 'M4 6h1v4' }),
    React.createElement('path', { d: 'M4 10h2' }),
    React.createElement('path', { d: 'M6 18H4c0-1 2-2 2-3s-1-1.5-2-1' })
  );

  const Italic = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('line', { x1: '19', x2: '10', y1: '4', y2: '4' }),
    React.createElement('line', { x1: '14', x2: '5', y1: '20', y2: '20' }),
    React.createElement('line', { x1: '15', x2: '9', y1: '4', y2: '20' })
  );

  const Underline = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M6 4v7a6 6 0 0 0 12 0V4' }),
    React.createElement('line', { x1: '4', x2: '20', y1: '21', y2: '21' })
  );

  const Type = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('polyline', { points: '4 7 4 4 20 4 20 7' }),
    React.createElement('line', { x1: '9', x2: '15', y1: '20', y2: '20' }),
    React.createElement('line', { x1: '12', x2: '12', y1: '4', y2: '20' })
  );

  const RemoveFormatting = ({ className }) => React.createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M4 7V4h16v3' }),
    React.createElement('path', { d: 'M5 20h6' }),
    React.createElement('path', { d: 'M13 4L8 20' }),
    React.createElement('line', { x1: '22', x2: '2', y1: '2', y2: '22' })
  );

  // Rich text editor component
  const RichTextEditor = ({ field, label, value, colSpan = 'col-span-12' }) => {
    const editorRef = useRef(null);
    const [showColorPicker, setShowColorPicker] = React.useState(false);

    const handleFormat = (command, value = null) => {
      document.execCommand(command, false, value);
      if (editorRef.current) {
        updateAction(aIndex, field, editorRef.current.innerHTML);
      }
    };

    const handleInput = (e) => {
      updateAction(aIndex, field, e.target.innerHTML);
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    };

    const handleColorChange = (color) => {
      handleFormat('foreColor', color);
      setShowColorPicker(false);
    };

    const colors = [
      { name: 'Black', value: '#000000' },
      { name: 'Red', value: '#EF4444' },
      { name: 'Blue', value: '#3B82F6' },
      { name: 'Green', value: '#10B981' },
      { name: 'Orange', value: '#F97316' },
      { name: 'Purple', value: '#A855F7' },
      { name: 'Pink', value: '#EC4899' },
      { name: 'Gray', value: '#6B7280' }
    ];

    const toolbarButtonClass = `p-1.5 rounded transition-colors ${
      darkMode
        ? 'hover:bg-slate-600 text-gray-300'
        : 'hover:bg-gray-200 text-gray-700'
    }`;

    return React.createElement('div', { className: colSpan },
      React.createElement('label', { className: labelClass }, label),
      // Formatting toolbar
      React.createElement('div', {
        className: `flex gap-1 mb-1 p-1 rounded-t-lg border ${
          darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-300'
        }`
      },
        React.createElement('button', {
          type: 'button',
          onClick: () => handleFormat('bold'),
          className: toolbarButtonClass,
          title: 'Bold'
        },
          React.createElement(Bold, { className: 'w-4 h-4' })
        ),
        React.createElement('button', {
          type: 'button',
          onClick: () => handleFormat('italic'),
          className: toolbarButtonClass,
          title: 'Italic'
        },
          React.createElement(Italic, { className: 'w-4 h-4' })
        ),
        React.createElement('button', {
          type: 'button',
          onClick: () => handleFormat('underline'),
          className: toolbarButtonClass,
          title: 'Underline'
        },
          React.createElement(Underline, { className: 'w-4 h-4' })
        ),
        // Divider
        React.createElement('div', {
          className: `w-px h-6 ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`
        }),
        React.createElement('button', {
          type: 'button',
          onClick: () => handleFormat('insertUnorderedList'),
          className: toolbarButtonClass,
          title: 'Bullet List'
        },
          React.createElement(List, { className: 'w-4 h-4' })
        ),
        React.createElement('button', {
          type: 'button',
          onClick: () => handleFormat('insertOrderedList'),
          className: toolbarButtonClass,
          title: 'Numbered List'
        },
          React.createElement(ListOrdered, { className: 'w-4 h-4' })
        ),
        // Divider
        React.createElement('div', {
          className: `w-px h-6 ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`
        }),
        // Color picker
        React.createElement('div', { className: 'relative' },
          React.createElement('button', {
            type: 'button',
            onClick: (e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            },
            className: toolbarButtonClass,
            title: 'Text Color'
          },
            React.createElement(Type, { className: 'w-4 h-4' })
          ),
          // Color picker dropdown
          showColorPicker && React.createElement('div', {
            className: `absolute top-full left-0 mt-1 p-2 rounded-lg shadow-lg border z-50 ${
              darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'
            }`,
            onClick: (e) => e.stopPropagation()
          },
            React.createElement('div', { className: 'grid grid-cols-4 gap-1.5' },
              colors.map(color =>
                React.createElement('button', {
                  key: color.value,
                  type: 'button',
                  onClick: () => handleColorChange(color.value),
                  className: 'w-6 h-6 rounded border-2 border-white hover:scale-110 transition-transform shadow-sm',
                  style: { backgroundColor: color.value },
                  title: color.name
                })
              )
            )
          )
        ),
        // Divider
        React.createElement('div', {
          className: `w-px h-6 ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`
        }),
        // Remove Formatting button
        React.createElement('button', {
          type: 'button',
          onClick: () => handleFormat('removeFormat'),
          className: toolbarButtonClass,
          title: 'Remove Formatting'
        },
          React.createElement(RemoveFormatting, { className: 'w-4 h-4' })
        )
      ),
      // Content editable area
      React.createElement('div', {
        ref: editorRef,
        contentEditable: true,
        dangerouslySetInnerHTML: { __html: value || '' },
        onInput: handleInput,
        onPaste: handlePaste,
        className: `${inputClass} min-h-[80px] max-h-[200px] overflow-y-auto rich-text-content`,
        style: { whiteSpace: 'normal' }
      })
    );
  };

  const inputClass = `w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
    darkMode
      ? 'bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  }`;

  const labelClass = `block text-xs font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return React.createElement('div', {
    className: `${darkMode ? 'bg-slate-800' : 'bg-white'} p-5 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-gray-200'} shadow-md hover:shadow-lg transition-shadow`
  },
    // Header with Action, Department, Progress, and Delete button (separated with prominent background)
    React.createElement('div', {
      className: `grid grid-cols-12 gap-4 mb-4 pb-4 border-b rounded-lg p-4 ${
        darkMode
          ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-700'
          : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-200'
      }`
    },
      // Action field (formerly Title) - Bold and larger font
      React.createElement('div', { className: 'col-span-7' },
        React.createElement('label', { className: labelClass }, 'Action'),
        React.createElement('input', {
          type: 'text',
          value: action.title || '',
          onChange: (e) => updateAction(aIndex, 'title', e.target.value),
          placeholder: 'Enter action',
          className: inputClass + ' font-bold text-lg'
        })
      ),

      // Department field (75% smaller) - Bold and larger font
      React.createElement('div', { className: 'col-span-2' },
        React.createElement('label', { className: labelClass }, 'Department'),
        React.createElement('input', {
          type: 'text',
          value: action.department || '',
          onChange: (e) => updateAction(aIndex, 'department', e.target.value),
          placeholder: 'Enter dept',
          className: inputClass + ' font-bold text-lg'
        })
      ),

      // Progress dropdown - same size as Department
      React.createElement('div', { className: 'col-span-2' },
        React.createElement('label', { className: labelClass }, 'Progress'),
        React.createElement('select', {
          value: action.progress || '0%',
          onChange: (e) => updateAction(aIndex, 'progress', e.target.value),
          className: inputClass
        },
          React.createElement('option', { value: '0%' }, '0%'),
          React.createElement('option', { value: '5%' }, '5%'),
          React.createElement('option', { value: '10%' }, '10%'),
          React.createElement('option', { value: '15%' }, '15%'),
          React.createElement('option', { value: '20%' }, '20%'),
          React.createElement('option', { value: '25%' }, '25%'),
          React.createElement('option', { value: '30%' }, '30%'),
          React.createElement('option', { value: '35%' }, '35%'),
          React.createElement('option', { value: '40%' }, '40%'),
          React.createElement('option', { value: '45%' }, '45%'),
          React.createElement('option', { value: '50%' }, '50%'),
          React.createElement('option', { value: '55%' }, '55%'),
          React.createElement('option', { value: '60%' }, '60%'),
          React.createElement('option', { value: '65%' }, '65%'),
          React.createElement('option', { value: '70%' }, '70%'),
          React.createElement('option', { value: '75%' }, '75%'),
          React.createElement('option', { value: '80%' }, '80%'),
          React.createElement('option', { value: '85%' }, '85%'),
          React.createElement('option', { value: '90%' }, '90%'),
          React.createElement('option', { value: '95%' }, '95%'),
          React.createElement('option', { value: '100%' }, '100%')
        )
      ),

      // Delete button - centered with progress dropdown
      React.createElement('div', { className: 'col-span-1 flex items-center justify-center pt-6' },
        React.createElement('button', {
          onClick: () => deleteAction(aIndex),
          className: `p-2 rounded-lg transition-all ${
            darkMode
              ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`,
          title: 'Delete action'
        },
          React.createElement(Trash2, { className: 'w-4 h-4' })
        )
      ),

      // Second row in header: Initiative Owner, Classification, Investment Need
      // Initiative Owner field
      React.createElement('div', { className: 'col-span-5' },
        React.createElement('label', { className: labelClass }, 'Initiative Owner'),
        React.createElement('input', {
          type: 'text',
          value: action.initiativeOwner || '',
          onChange: (e) => updateAction(aIndex, 'initiativeOwner', e.target.value),
          placeholder: 'Enter initiative owner name',
          className: inputClass
        })
      ),

      // Classification selector (Action/Study/Decision)
      React.createElement('div', { className: 'col-span-3' },
        React.createElement('label', { className: labelClass }, 'Classification'),
        React.createElement('select', {
          value: action.classification || 'Action',
          onChange: (e) => updateAction(aIndex, 'classification', e.target.value),
          className: inputClass
        },
          React.createElement('option', { value: 'Action' }, 'Action'),
          React.createElement('option', { value: 'Decision' }, 'Decision'),
          React.createElement('option', { value: 'Study' }, 'Study')
        )
      ),

      // Investment Need field (moved to header, now plain text input instead of rich text)
      React.createElement('div', { className: 'col-span-4' },
        React.createElement('label', { className: labelClass }, 'Investment Need'),
        React.createElement('input', {
          type: 'text',
          value: action.investmentNeed || '',
          onChange: (e) => updateAction(aIndex, 'investmentNeed', e.target.value),
          placeholder: 'Enter investment need',
          className: inputClass
        })
      )
    ),

    // Additional fields
    React.createElement('div', {
      className: 'grid grid-cols-12 gap-4 mb-6'
    },
      // Scope field (rich text editor) - side by side with Team Members
      React.createElement(RichTextEditor, {
        field: 'scope',
        label: 'Scope',
        value: action.scope || '',
        colSpan: 'col-span-6'
      }),

      // Team Members field (rich text editor) - next to Scope
      React.createElement(RichTextEditor, {
        field: 'teamMembers',
        label: 'Team Members',
        value: action.teamMembers || '',
        colSpan: 'col-span-6'
      }),

      // Key Achievements field (rich text editor) - left side
      React.createElement(RichTextEditor, {
        field: 'keyAchievements',
        label: 'Key Achievements',
        value: action.keyAchievements || '',
        colSpan: 'col-span-6'
      }),

      // Value Capture field (rich text editor) - right side
      React.createElement(RichTextEditor, {
        field: 'valueCapture',
        label: 'Value Capture',
        value: action.valueCapture || '',
        colSpan: 'col-span-6'
      })
    ),

    // Activities Section
    React.createElement('div', {
      className: `mt-6 pt-6 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
    },
      // Section header with Add Activity button
      React.createElement('div', {
        className: 'flex items-center justify-between mb-4'
      },
        React.createElement('h3', {
          className: `text-lg font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
        }, '📋 Activities'),
        React.createElement('button', {
          type: 'button',
          onClick: () => addActivity(aIndex),
          className: `px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md text-sm font-semibold flex items-center gap-2`
        },
          '+', ' Add Activity'
        )
      ),

      // Activities list
      action.activities && action.activities.length > 0
        ? React.createElement('div', { className: 'space-y-4' },
            action.activities.map((activity, activityIndex) =>
              React.createElement('div', {
                key: activityIndex,
                className: `p-4 rounded-lg border ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-300'}`
              },
                // Activity header
                React.createElement('div', {
                  className: 'flex items-center justify-between mb-3'
                },
                  React.createElement('h4', {
                    className: `font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
                  }, `Activity ${activityIndex + 1}`),
                  React.createElement('button', {
                    type: 'button',
                    onClick: () => deleteActivity(aIndex, activityIndex),
                    className: `p-1.5 rounded transition-colors ${
                      darkMode
                        ? 'text-red-400 hover:bg-red-900/20'
                        : 'text-red-600 hover:bg-red-50'
                    }`,
                    title: 'Delete Activity'
                  },
                    React.createElement(Trash2, { className: 'w-4 h-4' })
                  )
                ),

                // Activity fields grid
                React.createElement('div', {
                  className: 'grid grid-cols-12 gap-4'
                },
                  // Activity Title
                  React.createElement('div', { className: 'col-span-12' },
                    React.createElement('label', { className: labelClass }, 'Activity Title'),
                    React.createElement('input', {
                      type: 'text',
                      value: activity.title || '',
                      onChange: (e) => updateActivity(aIndex, activityIndex, 'title', e.target.value),
                      placeholder: 'Enter activity title',
                      className: inputClass
                    })
                  ),

                  // Activity Start Date
                  React.createElement('div', { className: 'col-span-4' },
                    React.createElement('label', { className: labelClass }, 'Activity Start'),
                    React.createElement('input', {
                      type: 'date',
                      value: activity.startDate || '',
                      onChange: (e) => updateActivity(aIndex, activityIndex, 'startDate', e.target.value),
                      className: inputClass
                    })
                  ),

                  // Activity Finish Date
                  React.createElement('div', { className: 'col-span-4' },
                    React.createElement('label', { className: labelClass }, 'Activity Finish'),
                    React.createElement('input', {
                      type: 'date',
                      value: activity.finishDate || '',
                      onChange: (e) => updateActivity(aIndex, activityIndex, 'finishDate', e.target.value),
                      className: inputClass
                    })
                  ),

                  // Activity Progress with bar visualization
                  React.createElement('div', { className: 'col-span-4' },
                    React.createElement('label', { className: labelClass }, 'Activity Progress'),
                    React.createElement('select', {
                      value: activity.progress || '0%',
                      onChange: (e) => updateActivity(aIndex, activityIndex, 'progress', e.target.value),
                      className: inputClass + ' mb-2'
                    },
                      React.createElement('option', { value: '0%' }, '0%'),
                      React.createElement('option', { value: '5%' }, '5%'),
                      React.createElement('option', { value: '10%' }, '10%'),
                      React.createElement('option', { value: '15%' }, '15%'),
                      React.createElement('option', { value: '20%' }, '20%'),
                      React.createElement('option', { value: '25%' }, '25%'),
                      React.createElement('option', { value: '30%' }, '30%'),
                      React.createElement('option', { value: '35%' }, '35%'),
                      React.createElement('option', { value: '40%' }, '40%'),
                      React.createElement('option', { value: '45%' }, '45%'),
                      React.createElement('option', { value: '50%' }, '50%'),
                      React.createElement('option', { value: '55%' }, '55%'),
                      React.createElement('option', { value: '60%' }, '60%'),
                      React.createElement('option', { value: '65%' }, '65%'),
                      React.createElement('option', { value: '70%' }, '70%'),
                      React.createElement('option', { value: '75%' }, '75%'),
                      React.createElement('option', { value: '80%' }, '80%'),
                      React.createElement('option', { value: '85%' }, '85%'),
                      React.createElement('option', { value: '90%' }, '90%'),
                      React.createElement('option', { value: '95%' }, '95%'),
                      React.createElement('option', { value: '100%' }, '100%')
                    ),
                    // Progress bar visualization
                    React.createElement('div', {
                      className: `w-full h-2 rounded-full overflow-hidden ${
                        darkMode ? 'bg-slate-700' : 'bg-gray-200'
                      }`
                    },
                      React.createElement('div', {
                        className: 'h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300',
                        style: { width: activity.progress || '0%' }
                      })
                    )
                  ),

                  // Activity Key Achievements (rich text)
                  React.createElement(ActivityRichTextEditor, {
                    aIndex,
                    activityIndex,
                    field: 'keyAchievements',
                    label: 'Activity Key Achievements',
                    value: activity.keyAchievements || '',
                    updateActivity,
                    darkMode
                  })
                )
              )
            )
          )
        : React.createElement('p', {
            className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} italic text-center py-4`
          }, 'No activities yet. Click "Add Activity" to create one.')
    )
  );
}

// Activity Rich Text Editor Component
function ActivityRichTextEditor({ aIndex, activityIndex, field, label, value, updateActivity, darkMode }) {
  const { useRef, useState } = React;
  const editorRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleFormat = (command, commandValue = null) => {
    document.execCommand(command, false, commandValue);
    if (editorRef.current) {
      updateActivity(aIndex, activityIndex, field, editorRef.current.innerHTML);
    }
  };

  const handleInput = (e) => {
    updateActivity(aIndex, activityIndex, field, e.target.innerHTML);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleColorChange = (color) => {
    handleFormat('foreColor', color);
    setShowColorPicker(false);
  };

  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Purple', value: '#A855F7' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Gray', value: '#6B7280' }
  ];

  const toolbarButtonClass = `p-1.5 rounded transition-colors ${
    darkMode
      ? 'hover:bg-slate-600 text-gray-300'
      : 'hover:bg-gray-200 text-gray-700'
  }`;

  const labelClass = `block text-xs font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;
  const inputClass = `w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
    darkMode
      ? 'bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  }`;

  // Icon components
  const Bold = ({ className }) => React.createElement('svg', {
    className, fill: 'none', stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z' }),
    React.createElement('path', { d: 'M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z' })
  );

  const Italic = ({ className }) => React.createElement('svg', {
    className, fill: 'none', stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24'
  },
    React.createElement('line', { x1: '19', x2: '10', y1: '4', y2: '4' }),
    React.createElement('line', { x1: '14', x2: '5', y1: '20', y2: '20' }),
    React.createElement('line', { x1: '15', x2: '9', y1: '4', y2: '20' })
  );

  const Underline = ({ className }) => React.createElement('svg', {
    className, fill: 'none', stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M6 4v7a6 6 0 0 0 12 0V4' }),
    React.createElement('line', { x1: '4', x2: '20', y1: '21', y2: '21' })
  );

  const List = ({ className }) => React.createElement('svg', {
    className, fill: 'none', stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24'
  },
    React.createElement('line', { x1: '8', x2: '21', y1: '6', y2: '6' }),
    React.createElement('line', { x1: '8', x2: '21', y1: '12', y2: '12' }),
    React.createElement('line', { x1: '8', x2: '21', y1: '18', y2: '18' }),
    React.createElement('line', { x1: '3', x2: '3.01', y1: '6', y2: '6' }),
    React.createElement('line', { x1: '3', x2: '3.01', y1: '12', y2: '12' }),
    React.createElement('line', { x1: '3', x2: '3.01', y1: '18', y2: '18' })
  );

  const ListOrdered = ({ className }) => React.createElement('svg', {
    className, fill: 'none', stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24'
  },
    React.createElement('line', { x1: '10', x2: '21', y1: '6', y2: '6' }),
    React.createElement('line', { x1: '10', x2: '21', y1: '12', y2: '12' }),
    React.createElement('line', { x1: '10', x2: '21', y1: '18', y2: '18' }),
    React.createElement('path', { d: 'M4 6h1v4' }),
    React.createElement('path', { d: 'M4 10h2' }),
    React.createElement('path', { d: 'M6 18H4c0-1 2-2 2-3s-1-1.5-2-1' })
  );

  const Type = ({ className }) => React.createElement('svg', {
    className, fill: 'none', stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24'
  },
    React.createElement('polyline', { points: '4 7 4 4 20 4 20 7' }),
    React.createElement('line', { x1: '9', x2: '15', y1: '20', y2: '20' }),
    React.createElement('line', { x1: '12', x2: '12', y1: '4', y2: '20' })
  );

  const RemoveFormatting = ({ className }) => React.createElement('svg', {
    className, fill: 'none', stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24'
  },
    React.createElement('path', { d: 'M4 7V4h16v3' }),
    React.createElement('path', { d: 'M5 20h6' }),
    React.createElement('path', { d: 'M13 4L8 20' }),
    React.createElement('line', { x1: '22', x2: '2', y1: '2', y2: '22' })
  );

  return React.createElement('div', { className: 'col-span-12' },
    React.createElement('label', { className: labelClass }, label),
    // Formatting toolbar
    React.createElement('div', {
      className: `flex gap-1 mb-1 p-1 rounded-t-lg border ${
        darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-300'
      }`
    },
      React.createElement('button', {
        type: 'button',
        onClick: () => handleFormat('bold'),
        className: toolbarButtonClass,
        title: 'Bold'
      }, React.createElement(Bold, { className: 'w-4 h-4' })),
      React.createElement('button', {
        type: 'button',
        onClick: () => handleFormat('italic'),
        className: toolbarButtonClass,
        title: 'Italic'
      }, React.createElement(Italic, { className: 'w-4 h-4' })),
      React.createElement('button', {
        type: 'button',
        onClick: () => handleFormat('underline'),
        className: toolbarButtonClass,
        title: 'Underline'
      }, React.createElement(Underline, { className: 'w-4 h-4' })),
      // Divider
      React.createElement('div', {
        className: `w-px h-6 ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`
      }),
      React.createElement('button', {
        type: 'button',
        onClick: () => handleFormat('insertUnorderedList'),
        className: toolbarButtonClass,
        title: 'Bullet List'
      }, React.createElement(List, { className: 'w-4 h-4' })),
      React.createElement('button', {
        type: 'button',
        onClick: () => handleFormat('insertOrderedList'),
        className: toolbarButtonClass,
        title: 'Numbered List'
      }, React.createElement(ListOrdered, { className: 'w-4 h-4' })),
      // Divider
      React.createElement('div', {
        className: `w-px h-6 ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`
      }),
      // Color picker
      React.createElement('div', { className: 'relative' },
        React.createElement('button', {
          type: 'button',
          onClick: (e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
          },
          className: toolbarButtonClass,
          title: 'Text Color'
        }, React.createElement(Type, { className: 'w-4 h-4' })),
        // Color picker dropdown
        showColorPicker && React.createElement('div', {
          className: `absolute top-full left-0 mt-1 p-2 rounded-lg shadow-lg border z-50 ${
            darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'
          }`,
          onClick: (e) => e.stopPropagation()
        },
          React.createElement('div', { className: 'grid grid-cols-4 gap-1.5' },
            colors.map(color =>
              React.createElement('button', {
                key: color.value,
                type: 'button',
                onClick: () => handleColorChange(color.value),
                className: 'w-6 h-6 rounded border-2 border-white hover:scale-110 transition-transform shadow-sm',
                style: { backgroundColor: color.value },
                title: color.name
              })
            )
          )
        )
      ),
      // Divider
      React.createElement('div', {
        className: `w-px h-6 ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`
      }),
      // Remove Formatting button
      React.createElement('button', {
        type: 'button',
        onClick: () => handleFormat('removeFormat'),
        className: toolbarButtonClass,
        title: 'Remove Formatting'
      }, React.createElement(RemoveFormatting, { className: 'w-4 h-4' }))
    ),
    // Content editable area
    React.createElement('div', {
      ref: editorRef,
      contentEditable: true,
      dangerouslySetInnerHTML: { __html: value || '' },
      onInput: handleInput,
      onPaste: handlePaste,
      className: `${inputClass} min-h-[80px] max-h-[200px] overflow-y-auto rich-text-content`,
      style: { whiteSpace: 'normal' }
    })
  );
}