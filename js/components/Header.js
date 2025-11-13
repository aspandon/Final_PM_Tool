// js/components/Header.js

/**
 * Header Component
 * Displays the app title, logo, and main action buttons
 */

export function Header({
  addProject,
  hideProjectFields,
  setHideProjectFields,
  onImportClick,
  exportToExcel,
  darkMode,
  setDarkMode
}) {
  const { BarChart3, Plus, Download, Upload, Settings, ArrowLeft } = lucide;
  const [showSettingsMenu, setShowSettingsMenu] = React.useState(false);

  // Close settings menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSettingsMenu && !event.target.closest('.settings-dropdown-container')) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSettingsMenu]);

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left side - Back to Hub and Title */}
      <div className="flex items-center gap-4">
        {/* Back to Hub Link */}
        <a
          href="index.html"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            darkMode
              ? 'text-gray-300 hover:text-blue-400 hover:bg-slate-700'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
          title="Back to Hub"
        >
          {React.createElement(ArrowLeft, { className: "w-5 h-5" })}
          <span className="text-sm font-medium">Back to Hub</span>
        </a>

        {/* Vertical Divider */}
        <div className={`w-px h-8 ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`}></div>

        {/* Logo */}
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          {React.createElement(BarChart3, { className: "w-6 h-6 text-white" })}
        </div>

        {/* Title and Subtitle - Now inline */}
        <div className="flex items-baseline gap-3">
          <h1 className={`text-2xl font-bold bg-gradient-to-r ${darkMode ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`}>
            Digital Development Project Management
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Project planning and resource management • Version 1.1
          </p>
        </div>
      </div>

      {/* Right side - Action Buttons */}
      <div className="flex gap-3">
        {/* Add Project Button */}
        <button
          onClick={addProject}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          title="Add new project"
        >
          {React.createElement(Plus, { className: "w-4 h-4" })}
          Add
        </button>

        {/* Settings Button with Dropdown */}
        <div className="relative settings-dropdown-container">
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            title="Settings"
          >
            {React.createElement(Settings, { className: "w-4 h-4" })}
            Settings
          </button>

          {/* Settings Dropdown Menu */}
          {showSettingsMenu && React.createElement('div', {
            className: `absolute right-0 mt-2 w-72 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-2xl border z-50`
          },
            // Menu Header
            React.createElement('div', {
              className: `px-4 py-3 border-b ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-gray-200 bg-gray-50'} rounded-t-xl`
            },
              React.createElement('h3', {
                className: `text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
              }, '⚙️ Settings')
            ),

            // Settings Content
            React.createElement('div', {
              className: 'p-4 space-y-4'
            },
              // Projects Section
              React.createElement('div', null,
                React.createElement('h4', {
                  className: `text-xs font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-2 flex items-center gap-1`
                },
                  React.createElement('div', {
                    className: 'w-1 h-3 bg-blue-600 rounded'
                  }),
                  'Projects'
                ),
                React.createElement('div', {
                  className: `${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-3`
                },
                  React.createElement('label', {
                    className: `flex items-center gap-3 cursor-pointer ${darkMode ? 'text-gray-200' : 'text-gray-700'}`
                  },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: hideProjectFields,
                      onChange: (e) => setHideProjectFields(e.target.checked),
                      className: 'w-4 h-4 rounded accent-purple-600 cursor-pointer'
                    }),
                    React.createElement('div', null,
                      React.createElement('div', {
                        className: 'text-sm font-medium'
                      }, 'Hide Project Fields'),
                      React.createElement('div', {
                        className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`
                      }, 'Hide project input forms from view')
                    )
                  )
                )
              )
            ),

            // Close Button
            React.createElement('div', {
              className: `px-4 py-3 border-t ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-gray-200 bg-gray-50'} rounded-b-xl`
            },
              React.createElement('button', {
                onClick: () => setShowSettingsMenu(false),
                className: `w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  darkMode
                    ? 'bg-slate-600 hover:bg-slate-500 text-gray-200'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`
              }, 'Close')
            )
          )}
        </div>

        {/* Import Button */}
        <button
          onClick={onImportClick}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          title="Import projects from Excel file"
        >
          {React.createElement(Upload, { className: "w-4 h-4" })}
          Import
        </button>

        {/* Export Button */}
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          title="Export projects to Excel file"
        >
          {React.createElement(Download, { className: "w-4 h-4" })}
          Export
        </button>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-2 ${darkMode ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-slate-700 to-slate-800'} text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? '☀️' : '🌙'}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
}