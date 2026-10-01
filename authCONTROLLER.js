const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Category = require('../models/Category');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, currency, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      currency: currency || 'USD',
      avatar: avatar || '',
    });

    // Make sure default categories exist in DB
    await Category.seedDefaults();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        themePreference: user.themePreference,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    // Auto-create and populate demo user if logging in as demo for the first time
    if (!user && email.toLowerCase() === 'demo@expensetracker.com') {
      user = await User.create({
        name: 'Alex Morgan (Demo)',
        email: 'demo@expensetracker.com',
        password: password || 'demo123456',
        currency: 'USD',
      });

      await Category.seedDefaults();

      const Income = require('../models/Income');
      const Expense = require('../models/Expense');

      const now = new Date();
      // Seed rich sample demo data
      await Income.insertMany([
        { user: user._id, title: 'Monthly Senior Tech Salary', amount: 5500, category: 'Salary', date: new Date(now.getFullYear(), now.getMonth(), 1), paymentMethod: 'Bank Transfer' },
        { user: user._id, title: 'Freelance Web Design Consulting', amount: 1850, category: 'Business', date: new Date(now.getFullYear(), now.getMonth(), 8), paymentMethod: 'UPI' },
        { user: user._id, title: 'Index Fund Quarterly Dividend', amount: 420, category: 'Investment', date: new Date(now.getFullYear(), now.getMonth(), 15), paymentMethod: 'Bank Transfer' },
        { user: user._id, title: 'Previous Month Salary', amount: 5500, category: 'Salary', date: new Date(now.getFullYear(), now.getMonth() - 1, 1), paymentMethod: 'Bank Transfer' },
        { user: user._id, title: 'Freelance Mobile App API', amount: 2200, category: 'Business', date: new Date(now.getFullYear(), now.getMonth() - 1, 10), paymentMethod: 'PayPal' },
      ]);

      await Expense.insertMany([
        { user: user._id, title: 'Downtown Apartment Rent', amount: 1650, category: 'Bills', date: new Date(now.getFullYear(), now.getMonth(), 2), paymentMethod: 'Bank Transfer' },
        { user: user._id, title: 'Whole Foods Market Groceries', amount: 340, category: 'Food', date: new Date(now.getFullYear(), now.getMonth(), 5), paymentMethod: 'Credit Card' },
        { user: user._id, title: 'High-Speed Fiber Internet & Utilities', amount: 125, category: 'Bills', date: new Date(now.getFullYear(), now.getMonth(), 7), paymentMethod: 'Debit Card' },
        { user: user._id, title: 'Flight Ticket & Weekend Getaway', amount: 580, category: 'Travel', date: new Date(now.getFullYear(), now.getMonth(), 12), paymentMethod: 'Credit Card' },
        { user: user._id, title: 'Tech Gadget & Mechanical Keyboard', amount: 210, category: 'Shopping', date: new Date(now.getFullYear(), now.getMonth(), 16), paymentMethod: 'Credit Card' },
        { user: user._id, title: 'Netflix & Spotify Family Subscriptions', amount: 35, category: 'Entertainment', date: new Date(now.getFullYear(), now.getMonth(), 18), paymentMethod: 'Credit Card' },
        { user: user._id, title: 'Previous Month Rent', amount: 1650, category: 'Bills', date: new Date(now.getFullYear(), now.getMonth() - 1, 2), paymentMethod: 'Bank Transfer' },
        { user: user._id, title: 'Previous Month Groceries', amount: 480, category: 'Food', date: new Date(now.getFullYear(), now.getMonth() - 1, 14), paymentMethod: 'Debit Card' },
      ]);
    } else if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found. Please click Quick Demo Login or register.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        themePreference: user.themePreference,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, email, avatar, currency, themePreference)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar, currency, themePreference } = req.body;
    const user = await User.findById(req.user._id);

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'That email is already in use by another account',
        });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (currency) user.currency = currency;
    if (themePreference) user.themePreference = themePreference;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        currency: updatedUser.currency,
        themePreference: updatedUser.themePreference,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match our records',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
