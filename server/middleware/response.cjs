const responseUtils = require('../utils/response.cjs');

function responseHandler(req, res, next) {
  // 将 utils/response.js 中的方法绑定到当前 res 实例
  // 使用 bind(null, res) 来预设第一个参数 (res)
  res.success = responseUtils.success.bind(null, res);
  res.error = responseUtils.error.bind(null, res);
  res.validationError = responseUtils.validationError.bind(null, res);
  res.unauthorized = responseUtils.unauthorized.bind(null, res);
  res.notFound = responseUtils.notFound.bind(null, res);
  res.serverError = responseUtils.serverError.bind(null, res);

  next();
}

module.exports = responseHandler;