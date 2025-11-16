// js/components/ProjectForm/ProjectBudgetSection.js

/**
 * ProjectBudgetSection Component
 * Handles 5-year budget fields (CAPEX/OPEX)
 */

import { Euro, Calendar } from '../../shared/icons/index.js';

export function ProjectBudgetSection({
  project,
  pIndex,
  updateProject,
  darkMode,
  isEditLocked = false
}) {
  // Format number with thousand separators (dots) and euro symbol
  const formatNumber = (num) => {
    const rounded = Math.round(num);
    const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `€${formatted}`;
  };

  // Calculate budget totals
  const calculateBudgetTotals = () => {
    const capexYear1 = parseFloat(project.capexYear1) || 0;
    const capexYear2 = parseFloat(project.capexYear2) || 0;
    const capexYear3 = parseFloat(project.capexYear3) || 0;
    const capexYear4 = parseFloat(project.capexYear4) || 0;
    const capexYear5 = parseFloat(project.capexYear5) || 0;

    const opexYear1 = parseFloat(project.opexYear1) || 0;
    const opexYear2 = parseFloat(project.opexYear2) || 0;
    const opexYear3 = parseFloat(project.opexYear3) || 0;
    const opexYear4 = parseFloat(project.opexYear4) || 0;
    const opexYear5 = parseFloat(project.opexYear5) || 0;

    const invoicedYear1 = parseFloat(project.invoicedYear1) || 0;
    const invoicedYear2 = parseFloat(project.invoicedYear2) || 0;
    const invoicedYear3 = parseFloat(project.invoicedYear3) || 0;
    const invoicedYear4 = parseFloat(project.invoicedYear4) || 0;
    const invoicedYear5 = parseFloat(project.invoicedYear5) || 0;

    const totalCapex = capexYear1 + capexYear2 + capexYear3 + capexYear4 + capexYear5;
    const totalOpex = opexYear1 + opexYear2 + opexYear3 + opexYear4 + opexYear5;
    const totalBudget = totalCapex + totalOpex;

    const totalYear1 = capexYear1 + opexYear1;
    const totalYear2 = capexYear2 + opexYear2;
    const totalYear3 = capexYear3 + opexYear3;
    const totalYear4 = capexYear4 + opexYear4;
    const totalYear5 = capexYear5 + opexYear5;

    const remainingYear1 = totalYear1 - invoicedYear1;
    const remainingYear2 = totalYear2 - invoicedYear2;
    const remainingYear3 = totalYear3 - invoicedYear3;
    const remainingYear4 = totalYear4 - invoicedYear4;
    const remainingYear5 = totalYear5 - invoicedYear5;

    const totalInvoiced = invoicedYear1 + invoicedYear2 + invoicedYear3 + invoicedYear4 + invoicedYear5;
    const totalRemainingBudget = totalBudget - totalInvoiced;

    return {
      totalCapex,
      totalOpex,
      totalBudget,
      totalYear1,
      totalYear2,
      totalYear3,
      totalYear4,
      totalYear5,
      remainingYear1,
      remainingYear2,
      remainingYear3,
      remainingYear4,
      remainingYear5,
      totalInvoiced,
      totalRemainingBudget
    };
  };

  const budgetTotals = calculateBudgetTotals();
  const firstYear = parseInt(project.budgetFirstYear) || new Date().getFullYear();

  return React.createElement('div', {
    className: `p-3 border-t-2 ${darkMode ? 'border-slate-600' : 'border-gray-200'}`
  },
    React.createElement('div', {
      className: `rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700/50' : 'border-sky-200 bg-sky-50/30'} p-3`
    },
      // Budget Header
      React.createElement('div', {
        className: `text-sm font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} mb-2 flex items-center gap-2`
      },
        React.createElement(Euro, {
          className: `w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-sky-600'}`
        }),
        'Project Budget'
      ),

      // Budget Grid
      React.createElement('div', {
        className: 'grid grid-cols-6 gap-2'
      },
        // Year Labels Row
        React.createElement('div', {
          className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} flex items-center`
        }, ''),
        ...[1, 2, 3, 4, 5].map(yearNum =>
          React.createElement('div', {
            key: `year-label-${yearNum}`,
            className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-700'} text-center`
          }, firstYear + yearNum - 1)
        ),

        // CAPEX Row
        React.createElement('div', {
          className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} flex items-center gap-1`
        },
          React.createElement(Euro, {
            className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-sky-600'}`
          }),
          'CAPEX'
        ),
        ...[1, 2, 3, 4, 5].map(yearNum =>
          React.createElement('input', {
            key: `capex-year-${yearNum}`,
            type: 'number',
            step: '0.01',
            value: project[`capexYear${yearNum}`] || '',
            onChange: (e) => updateProject(pIndex, `capexYear${yearNum}`, e.target.value),
            className: `w-full px-2 py-1 text-sm text-center border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-sky-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            placeholder: '0',
            disabled: isEditLocked
          })
        ),

        // OPEX Row
        React.createElement('div', {
          className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} flex items-center gap-1`
        },
          React.createElement(Euro, {
            className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-sky-600'}`
          }),
          'OPEX'
        ),
        ...[1, 2, 3, 4, 5].map(yearNum =>
          React.createElement('input', {
            key: `opex-year-${yearNum}`,
            type: 'number',
            step: '0.01',
            value: project[`opexYear${yearNum}`] || '',
            onChange: (e) => updateProject(pIndex, `opexYear${yearNum}`, e.target.value),
            className: `w-full px-2 py-1 text-sm text-center border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-sky-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            placeholder: '0',
            disabled: isEditLocked
          })
        ),

        // Total per Year Row (read-only calculated)
        React.createElement('div', {
          className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-700'} flex items-center gap-1`
        },
          React.createElement(Euro, {
            className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-sky-600'}`
          }),
          'Total/Year'
        ),
        ...[1, 2, 3, 4, 5].map(yearNum =>
          React.createElement('div', {
            key: `total-year-${yearNum}`,
            className: `px-2 py-1 text-sm font-bold text-center rounded ${darkMode ? 'bg-slate-800 text-purple-300' : 'bg-sky-100/30 text-sky-800'}`
          }, formatNumber(budgetTotals[`totalYear${yearNum}`]))
        ),

        // Invoiced Row (Budget consumption tracking)
        React.createElement('div', {
          className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} flex items-center gap-1`
        },
          React.createElement(Euro, {
            className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-sky-600'}`
          }),
          'Invoiced'
        ),
        ...[1, 2, 3, 4, 5].map(yearNum =>
          React.createElement('input', {
            key: `invoiced-year-${yearNum}`,
            type: 'number',
            step: '0.01',
            value: project[`invoicedYear${yearNum}`] || '',
            onChange: (e) => updateProject(pIndex, `invoicedYear${yearNum}`, e.target.value),
            className: `w-full px-2 py-1 text-sm text-center border ${darkMode ? 'border-slate-600 bg-slate-800 text-gray-200 input-glow-dark' : 'border-sky-200 bg-white input-glow'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            placeholder: '0',
            disabled: isEditLocked
          })
        ),

        // Remaining Budget Row (read-only calculated: Total/Year - Invoiced)
        React.createElement('div', {
          className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} flex items-center gap-1`
        },
          React.createElement(Euro, {
            className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-sky-600'}`
          }),
          'Remaining Budget'
        ),
        ...[1, 2, 3, 4, 5].map(yearNum =>
          React.createElement('div', {
            key: `remaining-year-${yearNum}`,
            className: `px-2 py-1 text-sm font-bold text-center rounded ${
              budgetTotals[`remainingYear${yearNum}`] < 0
                ? darkMode ? 'bg-red-900/30 text-red-300 border border-red-500' : 'bg-red-100 text-red-700 border border-red-400'
                : darkMode ? 'bg-slate-800 text-emerald-300' : 'bg-emerald-50/50 text-emerald-700'
            }`
          }, formatNumber(budgetTotals[`remainingYear${yearNum}`]))
        )
      ),

      // Summary Totals
      React.createElement('div', {
        className: `mt-3 pt-3 border-t ${darkMode ? 'border-slate-600' : 'border-sky-200'} grid grid-cols-5 gap-3`
      },
        // First Year Selector
        React.createElement('div', {
          className: `p-2 rounded ${darkMode ? 'bg-slate-800' : 'bg-white/30'} border ${darkMode ? 'border-slate-600' : 'border-sky-200'} flex flex-col`
        },
          React.createElement('div', {
            className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} mb-1 flex items-center gap-1`
          },
            React.createElement(Calendar, {
              className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-sky-600'}`
            }),
            'First Budget Year'
          ),
          React.createElement('select', {
            value: project.budgetFirstYear || new Date().getFullYear(),
            onChange: (e) => updateProject(pIndex, 'budgetFirstYear', e.target.value),
            className: `flex-1 px-2 py-1 text-sm border ${darkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-sky-200 bg-white'} rounded ${isEditLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
            disabled: isEditLocked
          },
            // Generate year options from current year - 5 to current year + 10
            Array.from({ length: 16 }, (_, i) => {
              const year = new Date().getFullYear() - 5 + i;
              return React.createElement('option', { key: year, value: year }, year);
            })
          )
        ),

        // Total CAPEX
        React.createElement('div', {
          className: `p-2 rounded ${darkMode ? 'bg-slate-800' : 'bg-white/30'} border ${darkMode ? 'border-slate-600' : 'border-sky-200'}`
        },
          React.createElement('div', {
            className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} mb-1 text-center`
          }, 'Total CAPEX'),
          React.createElement('div', {
            className: `text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-sky-700'} text-center`
          }, formatNumber(budgetTotals.totalCapex))
        ),

        // Total OPEX
        React.createElement('div', {
          className: `p-2 rounded ${darkMode ? 'bg-slate-800' : 'bg-white/30'} border ${darkMode ? 'border-slate-600' : 'border-sky-200'}`
        },
          React.createElement('div', {
            className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} mb-1 text-center`
          }, 'Total OPEX'),
          React.createElement('div', {
            className: `text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-sky-700'} text-center`
          }, formatNumber(budgetTotals.totalOpex))
        ),

        // Total Budget
        React.createElement('div', {
          className: `p-2 rounded ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-700' : 'bg-sky-50/20'} border-2 ${darkMode ? 'border-purple-500' : 'border-sky-300'}`
        },
          React.createElement('div', {
            className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} mb-1 flex items-center justify-center gap-1`
          },
            React.createElement(Euro, {
              className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-sky-600'}`
            }),
            'TOTAL BUDGET'
          ),
          React.createElement('div', {
            className: `text-xl font-bold ${darkMode ? 'text-purple-400' : 'text-sky-800'} text-center`
          }, formatNumber(budgetTotals.totalBudget))
        ),

        // Total Remaining Budget
        React.createElement('div', {
          className: `p-2 rounded ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-700' : 'bg-sky-50/20'} border-2 ${
            budgetTotals.totalRemainingBudget < 0
              ? darkMode ? 'border-red-500' : 'border-red-400'
              : darkMode ? 'border-emerald-500' : 'border-emerald-400'
          }`
        },
          React.createElement('div', {
            className: `text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-sky-900'} mb-1 flex items-center justify-center gap-1`
          },
            React.createElement(Euro, {
              className: `w-3 h-3 ${darkMode ? 'text-purple-400' : 'text-sky-600'}`
            }),
            'TOTAL REMAINING BUDGET'
          ),
          React.createElement('div', {
            className: `text-xl font-bold ${
              budgetTotals.totalRemainingBudget < 0
                ? darkMode ? 'text-red-400' : 'text-red-700'
                : darkMode ? 'text-emerald-400' : 'text-emerald-700'
            } text-center`
          }, formatNumber(budgetTotals.totalRemainingBudget))
        )
      )
    )
  );
}