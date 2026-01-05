import { DefaultTheme } from 'vitepress';
import type {
  FriendLinkItem,
  Blogger,
  Author,
  FooterInfo,
  Private,
  SiteAnalytics,
  SiteAnalyticsProvider,
} from 'vitepress-theme-teek';
import type { CursorAppendTheme } from './theme/config/pulseConfig';

type VpConfig = DefaultTheme.Config;
type SiteAnalyticsType = keyof SiteAnalyticsProvider;

interface RunConfig {
  autoFrontmatter: boolean;
  recoverTransform: boolean;
}

interface SiteConfig {
  title: string;
  description: {
    content: string[],
    style: 'default' | 'types' | 'switch',
  },
  createTime: string;
  blogger: Blogger & { show: boolean; avatarTitle?: string };
  author: Author;
}

interface ThemeColor {
  label: string;
  value: string;
  color: string;
}

interface GlobalConfig {
  theme: 'doc' | 'blog' | 'blog-full' | 'blog-body' | 'blog-card';
  themeSwitch?: boolean;
  viewTransition: boolean;
  fullscreenWallpaper?: boolean;
  sidebarTrigger?: boolean;
  articleShare?: boolean;
  showRibbon?: boolean;
  topArticle?: boolean;
  category?: boolean;
  tag?: boolean;
  docAnalysis?: boolean;
  backTop?: boolean;
  h1Gradient?: boolean;
  appendThemeColor?: ThemeColor[];
}

interface HeaderConfig {
  nav?: VpConfig['nav'];
  navSocial?: {
    github?: string;
    gitee?: string;
  },
  localSearch: boolean;
}

interface BannerConfig {
  name?: string;
  images: string[];
}

interface PostConfig {
  postStyle: 'list' | 'card';
  coverImgMode: 'default' | 'full';
  page: {
    disabled: boolean;
    pageSize: number;
    pagerCount: number;
  }
}

type FooterConfig = Omit<FooterInfo, 'theme' | 'copyright'> & {
  showCopyright?: boolean;
  createYear?: number; // 创建年份
  runTime?: boolean; // 是否显示运行时间
  customHtml?: string; // 仅在runTime为false时生效
}

// 启动时配置
export const runConfig: RunConfig = {
  // 启动/打包时是否自动生成frontmatter，建议添加新文件后开启运行一次
  autoFrontmatter: false,
  // 启动/打包时是否覆盖原有frontmatter，建议覆盖后关闭，否则手动添加的frontmatter会覆盖掉
  recoverTransform: false,
}

// 博主信息
export const bloggerInfo: Blogger & { avatarTitle?: string } = {
  name: 'Hyde', // 博主昵称
  slogan: '朝圣的使徒，正在走向编程的至高殿堂！', // 博主签名
  avatar: 'https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png', // 博主头像
  avatarTitle: '', // hover头像时显示的文字，为空时不显示
  shape: 'circle-rotate', // 头像风格：square 为方形头像，circle 为圆形头像，circle-rotate 可支持鼠标悬停旋转，circle-rotate-last 将会持续旋转 59s
  circleBgImg: '/blog/bg4.webp', // 背景图片
  circleBgMask: true, // 遮罩层是否显示，仅当 shape 为 circle 且 circleBgImg 配置时有效
  circleSize: 100, // 头像大小
  color: '#ffffff', // 字体颜色
  // 状态，仅当 shape 为 circle 相关值时有效
  status: {
    icon: '😪', // 状态图标
    size: 24, // 图标大小
    title: '困' // 鼠标悬停图标的提示语
  }
};

// 网站信息配置
export const siteConfig: SiteConfig = {
  title: 'My Note Site', // 网站标题
  // 网站描述
  description: {
    content: [
      '故事由我书写，旅程由你见证，传奇由她聆听 —— 来自 Young Kbt',
      '积跬步以至千里，致敬每个爱学习的你 —— 来自 Evan Xu',
      '这一生波澜壮阔或是不惊都没问题 —— 来自 Weibw'
    ], // 描述内容：default、types只显示第一条，switch会在多条中切换
    style: 'types' //  描述文字风格：default为纯展示，types为文字打印风格，switch为文字切换风格
  },
  createTime: '2025-09-19',
  blogger: {
    show: true,
    ...bloggerInfo,
  },
  author: {
    name: bloggerInfo.name, // 作者名称
    link: 'https://github.com/sgs888' // 点击作者名跳转链接
  },
};

// 全局配置
export const globalConfig: GlobalConfig = {
  // 主题风格
  theme: 'doc',
  // 是否开启主题切换
  themeSwitch: true,
  // 深色、浅色切换过渡动画
  viewTransition: true,
  // 全屏时是否设置为壁纸
  fullscreenWallpaper: false,
  // 是否开启文章分享按钮
  articleShare: true,
  // 是否开启侧边栏收缩按钮
  sidebarTrigger: true,
  // 是否显示彩带背景，仅blog主页和doc生效
  showRibbon: false,
  // 是否显示置顶文章卡片
  topArticle: true,
  // 是否显示分类卡片
  category: true,
  // 是否显示标签卡片
  tag: true,
  // 是否显示站点统计卡片
  docAnalysis: true,
  // 是否开启返回到顶部按钮
  backTop: true,
  // 文档一级标题是否开启渐变
  h1Gradient: true,
  // 追加主题颜色, 不需要时设置为空即可
  appendThemeColor: [
    { label: '紫罗兰', value: 'violet', color: '#7166f0' },
    { label: '珊瑚粉', value: 'coral-pink', color: '#ff6b6b' },
    { label: '天蓝', value: 'sky-blue', color: '#00bbf9' },
    { label: '蓝绿', value: 'blue-green', color: '#00f5d4' },
    { label: '石板灰', value: 'slate-gray', color: '#708090' },
    { label: '粉红', value: 'pink', color: '#f15bb5' },
    { label: '黄绿', value: 'yellow-green', color: '#8ac926' },
    { label: '橙红', value: 'orange-red', color: '#ff9e6b' }
  ],
}

// 全局header配置
export const headerConfig: HeaderConfig = {
  // 顶部导航
  nav: [
    { text: '配置', link: '/配置/快速开始' },
    { text: '示例', link: '/示例文档/用法示例' },
    {
      text: '功能页',
      items: [
        { text: '归档页', link: '/archives' },
        { text: '清单页', link: '/articleOverview' },
        { text: '分类页', link: '/categories' },
        { text: '标签页', link: '/tags' },
        { text: '登录页', link: '/login' },
        { text: '风险提示页', link: '/risk-link?target=https:/vp.teek.top', target: '_blank' },
      ],
    },
  ],
  // 顶部导航右侧社交图标
  navSocial: {
    github: 'https://github.com/sgs888',
    gitee: '#'
  },
  // 是否开启本地搜索
  localSearch: true,
}

// 轮播图配置
export const bannerConfig: BannerConfig = {
  name: 'Banner Title', // 轮播图标题, 为undefined时显示网站标题，为空时不显示
  images: [
    '/blog/bg1.webp',
    '/blog/bg2.webp',
    '/blog/bg3.webp',
    // '/blog/bg4.webp',
    // '/blog/bg5.gif',
  ],
}

// 主页文章列表配置
export const postConfig: PostConfig = {
  postStyle: 'list', // 文章列表样式：list为列表样式，card为宫格样式
  coverImgMode: 'full', // 封面图片模式：default为默认模式，full为全图模式；仅在 postStyle 为list时有效
  page: {
    disabled: false, // 是否禁用分页
    pageSize: 10, // 每页显示的文章数量
    pagerCount: 8, // 页码按钮的数量
  }
};

// 页脚配置
export const footerConfig: FooterConfig = {
  // 是否显示版权信息
  showCopyright: true,
  // 是否显示运行时间
  runTime: true,
  // 页脚顶部信息
  topMessage: [],
  // 页脚底部信息
  bottomMessage: '',
  // ICP备案信息
  icpRecord: {
    name: '',
    link: ''
  },
  // 网络安全备案信息
  securityRecord: {
    name: '',
    link: ''
  },
  // 自定义html代码
  customHtml: ''
}

// 友情链接
export const friendLinkList: FriendLinkItem[] = [
  {
    name: 'Teeker',
    desc: '朝圣的使徒，正在走向编程的至高殿堂！',
    avatar: 'https://testingcf.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar2.png',
    link: 'http://notes.teek.top/'
  },
  {
    name: 'vuepress-theme-vdoing',
    desc: '🚀一款简洁高效的VuePress 知识管理&博客 主题',
    avatar: 'https://doc.xugaoyi.com/img/logo.png',
    link: 'https://doc.xugaoyi.com/'
  },
  {
    name: 'One',
    desc: '明心静性，爱自己',
    avatar: 'https://onedayxyy.cn/img/xyy.webp',
    link: 'https://onedayxyy.cn/'
  },
  {
    name: 'Hyde Blog',
    desc: '人心中的成见是一座大山',
    avatar: 'https://teek.seasir.top/avatar/avatar.webp',
    link: 'https://teek.seasir.top/'
  },
  {
    name: '二丫讲梵',
    desc: '💻学习📝记录🔗分享',
    avatar: 'https://wiki.eryajf.net/img/logo.png',
    link: ' https://wiki.eryajf.net/'
  },
  {
    name: '粥里有勺糖',
    desc: '简约风的 VitePress 博客主题',
    avatar: 'https://theme.sugarat.top/logo.png',
    link: 'https://theme.sugarat.top/'
  },
  {
    name: 'VitePress 快速上手中文教程',
    desc: '如果你也想搭建它，那跟我一起做吧',
    avatar: 'https://avatars.githubusercontent.com/u/90893790?v=4',
    link: 'https://vitepress.yiov.top/'
  },
  {
    name: '友人A',
    desc: 'おとといは兎をみたの，昨日は鹿，今日はあなた',
    avatar: 'http://niubin.site/logo.jpg',
    link: 'http://niubin.site/'
  }
];

// 私密文章配置
export const privateConfig: Private = {
  // 是否开启私密文章功能
  enabled: false,
  // 登录过期时间：1d 代表 1 天，1h 代表 1 小时，仅支持这两个单位，不加单位代表秒。过期后访问私密文章重新输入用户名和密码。默认一天
  expire: '3h',
  // 开启是否在网页关闭或刷新后，清除登录状态，这样再次访问网页，需要重新登录
  session: true,
  // 是否使用站点级别登录功能，即第一次进入网站需要验证
  siteLogin: false,
  pages: [
    { username: 'admin', password: 'admin' }
  ]
}

// 站点分析配置, 可参考https://vp.teek.top/reference/config/global-config.html#siteanalytics
export const siteAnalytics: SiteAnalytics<SiteAnalyticsType>[] = [
  /*{ provider: 'google', options: { id: '******' } },
  { provider: 'baidu', options: { id: '******' } },
  { provider: 'umami', options: { id: '******', src: '**' } },*/
];

// 鼠标追加主题
export const cursorThemeAppend: CursorAppendTheme[] = [
  {
    key: 'mac',
    label: 'Mac OS',
    default: { url: '/cursors/mac/default.png', x: 12, y: 8 },
    text: { url: '/cursors/mac/text.png', x: 16, y: 17 },
    pointer: { url: '/cursors/mac/hand.png', x: 13, y: 9 },
    grab: { url: '/cursors/mac/grab.png', x: 16, y: 16 },
    help: { url: '/cursors/mac/help.png', x: 16, y: 16 },
    move: { url: '/cursors/mac/move.png', x: 16, y: 16 },
    noAllowed: { url: '/cursors/mac/notAllowed.png', x: 16, y: 16 },
    cross: { url: '/cursors/mac/cross.png', x: 16, y: 16 },
  }
];