const Expense = require('../models/Expense');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Add a new expense
 * @route   POST /api/expenses
 * @access  Public
 */
const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, date, description, paymentMethod, isSplit, splitPeopleCount, splitPeopleNames, isSettled } = req.body;

  const expense = await Expense.create({
    amount,
    category,
    date: date || new Date(),
    description,
    paymentMethod,
    isSplit,
    splitPeopleCount,
    splitPeopleNames,
    isSettled,
  });

  return ApiResponse.success(res, 'Expense created successfully', expense, 201);
});

/**
 * @desc    View all expenses (with search, pagination, sorting, and filtering)
 * @route   GET /api/expenses
 * @access  Public
 */
const getExpenses = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'date:desc',
    q, // Search query
    category,
    paymentMethod,
    startDate,
    endDate,
    minAmount,
    maxAmount,
  } = req.query;

  // Build filter object
  const filter = {};

  // Text search on description or category
  if (q) {
    filter.$or = [
      { description: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
    ];
  }

  // Exact filters
  if (category) {
    filter.category = { $regex: `^${category}$`, $options: 'i' };
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  // Date range filter
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      // Set to end of the day (23:59:59.999) for inclusive range
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  // Amount range filter
  if (minAmount || maxAmount) {
    filter.amount = {};
    if (minAmount) {
      filter.amount.$gte = Number(minAmount);
    }
    if (maxAmount) {
      filter.amount.$lte = Number(maxAmount);
    }
  }

  // Pagination parameters
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  let sortObj = { date: -1 }; // default: newest first
  if (sortBy) {
    const [field, order] = sortBy.split(':');
    sortObj = { [field]: order === 'asc' ? 1 : -1 };
  }

  // Query database
  const expenses = await Expense.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum);

  const totalItems = await Expense.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limitNum);

  const pagination = {
    totalItems,
    totalPages,
    currentPage: pageNum,
    limit: limitNum,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1,
  };

  return ApiResponse.paginated(res, 'Expenses retrieved successfully', expenses, pagination);
});

/**
 * @desc    View a single expense by ID
 * @route   GET /api/expenses/:id
 * @access  Public
 */
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    throw new ApiError(404, `Expense not found with ID: ${req.params.id}`);
  }

  return ApiResponse.success(res, 'Expense retrieved successfully', expense);
});

/**
 * @desc    Update an expense by ID
 * @route   PUT /api/expenses/:id
 * @access  Public
 */
const updateExpense = asyncHandler(async (req, res) => {
  const { amount, category, date, description, paymentMethod, isSplit, splitPeopleCount, splitPeopleNames, isSettled } = req.body;

  const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    { amount, category, date, description, paymentMethod, isSplit, splitPeopleCount, splitPeopleNames, isSettled },
    { new: true, runValidators: true }
  );

  if (!expense) {
    throw new ApiError(404, `Expense not found with ID: ${req.params.id}`);
  }

  return ApiResponse.success(res, 'Expense updated successfully', expense);
});

/**
 * @desc    Delete an expense by ID
 * @route   DELETE /api/expenses/:id
 * @access  Public
 */
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);

  if (!expense) {
    throw new ApiError(404, `Expense not found with ID: ${req.params.id}`);
  }

  return ApiResponse.success(res, 'Expense deleted successfully', null);
});

/**
 * @desc    Filter expenses by category (Path parameter version)
 * @route   GET /api/expenses/category/:category
 * @access  Public
 */
const getExpensesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { category: { $regex: `^${category}$`, $options: 'i' } };

  const expenses = await Expense.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const totalItems = await Expense.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const pagination = {
    totalItems,
    totalPages,
    currentPage: page,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return ApiResponse.paginated(
    res,
    `Expenses in category '${category}' retrieved successfully`,
    expenses,
    pagination
  );
});

/**
 * @desc    Get monthly, category-wise and total stats for visual analytics
 * @route   GET /api/expenses/stats
 * @access  Public
 */
const getExpenseStats = asyncHandler(async (req, res) => {
  // 1. Total expense calculation
  const totalStats = await Expense.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalAmount = totalStats.length > 0 ? totalStats[0].totalAmount : 0;
  const totalCount = totalStats.length > 0 ? totalStats[0].count : 0;

  // 2. Category-wise Analysis
  const categoryStats = await Expense.aggregate([
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  // 3. Monthly Summary (for the current and past months)
  const monthlyStats = await Expense.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 } // Limit to past 12 months
  ]);

  // Format monthly response for easier graphing
  const formattedMonthly = monthlyStats.map(item => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return {
      year: item._id.year,
      month: item._id.month,
      monthName: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      totalAmount: item.totalAmount,
      count: item.count
    };
  });

  return ApiResponse.success(res, 'Analytics stats retrieved successfully', {
    total: {
      amount: totalAmount,
      count: totalCount,
    },
    categoryBreakdown: categoryStats.map(item => ({
      category: item._id,
      totalAmount: item.totalAmount,
      count: item.count,
    })),
    monthlySummary: formattedMonthly,
  });
});

const deleteAllExpenses = asyncHandler(async (req, res) => {
  await Expense.deleteMany({});
  return ApiResponse.success(res, 'All expenses deleted successfully', null);
});

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getExpenseStats,
  deleteAllExpenses,
};
