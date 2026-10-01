const Income = require('../models/Income');
const Expense = require('../models/Expense');

// @desc    Get dashboard metrics, balance, stats, recent transactions, monthly chart data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Aggregate Total Income
    const incomeAgg = await Income.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const totalIncome = incomeAgg.length > 0 ? incomeAgg[0].total : 0;
    const incomeCount = incomeAgg.length > 0 ? incomeAgg[0].count : 0;

    // Aggregate Total Expense
    const expenseAgg = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const totalExpense = expenseAgg.length > 0 ? expenseAgg[0].total : 0;
    const expenseCount = expenseAgg.length > 0 ? expenseAgg[0].count : 0;

    // Net Balance & Savings
    const totalBalance = totalIncome - totalExpense;
    const savings = totalBalance > 0 ? totalBalance : 0;
    const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

    // Current Month Metrics
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const currentMonthIncomeAgg = await Income.aggregate([
      { $match: { user: userId, date: { $gte: startOfCurrentMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const currentMonthIncome = currentMonthIncomeAgg.length > 0 ? currentMonthIncomeAgg[0].total : 0;

    const currentMonthExpenseAgg = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: startOfCurrentMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const currentMonthExpense = currentMonthExpenseAgg.length > 0 ? currentMonthExpenseAgg[0].total : 0;

    // Past 6 Months Monthly Trend for charts
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyIncomeData = await Income.aggregate([
      { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthlyExpenseData = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Build unified 6-month array
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const monthLabel = `${monthNames[month - 1]} ${year}`;

      const inc = monthlyIncomeData.find((item) => item._id.year === year && item._id.month === month);
      const exp = monthlyExpenseData.find((item) => item._id.year === year && item._id.month === month);

      monthlyTrends.push({
        month: monthLabel,
        income: inc ? inc.total : 0,
        expense: exp ? exp.total : 0,
        net: (inc ? inc.total : 0) - (exp ? exp.total : 0),
      });
    }

    // Category Spending Breakdown
    const categoryBreakdown = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Recent 5 Incomes and Recent 5 Expenses merged and sorted
    const recentIncomes = await Income.find({ user: userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .lean();

    const recentExpenses = await Expense.find({ user: userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .lean();

    const recentTransactions = [
      ...recentIncomes.map((inc) => ({ ...inc, type: 'income' })),
      ...recentExpenses.map((exp) => ({ ...exp, type: 'expense' })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);

    res.status(200).json({
      success: true,
      stats: {
        totalBalance,
        totalIncome,
        totalExpense,
        savings,
        savingsRate: Number(savingsRate),
        incomeCount,
        expenseCount,
        currentMonthIncome,
        currentMonthExpense,
        currentMonthSavings: currentMonthIncome - currentMonthExpense,
      },
      monthlyTrends,
      categoryBreakdown: categoryBreakdown.map((cat) => ({
        category: cat._id || 'Uncategorized',
        total: cat.total,
        count: cat.count,
        percentage: totalExpense > 0 ? Number(((cat.total / totalExpense) * 100).toFixed(1)) : 0,
      })),
      recentTransactions,
    });
  } catch (error) {
    next(error);
  }
};
