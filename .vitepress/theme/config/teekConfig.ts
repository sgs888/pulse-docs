// @ts-ignore
import { defineTeekConfig } from 'vitepress-theme-teek/config';
import {
  siteConfig,
  globalConfig,
  bannerConfig,
  postConfig,
  footerConfig,
  friendLinkList,
} from '../../siteConfig';

const {
  createTime,
  author,
  description,
  blogger,
} = siteConfig;
const {
  viewTransition,
  fullscreenWallpaper,
  articleShare,
  sidebarTrigger,
} = globalConfig;

const generateFooterConfig = () => {
  const copyFooter = JSON.parse(JSON.stringify(footerConfig));
  delete copyFooter.theme;
  delete copyFooter.copyright;
  delete copyFooter.customHtml;
  if (copyFooter?.icpRecord && !copyFooter.icpRecord.name && !copyFooter.icpRecord.link) {
    delete copyFooter.icpRecord;
  }
  if (copyFooter?.securityRecord && !copyFooter.securityRecord.name && !copyFooter.securityRecord.link) {
    delete copyFooter.securityRecord;
  }

  const theme = {
    show: true,
    // name: 'Theme By Hydeek (based on Teek)'
    // link: '',
  };
  const copyright = {
    show: footerConfig?.showCopyright,
    createYear: footerConfig?.createYear,
    suffix: author?.name
  };
  const customHtml = footerConfig?.runTime ? `<span id="runtime"></span>` : footerConfig?.customHtml;

  return {
    ...copyFooter,
    theme,
    copyright,
    customHtml
  };
};

// teek主题配置，配置项可参考.vitepress/teekConfig.template.ts
export const teekConfig = defineTeekConfig({
  teekHome: true,
  vpHome: true,
  loading: false,
  homeCardListPosition: 'right', // 侧边栏位置，可选配置 left | right
  backTop: {
    enabled: true,
    content: 'icon',
    // done: TkMessage => TkMessage.success('返回顶部成功') // 回到顶部后的回调
  },
  // 代码块配置
  codeBlock: {
    enabled: true,
    collapseHeight: 600,
    overlay: false, // 代码块底部是否显示展开/折叠遮罩层
    overlayHeight: 200, // 当出现遮罩层时，指定代码块显示高度，当 overlay 为 true 时生效
    langTextTransform: 'uppercase', // 语言文本显示样式，为 text-transform 的值:none, capitalize, lowercase, uppercase
    // copiedDone: TkMessage => TkMessage.success('复制成功！') // 复制代码完成后的回调
  },
  viewTransition,
  sidebarTrigger, // 是否开启侧边栏触发按钮
  anchorScroll: true,  // 是否启用锚点滚动功能
  windowTransition: true, // 是否开启部分元素过渡效果
  themeEnhance: {
    enabled: true,
    layoutSwitch: {
      defaultMode: 'bothWidthAdjustable'
    }
  },
  // 文章默认的作者信息
  author,
  // 首页Banner配置
  banner: {
    enabled: true,
    name: bannerConfig?.name,
    bgStyle: 'partImg', // Banner 背景风格：pure 为纯色背景，partImg 为局部图片背景，fullImg 为全屏图片背景
    pureBgColor: '#28282d', // 纯色背景颜色
    imgSrc: bannerConfig.images ?? [],
    description: description.content,
    descStyle: description.style
  },
  // 是否开启壁纸模式
  wallpaper: {
    enabled: fullscreenWallpaper,
    hideBanner: true,
    hideMask: true
  },
  // 文章配置
  post: {
    postStyle: postConfig.postStyle ?? 'list',
    excerptPosition: 'bottom',
    showMore: true,
    moreLabel: '阅读全文 >',
    emptyLabel: '暂无文章',
    coverImgMode: postConfig.coverImgMode ?? 'default',
    showCapture: true,
    splitSeparator: false,
    // defaultCoverImg: ['/blog/bg1.webp'],
  },
  // 分页
  page: {
    ...(postConfig.page ?? {
      disabled: false,
      pageSize: 10,
      pagerCount: 8,
    }),
    layout: 'prev, pager, next, jumper, ->, total',
    size: 'default',
    background: false,
    hideOnSinglePage: true
  },
  // 页脚
  footerInfo: generateFooterConfig(),
  // 博客主卡片配置
  blogger: blogger.show ? blogger : undefined,
  // 主页卡片顺序(除了博客主卡片)
  homeCardSort: ['topArticle', 'category', 'tag', 'docAnalysis', 'friendLink'],
  // 精选文章卡片配置
  topArticle: {
    enabled: true,
    emptyLabel: '暂无精选文章',
    limit: 5,
    autoPage: false,
    pageSpeed: 5000,
    dateFormat: 'yyyy-MM-dd hh:mm'
  },
  // 分类卡片配置
  category: {
    enabled: true,
    path: '/categories',
    moreLabel: '更多分类...',
    emptyLabel: '暂无文章分类',
    limit: 5,
    autoPage: false,
    pageSpeed: 5000
  },
  // 友情链接卡片配置
  friendLink: {
    enabled: friendLinkList && friendLinkList.length > 0,
    list: friendLinkList,
    emptyLabel: '暂无友情链接', // 友情链接为空时的标签
    limit: 5,
    autoScroll: false,
    scrollSpeed: 2500,
    autoPage: false,
    pageSpeed: 5000
  },
  // 标签卡片配置
  tag: {
    enabled: true,
    path: '/tags',
    moreLabel: '更多 ...',
    emptyLabel: '暂无标签',
    limit: 21,
    autoPage: false,
    pageSpeed: 5000
  },
  // 站点信息卡片配置
  docAnalysis: {
    enabled: true, // 是否启用站点信息卡片
    createTime, // 站点创建时间
    wordCount: true, // 是否开启文章页的字数统计
    readingTime: true, // 是否开启文章页的阅读时长统计
    // 访问量、访客数统计配置
    statistics: {
      siteView: true, // 是否开启首页的访问量和排名统计
      pageView: true, // 是否开启文章页的浏览量统计
      tryRequest: false, // 如果请求网站流量统计接口失败，是否重试
      tryCount: 5, // 重试次数，仅当 tryRequest 为 true 时有效
      tryIterationTime: 2000, // 重试间隔时间，单位：毫秒，仅当 tryRequest 为 true 时有效
      permalink: true // 是否只统计永久链接的浏览量，如果为 false，则统计 VitePress 默认的文档目录链接
    },
    // 自定义现有信息
    overrideInfo: [
      {
        key: 'lastActiveTime',
        label: '活跃时间',
        value: (_, currentValue) => (currentValue + '').replace('前', ''),
        show: true
      }
    ],
    // 自定义额外信息
    appendInfo: [{ key: 'index', label: '站点作者', value: siteConfig.author.name }]
  },
  // 面包屑配置
  breadcrumb: {
    enabled: true,
    showCurrentName: false,
    separator: '/',
    homeLabel: '首页',
  },
  // 文章分享配置
  articleShare: {
    enabled: articleShare ?? false,
    text: '分享此页面',
    copiedText: '链接已复制',
    query: true,
    hash: true,
  },
  // 文章页底部的最近更新栏配置
  articleUpdate: {
    enabled: true, // 是否启用文章最近更新栏
    limit: 3 // 文章最近更新栏显示数量
  },
  articleAnalyze: {
    showIcon: true,
    dateFormat: 'yyyy-MM-dd hh:mm',
    showInfo: true,
    showAuthor: true,
    showCreateDate: true,
    showUpdateDate: true,
    showCategory: false,
    showTag: false,
    // 将文章信息传送到指定位置，仅限在文章页生效，默认在文章页顶部
    teleport: {
      selector: 'h1',
      position: 'after',
      className: 'h1-bottom-info'
    }
  },
  vitePlugins: {
    sidebar: true,
    sidebarOption: {},
    permalink: true,
    permalinkOption: {},
    mdH1: true,
    catalogue: true,
    catalogueOption: {},
    docAnalysis: true,
    docAnalysisOption: {},
    fileContentLoaderIgnore: [],
    autoFrontmatter: false,
    // autoFrontmatter 插件配置项
    autoFrontmatterOption: {
      permalinkPrefix: '', // 自动生成 permalink 的固定前缀，如 pages、pages/demo，默认为 pages
      categories: true, // 是否自动生成 categories
      recoverTransform: false, // 是否覆盖原有frontmatter
      transform: (frontmatter, fileInfo) => {
        const relativePath = fileInfo.relativePath;
        frontmatter.permalink = relativePath.replace(/\.md$/, '');
        return frontmatter;
      }
    }
  },
});
