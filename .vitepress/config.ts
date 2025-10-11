import { defineConfig, DefaultTheme } from 'vitepress';
import { teekConfig } from './theme/config/teekConfig';
import { siteConfig, headerConfig } from './siteConfig';

type VpConfig = DefaultTheme.Config;
const { title } = siteConfig;
const {
  nav,
  navSocial,
  localSearch
} = headerConfig;

const generateSocialLinks = () => {
  if (!navSocial || (!navSocial.gitee && !navSocial.github)) {
    return undefined;
  }
  const links = [];
  if (navSocial.github) {
    links.push({
      icon: 'github',
      link: navSocial.github,
    });
  }
  if (navSocial.gitee) {
    links.push({
      icon: 'gitee',
      link: navSocial.gitee,
    });
  }
  return links;
}

const search: VpConfig['search'] = {
  provider: 'local',
  options: {
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        displayDetails: '显示详情',
        resetButtonTitle: '重置',
        backButtonTitle: '返回',
        noResultsText: '无法找到相关结果',
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
        }
      }
    }
  }
}

export default defineConfig({
  extends: teekConfig,
  title,
  base: '/',
  srcDir: 'docs',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    siteTitle: title,
    logo: '/logo.png',
    // 顶部导航
    nav,
    // 社交链接
    socialLinks: generateSocialLinks(),
    // 全局搜索
    search: localSearch ? search : undefined,
    outline: {
      level: 'deep',
      label: '本页导航',
    },
    lastUpdated: {
      text: '最后更新时间',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  },
  vite: {
    publicDir: '../public'
  }
});
