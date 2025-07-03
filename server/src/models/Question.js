const mongoose = require('mongoose');

/**
 * 题目数据模型
 * 支持选择题和填空题两种类型
 */
const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['choice', 'fill'],
      required: true,
      default: 'choice',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      default: [],
      validate: {
        validator: function (options) {
          // 选择题必须有4个选项
          if (this.type === 'choice') {
            return options.length === 4;
          }
          // 填空题不需要选项
          return true;
        },
        message: '选择题必须包含4个选项',
      },
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tag',
        },
      ],
      default: [],
      validate: {
        validator: function (tags) {
          return tags.length <= 10; // 最多10个标签
        },
        message: '标签数量不能超过10个',
      },
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// 创建索引以提高查询性能
questionSchema.index({ type: 1, tags: 1 });
questionSchema.index({ isActive: 1 });
questionSchema.index({ createdAt: -1 });

// 虚拟字段：题目类型的中文描述
questionSchema.virtual('typeText').get(function () {
  return this.type === 'choice' ? '选择题' : '填空题';
});

// 确保虚拟字段在JSON序列化时包含
questionSchema.set('toJSON', { virtuals: true });
questionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Question', questionSchema);
