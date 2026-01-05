<template>
  <Transition :name="transitionName">
    <BaseTemplate
      v-if="spotlightToggledOn"
      :icon="clickIcon"
      :title="t('tk.themeEnhance.spotlightStyles.title')"
      :helper="!themeEnhanceConfig.spotlight?.disableHelp"
      :helper-desc="t('tk.themeEnhance.spotlightStyles.helpDesc')"
      :tips
      :disabled="supportTouch"
    >
      <TkSegmented v-model="spotlightStyle" :options="segmentedOptions" :disabled="supportTouch" />
    </BaseTemplate>
  </Transition>
</template>

<script setup lang="ts">
import type { ThemeEnhance } from 'vitepress-theme-teek';
import { computed } from 'vue';
import {
  SpotlightStyle,
  useStorage,
  useMediaQuery,
  useLocale,
  useTeekConfig,
  clickIcon,
  alignLeftIcon,
  alignTextLeftIcon,
  touchMedia,
  spotlightStyleStorageKey,
  spotlightStorageKey,
  transitionName,
  TkSegmented,
  TkThemeEnhanceBaseTemplate as BaseTemplate,
} from 'vitepress-theme-teek';

defineOptions({ name: 'SpotlightStyle' });

const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>('themeEnhance', {});
const { t } = useLocale();

const spotlightStyle = useStorage(
  spotlightStyleStorageKey,
  themeEnhanceConfig.value.spotlight?.defaultStyle || SpotlightStyle.Aside
);
const spotlightToggledOn = useStorage(spotlightStorageKey, themeEnhanceConfig.value.spotlight?.defaultValue ?? true);
const supportTouch = useMediaQuery(touchMedia);

const content = computed(() => [
  {
    value: SpotlightStyle.Aside,
    title: t('tk.themeEnhance.spotlightStyles.asideTipTitle'),
    helpMessage: t('tk.themeEnhance.spotlightStyles.asideHelpTipContent'),
    ariaLabel: t('tk.themeEnhance.spotlightStyles.asideTipTitle'),
    icon: alignLeftIcon
  },
  {
    value: SpotlightStyle.Under,
    title: t('tk.themeEnhance.spotlightStyles.underTipTitle'),
    helpMessage: t('tk.themeEnhance.spotlightStyles.underHelpTipContent'),
    ariaLabel: t('tk.themeEnhance.spotlightStyles.underTipTitle'),
    icon: alignTextLeftIcon
  }
]);

const segmentedOptions = computed(() =>
  content.value.map(item => ({
    value: item.value,
    title: item.title,
    ariaLabel: item.ariaLabel,
    icon: item.icon
  }))
);

const tips = computed(() =>
  content.value.map(item => ({
    title: item.title,
    icon: item.icon,
    content: item.helpMessage
  }))
);
</script>
