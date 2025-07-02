const Tag = require('../models/Tag');

/**
 * 获取所有标签
 */
exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });
    res.json(tags);
  } catch (err) {
    next(err);
  }
};

/**
 * 创建新标签
 */
exports.createTag = async (req, res, next) => {
  try {
    const { name, desc, color } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: '标签名称不能为空' });
    }
    // 名称唯一校验
    const exists = await Tag.findOne({ name: name.trim() });
    if (exists) {
      return res.status(409).json({ message: '标签名称已存在' });
    }
    const tag = await Tag.create({ name: name.trim(), desc, color });
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
};

/**
 * 更新标签
 */
exports.updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, desc, color } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: '标签名称不能为空' });
    }
    // 名称唯一校验（排除自己）
    const exists = await Tag.findOne({ name: name.trim(), _id: { $ne: id } });
    if (exists) {
      return res.status(409).json({ message: '标签名称已存在' });
    }
    const tag = await Tag.findByIdAndUpdate(id, { name: name.trim(), desc, color }, { new: true });
    if (!tag) return res.status(404).json({ message: '标签不存在' });
    res.json(tag);
  } catch (err) {
    next(err);
  }
};

/**
 * 删除标签
 */
exports.deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) return res.status(404).json({ message: '标签不存在' });
    res.json({ message: '标签已删除' });
  } catch (err) {
    next(err);
  }
}; 