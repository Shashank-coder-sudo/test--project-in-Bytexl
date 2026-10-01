const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Category type must be income or expense'],
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    icon: {
      type: String,
      default: 'tag',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means global default category
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-defined default categories
const defaultCategories = [
  { name: 'Salary', type: 'income', color: '#10b981', icon: 'wallet', isDefault: true },
  { name: 'Business', type: 'income', color: '#06b6d4', icon: 'briefcase', isDefault: true },
  { name: 'Investment', type: 'income', color: '#8b5cf6', icon: 'trending-up', isDefault: true },
  { name: 'Food', type: 'expense', color: '#ef4444', icon: 'utensils', isDefault: true },
  { name: 'Travel', type: 'expense', color: '#f59e0b', icon: 'plane', isDefault: true },
  { name: 'Shopping', type: 'expense', color: '#ec4899', icon: 'shopping-bag', isDefault: true },
  { name: 'Bills', type: 'expense', color: '#6366f1', icon: 'file-text', isDefault: true },
  { name: 'Entertainment', type: 'expense', color: '#a855f7', icon: 'film', isDefault: true },
  { name: 'Medical', type: 'expense', color: '#14b8a6', icon: 'activity', isDefault: true },
  { name: 'Education', type: 'expense', color: '#3b82f6', icon: 'book-open', isDefault: true },
  { name: 'Others', type: 'expense', color: '#64748b', icon: 'more-horizontal', isDefault: true },
];

categorySchema.statics.seedDefaults = async function () {
  try {
    const count = await this.countDocuments({ isDefault: true });
    if (count === 0) {
      await this.insertMany(defaultCategories);
      console.log('[Default Categories Seeded Successfully]');
    }
  } catch (error) {
    console.error(`[Error seeding default categories]: ${error.message}`);
  }
};

module.exports = mongoose.model('Category', categorySchema);
