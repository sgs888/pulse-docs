<template>
  <TkPopover
    v-if="!isMobile && themeEnhanceConfig.position === 'top'"
    trigger="click"
    :class="[ns.b(), 'flx-align-center']"
    :popper-class="ns.e('popover')"
    :y-offset="-15"
    :x-offset="15"
  >
    <template #reference>
      <TkIcon :icon="settingIcon" :size="22" class="setting-icon" />
    </template>
    <div :class="ns.e('content')">
      <slot name="teek-theme-enhance-top" />

      <template v-if="!disabledList.layoutSwitch">
        <LayoutSwitch />
        <LayoutPageWidthSlide />
        <LayoutDocWidthSlide />
      </template>

      <template v-if="!disabledList.themeColor">
        <ThemeColor />
      </template>

      <template v-if="!disabledList.spotlight">
        <Spotlight />
        <SpotlightStyle />
      </template>

      <slot name="teek-theme-enhance-bottom" />
    </div>
  </TkPopover>
</template>

<script setup lang="ts" name="ThemeEnhance">
import { useData } from 'vitepress';
import {
  ns,
  mobileMaxWidthMedia,
  themeColorStorageKey,
  varNameList,
  TkIcon,
  TkPopover,
  isClient,
  ThemeColorName,
  ThemeEnhance,
  useMediaQuery,
  useStorage,
  useTeekConfig,
} from 'vitepress-theme-teek';
import { computed, nextTick, ref, watch } from 'vue';
import LayoutSwitch from 'vitepress-theme-teek/es/components/theme/ThemeEnhance/src/LayoutSwitch.vue';
import LayoutPageWidthSlide from 'vitepress-theme-teek/es/components/theme/ThemeEnhance/src/LayoutPageWidthSlide.vue';
import LayoutDocWidthSlide from 'vitepress-theme-teek/es/components/theme/ThemeEnhance/src/LayoutDocWidthSlide.vue';
import ThemeColor from 'vitepress-theme-teek/es/components/theme/ThemeEnhance/src/ThemeColor.vue';
import Spotlight from 'vitepress-theme-teek/es/components/theme/ThemeEnhance/src/Spotlight.vue';
import SpotlightStyle from 'vitepress-theme-teek/es/components/theme/ThemeEnhance/src/SpotlightStyle.vue';
import { useExtraThemeColor } from '../composables/useExtraThemeColor.js';

const settingIcon = `<svg viewBox="0 0 1024 1024" width="48" height="48">
  <path d="M512 341.33c-94.1 0-170.67 76.56-170.67 170.67S417.9 682.67 512 682.67 682.67 606.1 682.67 512 606.1 341.33 512 341.33z m0 256c-47.06 0-85.33-38.27-85.33-85.33s38.27-85.33 85.33-85.33 85.33 38.27 85.33 85.33-38.27 85.33-85.33 85.33z" fill="currentColor" />
  <path d="M942.4 587.83C913.77 573.1 896 544.04 896 512s17.77-61.1 46.4-75.83c17.96-9.25 26.96-29.83 21.58-49.29-21-76.06-61.71-146.46-117.73-203.56-14.15-14.44-36.44-16.98-53.48-6.04-27.06 17.35-61.06 18.19-88.77 2.17-27.85-16.06-44.12-46.1-42.48-78.35 1.04-20.23-12.29-38.4-31.9-43.48-76.42-19.83-158.83-19.83-235.25 0-19.6 5.08-32.94 23.25-31.9 43.48 1.65 32.25-14.62 62.29-42.48 78.35-27.69 16.02-61.69 15.19-88.77-2.17-17.06-10.94-39.35-8.38-53.48 6.04-55.98 57.06-96.69 127.46-117.73 203.54-5.38 19.48 3.62 40.06 21.58 49.31C110.23 450.9 128 479.96 128 512s-17.77 61.1-46.4 75.83c-17.96 9.25-26.96 29.83-21.58 49.31 21.04 76.08 61.75 146.48 117.73 203.54 14.15 14.42 36.44 16.96 53.48 6.04 27.08-17.33 61.08-18.17 88.77-2.17 27.85 16.06 44.12 46.1 42.48 78.35-1.04 20.23 12.29 38.4 31.9 43.48 38.21 9.92 77.77 14.94 117.62 14.94s79.42-5.02 117.62-14.94c19.6-5.08 32.94-23.25 31.9-43.48-1.65-32.25 14.62-62.29 42.48-78.35 27.71-16 61.71-15.17 88.77 2.17 17.04 10.92 39.31 8.35 53.48-6.04 56-57.1 96.71-127.48 117.73-203.56 5.37-19.45-3.63-40.04-21.58-49.29z m-69.96 55.52c-15.23 41.65-37.85 80.67-66.67 115.04-47.06-17.5-99.81-13.52-144.44 12.25-44.88 25.92-74.73 69.85-82.96 119.62-43.62 7.62-89.12 7.62-132.75 0-8.23-49.77-38.08-93.71-82.96-119.62-44.62-25.75-97.42-29.73-144.44-12.25-28.81-34.35-51.42-73.38-66.67-115.04 38.77-32 61.77-79.73 61.77-131.35s-23-99.35-61.77-131.35c15.25-41.67 37.85-80.69 66.67-115.04 47.02 17.48 99.79 13.48 144.44-12.25 44.88-25.92 74.73-69.85 82.96-119.62 43.62-7.63 89.12-7.63 132.75 0 8.23 49.77 38.08 93.71 82.96 119.62 44.62 25.73 97.4 29.75 144.44 12.25 28.83 34.38 51.44 73.4 66.67 115.02-38.77 32.02-61.77 79.75-61.77 131.38s23 99.34 61.77 131.34z" fill="currentColor"/>
</svg>`;

defineOptions({ name: 'ThemeEnhance' });

const { isDark } = useData();
const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>('themeEnhance', { position: 'top' });

const isMobile = useMediaQuery(mobileMaxWidthMedia);
const themeColorName = useStorage(themeColorStorageKey,
  themeEnhanceConfig.value.themeColor?.defaultColorName || ThemeColorName.vpDefault);

const themeColor = ref();

const disabledList = computed(() => {
  return {
    layoutSwitch: themeEnhanceConfig.value.layoutSwitch?.disabled ?? false,
    themeColor: themeEnhanceConfig.value.themeColor?.disabled ?? false,
    spotlight: themeEnhanceConfig.value.spotlight?.disabled ?? false
  };
});

const { start: startExtraTheme, stop: stopExtraTheme } = useExtraThemeColor(themeColor);

// 同步主题色
const syncThemeColor = async () => {
  await nextTick();
  const computedStyle = getComputedStyle(document.documentElement);
  themeColor.value = computedStyle.getPropertyValue(varNameList.vpBrand1);
}

watch([themeColorName, isDark], async () => {
  if (!isClient) return;
  await syncThemeColor();
  if (disabledList.value.themeColor) {
    stopExtraTheme();
  } else {
    startExtraTheme();
  }
}, { immediate: true });


</script>
<style lang="scss" scoped>
.setting-icon:hover {
  color: var(--vp-c-tip-1);
}
</style>
