// js/utils/excelUtils.js

export const exportToExcel = (projects) => {
  const data = projects.map(p => ({
    'Project Name': p.name,
    'Division': p.division,
    'Project Manager': p.projectManager,
    'PM Allocation (FTEs)': p.pmAllocation,
    'Business Partner': p.businessPartner,
    'BP Allocation (FTEs)': p.bpAllocation,
    'BP Implementation Allocation (Man Days)': p.bpImplementationAllocation,
    'PM External Allocation (FTEs)': p.pmExternalAllocation,
    'QA External Allocation (FTEs)': p.qaExternalAllocation,
    'Kanban Status': p.kanbanStatus || 'backlog',
    'Notes': p.notes || '',
    'BP Implementation Start': p.bpImplementation.start ? new Date(p.bpImplementation.start) : '',
    'BP Implementation Finish': p.bpImplementation.finish ? new Date(p.bpImplementation.finish) : '',
    'PM Plan (In. Proposal) Start': p.plannedInvestment.start ? new Date(p.plannedInvestment.start) : '',
    'PM Plan (In. Proposal) Finish': p.plannedInvestment.finish ? new Date(p.plannedInvestment.finish) : '',
    'Actual Start Date': p.actualDates.start ? new Date(p.actualDates.start) : '',
    'Actual Finish Date': p.actualDates.finish ? new Date(p.actualDates.finish) : '',
    'PSD Start': p.psd.start ? new Date(p.psd.start) : '',
    'PSD Finish': p.psd.finish ? new Date(p.psd.finish) : '',
    'Investment Proposal Start': p.investment.start ? new Date(p.investment.start) : '',
    'Investment Proposal Finish': p.investment.finish ? new Date(p.investment.finish) : '',
    'Procurement Start': p.procurement.start ? new Date(p.procurement.start) : '',
    'Procurement Finish': p.procurement.finish ? new Date(p.procurement.finish) : '',
    'Implementation (Actual) Start': p.implementation.start ? new Date(p.implementation.start) : '',
    'Implementation (Actual) Finish': p.implementation.finish ? new Date(p.implementation.finish) : ''
  }));

  const ws = XLSX.utils.json_to_sheet(data, { cellDates: true, dateNF: 'yyyy-mm-dd' });

  // Date columns: L through Y (Kanban Status and Notes are J and K now)
  const dateColumns = ['L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];
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

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Projects');
  
  XLSX.writeFile(wb, 'gantt_chart_projects.xlsx');
};

export const importFromExcel = (file, callback) => {
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
        
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return value;
        }
        
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        
        return '';
      };

      const importedProjects = data.map(row => ({
        name: row['Project Name'] || '',
        division: row['Division'] || '',
        projectManager: row['Project Manager'] || '',
        pmAllocation: row['PM Allocation (FTEs)'] || '',
        businessPartner: row['Business Partner'] || '',
        bpAllocation: row['BP Allocation (FTEs)'] || '',
        bpImplementationAllocation: row['BP Implementation Allocation (Man Days)'] || '',
        pmExternalAllocation: row['PM External Allocation (FTEs)'] || '',
        qaExternalAllocation: row['QA External Allocation (FTEs)'] || '',
        kanbanStatus: row['Kanban Status'] || 'backlog',
        notes: row['Notes'] || '',
        bpImplementation: {
          start: formatDate(row['BP Implementation Start']),
          finish: formatDate(row['BP Implementation Finish'])
        },
        plannedInvestment: {
          start: formatDate(row['PM Plan (In. Proposal) Start']),
          finish: formatDate(row['PM Plan (In. Proposal) Finish'])
        },
        actualDates: {
          start: formatDate(row['Actual Start Date']),
          finish: formatDate(row['Actual Finish Date'])
        },
        psd: {
          start: formatDate(row['PSD Start']),
          finish: formatDate(row['PSD Finish'])
        },
        investment: {
          start: formatDate(row['Investment Proposal Start']),
          finish: formatDate(row['Investment Proposal Finish'])
        },
        procurement: {
          start: formatDate(row['Procurement Start']),
          finish: formatDate(row['Procurement Finish'])
        },
        implementation: {
          start: formatDate(row['Implementation (Actual) Start']),
          finish: formatDate(row['Implementation (Actual) Finish'])
        }
      }));

      callback(importedProjects);
      alert(`Successfully imported ${importedProjects.length} projects!`);
    } catch (error) {
      alert('Error importing file. Please make sure it has the correct format.');
      console.error(error);
    }
  };
  reader.readAsBinaryString(file);
};