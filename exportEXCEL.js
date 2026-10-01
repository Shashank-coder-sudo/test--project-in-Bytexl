import * as XLSX from 'xlsx';
import { formatDate } from './formatters';

export const exportTransactionsToExcel = ({
  fileName = 'financial_transactions',
  transactions = [],
  summary = null,
}) => {
  const formattedRows = transactions.map((t, index) => ({
    '#': index + 1,
    'Date': formatDate(t.date),
    'Title': t.title,
    'Category': t.category || '-',
    'Type': t.type ? t.type.toUpperCase() : (t.amount >= 0 ? 'INCOME' : 'EXPENSE'),
    'Amount': t.amount,
    'Payment Method': t.paymentMethod || '-',
    'Description': t.description || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedRows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 25 },
    { wch: 16 },
    { wch: 12 },
    { wch: 14 },
    { wch: 18 },
    { wch: 30 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  // If summary exists, append summary sheet
  if (summary) {
    const summaryRows = [
      { Metric: 'Total Income', Value: summary.totalIncome || 0 },
      { Metric: 'Total Expense', Value: summary.totalExpense || 0 },
      { Metric: 'Net Savings / Balance', Value: summary.netSavings || summary.totalBalance || 0 },
      { Metric: 'Savings Rate (%)', Value: `${summary.savingsRate || 0}%` },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  }

  XLSX.writeFile(workbook, `${fileName}_${Date.now()}.xlsx`);
};
