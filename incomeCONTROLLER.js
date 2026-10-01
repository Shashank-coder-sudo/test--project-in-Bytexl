const Income = require('../models/Income');

// @desc    Get all incomes for authenticated user (with search, filter, pagination)
// @route   GET /api/income
// @access  Private
exports.getIncomes = async (req, res, next) => {
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

    const total = await Income.countDocuments(query);
    const incomes = await Income.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Calculate sum of filtered incomes
    const totalAmountAgg = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalAmount = totalAmountAgg.length > 0 ? totalAmountAgg[0].total : 0;

    res.status(200).json({
      success: true,
      count: incomes.length,
      total,
      totalAmount,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      incomes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new income
// @route   POST /api/income
// @access  Private
exports.addIncome = async (req, res, next) => {
  try {
    const { title, amount, category, date, description, paymentMethod } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title and amount for this income',
      });
    }

    const income = await Income.create({
      user: req.user._id,
      title,
      amount: Number(amount),
      category: category || 'Salary',
      date: date ? new Date(date) : new Date(),
      description: description || '',
      paymentMethod: paymentMethod || 'Bank Transfer',
    });

    res.status(201).json({
      success: true,
      message: 'Income added successfully',
      income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update income
// @route   PUT /api/income/:id
// @access  Private
exports.updateIncome = async (req, res, next) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income transaction not found',
      });
    }

    // Ensure user owns the income record
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this income record',
      });
    }

    income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Income updated successfully',
      income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
exports.deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income transaction not found',
      });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this income record',
      });
    }

    await income.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Income deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
