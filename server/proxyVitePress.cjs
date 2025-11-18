const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

// 检查代理服务器是否可以连接
async function checkVitePressDevServer(url) {
  const requestPromise = async () => {
    return fetch(url, { method: 'GET' }).then(response => {
      if (response.ok) {
        return true;
      } else {
        console.warn(`\n⚠️  VitePress server responded with status: ${response.status}`);
        return false;
      }
    }).catch((error) => {
      console.warn(`\n⚠️  Network error when checking VitePress server:`, error.message);
      return false;
    });
  }

  let timer = null;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => {
      console.warn(`\n⚠️  Health check for ${url} timed out after 5 seconds.`);
      resolve(false);
    }, 5000);
  });

  return Promise.race([requestPromise(), timeoutPromise]).finally(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
}

function proxyVitePress(app, options) {
  const { isProd, VITE_PRESS_DEV_URL, vitePressPath } = options;

  if (isProd) {
    app.use(express.static(vitePressPath));
    app.use('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(vitePressPath, 'index.html'), (err) => {
        if (err) {
          next(err);
        }
      });
    });
  } else {
    console.log('💡 In dev mode, static files are served by VitePress dev server.');

    // 检测VitePress服务
    checkVitePressDevServer(VITE_PRESS_DEV_URL)
    .then(isUp => {
      if (isUp) {
        console.log(`✅ VitePress dev server is UP and running at ${VITE_PRESS_DEV_URL}`);
      } else {
        console.error(`🚨 VitePress dev server (${VITE_PRESS_DEV_URL}) is DOWN or unreachable!`);
        console.error('Page requests will likely fail. Please start the VitePress dev server.');
        console.error('Run: npm run docs:dev (or your VitePress start command)\n');
      }
    })
    .catch(console.error);

    const vitePressProxy = createProxyMiddleware({
      target: VITE_PRESS_DEV_URL,
      changeOrigin: true,
      ws: true,
      logLevel: 'info',
      timeout: 30000,
      proxyTimeout: 30000,
      onError: (err, req, res) => {
        console.error('❌ Proxy Error:', err.message);
        if (!res.headersSent) {
          res.status(502).send('Bad Gateway: Cannot reach VitePress dev server.');
        }
      }
    });

    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      return vitePressProxy(req, res, next);
    });
  }
}

module.exports = proxyVitePress;