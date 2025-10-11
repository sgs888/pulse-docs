<template>
  <BaseTemplate
    :class="ns"
    :icon="magicIcon"
    :title="tipInfo.title"
    :helper="!isMobile"
    :helper-desc="tipInfo.desc"
    :tips="tipInfo.tips"
  >
    <template #title>
      <div class="flx-justify-between flx-1">
        {{ tipInfo.title }}
        <button @click="handleCopy">复制Theme Key</button>
      </div>
    </template>
    <TkSegmented v-model="currentStyle" :options="segmentedOptions" />
  </BaseTemplate>
</template>
<script setup lang="ts" name="ThemeSwitch">
import { nextTick, ref, watch } from 'vue';
import {
  TkSegmented,
  TkMessage,
  magicIcon,
  isClient,
  useCommon,
  useClipboard,
  useStorage,
  TkThemeEnhanceBaseTemplate as BaseTemplate
} from 'vitepress-theme-teek';
import {
  docThemeConfig,
  blogThemeConfig,
  blogFullThemeConfig,
  blogBodyThemeConfig,
  blogCardThemeConfig,
} from '../config/themeConfig';

const ns = 'config-switch';
const tipInfo = {
  title: '配置切换',
  desc: '点击立即生效，可在预设主题间快速切换',
  tips: [{
    title: 'Theme Key',
    content: 'Theme Key 是一个主题标识符，可复制并替换默认主题theme',
  }],
};
const segmentedOptions = [
  { value: 'doc', label: '文档预设', title: 'doc: 文档默认风格' },
  { value: 'blog', label: '博客预设', title: 'blog: 首页默认风格' },
  { value: 'blog-full', label: '博客大图', title: 'blog-full: 首页 Banner 大图 + 评论' },
  { value: 'blog-body', label: '博客全图', title: 'blog-body: 全站背景图 + 碎片化文章页' },
  { value: 'blog-card', label: '博客卡片', title: 'blog-card: 首页卡片文章列表 + 左侧卡片栏列表' }
];

const emit = defineEmits<{
  switch: [config: typeof docThemeConfig, style: string];
}>();

// 默认文档风格
const themeStyle = defineModel({ default: 'doc' });
const currentStyle = useStorage('tk:configStyle', 'doc');
const themeConfig = ref(docThemeConfig);

const { copy, copied } = useClipboard();
const { isMobile } = useCommon();

const update = async (style: string) => {
  if (style === 'doc') themeConfig.value = docThemeConfig;
  if (style === 'blog') themeConfig.value = blogThemeConfig;
  if (style === 'blog-full') themeConfig.value = blogFullThemeConfig;
  if (style === 'blog-body') themeConfig.value = blogBodyThemeConfig;
  if (style === 'blog-card') themeConfig.value = blogCardThemeConfig;

  emit('switch', themeConfig.value, style);

  await nextTick();

  if (!isClient) return;
  const navDom = document.querySelector('.VPNavBar') as HTMLElement;

  // 兼容 Teek Banner 样式
  if (['blog-full', 'blog-body', 'blog-card'].includes(style)) navDom?.classList.add('full-img-nav-bar');
  else navDom?.classList.remove('full-img-nav-bar');
};

watch(themeStyle, update, { immediate: true });
watch(
  currentStyle,
  newVal => {
    newVal && (themeStyle.value = newVal);
  },
  { immediate: true }
);

const handleCopy = async () => {
  await copy(themeStyle.value);
  copied.value
    ? TkMessage.success({ message: '复制成功！', plain: true })
    : TkMessage.error({ message: '复制失败！', plain: true });
};
</script>

<style lang="scss">
$namespace: config-switch;

.#{$namespace} {
  @media (max-width: 768px) {
    margin-top: 10px;
  }
  h3 {
    display: inline-block;
    font-size: 12px;
    opacity: 0.8;
  }
  button {
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: 0.1s;
    color: var(--vp-c-text-1);

    &:hover {
      color: #5171d7;
      border-color: #5171d7;
    }
  }

  &__helper-desc {
    line-height: 24px;
  }

  .tk-segmented-item {
    min-width: 70px;
  }
}
</style>
