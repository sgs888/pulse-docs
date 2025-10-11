<template>
  <template v-if="teekConfig.teekTheme">
    <TkRouteLoading v-if="teekConfig.loading ?? false" v-model="loading">
      <template #default="scope">
        <slot name="teek-loading" v-bind="scope" />
      </template>
    </TkRouteLoading>

    <template v-if="frontmatter.loginPage === true">
      <slot name="teek-login-page">
        <TkLoginPage v-show="!loading" />
      </slot>
    </template>
    <template v-if="frontmatter.riskLinkPage === true">
      <slot name="teek-risk-link-page">
        <TkRiskLinkPage v-show="!loading" />
      </slot>
    </template>

    <template v-if="frontmatter.layout !== false">
      <TkBodyBgImage v-if="teekConfig.bodyBgImg?.imgSrc" />
      <TkArticleHeadingHighlight />
      <TkNotice v-if="teekConfig.notice?.enabled">
        <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
          <slot :name="name" v-bind="scope" />
        </template>
      </TkNotice>
      <TkRightBottomButton>
        <!-- 通用插槽 -->
        <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
          <slot :name="name" v-bind="scope" />
        </template>
      </TkRightBottomButton>
    </template>

    <Layout
      v-show="!loading"
      :class="[
        ns.b(),
        { [ns.m('hide-vp-home')]: !teekConfig.vpHome || (bannerEnabled && isFullscreen) },
        ns.has('sidebar-trigger', teekConfig.sidebarTrigger),
      ]"
    >
      <template #home-hero-before>
        <TkHomeBanner v-if="bannerTop">
          <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
            <slot :name="name" v-bind="scope" />
          </template>
        </TkHomeBanner>

        <slot name="home-hero-before" />
      </template>
      <slot name="teek-home-before" />
      <slot name="home-hero-after" />
      <slot name="teek-home-after" />

      <template #home-features-after>
        <!-- 自定义首页 -->
        <TkHome ref="tkHomeRef" v-if="teekConfig.teekHome">
          <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
            <slot :name="name" v-bind="scope" />
          </template>
        </TkHome>

        <template v-else>
          <slot name="teek-home-features-before" />
          <TkHomeFeature />
          <slot name="teek-home-features-after" />
        </template>

        <slot name="home-features-after" />
      </template>

      <template #nav-bar-content-after>
        <slot name="nav-bar-content-after" />

        <ThemeSetting v-if="teekConfig.themeEnhance.enabled ?? true">
          <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
            <template v-if="name === 'teek-theme-enhance-bottom'">
              <BannerTopSwitch v-if="bannerEnabled" @change="changeBannerTop" />
              <slot name="teek-theme-enhance-bottom" v-bind="scope" />
            </template>
            <slot v-else :name="name" v-bind="scope" />
          </template>
        </ThemeSetting>
      </template>

      <template #layout-bottom>
        <TkFooterGroup v-if="isHomePage" />
        <slot name="teek-footer-info-before" />

        <slot name="teek-footer-info">
          <TkFooterInfo v-if="isHomePage" />
        </slot>

        <slot name="teek-footer-info-after" />
        <slot name="layout-bottom" />
      </template>

      <template #sidebar-nav-before>
        <TkHomeMyCardScreen />
      </template>

      <template #doc-before>
        <slot name="doc-before" />
        <slot name="teek-article-analyze-before" />
        <TkArticleAnalyze v-if="frontmatter.article !== false" />
        <slot name="teek-article-analyze-after" />

        <TkArticleImagePreview />
        <TkArticlePageStyle />
        <TkCodeBlockToggle v-if="teekConfig.codeBlock.enabled ?? true" />
        <TkVpContainer v-if="topTipConfig" v-bind="isBoolean(topTipConfig) ? {} : topTipConfig" />
        <TkSidebarTrigger v-if="teekConfig.sidebarTrigger">
          <template #default="scope">
            <slot name="teek-sidebar-trigger" v-bind="scope" />
          </template>
        </TkSidebarTrigger>
      </template>

      <template #doc-footer-before>
        <slot name="doc-footer-before" />
        <slot name="teek-article-bottom-tip-before" />
        <TkVpContainer v-if="bottomTipConfig" v-bind="isBoolean(bottomTipConfig) ? {} : bottomTipConfig" />
        <slot name="teek-article-bottom-tip-after" />
      </template>

      <template #doc-after>
        <slot name="doc-after" />

        <slot name="teek-doc-update-before" />
        <TkArticleUpdate v-if="(teekConfig.articleUpdate.enabled ?? true) && frontmatter.articleUpdate !== false" />
        <slot name="teek-doc-update-after" />

        <slot name="teek-doc-after-appreciation-before" />
        <TkDocAfterAppreciation v-if="teekConfig.appreciation.position === 'doc-after'" />
        <TkDocAfterAppreciationPopper v-else-if="teekConfig.appreciation.position === 'doc-after-popper'" />
        <slot name="teek-doc-after-appreciation-after" />

        <slot name="teek-comment-before" />

        <!-- 评论区 -->
        <template v-if="commentConfig.enabled && commentConfig.provider">
          <template v-if="commentConfig.provider === 'render'">
            <slot name="teek-comment" />
          </template>
          <component
            v-else
            :is="commentConfig.components?.[commentConfig.provider]"
            :id="`${ns.namespace}-comment`"
            :class="ns.e('comment')"
          />
        </template>

        <slot name="teek-comment-after" />
      </template>

      <template #aside-bottom>
        <slot name="aside-bottom" />

        <slot name="teek-aside-bottom-appreciation-before" />
        <TkAsideBottomAppreciation v-if="teekConfig.appreciation.position === 'aside-bottom'" />
        <slot name="teek-aside-bottom-appreciation-after" />
      </template>

      <template #page-top>
        <slot name="page-top" />
        <slot name="teek-page-top-before" />

        <TkArchivesPage v-if="isArchivesPage">
          <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
            <slot :name="name" v-bind="scope" />
          </template>
        </TkArchivesPage>
        <TkCataloguePage v-if="isCataloguePage">
          <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
            <slot :name="name" v-bind="scope" />
          </template>
        </TkCataloguePage>
        <TkArticleOverviewPage v-if="isArticleOverviewPage" />

        <slot name="teek-page-top-after" />
      </template>

      <template #aside-outline-before>
        <slot name="teek-article-share-before" />

        <TkArticleShare v-if="teekConfig.articleShare.enabled" />

        <slot name="teek-article-share-after" />
        <slot name="aside-outline-before" />
      </template>

      <!-- 其他 VP 插槽 -->
      <template
        v-for="name in Object.keys($slots).filter(name => !usedSlots.includes(name))"
        :key="name"
        #[name]="slotData"
      >
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Layout>
  </template>

  <template v-else>
    <Layout>
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Layout>
  </template>

  <!-- 自定义滚动条 -->
  <div ref="scrollBarRef" class="fake-scrollbar">
    <div ref="thumbRef" class="fake-thumb"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, inject, ref, watch, onMounted } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { useData, onContentUpdated } from 'vitepress';
import type { TeekConfig, Language } from 'vitepress-theme-teek';
import {
  isBoolean,
  useNamespace,
  useEventListener,
  useTeekConfig,
  usePageState,
  useWatchLogin,
  useRiskLink,
  localeContextKey,
  isClient,
  TkHomeBanner,
  TkHome,
  TkHomeMyCardScreen,
  TkBodyBgImage,
  TkFooterGroup,
  TkFooterInfo,
  TkArticleImagePreview,
  TkArticleAnalyze,
  TkArticleShare,
  TkArticleUpdate,
  TkArticleHeadingHighlight,
  TkArticlePageStyle,
  TkDocAfterAppreciation,
  TkAsideBottomAppreciation,
  TkDocAfterAppreciationPopper,
  TkCommentTwikoo,
  TkCommentArtalk,
  TkCommentGiscus,
  TkCommentWaline,
  TkCodeBlockToggle,
  TkRightBottomButton,
  TkNotice,
  TkVpContainer,
  TkArchivesPage,
  TkCataloguePage,
  TkArticleOverviewPage,
  TkLoginPage,
  TkRiskLinkPage,
  TkSidebarTrigger,
  TkHomeFeature,
  TkRouteLoading,
} from 'vitepress-theme-teek';
import { useFakeScrollbar } from '../composables/useFakeScrollBar';
import ThemeSetting from './ThemeSetting.vue';
import BannerTopSwitch from './BannerTopSwitch.vue';

defineOptions({ name: 'TeekLayout' });

const props = defineProps<{ locale?: Language }>();

provide(
  localeContextKey,
  computed(() => props.locale)
);
const currentStyle = inject('currentStyle', ref());

const { Layout } = DefaultTheme;

const ns = useNamespace('layout');
const { getTeekConfig, getTeekConfigRef } = useTeekConfig();
const { isHomePage, isArchivesPage, isCataloguePage, isArticleOverviewPage } = usePageState();
const { frontmatter, localeIndex, page } = useData();
const { scrollBarRef, thumbRef } = useFakeScrollbar();

// 支持 provide、frontmatter.tk、frontmatter、theme 配置
const teekConfig = getTeekConfigRef<Required<TeekConfig>>(null, {
  teekTheme: true,
  teekHome: true,
  vpHome: true,
  sidebarTrigger: false,
  loading: false,
  codeBlock: { enabled: true },
  themeSize: '',
  bodyBgImg: {},
  notice: {},
  comment: { provider: '' },
  articleUpdate: { enabled: true },
  articleTopTip: undefined,
  articleBottomTip: undefined,
  articleShare: {},
  appreciation: {},
  riskLink: { enabled: false },
  themeEnhance: { enabled: true }
});

const tkHomeRef = ref();
const loading = ref(teekConfig.value.loading);
const bannerTop = ref(false);
const isFullscreen = ref(false);

const bannerEnabled = computed(() => {
  const banner = getTeekConfig('banner');
  const tkHomeEnabled = getTeekConfig('teekHome');
  return currentStyle.value !== 'blog-body' && banner && banner?.enabled && tkHomeEnabled;
});

const wallpaperEnabled = computed(() => {
  const wallpaper = getTeekConfig('wallpaper');
  const banner = getTeekConfig('banner');
  const bodyBgImg = getTeekConfig('bodyBgImg');
  return wallpaper && wallpaper.enabled && (banner.bgStyle === 'fullImg' || bodyBgImg.imgSrc);
});

const commentConfig = computed(() => {
  const comment = frontmatter.value.comment ?? teekConfig.value.comment;
  if (isBoolean(comment)) return { enabled: comment };

  return {
    enabled: true,
    components: {
      twikoo: TkCommentTwikoo,
      waline: TkCommentWaline,
      giscus: TkCommentGiscus,
      artalk: TkCommentArtalk
    },
    provider: comment.provider,
    options: comment.options
  };
});

const topTipConfig = computed(() => {
  if (isBoolean(teekConfig.value.articleTopTip)) return teekConfig.value.articleTopTip;
  return teekConfig.value.articleTopTip?.(frontmatter.value, localeIndex.value, page.value);
});
const bottomTipConfig = computed(() => {
  if (isBoolean(teekConfig.value.articleBottomTip)) return teekConfig.value.articleBottomTip;
  return teekConfig.value.articleBottomTip?.(frontmatter.value, localeIndex.value, page.value);
});

const themeSizeAttribute = ns.join('theme-size');

const changeBannerTop = (isTop: boolean) => {
  bannerTop.value = isTop;
};
const initBannerTop = () => {
  const banner = tkHomeRef.value?.$el.querySelector('.tk-banner');
  if (banner) {
    banner.style.display = bannerTop.value ? 'none' : '';
    if (!bannerTop.value) {
      banner.style.marginTop = '32px';
    }
  }
}

watch(
  () => teekConfig.value.themeSize,
  newValue => {
    if (!isClient) return;
    // 设置或删除主题尺寸
    if (newValue) document.documentElement.setAttribute(themeSizeAttribute, newValue);
    else document.documentElement.removeAttribute(themeSizeAttribute);
  },
  { immediate: true, flush: 'post' }
);
watch(bannerTop, () => nextTick(initBannerTop));

const { watchSite, watchPages } = useWatchLogin();
const { restart } = useRiskLink({
  whitelist: teekConfig.value.riskLink.whitelist,
  blacklist: teekConfig.value.riskLink.blacklist
});

watchSite();
watchPages();

onContentUpdated(() => {
  if (teekConfig.value.riskLink.enabled) restart();
  nextTick(initBannerTop);
});

const getDocument = () => document;
if (wallpaperEnabled.value) {
  useEventListener(getDocument, 'fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
}

// 维护已使用的插槽，防止外界传来的插槽覆盖已使用的插槽
const usedSlots = [
  'home-hero-before',
  'home-features-after',
  'nav-bar-content-after',
  'layout-bottom',
  'doc-footer-before',
  'doc-before',
  'doc-after',
  'aside-bottom',
  'page-top',
  'aside-outline-before',
  'sidebar-nav-before'
];
</script>

<style scoped lang="scss">

</style>