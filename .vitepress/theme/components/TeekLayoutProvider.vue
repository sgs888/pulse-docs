<template>
  <TeekLayout>
    <template #teek-theme-enhance-bottom>
      <div v-if="themeSwitch" :class="[ns, 'flx-align-center']">
        <ThemeSwitch v-model="currentStyle" @switch="handleConfigSwitch" />
      </div>
    </template>

    <template #nav-screen-content-after>
      <ThemeSwitch v-if="themeSwitch" v-model="currentStyle" @switch="handleConfigSwitch" />
    </template>

    <template #teek-archives-top-before>
      <ContributeChart />
    </template>

    <template #not-found>
      <NotFound />
    </template>
  </TeekLayout>
</template>

<script setup lang="ts" name="TeekLayoutProvider">
import { watch, nextTick, ref, provide, computed, onMounted } from 'vue';
import { TeekConfig, useTeekConfig } from 'vitepress-theme-teek';
import { teekConfigContext, clockIcon } from 'vitepress-theme-teek';
import { siteConfig, globalConfig } from '../../siteConfig';
import {
  docThemeConfig,
  blogThemeConfig,
  blogFullThemeConfig,
  blogBodyThemeConfig,
  blogCardThemeConfig,
} from '../config/themeConfig';
import { useData } from 'vitepress';
import { useRibbon } from '../composables/useRibbon';
import { useRuntime } from '../composables/useRuntime';
import TeekLayout from './TeekLayout.vue';
import ThemeSwitch from './ThemeSwitch.vue';
import ContributeChart from './ContributeChart.vue';
import NotFound from './404.vue';

const ns = 'layout-provider';
const createTime = siteConfig.createTime;
const avatarTitle = siteConfig.blogger.avatarTitle ?? '';
const {
  showRibbon,
  theme,
  themeSwitch,
} = globalConfig;
const { getTeekConfigRef } = useTeekConfig();
const { frontmatter } = useData();

// 默认文档风
const currentStyle = ref(theme ?? 'doc');
const themeConfig = ref(docThemeConfig);
provide(teekConfigContext, themeConfig);
provide('currentStyle', currentStyle);
const teekConfig = getTeekConfigRef<Required<TeekConfig>>(null);

const bannerEnabled = computed(() => {
  const banner = frontmatter.value.banner ?? teekConfig.value.banner;
  const tkHomeEnabled = frontmatter.value.tk?.teekHome ?? teekConfig.value.teekHome;
  return banner && banner.enabled && tkHomeEnabled;
});

// 彩带背景
const { start: startRibbon, stop: stopRibbon } = useRibbon({ immediate: false, clickReRender: true });
// 页脚运行时间
const { start: startRuntime, stop: stopRuntime } = useRuntime(`${createTime} 00:00:00`, {
  prefix: `<span style="width: 16px; display: inline-block; vertical-align: -3px; margin-right: 3px;">${clockIcon}</span>小破站已运行 `
});

const watchRuntimeAndRibbon = async (layout: string, style: string) => {
  const isHome = layout === 'home';
  const isDoc = [undefined, 'doc'].includes(layout);
  const isBlog = style.startsWith('blog');

  // 博客类风格的首页显示运行时间
  await nextTick();
  if (isHome) startRuntime();
  else stopRuntime();

  // 博客类风格的首页显示彩带 & 设置了 pageStyle 的文章页显示彩带
  if (showRibbon && (
    (isHome && isBlog && style !== 'blog-body')
    || (isDoc && themeConfig.value.pageStyle)
  )) {
    startRibbon();
  } else {
    stopRibbon();
  }
};

watch([frontmatter, currentStyle], ([newFrontmatter, newStyle]) => setTimeout(() => watchRuntimeAndRibbon(newFrontmatter.layout, newStyle), 700), {
  immediate: true,
  flush: 'post'
});

const handleConfigSwitch = (config: TeekConfig, style: string) => {
  themeConfig.value = config;
  setTimeout(() => watchRuntimeAndRibbon(frontmatter.value.layout, style), 700);
};

const initThemeWhenCloseSwitch = () => {
  localStorage.setItem('tk:configStyle', theme);
  if (theme === 'doc') themeConfig.value = docThemeConfig;
  if (theme === 'blog') themeConfig.value = blogThemeConfig;
  if (theme === 'blog-full') themeConfig.value = blogFullThemeConfig;
  if (theme === 'blog-body') themeConfig.value = blogBodyThemeConfig;
  if (theme === 'blog-card') themeConfig.value = blogCardThemeConfig;
  handleConfigSwitch(themeConfig.value, theme);
}

// 初始化头像title，覆盖默认文字“我好看吗”
const initAvatarTitle = () => {
  const avatar = document.querySelector('.tk-avatar');
  avatar?.setAttribute('title', avatarTitle);
}

onMounted(() => {
  initAvatarTitle();
  if (!themeSwitch) {
    initThemeWhenCloseSwitch();
  }
});
</script>
<style lang="scss">
.tk-my.is-circle-bg {
  .tk-my__avatar.circle-rotate {
    margin-top: 200px;

    .tk-avatar:not(.avatar-sticker) {
      border: 5px solid var(--vp-c-bg-elv);
    }
  }
}

.runtime {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
