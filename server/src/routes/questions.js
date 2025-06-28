const express = require('express');
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  importQuestions,
  exportQuestions,
  getQuestionStats,
} = require('../controllers/questionController');

const router = express.Router();

/**
 * 题目管理路由
 * 提供题目的增删改查功能
 */

// 获取题目列表
router.get('/', getQuestions);

// 获取题目统计信息
router.get('/stats', getQuestionStats);

// 获取单个题目详情
router.get('/:id', getQuestion);

// 创建新题目
router.post('/', createQuestion);

// 更新题目
router.put('/:id', updateQuestion);

// 删除题目
router.delete('/:id', deleteQuestion);

// 批量导入题目
router.post('/import', importQuestions);

// 导出题目
router.get('/export', exportQuestions);

module.exports = router; 