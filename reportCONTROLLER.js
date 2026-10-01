const Income = require('../models/Income');
const Expense = require('../models/Expense');

// @desc    Get monthly report for a specific year
// @route   GET /api/report/monthly?year=2026
// @access  Private
exports.getMonthlyReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const monthlyIncome = await Income.aggregate([
      { $match: { user: userId, date: { $gte: startOfYear, $lte: endOfYear } } },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyExpense = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: startOfYear, $lte: endOfYear } } },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    let totalYearlyIncome = 0;
    let totalYearlyExpense = 0;

    const reportData = months.map((monthName, index) => {
      const monthNum = index + 1;
      const inc = monthlyIncome.find((item) => item._id === monthNum);
      const exp = monthlyExpense.find((item) => item._id === monthNum);

      const incomeVal = inc ? inc.total : 0;
      const expenseVal = exp ? exp.total : 0;
      const netSavings = incomeVal - expenseVal;

      totalYearlyIncome += incomeVal;
      totalYearlyExpense += expenseVal;

      return {
        month: monthName,
        monthIndex: monthNum,
        income: incomeVal,
        expense: expenseVal,
        savings: netSavings,
        savingsRate: incomeVal > 0 ? Number(((netSavings / incomeVal) * 100).toFixed(1)) : 0,
        incomeCount: inc ? inc.count : 0,
        expenseCount: exp ? exp.count : 0,
      };
    });

    const netYearlySavings = totalYearlyIncome - totalYearlyExpense;

    res.status(200).json({
      success: true,
      year,
      summary: {
        totalIncome: totalYearlyIncome,
        totalExpense: totalYearlyExpense,
        netSavings: netYearlySavings,
        savingsRate: totalYearlyIncome > 0 ? Number(((netYearlySavings / totalYearlyIncome) * 100).toFixed(1)) : 0,
      },
      report: reportData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get yearly report comparison across years
// @route   GET /api/report/yearly
// @access  Private
exports.getYearlyReport = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const yearlyIncome = await Income.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $year: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const yearlyExpense = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $year: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge unique years
    const yearSet = new Set([
      ...yearlyIncome.map((i) => i._id),
      ...yearlyExpense.map((e) => e._id),
    ]);

    if (yearSet.size === 0) {
      yearSet.add(new Date().getFullYear());
    }

    const years = Array.from(yearSet).sort((a, b) => a - b);

    const report = years.map((yr) => {
      const inc = yearlyIncome.find((i) => i._id === yr);
      const exp = yearlyExpense.find((e) => e._id === yr);
      const incomeVal = inc ? inc.total : 0;
      const expenseVal = exp ? exp.total : 0;
      const savings = incomeVal - expenseVal;

      return {
        year: yr,
        income: incomeVal,
        expense: expenseVal,
        savings,
        savingsRate: incomeVal > 0 ? Number(((savings / incomeVal) * 100).toFixed(1)) : 0,
        incomeCount: inc ? inc.count : 0,
        expenseCount: exp ? exp.count : 0,
      };
    });

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category-wise distribution for pie/doughnut charts with custom date filter
// @route   GET /api/report/category-pie?type=expense&startDate=2026-01-01&endDate=2026-12-31
// @access  Private
exports.getCategoryPieReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type = 'expense', startDate, endDate } = req.query;

    const matchQuery = { user: userId };

    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchQuery.date.$lte = end;
      }
    }

    const Model = type === 'income' ? Income : Expense;

    const categoryData = await Model.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const grandTotal = categoryData.reduce((acc, curr) => acc + curr.total, 0);

    const result = categoryData.map((cat) => ({
      category: cat._id || 'Uncategorized',
      total: cat.total,
      count: cat.count,
      percentage: grandTotal > 0 ? Number(((cat.total / grandTotal) * 100).toFixed(1)) : 0,
    }));

    res.status(200).json({
      success: true,
      type,
      grandTotal,
      categories: result,
    });
  } catch (error) {
    next(error);
  }
};
