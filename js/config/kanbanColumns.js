// js/config/kanbanColumns.js

/**
 * Kanban Board Column Configuration
 * Defines column names and properties
 */

export const kanbanColumns = [
  'On Hold',
  'Backlog',
  'PSD Prep',
  'PSD Ready',
  'Approved',
  'Procurement',
  'Implementation',
  'UAT',
  'Done'
];

export const ragStatuses = ['Red', 'Amber', 'Green'];

export const ragColors = {
  'Red': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  'Amber': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  'Green': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' }
};
