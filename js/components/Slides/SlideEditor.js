// js/components/Slides/SlideEditor.js

import { RichTextEditor } from './RichTextEditor.js';
import { Plus, Trash2 } from '../../shared/icons/index.js';

const { useState } = React;

/**
 * Slide Editor Component
 * Form for editing slide data for projects under Implementation status
 */
export function SlideEditor({ project, slideData, onSave, darkMode }) {
  const [formData, setFormData] = useState(slideData || {
    // Basic Info
    sapId: project.sapId || '',
    jiraId: project.jiraId || '',
    pmBp: project.projectManager || '',
    businessOwner: project.businessOwner || '',
    involvedDivisions: project.division || '',
    projectStatus: project.kanbanStatus || 'Implementation',
    workCompleted: 0,
    baselineBudget: project.budget || '',
    plannedStartDate: project.implementation?.start || '',
    plannedCompletionDate: project.implementation?.finish || '',

    // RAG Status
    ragOverall: 'Green',
    ragSchedule: 'Green',
    ragCost: 'Green',
    ragScope: 'Green',

    // Project Info
    projectName: project.name || '',
    projectScope: '',

    // Rich Text Fields
    activitiesPerformed: '',
    majorActions: '',

    // Dynamic Arrays
    phases: [],
    risks: []
  });

  const updateField = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onSave(updated);
  };

  const updateArrayItem = (arrayName, index, field, value) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    updateField(arrayName, updatedArray);
  };

  const addArrayItem = (arrayName, template) => {
    updateField(arrayName, [...formData[arrayName], template]);
  };

  const removeArrayItem = (arrayName, index) => {
    updateField(arrayName, formData[arrayName].filter((_, i) => i !== index));
  };

  const ragColors = ['Green', 'Amber', 'Red'];
  const riskLevels = [
    { value: 'Low', color: 'bg-green-500', label: 'Low' },
    { value: 'Medium', color: 'bg-yellow-500', label: 'Medium' },
    { value: 'High', color: 'bg-red-500', label: 'High' }
  ];

  const inputClass = `w-full px-3 py-2 rounded-lg border ${
    darkMode
      ? 'bg-slate-700 border-slate-600 text-gray-200'
      : 'bg-white border-gray-300 text-gray-900'
  } focus:outline-none focus:ring-2 focus:ring-blue-500`;

  const labelClass = `block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  const sectionClass = `rounded-lg p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md mb-6`;

  const buttonClass = `px-4 py-2 rounded-lg font-semibold transition-colors ${
    darkMode
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-blue-500 text-white hover:bg-blue-600'
  }`;

  const deleteButtonClass = `p-2 rounded-lg transition-colors ${
    darkMode
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-red-500 text-white hover:bg-red-600'
  }`;

  return React.createElement('div', { className: 'space-y-6' },
    // Header
    React.createElement('div', { className: sectionClass },
      React.createElement('h2', {
        className: `text-2xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, `Slide Editor: ${project.name}`)
    ),

    // Section 1: Basic Information
    React.createElement('div', { className: sectionClass },
      React.createElement('h3', {
        className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, 'Basic Information'),

      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
        // SAP ID
        React.createElement('div', null,
          React.createElement('label', { className: labelClass }, 'SAP ID'),
          React.createElement('input', {
            type: 'text',
            className: inputClass,
            value: formData.sapId,
            onChange: (e) => updateField('sapId', e.target.value),
            placeholder: 'H/00050'
          })
        ),

        // JIRA ID
        React.createElement('div', null,
          React.createElement('label', { className: labelClass }, 'JIRA ID'),
          React.createElement('input', {
            type: 'text',
            className: inputClass,
            value: formData.jiraId,
            onChange: (e) => updateField('jiraId', e.target.value),
            placeholder: 'PMO-198'
          })
        ),

        // PM/BP
        React.createElement('div', null,
          React.createElement('label', { className: labelClass }, 'PM/BP'),
          React.createElement('input', {
            type: 'text',
            className: inputClass,
            value: formData.pmBp,
            onChange: (e) => updateField('pmBp', e.target.value),
            placeholder: 'Project Manager Name'
          })
        ),

        // Business Owner
        React.createElement('div', null,
          React.createElement('label', { className: labelClass }, 'Business Owner'),
          React.createElement('input', {
            type: 'text',
            className: inputClass,
            value: formData.businessOwner,
            onChange: (e) => updateField('businessOwner', e.target.value),
            placeholder: 'Business Owner'
          })
        ),

        // Involved Divisions
        React.createElement('div', null,
          React.createElement('label', { className: labelClass }, 'Involved Divisions'),
          React.createElement('input', {
            type: 'text',
            className: inputClass,
            value: formData.involvedDivisions,
            onChange: (e) => updateField('involvedDivisions', e.target.value),
            placeholder: 'DDDE, IT, Commercial'
          })
        ),

        // Project Status
        React.createElement('div', null,
          React.createElement('label', { className: labelClass }, 'Project Status'),
          React.createElement('input', {
            type: 'text',
            className: inputClass,
            value: formData.projectStatus,
            onChange: (e) => updateField('projectStatus', e.target.value),
            placeholder: 'Planning / Implementation'
          })
        ),

        // Work Completed (%)
        React.createElement('div', null,
          React.createElement('label', { className: labelClass }, 'Work Completed (%)'),
          React.createElement('input', {
            type: 'number',
            className: inputClass,
            value: formData.workCompleted,
            onChange: (e) => updateField('workCompleted', parseInt(e.target.value) || 0),
            min: 0,
            max: 100,
            placeholder: '40'
          })
        ),

        // Baseline Budget
        React.createElement('div', null,
          React.createElement('label', { className: labelClass }, 'Baseline Budget'),
          React.createElement('input', {
            type: 'text',
            className: inputClass,
            value: formData.baselineBudget,
            onChange: (e) => updateField('baselineBudget', e.target.value),
            placeholder: '50K'
          })
        ),

        // Planned Start Date
        React.createElement('div', null,
          React.createElement('label', { className: labelClass }, 'Planned Start Date'),
          React.createElement('input', {
            type: 'date',
            className: inputClass,
            value: formData.plannedStartDate,
            onChange: (e) => updateField('plannedStartDate', e.target.value)
          })
        ),

        // Planned Finish Date
        React.createElement('div', null,
          React.createElement('label', { className: labelClass }, 'Planned Finish Date'),
          React.createElement('input', {
            type: 'date',
            className: inputClass,
            value: formData.plannedCompletionDate,
            onChange: (e) => updateField('plannedCompletionDate', e.target.value)
          })
        )
      )
    ),

    // Section 2: RAG Status
    React.createElement('div', { className: sectionClass },
      React.createElement('h3', {
        className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, 'RAG Status'),

      React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
        ['Overall', 'Schedule', 'Cost', 'Scope'].map(category => {
          const fieldName = `rag${category}`;
          return React.createElement('div', { key: category },
            React.createElement('label', { className: labelClass }, category),
            React.createElement('div', { className: 'flex gap-2' },
              ragColors.map(color =>
                React.createElement('button', {
                  key: color,
                  type: 'button',
                  onClick: () => updateField(fieldName, color),
                  className: `flex-1 px-3 py-2 rounded-lg font-semibold transition-all ${
                    formData[fieldName] === color
                      ? `${
                          color === 'Green' ? 'bg-green-500 text-white ring-2 ring-green-600' :
                          color === 'Amber' ? 'bg-yellow-500 text-white ring-2 ring-yellow-600' :
                          'bg-red-500 text-white ring-2 ring-red-600'
                        }`
                      : `${
                          color === 'Green' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          color === 'Amber' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          'bg-red-100 text-red-800 hover:bg-red-200'
                        }`
                  }`
                }, color.charAt(0))
              )
            )
          );
        })
      )
    ),

    // Section 3: Project Scope
    React.createElement('div', { className: sectionClass },
      React.createElement('h3', {
        className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, 'Project Scope'),
      React.createElement('textarea', {
        className: inputClass + ' min-h-[100px]',
        value: formData.projectScope,
        onChange: (e) => updateField('projectScope', e.target.value),
        placeholder: 'Enter project scope description...'
      })
    ),

    // Section 4: Activities & Actions (Rich Text)
    React.createElement('div', { className: sectionClass },
      React.createElement('h3', {
        className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, 'Activities Performed & Milestones Achieved'),
      React.createElement(RichTextEditor, {
        value: formData.activitiesPerformed,
        onChange: (value) => updateField('activitiesPerformed', value),
        darkMode,
        placeholder: 'Enter activities and milestones...'
      })
    ),

    React.createElement('div', { className: sectionClass },
      React.createElement('h3', {
        className: `text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
      }, 'Major Action Items - Upcoming Activities - Comments'),
      React.createElement(RichTextEditor, {
        value: formData.majorActions,
        onChange: (value) => updateField('majorActions', value),
        darkMode,
        placeholder: 'Enter major actions and upcoming activities...'
      })
    ),

    // Section 5: Phases/Milestones/Deliverables
    React.createElement('div', { className: sectionClass },
      React.createElement('div', { className: 'flex items-center justify-between mb-4' },
        React.createElement('h3', {
          className: `text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
        }, 'Phases/Milestones/Deliverables'),
        React.createElement('button', {
          type: 'button',
          onClick: () => addArrayItem('phases', {
            description: '',
            ragStatus: 'Green',
            deliveryDate: '',
            remarks: ''
          }),
          className: buttonClass + ' flex items-center gap-2'
        },
          React.createElement(Plus, { className: 'w-4 h-4' }),
          'Add Phase'
        )
      ),

      formData.phases.length === 0
        ? React.createElement('p', {
            className: `text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
          }, 'No phases added yet. Click "Add Phase" to begin.')
        : React.createElement('div', { className: 'space-y-4' },
            formData.phases.map((phase, index) =>
              React.createElement('div', {
                key: index,
                className: `p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`
              },
                React.createElement('div', { className: 'flex items-start gap-4' },
                  React.createElement('div', { className: 'flex-1 grid grid-cols-1 md:grid-cols-2 gap-3' },
                    // Description
                    React.createElement('div', { className: 'md:col-span-2' },
                      React.createElement('label', { className: labelClass }, 'Description'),
                      React.createElement('input', {
                        type: 'text',
                        className: inputClass,
                        value: phase.description,
                        onChange: (e) => updateArrayItem('phases', index, 'description', e.target.value),
                        placeholder: 'Phase description'
                      })
                    ),

                    // RAG Status
                    React.createElement('div', null,
                      React.createElement('label', { className: labelClass }, 'RAG Status'),
                      React.createElement('select', {
                        className: inputClass,
                        value: phase.ragStatus,
                        onChange: (e) => updateArrayItem('phases', index, 'ragStatus', e.target.value)
                      },
                        ragColors.map(color =>
                          React.createElement('option', { key: color, value: color }, color)
                        )
                      )
                    ),

                    // Estimated Delivery Date
                    React.createElement('div', null,
                      React.createElement('label', { className: labelClass }, 'Estimated Delivery Date'),
                      React.createElement('input', {
                        type: 'date',
                        className: inputClass,
                        value: phase.deliveryDate,
                        onChange: (e) => updateArrayItem('phases', index, 'deliveryDate', e.target.value)
                      })
                    ),

                    // Remarks on Progress
                    React.createElement('div', { className: 'md:col-span-2' },
                      React.createElement('label', { className: labelClass }, 'Remarks on Progress'),
                      React.createElement('textarea', {
                        className: inputClass,
                        value: phase.remarks,
                        onChange: (e) => updateArrayItem('phases', index, 'remarks', e.target.value),
                        placeholder: 'Progress remarks',
                        rows: 2
                      })
                    )
                  ),

                  // Delete Button
                  React.createElement('button', {
                    type: 'button',
                    onClick: () => removeArrayItem('phases', index),
                    className: deleteButtonClass,
                    title: 'Remove Phase'
                  },
                    React.createElement(Trash2, { className: 'w-4 h-4' })
                  )
                )
              )
            )
          )
    ),

    // Section 6: Risks
    React.createElement('div', { className: sectionClass },
      React.createElement('div', { className: 'flex items-center justify-between mb-4' },
        React.createElement('h3', {
          className: `text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`
        }, 'Risks'),
        React.createElement('button', {
          type: 'button',
          onClick: () => addArrayItem('risks', {
            description: '',
            assessment: 'Low',
            control: ''
          }),
          className: buttonClass + ' flex items-center gap-2'
        },
          React.createElement(Plus, { className: 'w-4 h-4' }),
          'Add Risk'
        )
      ),

      formData.risks.length === 0
        ? React.createElement('p', {
            className: `text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
          }, 'No risks added yet. Click "Add Risk" to begin.')
        : React.createElement('div', { className: 'space-y-4' },
            formData.risks.map((risk, index) =>
              React.createElement('div', {
                key: index,
                className: `p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`
              },
                React.createElement('div', { className: 'flex items-start gap-4' },
                  React.createElement('div', { className: 'flex-1 grid grid-cols-1 md:grid-cols-2 gap-3' },
                    // Risk Description
                    React.createElement('div', { className: 'md:col-span-2' },
                      React.createElement('label', { className: labelClass }, 'Risk Description'),
                      React.createElement('textarea', {
                        className: inputClass,
                        value: risk.description,
                        onChange: (e) => updateArrayItem('risks', index, 'description', e.target.value),
                        placeholder: 'Risk description',
                        rows: 2
                      })
                    ),

                    // Risk Assessment
                    React.createElement('div', null,
                      React.createElement('label', { className: labelClass }, 'Risk Assessment'),
                      React.createElement('div', { className: 'flex gap-2' },
                        riskLevels.map(level =>
                          React.createElement('button', {
                            key: level.value,
                            type: 'button',
                            onClick: () => updateArrayItem('risks', index, 'assessment', level.value),
                            className: `flex-1 px-3 py-2 rounded-lg font-semibold transition-all ${
                              risk.assessment === level.value
                                ? `${level.color} text-white ring-2 ring-offset-1`
                                : `${level.color.replace('bg-', 'bg-')}/20 hover:${level.color.replace('bg-', 'bg-')}/30`
                            }`
                          }, level.label)
                        )
                      )
                    ),

                    // Control
                    React.createElement('div', { className: 'md:col-span-2' },
                      React.createElement('label', { className: labelClass }, 'Control'),
                      React.createElement('textarea', {
                        className: inputClass,
                        value: risk.control,
                        onChange: (e) => updateArrayItem('risks', index, 'control', e.target.value),
                        placeholder: 'Control measures',
                        rows: 2
                      })
                    )
                  ),

                  // Delete Button
                  React.createElement('button', {
                    type: 'button',
                    onClick: () => removeArrayItem('risks', index),
                    className: deleteButtonClass,
                    title: 'Remove Risk'
                  },
                    React.createElement(Trash2, { className: 'w-4 h-4' })
                  )
                )
              )
            )
          )
    )
  );
}
