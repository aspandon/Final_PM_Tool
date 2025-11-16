// js/components/MenuBar/HelpMenu.js

import { HelpCircle, X } from '../../shared/icons/index.js';

export function HelpMenu({
  isOpen,
  onClose,
  darkMode,
  showHelpModal,
  setShowHelpModal
}) {
  if (!isOpen && !showHelpModal) return null;

  const menuItemClass = `flex items-center gap-3 px-4 py-2.5 text-sm dropdown-item ${
    darkMode
      ? 'text-gray-200 hover:bg-slate-600'
      : 'text-gray-700 hover:bg-gray-100'
  }`;

  return React.createElement(React.Fragment, null,
    // Help Dropdown
    isOpen && React.createElement('div', {
      className: `absolute top-full left-0 mt-1 w-56 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-slate-700' : 'border-gray-200'} py-1 z-[100] dropdown-enter`
    },
      React.createElement('button', {
        onClick: (e) => {
          e.stopPropagation();
          setShowHelpModal(true);
          onClose();
        },
        className: menuItemClass
      },
        React.createElement(HelpCircle, { className: 'w-4 h-4' }),
        'Guide'
      )
    ),

    // Help Modal
    showHelpModal && React.createElement('div', {
      className: 'fixed inset-0 bg-black/50 flex items-start justify-center z-[100] p-4 pt-8 overflow-y-auto',
      onClick: () => setShowHelpModal(false)
    },
      React.createElement('div', {
        className: `${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`,
        onClick: (e) => e.stopPropagation()
      },
        // Modal Header
        React.createElement('div', {
          className: `flex items-center justify-between p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
        },
          React.createElement('div', {
            className: 'flex items-center gap-3'
          },
            React.createElement('div', {
              className: 'p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl'
            },
              React.createElement(HelpCircle, { className: 'w-6 h-6 text-white' })
            ),
            React.createElement('h2', {
              className: `text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, 'PM Tool User Guide')
          ),
          React.createElement('button', {
            onClick: () => setShowHelpModal(false),
            className: `p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`
          },
            React.createElement(X, { className: 'w-5 h-5' })
          )
        ),

        // Modal Content
        React.createElement('div', {
          className: `p-6 overflow-y-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
        },
          // Purpose Section
          React.createElement('section', { className: 'mb-8' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }, '🎯 Purpose'),
            React.createElement('p', { className: 'mb-3' },
              'The Digital Development Project Management Tool is a comprehensive web-based application designed to streamline project planning, resource allocation, and portfolio management across multiple divisions and initiatives.'
            ),
            React.createElement('p', { className: 'mb-2' },
              'This tool helps you:'
            ),
            React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1 mb-3' },
              React.createElement('li', null, 'Plan and track multiple projects simultaneously across different phases'),
              React.createElement('li', null, 'Visualize project timelines with interactive Gantt charts'),
              React.createElement('li', null, 'Manage resource allocation for Project Managers, Business Partners, and external resources'),
              React.createElement('li', null, 'Monitor FTE (Full-Time Equivalent) distribution across divisions and time periods'),
              React.createElement('li', null, 'Compare planned timelines against actual execution dates'),
              React.createElement('li', null, 'Make data-driven decisions using visual analytics and filtering capabilities'),
              React.createElement('li', null, 'Maintain project portfolio data with automatic saving and Excel integration')
            )
          ),

          // Options Section
          React.createElement('section', { className: 'mb-8' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }, '⚙️ Options & Navigation'),
            React.createElement('p', { className: 'mb-4' },
              'The PM Tool provides multiple views and menu options to help you manage your projects effectively:'
            ),

            React.createElement('h4', {
              className: `font-bold text-lg mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, 'Application Tabs'),

            // Projects Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📋 Projects'),
              React.createElement('p', { className: 'mb-2' },
                'The Projects tab is where you create and manage all your project entries. Each project includes:'
              ),
              React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                React.createElement('li', null, 'Project name and division'),
                React.createElement('li', null, 'Project Manager and Business Partner assignments'),
                React.createElement('li', null, 'Resource allocations (PM, BP, External resources)'),
                React.createElement('li', null, 'Multiple project phases with start/finish dates:'),
                React.createElement('ul', { className: 'list-circle list-inside ml-8 mt-1 space-y-1' },
                  React.createElement('li', null, 'PSD & Inv. Proposal Preparation'),
                  React.createElement('li', null, 'Investment Approval'),
                  React.createElement('li', null, 'Procurement'),
                  React.createElement('li', null, 'Project Implementation (CAPEX Reg)'),
                  React.createElement('li', null, 'BP Implementation'),
                  React.createElement('li', null, 'Planned Investment Rec.')
                )
              ),
              React.createElement('p', { className: 'mt-3' },
                'Use the Lock/Unlock button (🔒/🔓) in the tab bar to prevent accidental edits to project data when reviewing or presenting.'
              )
            ),

            // Planner Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📅 Planner'),
              React.createElement('p', null,
                'Visual Gantt timeline showing all project phases across a calendar view. Color-coded bars represent different phases, making it easy to see project schedules at a glance and identify overlaps or gaps.'
              )
            ),

            // Kanban Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📋 Kanban'),
              React.createElement('p', { className: 'mb-2' },
                'Board view organizing projects into columns based on their phase status. Provides a visual workflow management system where projects can be moved between different phase stages.'
              ),
              React.createElement('p', { className: 'mb-2' },
                'Features customizable card display options (configure via Settings > Kanban):'
              ),
              React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                React.createElement('li', null, 'RAG Status - Red/Amber/Green project health indicators'),
                React.createElement('li', null, 'Project Manager - Show/hide PM assignments'),
                React.createElement('li', null, 'Business Partner - Show/hide BP assignments'),
                React.createElement('li', null, 'Division - Show/hide division labels')
              ),
              React.createElement('p', { className: 'mt-3 mb-2' },
                'Each card includes a notes icon (📝) in the top-right corner:'
              ),
              React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                React.createElement('li', null, 'Gray icon - No notes yet'),
                React.createElement('li', null, 'Blue icon with green badge - Notes exist'),
                React.createElement('li', null, 'Click to open modal editor for adding/editing project notes'),
                React.createElement('li', null, 'Notes saved automatically with project data')
              )
            ),

            // Resources Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '👥 Resources'),
              React.createElement('p', { className: 'mb-2' },
                'Per-person resource effort tracking showing:'
              ),
              React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                React.createElement('li', null, 'Individual PM and BP effort over time'),
                React.createElement('li', null, 'Consolidated totals (Total PM, Total BP)'),
                React.createElement('li', null, 'External resource tracking (PM External, QA External)'),
                React.createElement('li', null, 'BAU (Business As Usual) allocation overlay')
              )
            ),

            // Divisions Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📊 Divisions'),
              React.createElement('p', null,
                'Consolidated view showing FTE (Full-Time Equivalent) distribution across divisions over time. Visualize resource allocation by department using stacked bar charts.'
              )
            ),

            // Actuals Comparison Tab
            React.createElement('div', { className: 'mb-4' },
              React.createElement('h4', { className: 'font-bold text-lg mb-2' }, '📈 Actuals Comparison'),
              React.createElement('p', null,
                'Compare planned project timelines against actual execution dates. Identify delays or accelerations by visualizing planned vs. actual start and finish dates side-by-side.'
              )
            ),

            // Menu Options
            React.createElement('h4', {
              className: `font-bold text-lg mb-3 mt-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
            }, 'Menu Options'),

            React.createElement('div', { className: 'space-y-3 ml-4' },
              React.createElement('div', null,
                React.createElement('h5', { className: 'font-bold mb-1' }, '📁 Files Menu'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Add Project - Create a new project entry'),
                  React.createElement('li', null, 'Import from Excel - Load projects from .xlsx/.xls file'),
                  React.createElement('li', null, 'Export to Excel - Save all projects to Excel'),
                  React.createElement('li', null, 'Clear All Data - Remove all projects and filters (with confirmation)')
                )
              ),
              React.createElement('div', null,
                React.createElement('h5', { className: 'font-bold mb-1' }, '⚙️ Settings Menu'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Hide/Show Project Fields - Toggle input form visibility'),
                  React.createElement('li', null, 'Light/Dark Mode - Switch color theme')
                )
              ),
              React.createElement('div', null,
                React.createElement('h5', { className: 'font-bold mb-1' }, '❓ Help Menu'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4' },
                  React.createElement('li', null, 'Guide - Open this comprehensive help documentation')
                )
              )
            )
          ),

          // Functionality Section
          React.createElement('section', { className: 'mb-8' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }, '⚡ Functionality'),
            React.createElement('p', { className: 'mb-4' },
              'The PM Tool includes powerful features to enhance your project management experience:'
            ),

            React.createElement('div', { className: 'space-y-3' },
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🔄 Auto-Save with Status Indicator'),
                React.createElement('p', { className: 'mb-2' },
                  'All changes to projects and filters are automatically saved to your browser\'s local storage. Your data persists across sessions and browser restarts.'
                ),
                React.createElement('p', null,
                  'Monitor the auto-save status in the top-right corner of the menu bar: Green indicator = "Auto-Save Active", Red indicator = "Save Error - Check Connection", Yellow pulsing = "Saving..."'
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '📝 Kanban Card Notes'),
                React.createElement('p', { className: 'mb-2' },
                  'Add detailed notes to any project directly from the Kanban board without cluttering the card layout. Each card displays a small notes icon in the top-right corner.'
                ),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Click the notes icon to open a full-featured editor modal'),
                  React.createElement('li', null, 'Visual indicators: Gray = no notes, Blue with green badge = notes exist'),
                  React.createElement('li', null, 'Modal appears near the clicked card for contextual editing'),
                  React.createElement('li', null, 'Keyboard shortcut: Ctrl+Enter (Cmd+Enter on Mac) to save quickly'),
                  React.createElement('li', null, 'Notes persist with project data and sync via auto-save')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🔍 Global Filters with Persistence'),
                React.createElement('p', { className: 'mb-2' },
                  'Filter your project portfolio by multiple criteria:'
                ),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Date Range - Focus on specific time periods'),
                  React.createElement('li', null, 'Divisions - Select one or multiple divisions'),
                  React.createElement('li', null, 'Projects - Choose specific projects to display'),
                  React.createElement('li', null, 'Project Managers & Business Partners - Filter by resource'),
                  React.createElement('li', null, 'External Resources - Toggle PM External and QA External visibility'),
                  React.createElement('li', null, 'BAU Allocation - Add constant monthly FTE values')
                ),
                React.createElement('p', { className: 'mt-2' },
                  'All filter choices are automatically saved and restored when you return to the application. Click "Apply" to activate filters, "Clear" to reset them.'
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '📥 Import/Export to Excel'),
                React.createElement('p', { className: 'mb-2' },
                  'Seamlessly integrate with Excel spreadsheets:'
                ),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Import - Upload .xlsx or .xls files to load projects'),
                  React.createElement('li', null, 'Export - Download your portfolio as "gantt_chart_projects.xlsx"'),
                  React.createElement('li', null, 'Backup - Regular exports ensure data safety'),
                  React.createElement('li', null, 'Sharing - Share Excel files with team members')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🌙 Dark Mode Support'),
                React.createElement('p', null,
                  'Toggle between light and dark themes via Settings menu for comfortable viewing in any environment. Theme preference is saved automatically.'
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '👁️ Hide/Show Project Fields'),
                React.createElement('p', null,
                  'Collapse project input forms to focus exclusively on charts and timelines, or expand them to edit project details. Perfect for presentations or data entry modes.'
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-1' }, '🏠 Back to Hub Navigation'),
                React.createElement('p', null,
                  'Quickly return to the Digital Development Hub landing page to switch between PM Tool and Action Items Tracker applications.'
                )
              )
            )
          ),

          // How to Use Section
          React.createElement('section', { className: 'mb-4' },
            React.createElement('h3', {
              className: `text-xl font-bold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }, '📖 How to Use the PM Tool'),
            React.createElement('p', { className: 'mb-4' },
              'Follow these steps to effectively manage your project portfolio:'
            ),

            React.createElement('div', { className: 'space-y-4' },
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-2' }, '1️⃣ Adding Projects'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Click Files > Add Project to create a new project entry'),
                  React.createElement('li', null, 'Fill in basic details: Project Name and Division'),
                  React.createElement('li', null, 'Assign resources: Project Manager and Business Partner'),
                  React.createElement('li', null, 'Enter allocation percentages as decimals (0.5 = 50% FTE, 1.0 = 100% FTE)'),
                  React.createElement('li', null, 'Add External Resource allocations if applicable'),
                  React.createElement('li', null, 'Define phase dates using the date pickers for each project phase')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-2' }, '2️⃣ Viewing & Analyzing Data'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Switch between tabs (Projects, Planner, Resources, Divisions, Actuals) to see different views'),
                  React.createElement('li', null, 'Use Planner tab for Gantt timeline visualization'),
                  React.createElement('li', null, 'Check Resources tab to monitor individual PM/BP workload'),
                  React.createElement('li', null, 'Review Divisions tab for departmental FTE distribution'),
                  React.createElement('li', null, 'Compare timelines in Actuals Comparison tab')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-2' }, '3️⃣ Filtering Your Portfolio'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Use Global Filters panel to narrow down your project view'),
                  React.createElement('li', null, 'Select date range to focus on specific time periods'),
                  React.createElement('li', null, 'Choose divisions, projects, PMs, or BPs from dropdown menus'),
                  React.createElement('li', null, 'Toggle External PM/QA checkboxes to include/exclude external resources'),
                  React.createElement('li', null, 'Click "Apply" to activate filters, "Clear" to reset')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-2' }, '4️⃣ Managing Data'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Delete projects using the delete button on each project card'),
                  React.createElement('li', null, 'Export to Excel regularly for backups (Files > Export to Excel)'),
                  React.createElement('li', null, 'Import existing Excel files (Files > Import from Excel)'),
                  React.createElement('li', null, 'Clear all data and start fresh (Files > Clear All Data)')
                )
              ),
              React.createElement('div', null,
                React.createElement('h4', { className: 'font-bold mb-2' }, '5️⃣ Best Practices'),
                React.createElement('ul', { className: 'list-disc list-inside ml-4 space-y-1' },
                  React.createElement('li', null, 'Use consistent naming conventions for PMs and BPs across all projects'),
                  React.createElement('li', null, 'Keep allocation percentages accurate for reliable FTE calculations'),
                  React.createElement('li', null, 'Set realistic phase dates based on actual project timelines'),
                  React.createElement('li', null, 'Review the auto-save indicator to ensure data is being saved'),
                  React.createElement('li', null, 'Export your data regularly as an additional backup'),
                  React.createElement('li', null, 'Use Hide Fields when presenting to stakeholders for cleaner views'),
                  React.createElement('li', null, 'Apply filters to create focused reports for specific divisions or time periods')
                )
              )
            )
          ),

          // Quick Tips
          React.createElement('section', { className: 'mb-4 p-4 rounded-lg ' + (darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200') },
            React.createElement('h3', {
              className: `text-lg font-bold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
            }, '💡 Quick Tips'),

            React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
              React.createElement('li', null, 'Use consistent naming for Project Managers and Business Partners across projects for accurate resource tracking'),
              React.createElement('li', null, 'Enter allocation percentages as decimals (e.g., 0.5 for 50% FTE, 1.0 for 100% FTE)'),
              React.createElement('li', null, 'Set date ranges in Global Filters to zoom into specific time periods'),
              React.createElement('li', null, 'Use the Hide Fields option when presenting to focus on visualizations'),
              React.createElement('li', null, 'Export regularly to maintain backups of your project data'),
              React.createElement('li', null, 'BAU allocation adds a constant FTE value per month to all PMs or BPs')
            )
          )
        )
      )
    )
  );
}
