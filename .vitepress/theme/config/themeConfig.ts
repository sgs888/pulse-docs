import type { TeekConfig } from 'vitepress-theme-teek';
import { bannerConfig, globalConfig } from '../../siteConfig';

const appendThemeColor = globalConfig.appendThemeColor ?? [];
const appendColor = appendThemeColor.length > 0 ? [{
  label: '扩展主题颜色',
  tip: '扩展主题颜色',
  options: appendThemeColor
}] : [];


// 基础配置
const commonThemeConfig: TeekConfig = {
  themeEnhance: {
    themeColor: {
      append: [...appendColor]
    }
  }
};

// 文档配置
export const docThemeConfig: TeekConfig = {
  ...commonThemeConfig,
  teekHome: false,
};

// 博客默认配置
export const blogThemeConfig: TeekConfig = {
  ...commonThemeConfig,
};

// 博客大图配置
export const blogFullThemeConfig: TeekConfig = {
  ...commonThemeConfig,
  pageStyle: 'default',
  post: {
    coverImgMode: 'full'
  },
  banner: {
    bgStyle: 'fullImg',
    descStyle: 'types'
  }
};

// 博客全图配置
export const blogBodyThemeConfig: TeekConfig = {
  pageStyle: 'segment',
  bodyBgImg: {
    imgSrc: bannerConfig.images ?? [],
  },
  banner: {
    descStyle: 'types'
  },
  themeEnhance: {
    layoutSwitch: {
      defaultMode: 'original'
    }
  },
  ...commonThemeConfig,
};

// 博客卡片配置
export const blogCardThemeConfig: TeekConfig = {
  ...commonThemeConfig,
  pageStyle: 'card-nav',
  post: {
    postStyle: 'card'
  },
  homeCardListPosition: 'left',
  banner: {
    bgStyle: 'fullImg',
    descStyle: 'types'
  },
  page: {
    pageSize: 20,
  }
};
