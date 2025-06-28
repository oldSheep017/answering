const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 导入模型
const Question = require('../src/models/Question');

/**
 * 导入示例数据
 */
async function importSampleData() {
  try {
    // 连接数据库
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/question-bank';
    await mongoose.connect(mongoUri);
    console.log('✅ 数据库连接成功');

    // 读取示例数据
    const sampleDataPath = path.join(__dirname, '../sample-data.json');
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

    // 清空现有数据
    await Question.deleteMany({});
    console.log('🗑️ 已清空现有题目数据');

    // 导入新数据
    const questions = await Question.insertMany(sampleData.questions);
    console.log(`✅ 成功导入 ${questions.length} 道题目`);

    // 显示统计信息
    const stats = await Question.aggregate([
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
        },
      },
    ]);

    if (stats.length > 0) {
      const stat = stats[0];
      console.log('\n📊 数据统计:');
      console.log(`   总题目数: ${stat.total}`);
      console.log(`   选择题: ${stat.choiceCount}`);
      console.log(`   填空题: ${stat.fillCount}`);
      console.log(`   简单题: ${stat.easyCount}`);
      console.log(`   中等题: ${stat.mediumCount}`);
    }

    // 显示标签统计
    const tagStats = await Question.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log('\n🏷️ 标签统计:');
    tagStats.forEach(tag => {
      console.log(`   ${tag._id}: ${tag.count} 题`);
    });

    console.log('\n🎉 示例数据导入完成！');
    console.log('📍 可以访问 http://localhost:3000 查看应用');

  } catch (error) {
    console.error('❌ 导入失败:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 数据库连接已关闭');
  }
}

// 运行导入
if (require.main === module) {
  importSampleData();
}

module.exports = importSampleData; 