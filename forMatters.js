// Format numeric amounts into currency strings
export const formatCurrency = (amount, currency = 'USD') => {
  const symbolMap = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'CA$',
    AUD: 'AU$',
    JPY: '¥',
    CNY: '¥',
  };

  const num = Number(amount) || 0;
  const formattedNumber = num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const sym = symbolMap[currency] || '$';
  return `${sym}${formattedNumber}`;
};

// Format Date strings
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Category Color map for charts and badges
export const categoryColors = {
  Salary: '#10b981',
  Business: '#06b6d4',
  Investment: '#8b5cf6',
  Food: '#ef4444',
  Travel: '#f59e0b',
  Shopping: '#ec4899',
  Bills: '#6366f1',
  Entertainment: '#a855f7',
  Medical: '#14b8a6',
  Education: '#3b82f6',
  Others: '#64748b',
};

export const getCategoryColor = (categoryName) => {
  return categoryColors[categoryName] || '#6366f1';
};
