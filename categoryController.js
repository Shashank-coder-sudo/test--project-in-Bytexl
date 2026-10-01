const Category = require('../models/Category');

// @desc    Get all categories (defaults + user custom)
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    // Ensure default categories exist
    await Category.seedDefaults();

    const categories = await Category.find({
      $or: [{ isDefault: true }, { user: req.user._id }],
    }).sort({ type: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a custom user category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res, next) => {
  try {
    const { name, type, color, icon } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category name and type (income or expense)',
      });
    }

    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      type,
      $or: [{ isDefault: true }, { user: req.user._id }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists',
      });
    }

    const category = await Category.create({
      name,
      type,
      color: color || '#6366f1',
      icon: icon || 'tag',
      user: req.user._id,
      isDefault: false,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Default system categories cannot be deleted',
      });
    }

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this category',
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
