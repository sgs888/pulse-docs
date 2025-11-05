#!/usr/bin/env node
require('dotenv').config();

const { build } = require('esbuild');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const command = process.argv[2];

switch (command) {
  case 'dev':
    startDevServer();
    break;
  case 'build':
    buildProduction();
    break;
  default:
    console.log('❌ Unknown command. Usage:');
    console.log('   node build-server.js dev    - Start development server with nodemon');
    console.log('   node build-server.js build  - Build production bundle');
    process.exit(1);
}

// 启动开发服务器
function startDevServer() {
  console.log('🚀 Starting development server...');

  // 检查 nodemon 是否安装
  const nodemonPath = require.resolve('nodemon/bin/nodemon');

  // 使用 spawn 启动 nodemon 进程，并继承当前进程的 stdio
  const child = spawn(
    'node',
    [nodemonPath, 'server/index.cjs'],
    { stdio: 'inherit' } // 关键！让子进程的输出显示在父进程的终端上
  );

  // 监听子进程退出
  child.on('close', (code) => {
    console.log(`Development server stopped with code ${code}`);
    process.exit(code);
  });

  // 监听错误
  child.on('error', (err) => {
    console.error('❌ Failed to start nodemon:', err);
    process.exit(1);
  });
}

function spawnAsync(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: process.env,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ code });
      } else {
        reject(new Error(`stopped with code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

// 构建生产版本
async function buildProduction() {
  const NODE_ENV = process.env.NODE_ENV || 'production';
  const isProduction = NODE_ENV === 'production';
  const vitePressOutDir = '../' + (process.env.VITE_PRESS_OUTPUT_DIR || './.vitepress/dist');

  try {
    const outDir = path.join(__dirname, vitePressOutDir, 'server');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    console.log(`📦 Building VitePress bundle fro ${NODE_ENV}...`);

    // 打包VitePress
    await spawnAsync('npx', ['vitepress', 'build'], {
      stdio: 'inherit',
      shell: true,
      env: process.env,
    }).then(() => {
      console.log(`✅ VitePress built successfully.`);
    }).catch(err => {
      console.error('❌ Failed to build VitePress:', err);
    });

    console.log(`\n📦 Building server bundle for ${NODE_ENV}...`);

    const result = await build({
      entryPoints: ['server/index.cjs'],
      outfile: path.join(outDir, 'index.js'),
      platform: 'node',
      target: 'node14',
      format: 'cjs',
      bundle: true,
      minify: isProduction,
      sourcemap: !isProduction,
      external: [
        'express',
        'fs',
        'path',
        'http',
        // 添加其他你不想打包的依赖
      ],
      define: {
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      },
      logLevel: 'info',
    });

    console.log(`✅ Server bundle built successfully.`);
    console.log(`   Output: ${path.join(outDir, 'bundle.js')}`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}