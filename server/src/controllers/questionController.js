const Question = require('../models/Question');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * 题目管理控制器
 * 提供题目的增删改查功能
 */

/**
 * 获取题目列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getQuestions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    type,
    tags,
    difficulty,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // 构建查询条件
  const query = { isActive: true };

  if (type) query.type = type;
  if (difficulty) query.difficulty = difficulty;
  if (tags) {
    const tagArray = tags.split(',').map((tag) => tag.trim());
    query.tags = { $in: tagArray };
  }
  if (search) {
    query.$or = [{ title: { $regex: search, $options: 'i' } }];
  }

  // 构建排序条件
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // 分页
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const questions = await Question.find(query)
    .populate('tags', 'name color desc')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const total = await Question.countDocuments(query);

  res.json({
    success: true,
    data: {
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

/**
 * 获取单个题目详情
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const question = await Question.findById(id)
    .populate('tags', 'name color desc')
    .lean();

  if (!question) {
    throw new AppError('题目不存在', 404);
  }

  res.json({
    success: true,
    data: question,
  });
});

/**
 * 创建新题目
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const createQuestion = asyncHandler(async (req, res) => {
  const { type, title, options, answer, tags, difficulty } = req.body;

  // 验证选择题必须有选项
  if (
    type === 'choice' &&
    (!options || options.length < 2 || options.length > 8)
  ) {
    throw new AppError('选择题选项数量必须为2~8个', 400);
  }

  const question = await Question.create({
    type,
    title,
    options: type === 'choice' ? options : [],
    answer,
    tags: tags || [],
    difficulty: difficulty || 'medium',
  });

  res.status(201).json({
    success: true,
    data: question,
  });
});

/**
 * 更新题目
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const updateQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, title, options, answer, tags, difficulty } = req.body;

  const question = await Question.findById(id);

  if (!question) {
    throw new AppError('题目不存在', 404);
  }

  // 验证选择题必须有选项
  if (
    type === 'choice' &&
    (!options || options.length < 2 || options.length > 8)
  ) {
    throw new AppError('选择题选项数量必须为2~8个', 400);
  }

  const updatedQuestion = await Question.findByIdAndUpdate(
    id,
    {
      type,
      title,
      options: type === 'choice' ? options : [],
      answer,
      tags: tags || [],
      difficulty: difficulty || 'medium',
    },
    { new: true, runValidators: true }
  ).populate('tags', 'name color desc');

  res.json({
    success: true,
    data: updatedQuestion,
  });
});

/**
 * 删除题目
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const question = await Question.findById(id);

  if (!question) {
    throw new AppError('题目不存在', 404);
  }

  // 软删除
  await Question.findByIdAndUpdate(id, { isActive: false });

  res.json({
    success: true,
    message: '题目删除成功',
  });
});

/**
 * 批量导入题目
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const importQuestions = asyncHandler(async (req, res) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new AppError('请提供有效的题目数据', 400);
  }

  // 验证题目数据
  const validQuestions = questions.filter((q) => {
    if (!q.type || !q.title || !q.answer) return false;
    if (
      q.type === 'choice' &&
      (!q.options || q.options.length < 2 || q.options.length > 8)
    )
      return false;
    return true;
  });

  if (validQuestions.length !== questions.length) {
    throw new AppError('部分题目数据格式不正确', 400);
  }

  const createdQuestions = await Question.insertMany(validQuestions);

  res.status(201).json({
    success: true,
    data: {
      imported: createdQuestions.length,
      questions: createdQuestions,
    },
  });
});

/**
 * 导出题目
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const exportQuestions = asyncHandler(async (req, res) => {
  const { type, tags } = req.query;

  const query = { isActive: true };
  if (type) query.type = type;
  if (tags) {
    const tagArray = tags.split(',').map((tag) => tag.trim());
    query.tags = { $in: tagArray };
  }

  const questions = await Question.find(query)
    .populate('tags', 'name color desc')
    .select('-__v -createdAt -updatedAt')
    .lean();

  res.json({
    success: true,
    data: {
      questions,
      exportTime: new Date().toISOString(),
      total: questions.length,
    },
  });
});

/**
 * 获取题目统计信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getQuestionStats = asyncHandler(async (req, res) => {
  const stats = await Question.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        choiceCount: {
          $sum: { $cond: [{ $eq: ['$type', 'choice'] }, 1, 0] },
        },
        fillCount: {
          $sum: { $cond: [{ $eq: ['$type', 'fill'] }, 1, 0] },
        },
        easyCount: {
          $sum: { $cond: [{ $eq: ['$difficulty', 'easy'] }, 1, 0] },
        },
        mediumCount: {
          $sum: { $cond: [{ $eq: ['$difficulty', 'medium'] }, 1, 0] },
        },
        hardCount: {
          $sum: { $cond: [{ $eq: ['$difficulty', 'hard'] }, 1, 0] },
        },
      },
    },
  ]);

  // 获取标签统计
  const tagStats = await Question.aggregate([
    { $match: { isActive: true } },
    { $unwind: '$tags' },
    {
      $lookup: {
        from: 'tags',
        localField: 'tags',
        foreignField: '_id',
        as: 'tagInfo',
      },
    },
    {
      $group: {
        _id: { $arrayElemAt: ['$tagInfo._id', 0] },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.json({
    success: true,
    data: {
      ...stats[0],
      tagStats,
    },
  });
});

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  importQuestions,
  exportQuestions,
  getQuestionStats,
};
