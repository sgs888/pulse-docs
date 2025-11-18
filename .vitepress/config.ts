import { type DefaultTheme, defineConfigWithTheme } from 'vitepress';
import type { TeekConfig } from 'vitepress-theme-teek';
import { type PulseTheme, type Md5LoginInfo, PulseLoginType } from './theme/config/pulseConfig';
import dotenv from 'dotenv';
import { teekConfig } from './theme/config/teekConfig';
import { siteConfig, headerConfig, privateConfig } from './siteConfig';

type VpConfig = DefaultTheme.Config;

dotenv.config();
const vitePressOutDir = process.env.VITE_PRESS_OUTPUT_DIR || './.vitepress/dist';
const serverPort = process.env.EXPRESS_PORT || 3000;
const vitePressPort = process.env.VITE_PRESS_PORT ? Number(process.env.VITE_PRESS_PORT) : 8000;
const isTeekPrivate = process.env.TEEK_PRIVATE === 'true';
const privateType = process.env.PULSE_PRIVATE;
const privateUsername = process.env.PULSE_USERNAME;
const privatePassword = process.env.PULSE_PASSWORD;
const { title } = siteConfig;
const {
  nav,
  navSocial,
  localSearch
} = headerConfig;

// MD5形式的登录信息，会暴露到客户端
const md5LoginInfos: Md5LoginInfo[] = [
  { username: privateUsername, password: privatePassword }
];

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

export default defineConfigWithTheme<VpConfig & TeekConfig & PulseTheme>({
  extends: teekConfig,
  title,
  base: '/',
  srcDir: 'docs',
  outDir: vitePressOutDir,
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
      next: '下一篇',
    },
    // 覆盖siteConfig中的私密文章配置
    private: isTeekPrivate ? privateConfig : undefined,
    // 自定义配置
    pulse: {
      private: {
        isTeek: isTeekPrivate,
        type: privateType as PulseLoginType,
        md5LoginInfos: md5LoginInfos,
      }
    }
  },
  vite: {
    publicDir: '../public',
    server: {
      port: vitePressPort,
      proxy: {
        '/api': {
          target: `http://localhost:${serverPort}`, // Express 服务地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },
  }
});
