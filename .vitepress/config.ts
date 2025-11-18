import { type DefaultTheme, type SiteConfig, defineConfigWithTheme } from 'vitepress';
import type { TeekConfig, PostData } from 'vitepress-theme-teek';
import { type PulseTheme, type Md5LoginInfo, PulseLoginType, PostConfig } from './theme/config/pulseConfig';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { teekConfig } from './theme/config/teekConfig';
import { siteConfig, headerConfig, privateConfig } from './siteConfig';
import { createPrivateMdPlugin } from './plugins/privateMd';

const docsPath = path.resolve(__dirname, '../docs');
const { privateMdPlugin, privateContentMap } = createPrivateMdPlugin(docsPath);

type VpConfig = DefaultTheme.Config;

dotenv.config();
const vitePressOutDir = process.env.VITE_PRESS_OUTPUT_DIR || './.vitepress/dist';
const serverPort = process.env.EXPRESS_PORT || 3000;
const vitePressPort = process.env.VITE_PRESS_PORT ? Number(process.env.VITE_PRESS_PORT) : 8000;
const isTeekPrivate = process.env.TEEK_PRIVATE === 'true';
const privateType = process.env.PULSE_PRIVATE;
const isExpress = privateType === PulseLoginType.express;
const privateUsername = process.env.PULSE_USERNAME;
const privatePassword = process.env.PULSE_PASSWORD;
const { title } = siteConfig;
const {
  nav,
  navSocial,
  localSearch
} = headerConfig;

// MD5形式的登录信息，会暴露到客户端，非md5登录信息，请勿使用
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

// 提取所有文章数据
const getPostsData = (posts: PostData) => {
  const allPosts: PostConfig[] = posts.allPosts.map(post => {
    const permalink = post.frontmatter.permalink;
    const isPrivate = post.frontmatter.private;
    return {
      url: permalink || post.url,
      private: isPrivate,
    }
  });
  const originPosts: PostConfig[] = posts.originPosts.map(post => {
    const isPrivate = post.frontmatter.private;
    return {
      url: post.url,
      private: isPrivate,
    }
  });
  const specialPosts: PostConfig[] = allPosts.filter(
    item => !originPosts.some(originPost => originPost.url === item.url)
  );
  const originDirs = posts.originPosts.map(post => {
    let relativePath = post.relativePath;
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.slice(1);
    }
    return relativePath.split('/')[0];
  });

  return {
    originDirs: Array.from(new Set(originDirs)),
    allPosts,
    originPosts,
    specialPosts,
  };
}

// 生成构建后生成posts.json
const generatePostsAfterBuild = async (config: SiteConfig) => {
  const postsOutDir = path.resolve(__dirname, '../server/posts.json');
  const posts = config.userConfig.themeConfig.posts;
  const postData = getPostsData(posts);
  const postsJson = JSON.stringify(postData);

  if (!isExpress) {
    fs.unlinkSync(postsOutDir);
  }

  const dir = path.dirname(postsOutDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFile(postsOutDir, postsJson, 'utf8', (err) => {
    if (err) {
      console.log('❌ server/posts.json write error:', err);
    } else {
      console.log(`✅  server/posts.json write successfully.`);
    }
  });
}

// 构建后输出私密文档
const generatePrivateDocs = () => {
  const BACKUP_DIR = path.resolve(__dirname, '../server/privateMd');

  try {
    fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
    fs.mkdirSync(BACKUP_DIR, { recursive: true });

    for (const [relPath, content] of privateContentMap.entries()) {
      const backupPath = path.join(BACKUP_DIR, relPath);
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.writeFileSync(backupPath, content, 'utf8');
    }
    console.log(`✅  privateMdPlugin write successfully.`);
  } catch (error) {
    console.log('❌ privateMdPlugin write error:', error);
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
    plugins: isExpress ? [privateMdPlugin] : [],
  },
  async buildEnd(siteConfig) {
    await generatePostsAfterBuild(siteConfig);
    // generatePrivateDocs();
  }
});
