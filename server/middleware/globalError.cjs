const dotenv = require('dotenv');
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

function globalErrorHandler(err, req, res, next) {
  console.error('🚨 全局错误:', err.stack || err.message || err);

  // 对未响应客户端的错误进行响应
  if (!res.headersSent) {
    res.serverError('Internal Server Error', 500, isProd ? null : err.stack);
  }
}

module.exports = globalErrorHandler;