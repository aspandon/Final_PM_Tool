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
  const { BarChart3, Plus, Download, Upload, Edit2 } = lucide;

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left side - Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          {React.createElement(BarChart3, { className: "w-7 h-7 text-white" })}
        </div>
        <div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${darkMode ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`}>
            Digital Development Project Management
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
            Project planning and resource management • Version 1.0
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

        {/* Hide/Show Fields Button */}
        <button
          onClick={() => setHideProjectFields(!hideProjectFields)}
          className={`flex items-center gap-2 ${
            hideProjectFields 
              ? 'bg-gradient-to-r from-gray-500 to-gray-600' 
              : 'bg-gradient-to-r from-purple-500 to-purple-600'
          } text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
          title={hideProjectFields ? "Show project input fields" : "Hide project input fields"}
        >
          {React.createElement(Edit2, { className: "w-4 h-4" })}
          {hideProjectFields ? 'Show Fields' : 'Hide Fields'}
        </button>

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