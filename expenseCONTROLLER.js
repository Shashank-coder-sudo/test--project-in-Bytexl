const Expense = require('../models/Expense');

// @desc    Get all expenses for authenticated user (with search, filter, pagination)
// @route   GET /api/expense
// @access  Private
exports.getExpenses = async (req, res, next) => {
  try {
    const { search, category, startDate, endDate, minAmount, maxAmount, page = 1, limit = 10, sortBy = 'date', order = 'desc' } = req.query;

    const query = { user: req.user._id };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const total = await Expense.countDocuments(query);
    const expenses = await Expense.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Calculate sum of filtered expenses
    const totalAmountAgg = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalAmount = totalAmountAgg.length > 0 ? totalAmountAgg[0].total : 0;

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      totalAmount,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new expense
// @route   POST /api/expense
// @access  Private
exports.addExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, description, paymentMethod } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title and amount for this expense',
      });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount: Number(amount),
      category: category || 'Food',
      date: date ? new Date(date) : new Date(),
      description: description || '',
      paymentMethod: paymentMethod || 'Credit Card',
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expense/:id
// @access  Private
exports.updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense transaction not found',
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this expense record',
      });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expense/:id
// @access  Private
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense transaction not found',
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this expense record',
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
