<template>
  <BaseTemplate
    :class="ns"
    :icon="bannerIcon"
    :title="tipInfo.title"
    :helper="!isMobile"
    :helper-desc="tipInfo.desc"
  >
    <TkSwitch v-model="isTop" />
  </BaseTemplate>
</template>

<script setup lang="ts">
import {
  TkThemeEnhanceBaseTemplate as BaseTemplate,
  TkSwitch,
  useCommon,
  useStorage,
} from 'vitepress-theme-teek';
import { watch } from 'vue';

const ns = 'banner-top';
const bannerIcon = `<svg viewBox="0 0 1365 1024">
  <path d="M170.666667 113.777778a56.888889 56.888889 0 0 0-56.888889 56.888889v682.666666a56.888889 56.888889 0 0 0 56.888889 56.888889h1024a56.888889 56.888889 0 0 0 56.888889-56.888889V170.666667a56.888889 56.888889 0 0 0-56.888889-56.888889H170.666667z m0-113.777778h1024a170.666667 170.666667 0 0 1 170.666666 170.666667v682.666666a170.666667 170.666667 0 0 1-170.666666 170.666667H170.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V170.666667a170.666667 170.666667 0 0 1 170.666667-170.666667z" fill="#606266" p-id="6612"></path><path d="M398.222222 796.444444m-56.888889 0a56.888889 56.888889 0 1 0 113.777778 0 56.888889 56.888889 0 1 0-113.777778 0Z" fill="#606266" p-id="6613"></path><path d="M568.888889 796.444444m-56.888889 0a56.888889 56.888889 0 1 0 113.777778 0 56.888889 56.888889 0 1 0-113.777778 0Z" fill="#606266" p-id="6614"></path><path d="M682.666667 739.555556m56.888889 0l227.555555 0q56.888889 0 56.888889 56.888888l0 0q0 56.888889-56.888889 56.888889l-227.555555 0q-56.888889 0-56.888889-56.888889l0 0q0-56.888889 56.888889-56.888888Z" fill="currentColor"/>
</svg>`;
const tipInfo = {
  title: '轮播图置顶',
  desc: '轮播图默认在VP配置之后，开启后可将其移动至顶部',
};

const emit = defineEmits<{
  change: [config: boolean];
}>();

const { isMobile } = useCommon();
const isTop = useStorage('tk:bannerTop', false);

watch(isTop, () => {
  emit('change', isTop.value);
}, { immediate: true });

</script>

<style scoped lang="scss">

</style>