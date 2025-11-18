/**
 * 成功响应构建器
 * @param {Object} res - Express Response 对象
 * @param {*} data - 要返回的数据 (可选)
 * @param {string} message - 消息文本 (可选, 默认 '操作成功')
 * @param {number} code - HTTP 状态码 (可选, 默认 200)
 */
function success(res, data, message = '操作成功', code = 200) {
  return res.json({
    success: true,
    code,
    message,
    data: data !== undefined ? data : null // 如果没有数据，返回 null 而不是 undefined
  });
}

/**
 * 失败响应构建器
 * @param {Object} res - Express Response 对象
 * @param {string} message - 错误消息
 * @param {number} code - HTTP 状态码 (可选, 默认 400)
 * @param {*} errors - 具体错误详情 (可选)
 */
function error(res, message, code = 400, errors) {
  const response = {
    success: false,
    code,
    message
  };
  const hasErrors = errors !== undefined;
  if (hasErrors) {
    response.error = errors;
  }
  return res.status(hasErrors ? code : 200).json(response);
}

/**
 * 快捷方法：参数验证失败
 */
function validationError(res, errors) {
  return error(res, '请求参数无效', 400, errors);
}

/**
 * 快捷方法：未授权
 */
function unauthorized(res, message = '未授权访问') {
  return error(res, message, 401);
}

/**
 * 快捷方法：资源未找到
 */
function notFound(res, message = '资源未找到') {
  return error(res, message, 404);
}

/**
 * 快捷方法：服务器内部错误
 */
function serverError(res, message = '服务器内部错误', errors) {
  return error(res, message, 500, errors);
}

// 导出所有方法
module.exports = {
  success,
  error,
  validationError,
  unauthorized,
  notFound,
  serverError
};