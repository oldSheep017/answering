const express = require('express');
const {
  getHistories,
  getHistory,
  createHistory,
  generateRandomTest,
  submitTest,
  getScoreStats,
  deleteHistory,
} = require('../controllers/historyController');

const router = express.Router();

/**
 * 历史记录路由
 * 提供答题历史和测试功能
 */

// 获取历史记录列表
router.get('/', getHistories);

// 获取成绩统计
router.get('/stats', getScoreStats);

// 获取单个历史记录详情
router.get('/:id', getHistory);

// 创建新的答题记录
router.post('/', createHistory);

// 生成随机试卷
router.post('/generate-test', generateRandomTest);

// 提交答题结果
router.post('/submit-test', submitTest);

// 删除历史记录
router.delete('/:id', deleteHistory);

module.exports = router; 