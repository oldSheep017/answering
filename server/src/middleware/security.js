const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

/**
 * 安全中间件配置
 * 提供基本的安全防护功能
 */

/**
 * CORS 配置
 */
const corsOptions = {
  origin: function (origin, callback) {
    // 允许的域名列表
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ];

    // 开发环境允许所有来源
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }

    // 生产环境检查来源
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的来源'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
};

/**
 * 速率限制配置
 */
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: {
        message: message || '请求过于频繁，请稍后再试',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// 通用速率限制
const generalLimiter = createRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分钟
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100次请求
  '请求过于频繁，请稍后再试'
);

// API 速率限制
const apiLimiter = createRateLimit(
  15 * 60 * 1000, // 15分钟
  100, // 100次请求
  'API 请求过于频繁，请稍后再试'
);

// 严格速率限制（用于敏感操作）
const strictLimiter = createRateLimit(
  5 * 60 * 1000, // 5分钟
  10, // 10次请求
  '操作过于频繁，请稍后再试'
);

/**
 * Helmet 安全配置
 */
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
};

/**
 * 应用安全中间件
 * @param {Object} app - Express 应用实例
 */
const applySecurityMiddleware = (app) => {
  // 基础安全头
  app.use(helmet(helmetConfig));

  // CORS
  app.use(cors(corsOptions));

  // 速率限制
  app.use('/api/', generalLimiter);
  app.use('/api/questions', apiLimiter);
  app.use('/api/history', apiLimiter);

  // 移除 X-Powered-By 头
  app.disable('x-powered-by');

  // 设置安全头
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
};

module.exports = {
  corsOptions,
  generalLimiter,
  apiLimiter,
  strictLimiter,
  applySecurityMiddleware,
}; 