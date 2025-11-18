const jwt = require('jsonwebtoken');
const { getPublicPem, getPrivatePem } = require('../utils/crypto.cjs');

/**
 * 使用 RSA 私钥生成 JWT Token (算法: RS256)
 * @param {Object} payload - 要编码的数据
 * @param {string|number} expiresIn - 过期时间
 * @returns {string} 签名后的 Token
 */
function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, getPrivatePem(), {
    algorithm: 'RS256', // ✅ 指定使用 RS256 算法
    expiresIn
  });
}

/**
 * 使用 RSA 公钥验证 JWT Token
 * @param {string} token - 要验证的 Token
 * @returns {Object|null} 解码后的 payload 或 null
 */
function verifyToken(token) {
  try {
    // jwt.verify 会自动使用公钥验证 RS256 签名
    return jwt.verify(token, getPublicPem(), { algorithms: ['RS256'] });
  } catch (error) {
    console.error('Token 验证失败:', error.message);
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken
};