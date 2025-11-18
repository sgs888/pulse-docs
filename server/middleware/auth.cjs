const { verifyToken } = require('../utils/jwt.cjs');

function authenticateToken(req, res, next) {
  const token = req.headers['Authorization']?.split(' ')[1];
  if (!token) {
    return res.unauthorized('无效Token');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.unauthorized('无效Token或者Token已过期，请重新登录');
  }

  req.user = decoded;
  next();
}

module.exports = authenticateToken;