// js/actions/actionsExcelUtils.js

/**
 * Export actions to Excel file
 * @param {Array} actions - Array of action objects
 */
export const exportActionsToExcel = (actions) => {
  if (!actions || actions.length === 0) {
    alert('No actions to export. Please add some actions first.');
    return;
  }

  const data = actions.map(action => ({
    'Title': action.title || '',
    'Department': action.department || '',
    'Initiative': action.initiative || '',
    'Classification': action.classification || 'Action',
    'Progress': action.progress || '0%',
    'Start Date': action.startDate ? new Date(action.startDate) : '',
    'Finish Date': action.finishDate ? new Date(action.finishDate) : '',
    'Assignee': action.assignee || '',
    'Scope': action.scope || '',
    'Team Members': action.teamMembers || '',
    'Investment Need': action.investmentNeed || '',
    'Value Capture': action.valueCapture || '',
    'Key Achievements': action.keyAchievements || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data, { cellDates: true, dateNF: 'yyyy-mm-dd' });

  // Format date columns (F = Start Date, G = Finish Date)
  const dateColumns = ['F', 'G'];
  const range = XLSX.utils.decode_range(ws['!ref']);

  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    dateColumns.forEach(col => {
      const cellRef = col + (row + 1);
      if (ws[cellRef] && ws[cellRef].v) {
        ws[cellRef].t = 'd';
        ws[cellRef].z = 'yyyy-mm-dd';
      }
    });
  }

  // Set column widths for better readability
  ws['!cols'] = [
    { wch: 30 }, // Title
    { wch: 20 }, // Department
    { wch: 30 }, // Initiative
    { wch: 15 }, // Classification
    { wch: 10 }, // Progress
    { wch: 12 }, // Start Date
    { wch: 12 }, // Finish Date
    { wch: 20 }, // Assignee
    { wch: 40 }, // Scope
    { wch: 30 }, // Team Members
    { wch: 20 }, // Investment Need
    { wch: 50 }, // Value Capture
    { wch: 30 }  // Key Achievements
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Actions');

  XLSX.writeFile(wb, 'action_items.xlsx');
};

/**
 * Import actions from Excel file
 * @param {File} file - Excel file to import
 * @param {Function} callback - Callback function with imported actions
 */
export const importActionsFromExcel = (file, callback) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const workbook = XLSX.read(event.target.result, { type: 'binary', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { raw: false, dateNF: 'yyyy-mm-dd' });

      const formatDate = (value) => {
        if (!value) return '';

        // If already in YYYY-MM-DD format
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return value;
        }

        // Try to parse as date
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }

        return '';
      };

      const importedActions = data.map(row => ({
        title: row['Title'] || '',
        department: row['Department'] || '',
        initiative: row['Initiative'] || '',
        classification: row['Classification'] || 'Action',
        progress: row['Progress'] || '0%',
        startDate: formatDate(row['Start Date']),
        finishDate: formatDate(row['Finish Date']),
        assignee: row['Assignee'] || '',
        scope: row['Scope'] || '',
        teamMembers: row['Team Members'] || '',
        investmentNeed: row['Investment Need'] || '',
        valueCapture: row['Value Capture'] || '',
        keyAchievements: row['Key Achievements'] || ''
      }));

      callback(importedActions);
      alert(`Successfully imported ${importedActions.length} action item${importedActions.length !== 1 ? 's' : ''}!`);
    } catch (error) {
      alert('Error importing file. Please make sure it has the correct format with columns: Title, Department, Initiative, Classification, Progress, Start Date, Finish Date, Assignee, Scope, Team Members, Investment Need, Value Capture, Key Achievements');
      console.error('Import error:', error);
    }
  };
  reader.readAsBinaryString(file);
};
