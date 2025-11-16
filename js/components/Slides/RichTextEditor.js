// js/components/Slides/RichTextEditor.js

const { useState, useRef, useEffect } = React;

/**
 * Rich Text Editor Component
 * Provides formatting toolbar with: Bold, Italic, Underline, Bullets, Numbering, Font Color, Font Size
 */
export function RichTextEditor({ value, onChange, darkMode, placeholder = 'Enter text...' }) {
  const editorRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);

  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    // Ensure editor has focus before executing command
    if (!editorRef.current) return;

    editorRef.current.focus();

    // For list commands, use a more reliable approach
    if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
      // Execute the command
      const success = document.execCommand(command, false, value);

      // Force update after a short delay to ensure the DOM is updated
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
          // Trigger input event to save changes
          const event = new Event('input', { bubbles: true });
          editorRef.current.dispatchEvent(event);
          handleInput();
        }
      }, 10);
    } else {
      // Execute the command
      document.execCommand(command, false, value);
      handleInput();
    }
  };

  const toolbarButtonClass = `p-2 rounded transition-colors ${
    darkMode
      ? 'hover:bg-slate-600 text-gray-200'
      : 'hover:bg-gray-200 text-gray-700'
  }`;

  const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'];

  return React.createElement('div', {
    className: `border rounded-lg ${darkMode ? 'border-slate-600' : 'border-gray-300'}`
  },
    // Toolbar
    React.createElement('div', {
      className: `flex flex-wrap gap-1 p-2 border-b ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-gray-50'}`
    },
      // Bold
      React.createElement('button', {
        type: 'button',
        onClick: () => execCommand('bold'),
        className: toolbarButtonClass,
        title: 'Bold'
      },
        React.createElement('svg', {
          className: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z'
          }),
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z'
          })
        )
      ),

      // Italic
      React.createElement('button', {
        type: 'button',
        onClick: () => execCommand('italic'),
        className: toolbarButtonClass,
        title: 'Italic'
      },
        React.createElement('svg', {
          className: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
          React.createElement('line', { x1: '19', y1: '4', x2: '10', y2: '4', strokeWidth: 2, strokeLinecap: 'round' }),
          React.createElement('line', { x1: '14', y1: '20', x2: '5', y2: '20', strokeWidth: 2, strokeLinecap: 'round' }),
          React.createElement('line', { x1: '15', y1: '4', x2: '9', y2: '20', strokeWidth: 2, strokeLinecap: 'round' })
        )
      ),

      // Underline
      React.createElement('button', {
        type: 'button',
        onClick: () => execCommand('underline'),
        className: toolbarButtonClass,
        title: 'Underline'
      },
        React.createElement('svg', {
          className: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3'
          }),
          React.createElement('line', { x1: '4', y1: '21', x2: '20', y2: '21', strokeWidth: 2, strokeLinecap: 'round' })
        )
      ),

      // Divider
      React.createElement('div', {
        className: `w-px ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`
      }),

      // Bullet List
      React.createElement('button', {
        type: 'button',
        onClick: () => execCommand('insertUnorderedList'),
        className: toolbarButtonClass,
        title: 'Bullet List'
      },
        React.createElement('svg', {
          className: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
          React.createElement('line', { x1: '8', y1: '6', x2: '21', y2: '6', strokeWidth: 2, strokeLinecap: 'round' }),
          React.createElement('line', { x1: '8', y1: '12', x2: '21', y2: '12', strokeWidth: 2, strokeLinecap: 'round' }),
          React.createElement('line', { x1: '8', y1: '18', x2: '21', y2: '18', strokeWidth: 2, strokeLinecap: 'round' }),
          React.createElement('circle', { cx: '4', cy: '6', r: '1', fill: 'currentColor' }),
          React.createElement('circle', { cx: '4', cy: '12', r: '1', fill: 'currentColor' }),
          React.createElement('circle', { cx: '4', cy: '18', r: '1', fill: 'currentColor' })
        )
      ),

      // Numbered List
      React.createElement('button', {
        type: 'button',
        onClick: () => execCommand('insertOrderedList'),
        className: toolbarButtonClass,
        title: 'Numbered List'
      },
        React.createElement('svg', {
          className: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
          React.createElement('line', { x1: '10', y1: '6', x2: '21', y2: '6', strokeWidth: 2, strokeLinecap: 'round' }),
          React.createElement('line', { x1: '10', y1: '12', x2: '21', y2: '12', strokeWidth: 2, strokeLinecap: 'round' }),
          React.createElement('line', { x1: '10', y1: '18', x2: '21', y2: '18', strokeWidth: 2, strokeLinecap: 'round' }),
          React.createElement('text', { x: '4', y: '8', fontSize: '8', fill: 'currentColor' }, '1.'),
          React.createElement('text', { x: '4', y: '14', fontSize: '8', fill: 'currentColor' }, '2.'),
          React.createElement('text', { x: '4', y: '20', fontSize: '8', fill: 'currentColor' }, '3.')
        )
      ),

      // Divider
      React.createElement('div', {
        className: `w-px ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`
      }),

      // Font Size
      React.createElement('div', { className: 'relative' },
        React.createElement('button', {
          type: 'button',
          onClick: () => setShowFontSizePicker(!showFontSizePicker),
          className: toolbarButtonClass + ' flex items-center gap-1',
          title: 'Font Size'
        },
          React.createElement('svg', {
            className: 'w-5 h-5',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          },
            React.createElement('text', { x: '4', y: '16', fontSize: '14', fill: 'currentColor' }, 'A'),
            React.createElement('text', { x: '14', y: '20', fontSize: '10', fill: 'currentColor' }, 'A')
          ),
          React.createElement('svg', {
            className: 'w-3 h-3',
            fill: 'currentColor',
            viewBox: '0 0 20 20'
          },
            React.createElement('path', {
              fillRule: 'evenodd',
              d: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
              clipRule: 'evenodd'
            })
          )
        ),
        showFontSizePicker && React.createElement('div', {
          className: `absolute top-full left-0 mt-1 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'} border rounded shadow-lg z-10`
        },
          fontSizes.map(size =>
            React.createElement('button', {
              key: size,
              type: 'button',
              onClick: () => {
                execCommand('fontSize', '7');
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  const span = document.createElement('span');
                  span.style.fontSize = size;
                  range.surroundContents(span);
                }
                setShowFontSizePicker(false);
                handleInput();
              },
              className: `block w-full px-4 py-2 text-left ${darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'}`,
              style: { fontSize: size }
            }, size)
          )
        )
      ),

      // Font Color
      React.createElement('div', { className: 'relative' },
        React.createElement('button', {
          type: 'button',
          onClick: () => setShowColorPicker(!showColorPicker),
          className: toolbarButtonClass,
          title: 'Font Color'
        },
          React.createElement('svg', {
            className: 'w-5 h-5',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M7 21h10M12 3v18M8 7l4-4 4 4'
            })
          )
        ),
        showColorPicker && React.createElement('div', {
          className: `absolute top-full left-0 mt-1 p-2 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'} border rounded shadow-lg z-10 grid grid-cols-5 gap-1`
        },
          colors.map(color =>
            React.createElement('button', {
              key: color,
              type: 'button',
              onClick: () => {
                execCommand('foreColor', color);
                setShowColorPicker(false);
              },
              className: 'w-6 h-6 rounded border border-gray-400',
              style: { backgroundColor: color },
              title: color
            })
          )
        )
      ),

      // Divider
      React.createElement('div', {
        className: `w-px ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`
      }),

      // Remove Formatting
      React.createElement('button', {
        type: 'button',
        onClick: () => execCommand('removeFormat'),
        className: toolbarButtonClass,
        title: 'Remove Formatting'
      },
        React.createElement('svg', {
          className: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M6 18L18 6M6 6l12 12'
          })
        )
      )
    ),

    // Content Editable Area
    React.createElement('div', {
      ref: editorRef,
      contentEditable: true,
      onInput: handleInput,
      className: `p-3 min-h-[150px] max-h-[400px] overflow-y-auto focus:outline-none ${
        darkMode ? 'bg-slate-800 text-gray-200' : 'bg-white text-gray-900'
      }`,
      style: { whiteSpace: 'pre-wrap' },
      'data-placeholder': placeholder
    })
  );
}
