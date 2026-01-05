<template>
  <div class="cursor-setting" title="鼠标样式设置">
    <div v-if="!isMobile && enabled" @click="openSetting" class="setting-btn">
      <TkIcon :icon="cursorIcon" :size="22" />
    </div>
    <div class="tk-popover cursor-setting-container" v-show="visible">
      <BaseTemplate
        :icon="themeIcon"
        :title="themeInfo.title"
        :helper="!isMobile"
        :helper-desc="themeInfo.desc"
      >
        <div class="theme-container">
          <div
            class="cursor-item"
            v-for="cursor in cursorThemeList"
            :key="cursor.value"
            @click="changeType(cursor.value)"
          >
            <div :class="['icon', {
              'is-active': cursorConfig.theme === cursor.value,
              'is-custom': cursor.isCustom,
            }]">
              <img class="no-preview" :src="cursor.icon" alt="" />
            </div>
            <div class="label">{{ cursor.label }}</div>
          </div>
        </div>
      </BaseTemplate>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import {
  TkThemeEnhanceBaseTemplate as BaseTemplate,
  TkIcon,
  useCommon,
  useStorage,
} from 'vitepress-theme-teek';
import { useCursor } from '../composables/useCursor';
import { usePulseConfig } from '../composables/usePulseConfig';
import { cursorList } from '../config/pulseConfig';

const cursorIcon = `<svg class="icon" viewBox="0 0 1024 1024" width="48" height="48">
  <path d="M768 649.6a43.52 43.52 0 0 0-7.68-15.36L640 492.16l39.68-35.84a46.72 46.72 0 0 0 14.72-42.88 47.36 47.36 0 0 0-30.72-35.2L351.36 274.56a47.36 47.36 0 0 0-64 50.56l42.88 320a47.36 47.36 0 0 0 18.56 30.72 49.28 49.28 0 0 0 58.24 0L448 640l32 38.4 64 80 20.48 23.68a35.2 35.2 0 0 0 11.52 10.24 49.28 49.28 0 0 0 54.4-3.84l37.76-30.72 76.8-64a43.52 43.52 0 0 0 17.28-31.36 36.48 36.48 0 0 0 5.76-12.8zM128 336V192a64 64 0 0 1 64-64h128V64H192a128 128 0 0 0-128 128v144zM704 128h128a64 64 0 0 1 64 64v144h64V192a128 128 0 0 0-128-128h-128zM896 720V832a64 64 0 0 1-64 64h-128v64h128a128 128 0 0 0 128-128v-112zM320 896H192a64 64 0 0 1-64-64v-112H64V832a128 128 0 0 0 128 128h128z" fill="#fff"/>
</svg>`;
const themeIcon = `<svg class="icon" viewBox="0 0 1088 1024" xmlns="http://www.w3.org/2000/svg" width="48" height="48" style="transform: translateY(2px)">
  <path d="M739.2 342.464a213.312 213.312 0 1 0-217.6 125.632 298.432 298.432 0 0 1 217.6-125.632z m-145.92 423.168a298.432 298.432 0 0 0 0.064-251.328 213.312 213.312 0 1 1 0 251.392zM299.776 427.776a298.432 298.432 0 0 0 217.664 125.696 213.376 213.376 0 1 1-217.6-125.696z" fill="#5887E1" />
</svg>`;
const themeInfo = {
  title: '鼠标指针皮肤',
  desc: '点击可快速切换鼠标指针皮肤，仅在该网站内生效；右上角的“+”表示自定义皮肤，可参考对应文档配置自定义指针皮肤',
};

const { isMobile } = useCommon();
const { getPulseConfig } = usePulseConfig();
const { enabled, theme, append } = getPulseConfig('cursor');

const visible = ref(false);
const cursorConfig = useStorage('pulse:cursorConfig', {
  theme
});

const config = computed(() => ({
  enabled,
  ...cursorConfig.value
}));
const cursorThemeList = computed(() => {
  const innerThemeKeys = cursorList.map(item => item.value);
  const customThemeList = append.filter(x => !innerThemeKeys.includes(x.key)).map(item => {
    const icon = item.default.url;
    return {
      label: item.label,
      value: item.key,
      icon,
      isCustom: true,
    };
  });
  return [
    ...cursorList,
    ...customThemeList,
  ];
});

useCursor(config, append || []);

const openSetting = () => {
  visible.value = !visible.value;
}

const closeSetting = (e: Event) => {
  const cursorSetting = document.querySelector('.cursor-setting');
  const isCursor = cursorSetting.contains(e.target as Element);
  if (!isCursor) {
    visible.value = false;
  }
}

const changeType = (val: string) => {
  cursorConfig.value.theme = val;
}

onMounted(() => {
  window.addEventListener('click', closeSetting);
});
onUnmounted(() => {
  window.removeEventListener('click', closeSetting);
});
</script>

<style scoped lang="scss">
@use '../styles/cursor/index.scss' as cursor;

.cursor-setting {
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 40px;
  height: 40px;
}
.setting-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--pulse-brand-gr) 0%, var(--pulse-brand-5) 100%);
  box-shadow: 0 4px 10px var(--pulse-brand-tr-5);
  transition: all 0.3s ease;
  cursor: cursor.$pointer;
  z-index: 999;
  &:hover {
    background: linear-gradient(45deg, var(--pulse-brand-gr-br-1) 0%, var(--pulse-brand-gr-br-2) 100%);
    transform: scale(0.95);
    box-shadow: 0 6px 20px var(--pulse-brand-tr-5);
  }
}
.cursor-setting-container {
  position: fixed;
  bottom: 118px;
  right: 20px;
  width: 280px;
  height: 250px;
}
.theme-container {
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(4, 1fr);
}
.cursor-item {
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.1s ease;
    cursor: cursor.$pointer;
    &.is-custom::before {
      content: '+';
      position: absolute;
      top: 0;
      right: 0;
      width: 10px;
      height: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      font-weight: bold;
      border-radius: 0 0 0 6px;
      background-color: #4CAF50;
      color: #fff;
    }
    &:hover, &.is-active {
      border: 2px solid var(--tk-theme-color);
    }
    img {
      width: 32px;
      height: 32px;
    }
  }
  .label {
    width: 100%;
    height: 20px;
    line-height: 20px;
    color: var(--tk-popover-color);
    font-size: 10px;
    text-align: center;
  }
}
</style>