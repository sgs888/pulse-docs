import Teek from 'vitepress-theme-teek';
import TeekLayoutProvider from './components/TeekLayoutProvider.vue';

// Vite Press样式增强
import 'vitepress-theme-teek/index.css';
import 'vitepress-theme-teek/vp-plus/code-block-mobile.scss'; // 移动端代码块样式优化
import 'vitepress-theme-teek/vp-plus/sidebar.scss'; // 侧边栏优化
import 'vitepress-theme-teek/vp-plus/nav.scss'; // 导航栏优化
import 'vitepress-theme-teek/vp-plus/aside.scss'; // 右侧目栏录文字悬停和激活样式
import 'vitepress-theme-teek/vp-plus/doc-h1-gradient.scss'; // 一级标题渐变色
import 'vitepress-theme-teek/vp-plus/table.scss'; // 表格样式调整，去掉单元格之间的线条
import 'vitepress-theme-teek/vp-plus/mark.scss'; // <mark></mark> 样式
import 'vitepress-theme-teek/vp-plus/blockquote.scss'; // > 引用块样式
import 'vitepress-theme-teek/vp-plus/index-rainbow.scss'; // 首页图片彩虹动画
import 'vitepress-theme-teek/vp-plus/doc-fade-in.scss'; // 文章淡入淡出
// import 'vitepress-theme-teek/vp-plus/nav-blur.scss'; // 导航栏毛玻璃样式

// Teek 样式增强
import 'vitepress-theme-teek/tk-plus/banner-desc-gradient.scss'; // 博客风格 Banner 描述渐变样式
import 'vitepress-theme-teek/tk-plus/home-card-hover.scss'; // 首页卡片悬停效果
import 'vitepress-theme-teek/tk-plus/fade-up-animation.scss'; // 首次加载的动画效果

import './styles/code-bg.scss';
import './styles/iframe.scss';
import './styles/sidebar-icon.scss';
import './styles/home-card.scss';
import './styles/transparent.scss';
import './styles/blur.scss';
import './styles/cursor/index.scss';

export default {
  extends: Teek,
  Layout: TeekLayoutProvider
};
