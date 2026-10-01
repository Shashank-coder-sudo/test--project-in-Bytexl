import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export const exportTransactionsToPDF = ({
  title = 'Financial Report',
  userName = 'Valued User',
  currency = 'USD',
  transactions = [],
  summary = null,
}) => {
  const doc = new jsPDF();

  // Add Header Gradient Accent
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, 210, 24, 'F');

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 14, 15);

  // Subtitle / User metadata
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated for: ${userName} | Date: ${new Date().toLocaleDateString()}`, 14, 32);

  let startY = 38;

  // Add Summary Box if provided
  if (summary) {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, startY, 182, 22, 3, 3, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');

    const incStr = `Total Income: ${formatCurrency(summary.totalIncome || 0, currency)}`;
    const expStr = `Total Expense: ${formatCurrency(summary.totalExpense || 0, currency)}`;
    const netStr = `Net Savings: ${formatCurrency(summary.netSavings || summary.totalBalance || 0, currency)}`;

    doc.text(incStr, 20, startY + 13);
    doc.text(expStr, 85, startY + 13);
    doc.text(netStr, 145, startY + 13);

    startY += 28;
  }

  // Format table rows
  const tableRows = transactions.map((t, index) => [
    index + 1,
    formatDate(t.date),
    t.title,
    t.category || 'General',
    t.paymentMethod || '-',
    t.type ? t.type.toUpperCase() : 'TRANSACTION',
    formatCurrency(t.amount, currency),
  ]);

  doc.autoTable({
    head: [['#', 'Date', 'Title', 'Category', 'Method', 'Type', 'Amount']],
    body: tableRows,
    startY,
    theme: 'grid',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });

  // Save the generated PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};
