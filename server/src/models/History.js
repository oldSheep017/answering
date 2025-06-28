const mongoose = require('mongoose');

/**
 * 答题历史记录数据模型
 * 记录用户的测试历史和答题详情
 */
const historySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'anonymous', // 匿名用户
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
    },
    timeSpent: {
      type: Number, // 秒数
      required: true,
      min: 0,
    },
    details: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        userAnswer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
        questionType: {
          type: String,
          enum: ['choice', 'fill'],
          required: true,
        },
        questionTitle: {
          type: String,
          required: true,
        },
        correctAnswer: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          default: [],
        },
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    testType: {
      type: String,
      enum: ['random', 'custom'],
      default: 'random',
    },
  },
  {
    timestamps: true,
  }
);

// 创建索引以提高查询性能
historySchema.index({ userId: 1, date: -1 });
historySchema.index({ date: -1 });
historySchema.index({ score: -1 });

// 虚拟字段：正确率
historySchema.virtual('accuracy').get(function () {
  if (this.totalQuestions === 0) return 0;
  return Math.round((this.correctAnswers / this.totalQuestions) * 100);
});

// 虚拟字段：格式化时间
historySchema.virtual('timeSpentFormatted').get(function () {
  const minutes = Math.floor(this.timeSpent / 60);
  const seconds = this.timeSpent % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// 确保虚拟字段在JSON序列化时包含
historySchema.set('toJSON', { virtuals: true });
historySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('History', historySchema); 