const fs = require('fs');
const path = require('path');
const authenticateToken = require('./auth.cjs');

// 读取posts.json文件
const loadPostsData = () => {
  const postsPath = path.resolve('server/posts.json');

  if (!fs.existsSync(postsPath)) {
    console.error('posts.json file not found.');
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  } catch (error) {
    console.error('Error parsing posts.json:', error);
    return {};
  }
}

// 判断是否为私密文章
const isPrivate = (posts, path) => {
  const currentPath = decodeURIComponent(path);
  const firstSegment = currentPath.split('/')[1] || '';
  const originDirs = posts.originDirs;

  console.log('iii', firstSegment);
  if (!originDirs.includes(firstSegment)) {
    return false;
  }

  const originPosts = posts.originPosts || [];
  const post = originPosts.find(item => item.url === currentPath);
  console.log('post', post);
  if (!post) {
    console.log(`未找到对应路由： ${currentPath}`);
    return false;
  }
  return Boolean(post.private);
}

function authenticateVitePress(req, res, next) {
  if (req.path.startsWith('/api')) {
    return next();
  }

  const posts = loadPostsData();

  if (isPrivate(posts, req.path)) {
    return authenticateToken(req, res, next);
  }

  return next();
}

module.exports = authenticateVitePress;