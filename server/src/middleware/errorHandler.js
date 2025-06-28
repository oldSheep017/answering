/**
 * 全局错误处理中间件
 * 统一处理应用中的错误响应
 */

/**
 * 自定义错误类
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 记录错误日志
  console.error('❌ 错误详情:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Mongoose 重复键错误
  if (err.code === 11000) {
    const message = '数据已存在，请检查输入内容';
    error = new AppError(message, 400);
  }

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // Mongoose 无效 ObjectId
  if (err.name === 'CastError') {
    const message = '无效的资源ID';
    error = new AppError(message, 400);
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    const message = '无效的令牌';
    error = new AppError(message, 401);
  }

  // JWT 过期错误
  if (err.name === 'TokenExpiredError') {
    const message = '令牌已过期';
    error = new AppError(message, 401);
  }

  // 默认错误响应
  const statusCode = error.statusCode || 500;
  const message = error.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * 异步错误包装器
 * 用于包装异步路由处理器，自动捕获错误
 * @param {Function} fn - 异步函数
 * @returns {Function} 包装后的函数
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 错误处理
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const notFound = (req, res, next) => {
  const error = new AppError(`路径 ${req.originalUrl} 不存在`, 404);
  next(error);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
  notFound,
}; 