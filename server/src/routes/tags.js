const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

// 获取所有标签
router.get('/', tagController.getTags);
// 创建新标签
router.post('/', tagController.createTag);
// 更新标签
router.put('/:id', tagController.updateTag);
// 删除标签
router.delete('/:id', tagController.deleteTag);

module.exports = router; 