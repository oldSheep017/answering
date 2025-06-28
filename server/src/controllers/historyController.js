const History = require('../models/History');
const Question = require('../models/Question');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * 历史记录控制器
 * 提供答题历史和统计功能
 */

/**
 * 获取历史记录列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getHistories = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    userId = 'anonymous',
    startDate,
    endDate,
    sortBy = 'date',
    sortOrder = 'desc',
  } = req.query;

  // 构建查询条件
  const query = { userId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // 构建排序条件
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // 分页
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const histories = await History.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const total = await History.countDocuments(query);

  res.json({
    success: true,
    data: {
      histories,
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
 * 获取单个历史记录详情
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const history = await History.findById(id).lean();

  if (!history) {
    throw new AppError('历史记录不存在', 404);
  }

  res.json({
    success: true,
    data: history,
  });
});

/**
 * 创建新的答题记录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const createHistory = asyncHandler(async (req, res) => {
  const {
    userId = 'anonymous',
    score,
    totalQuestions,
    correctAnswers,
    timeSpent,
    details,
    tags,
    testType,
  } = req.body;

  // 验证数据
  if (!score || !totalQuestions || !correctAnswers || !timeSpent || !details) {
    throw new AppError('缺少必要的答题数据', 400);
  }

  if (!Array.isArray(details) || details.length === 0) {
    throw new AppError('答题详情不能为空', 400);
  }

  const history = await History.create({
    userId,
    score,
    totalQuestions,
    correctAnswers,
    timeSpent,
    details,
    tags: tags || [],
    testType: testType || 'random',
  });

  res.status(201).json({
    success: true,
    data: history,
  });
});

/**
 * 生成随机试卷
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const generateRandomTest = asyncHandler(async (req, res) => {
  const {
    questionCount = 10,
    types = ['choice', 'fill'],
    tags,
    difficulty,
  } = req.body;

  // 构建查询条件
  const query = { isActive: true };

  if (types && types.length > 0) {
    query.type = { $in: types };
  }

  if (tags && tags.length > 0) {
    query.tags = { $in: tags };
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  // 获取符合条件的题目总数
  const totalQuestions = await Question.countDocuments(query);

  if (totalQuestions < questionCount) {
    throw new AppError(
      `题库中符合条件的题目不足 ${questionCount} 道，当前只有 ${totalQuestions} 道`,
      400
    );
  }

  // 随机选择题目
  const questions = await Question.aggregate([
    { $match: query },
    { $sample: { size: parseInt(questionCount) } },
    {
      $project: {
        _id: 1,
        type: 1,
        title: 1,
        options: 1,
        tags: 1,
        difficulty: 1,
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      questions,
      testInfo: {
        questionCount: questions.length,
        types,
        tags,
        difficulty,
        generatedAt: new Date().toISOString(),
      },
    },
  });
});

/**
 * 提交答题结果
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const submitTest = asyncHandler(async (req, res) => {
  const {
    userId = 'anonymous',
    questions,
    answers,
    timeSpent,
    tags,
    testType,
  } = req.body;

  if (!questions || !answers || !timeSpent) {
    throw new AppError('缺少必要的答题数据', 400);
  }

  if (questions.length !== answers.length) {
    throw new AppError('题目数量与答案数量不匹配', 400);
  }

  // 获取正确答案并计算得分
  const questionIds = questions.map(q => q._id);
  const correctQuestions = await Question.find({
    _id: { $in: questionIds },
  }).lean();

  const questionMap = new Map(
    correctQuestions.map(q => [q._id.toString(), q])
  );

  let correctAnswers = 0;
  const details = [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const userAnswer = answers[i];
    const correctQuestion = questionMap.get(question._id);

    if (!correctQuestion) continue;

    const isCorrect = userAnswer.trim().toLowerCase() === 
                     correctQuestion.answer.trim().toLowerCase();

    if (isCorrect) correctAnswers++;

    details.push({
      questionId: question._id,
      userAnswer,
      isCorrect,
      questionType: question.type,
      questionTitle: question.title,
      correctAnswer: correctQuestion.answer,
      options: question.options || [],
    });
  }

  const score = Math.round((correctAnswers / questions.length) * 100);

  // 创建历史记录
  const history = await History.create({
    userId,
    score,
    totalQuestions: questions.length,
    correctAnswers,
    timeSpent,
    details,
    tags: tags || [],
    testType: testType || 'random',
  });

  res.status(201).json({
    success: true,
    data: {
      history,
      result: {
        score,
        correctAnswers,
        totalQuestions: questions.length,
        accuracy: Math.round((correctAnswers / questions.length) * 100),
        timeSpent,
      },
    },
  });
});

/**
 * 获取成绩统计
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getScoreStats = asyncHandler(async (req, res) => {
  const { userId = 'anonymous', days = 30 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  // 获取时间范围内的历史记录
  const histories = await History.find({
    userId,
    date: { $gte: startDate },
  })
    .sort({ date: 1 })
    .lean();

  // 计算统计数据
  const stats = {
    totalTests: histories.length,
    averageScore: 0,
    bestScore: 0,
    worstScore: 100,
    totalQuestions: 0,
    totalCorrect: 0,
    averageTime: 0,
  };

  if (histories.length > 0) {
    const totalScore = histories.reduce((sum, h) => sum + h.score, 0);
    const totalTime = histories.reduce((sum, h) => sum + h.timeSpent, 0);
    const totalQ = histories.reduce((sum, h) => sum + h.totalQuestions, 0);
    const totalC = histories.reduce((sum, h) => sum + h.correctAnswers, 0);

    stats.averageScore = Math.round(totalScore / histories.length);
    stats.bestScore = Math.max(...histories.map(h => h.score));
    stats.worstScore = Math.min(...histories.map(h => h.score));
    stats.totalQuestions = totalQ;
    stats.totalCorrect = totalC;
    stats.averageTime = Math.round(totalTime / histories.length);
  }

  // 按日期分组的数据（用于图表）
  const dailyStats = histories.reduce((acc, history) => {
    const date = history.date.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        date,
        score: 0,
        count: 0,
        questions: 0,
        correct: 0,
      };
    }
    acc[date].score += history.score;
    acc[date].count += 1;
    acc[date].questions += history.totalQuestions;
    acc[date].correct += history.correctAnswers;
    return acc;
  }, {});

  // 转换为数组并计算平均值
  const chartData = Object.values(dailyStats).map(day => ({
    date: day.date,
    averageScore: Math.round(day.score / day.count),
    testCount: day.count,
    accuracy: Math.round((day.correct / day.questions) * 100),
  }));

  res.json({
    success: true,
    data: {
      stats,
      chartData,
    },
  });
});

/**
 * 删除历史记录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const deleteHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const history = await History.findById(id);

  if (!history) {
    throw new AppError('历史记录不存在', 404);
  }

  await History.findByIdAndDelete(id);

  res.json({
    success: true,
    message: '历史记录删除成功',
  });
});

module.exports = {
  getHistories,
  getHistory,
  createHistory,
  generateRandomTest,
  submitTest,
  getScoreStats,
  deleteHistory,
}; 