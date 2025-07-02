const mongoose = require('mongoose');

/**
 * 标签模型
 * name: 标签名称，唯一且必填
 * desc: 标签描述，可选
 * color: 标签颜色，可选
 */
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 32
  },
  desc: {
    type: String,
    default: '',
    maxlength: 128
  },
  color: {
    type: String,
    default: '#4361ee',
    maxlength: 16
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tag', tagSchema); 