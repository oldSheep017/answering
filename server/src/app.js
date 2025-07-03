const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// 导入中间件和路由
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { applySecurityMiddleware } = require('./middleware/security');
const database = require('./config/database');

// 导入路由
const questionRoutes = require('./routes/questions');
const historyRoutes = require('./routes/history');
const tagRoutes = require('./routes/tags');

const app = express();
const PORT = process.env.PORT || 5000;

// 允许所有来源跨域（开发环境可用，生产建议指定域名）
app.use(cors());

/**
 * 连接数据库
 */
const connectDatabase = async () => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5秒
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 尝试连接数据库 (第 ${attempt}/${maxRetries} 次)...`);
      await database.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/question-bank');
      console.log('✅ 数据库连接成功');
      return;
    } catch (error) {
      console.error(`❌ 数据库连接失败 (第 ${attempt}/${maxRetries} 次):`, error.message);
      
      if (attempt === maxRetries) {
        console.error('❌ 数据库连接最终失败，退出程序');
        process.exit(1);
      }
      
      console.log(`⏳ ${retryDelay / 1000} 秒后重试...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

/**
 * 应用中间件
 */
const applyMiddleware = () => {
  // 安全中间件
  // applySecurityMiddleware(app);

  // 请求体解析
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 日志中间件
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // 静态文件服务
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
};

/**
 * 应用路由
 */
const applyRoutes = () => {
  // API 路由
  app.use('/api/questions', questionRoutes);
  app.use('/api/history', historyRoutes);
  app.use('/api/tags', tagRoutes);

  // 健康检查
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: '服务器运行正常',
      timestamp: new Date().toISOString(),
      database: database.getConnectionStatus() ? 'connected' : 'disconnected',
    });
  });

  // API 根路径
  app.get('/api', (req, res) => {
    res.json({
      success: true,
      message: '题库管理系统 API',
      version: '1.0.0',
      endpoints: {
        questions: '/api/questions',
        history: '/api/history',
        health: '/health',
      },
    });
  });
};

/**
 * 应用错误处理
 */
const applyErrorHandling = () => {
  // 404 错误处理
  app.use(notFound);

  // 全局错误处理
  app.use(errorHandler);
};

/**
 * 启动服务器
 */
const startServer = async () => {
  try {
    // 连接数据库
    await connectDatabase();

    // 应用中间件
    applyMiddleware();

    // 应用路由
    applyRoutes();

    // 应用错误处理
    applyErrorHandling();

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器启动成功`);
      console.log(`📍 端口: ${PORT}`);
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 数据库: ${database.getConnectionStatus() ? '已连接' : '未连接'}`);
      console.log(`🔗 API 地址: http://localhost:${PORT}/api`);
      console.log(`💚 健康检查: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('🛑 收到 SIGTERM 信号，正在关闭服务器...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 收到 SIGINT 信号，正在关闭服务器...');
  await database.disconnect();
  process.exit(0);
});

// 启动服务器
startServer();

module.exports = app; 
  process.exit(0);
});

// 启动服务器
startServer();

module.exports = app;
