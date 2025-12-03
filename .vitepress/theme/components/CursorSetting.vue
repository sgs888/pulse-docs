<template>
  <div class="cursor-setting" title="鼠标样式设置">
    <div v-if="!isMobile && enabled" class="setting-btn">
      <TkIcon :icon="cursorIcon" :size="22" @click="openSetting" />
    </div>
    <div class="tk-popover cursor-setting-container" v-show="visible">
      <div
        class="cursor-item"
        v-for="cursor in cursorList"
        :key="cursor.value"
        @click="changeType(cursor.value)"
      >
        <div :class="['icon', { 'is-active': cursorConfig.theme === cursor.value }]">
          <img :src="cursor.icon" alt="" />
        </div>
        <div class="label">{{ cursor.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import {
  TkIcon,
  useCommon,
  useStorage,
} from 'vitepress-theme-teek';
import { useCursor } from '../composables/useCursor';
import { usePulseConfig } from '../composables/usePulseConfig';
import { type Cursor, cursorList } from '../config/pulseConfig';

const cursorIcon = `<svg class="icon" viewBox="0 0 1024 1024" width="48" height="48">
  <path d="M768 649.6a43.52 43.52 0 0 0-7.68-15.36L640 492.16l39.68-35.84a46.72 46.72 0 0 0 14.72-42.88 47.36 47.36 0 0 0-30.72-35.2L351.36 274.56a47.36 47.36 0 0 0-64 50.56l42.88 320a47.36 47.36 0 0 0 18.56 30.72 49.28 49.28 0 0 0 58.24 0L448 640l32 38.4 64 80 20.48 23.68a35.2 35.2 0 0 0 11.52 10.24 49.28 49.28 0 0 0 54.4-3.84l37.76-30.72 76.8-64a43.52 43.52 0 0 0 17.28-31.36 36.48 36.48 0 0 0 5.76-12.8zM128 336V192a64 64 0 0 1 64-64h128V64H192a128 128 0 0 0-128 128v144zM704 128h128a64 64 0 0 1 64 64v144h64V192a128 128 0 0 0-128-128h-128zM896 720V832a64 64 0 0 1-64 64h-128v64h128a128 128 0 0 0 128-128v-112zM320 896H192a64 64 0 0 1-64-64v-112H64V832a128 128 0 0 0 128 128h128z" fill="#fff"/>
</svg>`;

const { isMobile } = useCommon();
const { getPulseConfig } = usePulseConfig();
const { enabled, theme } = getPulseConfig('cursor');

const visible = ref(false);
const cursorConfig = useStorage('pulse:cursorConfig', {
  theme
});

const config = computed(() => ({
  enabled,
  ...cursorConfig.value
}));

useCursor(config);

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

const changeType = (val: Cursor) => {
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
  cursor: cursor.$pointer, pointer;
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
  height: 200px;
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
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.1s ease;
    cursor: cursor.$pointer, pointer;
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
    font-size: 12px;
    text-align: center;
  }
}
</style>