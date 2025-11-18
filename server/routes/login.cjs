const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { getPublicPem, decryptWithPrivatePem } = require('../utils/crypto.cjs');
const { generateToken } = require('../utils/jwt.cjs');

const username = process.env.PULSE_USERNAME;
const password = process.env.PULSE_PASSWORD;
const userInfos = [
  { username, password, }
];

router.get('/getPublicPem', (req, res) => {
  const pemContent = getPublicPem();
  return res.success(pemContent);
})

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const decryptedText = decryptWithPrivatePem(password);
    const loginInfo = userInfos.find(item => item.username === username && item.password === decryptedText);
    if (loginInfo) {
      const token = generateToken(loginInfo, '3h');
      return res.success({ token, username }, '登录成功');
    } else {
      return res.unauthorized('用户名或密码错误');
    }
  } catch (error) {
    return res.error('登录失败', 500, error);
  }
});

module.exports = router;