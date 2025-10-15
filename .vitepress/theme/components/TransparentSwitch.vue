<template>
  <BaseTemplate
    :class="ns"
    :icon="transparentIcon"
    :title="tipInfo.title"
    :helper="!isMobile"
    :helper-desc="tipInfo.desc"
  >
    <TkSwitch v-model="isTransparent" />
    <div v-if="isTransparent" class="inner-box">
      毛玻璃效果：<TkSwitch v-model="isBlur" />
    </div>
    <div v-if="isBlur" class="inner-box">
      <span style="flex: 0 0 70px">模糊程度：</span>
      <TkInputSlide
        class="thin-slide"
        v-model="blurSize"
        :disabled="isMobile"
        :min="1"
        :max="10"
      />
    </div>
  </BaseTemplate>
</template>

<script setup lang="ts">
import {
  TkThemeEnhanceBaseTemplate as BaseTemplate,
  TkSwitch,
  TkInputSlide,
  useCommon,
  useStorage,
} from 'vitepress-theme-teek';
import { watch } from 'vue';

const ns = 'transparent';
const transparentIcon = `<svg class="icon" viewBox="0 0 1024 1024" width="48" height="48">
  <path d="M62.877561 957.189362c0-99.188047 0-198.37507 0-297.56414 99.509365 0 199.018729-0.001023 298.527071-0.001023 0.001023 0.641613 0.002047 1.284249 0.00307 1.927909-0.001023 98.866728-0.00307 197.733457-0.004093 296.601208-99.187023 0-198.37507 0-297.563116 0C63.520197 957.831998 63.198879 957.509656 62.877561 957.189362z" fill="#F5F5F7"></path>
  <path d="M62.877561 362.063129c0-97.903797 0.021489-195.807594-0.092098-293.711392-0.004093-3.297093 0.64673-3.947915 3.943822-3.943822 98.224092 0.113587 196.449207 0.092098 294.6733 0.092098 0.002047 99.18907 0.00307 198.37814 0.005117 297.568233C261.89936 362.065176 162.387949 362.065176 62.877561 362.063129z" fill="#EDECF0"></path>
  <path d="M955.567933 958.152293c-98.866728 0-197.733457 0-296.600185 0-0.001023-1.284249-0.002047-2.569522-0.00307-3.852748 0.001023-98.226139 0.002047-196.452277 0.00307-294.676369 99.187023 0 198.37507 0.001023 297.563116 0.001023 0 99.18907 0 198.376093 0 297.56414C956.210569 957.509656 955.888228 957.831998 955.567933 958.152293z" fill="#F5F5F7"></path>
  <path d="M658.962631 362.067222c0.002047-99.18907 0.00307-198.37814 0.005117-297.568233 97.904821 0 195.807594 0.021489 293.711392-0.092098 3.296069-0.00307 3.946892 0.64673 3.943822 3.943822-0.113587 97.903797-0.092098 195.807594-0.092098 293.711392C857.340771 362.065176 758.152724 362.066199 658.962631 362.067222z" fill="#EDECF0"></path>
  <path d="M62.877561 957.189362c0.321318 0.320295 0.641613 0.642636 0.962931 0.962931C63.012637 958.338534 62.691319 958.017216 62.877561 957.189362z" fill="#FBFBFC"></path>
  <path d="M955.567933 958.152293c0.320295-0.320295 0.642636-0.642636 0.962931-0.962931C956.718129 958.017216 956.395788 958.338534 955.567933 958.152293z" fill="#FDFDFD"></path>
  <path d="M658.964678 954.300568c-1.341554-0.187265-1.916653-0.994654-1.907443-2.309602 0.010233-1.443885-0.014326-2.886747-0.014326-4.330632-0.001023-93.051279 0-186.100512-0.002047-279.151791 0-6.948249-0.00614-6.955412-6.856152-6.955412-96.259344-0.001023-192.517665-0.001023-288.777009-0.001023-0.001023-0.64366-0.002047-1.286296-0.00307-1.927909l-0.00307 0.00307c99.18907 0 198.379163 0 297.568233 0l-0.002047-0.00307C658.966725 757.848291 658.965701 856.073406 658.964678 954.300568z" fill="#FDFDFD"></path>
  <path d="M658.969794 659.627269c-99.18907 0-198.37814 0-297.568233 0 0-99.190093 0-198.379163 0-297.568233 99.190093 0 198.379163 0 297.569256 0C658.970818 461.248106 658.970818 560.437176 658.969794 659.627269z" fill="#F1F1F4"></path>
</svg>`;
const tipInfo = {
  title: '透明化',
  desc: '部分元素背景透明化，支持设置毛玻璃效果以及模糊程度',
};

const emit = defineEmits<{
  change: [config: boolean];
}>();

const { isMobile } = useCommon();
const isTransparent = useStorage('tk:transparent', false);
const isBlur = useStorage('tk:blur', false);
const blurSize = useStorage('tk:blur-size', 5);

const setBodyClass = () => {
  const body = document.body;
  if (isTransparent.value) {
    body.classList.add('tk-transparent');
  } else {
    body.classList.remove('tk-transparent');
  }
  if (isTransparent.value && isBlur.value) {
    body.classList.add('tk-blur');
  } else {
    body.classList.remove('tk-blur');
  }
  if (isBlur.value && blurSize.value) {
    body.style.setProperty('--tk-blur-size', `${blurSize.value}px`);
  } else {
    body.style.removeProperty('--tk-blur-size');
  }
}

watch([isTransparent, isBlur, blurSize], () => {
  setBodyClass();
  emit('change', isTransparent.value);
}, { immediate: true });
</script>

<style scoped lang="scss">
.inner-box {
  display: flex;
  align-items: center;
}
.thin-slide:deep {
  margin-top: 8px;
  .tk-input-slide__label, .tk-input-slide__label__input {
    height: 18px !important;
  }
  input[type="range"] {
    &::-webkit-slider-thumb, &::-webkit-slider-runnable-track {
      height: 18px;
    }
    &::-moz-range-thumb, &::-moz-range-track {
      height: 18px;
    }
    &::-ms-thumb, &::-ms-track {
      height: 18px;
    }
  }
}
</style>