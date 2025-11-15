// js/components/ResourcesChart/ResourceInputs.js

/**
 * ResourceInputs Component
 * Handles BAU (Business As Usual) allocation inputs for PM and BP
 */
export function ResourceInputs({
  bauPM,
  bauBP,
  setBauPM,
  setBauBP,
  darkMode
}) {
  return React.createElement('div', {
    className: `mb-6 p-4 rounded-xl shadow-lg ${darkMode ? 'glass-dark border-animated-dark' : 'glass border-animated'}`,
    style: {
      background: darkMode
        ? 'linear-gradient(to right, rgba(51, 65, 85, 0.85), rgba(71, 85, 105, 0.85))'
        : 'linear-gradient(to right, rgba(147, 197, 253, 0.85), rgba(165, 180, 252, 0.85))'
    }
  },
    React.createElement('div', {
      className: 'grid grid-cols-2 gap-4'
    },
      // PM BAU Input
      React.createElement('div', null,
        React.createElement('label', {
          className: `block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`
        },
          'PM BAU Allocation (FTE/Month)',
          React.createElement('span', {
            className: `${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-1 font-normal`
          }, '(applies to all PMs universally)')
        ),
        React.createElement('input', {
          type: 'number',
          step: '0.1',
          value: bauPM,
          onChange: (e) => setBauPM(e.target.value),
          className: `w-full px-3 py-2 text-sm border rounded-lg shadow-sm ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white text-gray-900 input-glow'}`,
          placeholder: 'e.g., 0.5'
        })
      ),
      // BP BAU Input
      React.createElement('div', null,
        React.createElement('label', {
          className: `block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`
        },
          'BP BAU Allocation (FTE/Month)',
          React.createElement('span', {
            className: `${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-1 font-normal`
          }, '(applies to all BPs universally)')
        ),
        React.createElement('input', {
          type: 'number',
          step: '0.1',
          value: bauBP,
          onChange: (e) => setBauBP(e.target.value),
          className: `w-full px-3 py-2 text-sm border rounded-lg shadow-sm ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-gray-300 bg-white text-gray-900 input-glow'}`,
          placeholder: 'e.g., 0.5'
        })
      )
    )
  );
}
