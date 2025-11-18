const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const responseHandler = require('./middleware/response.cjs');
const globalErrorHandler = require('./middleware/globalError.cjs');
const authenticateVitePress = require('./middleware/vitepressAuth.cjs');
const proxyVitePress = require('./proxyVitepress.cjs');
const apiRoutes = require('./routes/index.cjs');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.EXPRESS_PORT || 3000;
const VITE_PRESS_DEV_URL = `http://localhost:${process.env.VITE_PRESS_PORT}`;
const outputDir = '../' + (process.env.VITE_PRESS_OUTPUT_DIR || './.vitepress/dist');
const vitePressPath = path.join(__dirname, outputDir);

const app = express();

// 解析 application/json
app.use(express.json());

// 解析 application/x-www-form-urlencoded (表单)
app.use(express.urlencoded({ extended: true }));

// 全局响应处理
app.use(responseHandler);

// 接口路由
app.use('/api', apiRoutes);

// 验证vitePress私密路由
app.use(authenticateVitePress);

// 根据环境代理vitePress资源
proxyVitePress(app, { isProd, vitePressPath, VITE_PRESS_DEV_URL });

// 全局错误处理
app.use(globalErrorHandler);

app.listen(PORT, (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
  console.log('isProd', isProd);
  console.log(`🔧 Server running on http://localhost:${PORT}`);
});