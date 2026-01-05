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
      <span style="flex: 0 0 70px">透明度：</span>
      <TkInputSlide
        class="thin-slide"
        v-model="opacity"
        :min="0.5"
        :max="1"
        :step="0.05"
      />
    </div>
    <div v-if="isTransparent" class="inner-box">
      毛玻璃效果：<TkSwitch v-model="isBlur" />
    </div>
    <div v-if="isTransparent && isBlur" class="inner-box">
      <span style="flex: 1 0 80px">模糊程度：</span>
      <TkInputSlide
        class="thin-slide"
        v-model="blurSize"
        :min="1"
        :max="20"
      />
    </div>
  </BaseTemplate>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue';
import { useData } from 'vitepress';
import {
  varNameList,
  isClient,
  TkInputSlide,
  TkSwitch,
  TkThemeEnhanceBaseTemplate as BaseTemplate,
  themeColorStorageKey,
  themeBgColorStorageKey,
  useCommon,
  useStorage,
  hexToRgb,
  getLightColor,
  getDarkColor,
} from 'vitepress-theme-teek';
import { useCssVars } from '../composables/useCssVars';

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
  desc: '部分元素背景透明化，支持单独设置透明程度、毛玻璃效果以及模糊程度',
};

const styleId = 'transparent-blur';
const bgColorStyleId = 'transparent-bg-color';

const { isDark } = useData();
const { isMobile } = useCommon();
const { setCSSVariables, removeCSSVariableStyle } = useCssVars();

const themeColorName = useStorage(themeColorStorageKey, '');
const isSpread = useStorage(themeBgColorStorageKey, false);
const isTransparent = useStorage('tk:transparent', false);
const opacity = useStorage('tk:opacity', 0.7);
const isBlur = useStorage('tk:blur', false);
const blurSize = useStorage('tk:blur-size', 5);

const hexToRgba = (hex: string, alpha: number) => {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(hex)) {
    console.error("[Pulse Error] 输入错误的 hex");
    return hex;
  }
  if (alpha < 0 || alpha > 1) {
    console.error("[Pulse Error] alpha必须为0~1之间的数字");
    return hex;
  }

  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getBrandColor = async (alpha: number) => {
  await nextTick();
  const computedStyle = getComputedStyle(document.documentElement);
  const brand1 = computedStyle.getPropertyValue(varNameList.vpBrand1);
  const brand2 = computedStyle.getPropertyValue(varNameList.vpBrand2);
  const brand3 = computedStyle.getPropertyValue(varNameList.vpBrand3);
  return {
    brand1,
    brand2,
    brand3,
    brandTr1: hexToRgba(brand1, alpha),
    brandTr2: hexToRgba(brand2, alpha),
    brandTr3: hexToRgba(brand3, alpha),
  }
}

const getColorByTheme = (color: string, deep: number, alpha: number) => {
  const getColor = isDark.value ? getDarkColor : getLightColor;
  return hexToRgba(getColor(color, deep) || color, alpha);
};

const generateDarkSpreadColorVars = (color: string, alpha: number) => {
  const softColor = getColorByTheme(color, 0.89, alpha);
  const navColor = getColorByTheme(color, 0.88, alpha);
  const elmColor = getColorByTheme(color, 0.87, alpha);

  return {
    '--pulse-soft-bg-color': softColor,
    '--pulse-sidebar-bg-color': softColor,
    '--pulse-nav-bg-color': navColor,
    '--pulse-deep-bg-color': elmColor,
    '--pulse-alt-bg-color': softColor,
  }
}

const generateLightSpreadColorVars = (color: string, alpha: number) => {
  const softColor = getColorByTheme(color, 0.88, alpha);
  const navColor = getColorByTheme(color, 0.91, alpha);
  const elmColor = getColorByTheme(color, 0.895, alpha);

  return {
    '--pulse-soft-bg-color': softColor,
    '--pulse-sidebar-bg-color': softColor,
    '--pulse-nav-bg-color': navColor,
    '--pulse-deep-bg-color': elmColor,
    '--pulse-alt-bg-color': softColor,
  }
}

const generateSpreadColorVars = (color: string, alpha: number) => {
  return isDark.value ? generateDarkSpreadColorVars(color, alpha) : generateLightSpreadColorVars(color, alpha);
}

const generateColorCssVars = async (alpha: number) => {
  const { brand1, brandTr1, brandTr2, brandTr3 } = await getBrandColor(alpha);
  const brandColorVars = {
    '--pulse-brand1-color': brandTr1,
    '--pulse-brand2-color': brandTr2,
    '--pulse-brand3-color': brandTr3,
  };

  const deepAlpha = alpha >= 1 ? alpha : Number(Math.min(alpha + 0.05, 0.95).toFixed(2));
  const alphaAdd = Number(Math.min(alpha + 0.1, 1).toFixed(2));
  const spreadColorVars = isSpread.value ? generateSpreadColorVars(brand1, alpha) : {};
  const colorVars = isDark.value ? {
    '--pulse-nav-bg-color': `rgba(27, 27, 31, ${alpha})`,
    '--pulse-sidebar-bg-color': `rgba(22, 22, 24, ${alpha})`,
    '--pulse-elv-bg-color': `rgba(32, 33, 39, ${alpha})`,
    '--pulse-soft-bg-color': `rgba(32, 33, 39, ${alpha})`,
    '--pulse-deep-bg-color': `rgba(22, 22, 24, ${deepAlpha})`,
    '--pulse-alt-bg-color': `rgba(50, 54, 63, ${alpha})`,
    '--pulse-alt-bg-hover': `rgba(65, 72, 83, ${alphaAdd})`,
    '--pulse-border-color': `rgba(46, 46, 50, ${alphaAdd})`,
    '--pulse-divider-color': `rgba(0, 0, 0, ${alpha})`,
  } : {
    '--pulse-nav-bg-color': `rgba(255, 255, 255, ${alpha})`,
    '--pulse-sidebar-bg-color': `rgba(246, 246, 247, ${alpha})`,
    '--pulse-elv-bg-color': `rgba(255, 255, 255, ${alpha})`,
    '--pulse-soft-bg-color': `rgba(246, 246, 247, ${alpha})`,
    '--pulse-deep-bg-color': `rgba(246, 246, 247, ${deepAlpha})`,
    '--pulse-alt-bg-color': `rgba(235, 235, 239, ${alpha})`,
    '--pulse-alt-bg-hover': `rgba(228, 228, 233, ${alphaAdd})`,
    '--pulse-border-color': `rgba(226, 226, 227, ${alphaAdd})`,
    '--pulse-divider-color': `rgba(226, 226, 227, ${alpha})`,
  };

  return {
    ...brandColorVars,
    ...colorVars,
    ...spreadColorVars,
  }
}

watch([isTransparent, isBlur, opacity, blurSize, isDark, themeColorName, isSpread], async ([transparent, blur, op, bl]) => {
  if (!isClient) return;

  if (!transparent) {
    document.documentElement.classList.remove('pulse-transparent');
    document.documentElement.classList.remove('pulse-transparent-blur');
    removeCSSVariableStyle(styleId);
    removeCSSVariableStyle(bgColorStyleId);
  } else {
    const cssVars = {
      '--pulse-opacity': op.toString(),
      '--pulse-blur-size': `${bl}px`,
      '--pulse-deep-blur': `${bl + 2}px`,
    };
    setCSSVariables(styleId, cssVars);
    const colorCssVars = await generateColorCssVars(op);
    setCSSVariables(bgColorStyleId, colorCssVars);
    if (blur) {
      document.documentElement.classList.remove('pulse-transparent');
      document.documentElement.classList.add('pulse-transparent-blur');
    } else {
      document.documentElement.classList.remove('pulse-transparent-blur');
      document.documentElement.classList.add('pulse-transparent');
    }
  }
}, { immediate: true });
</script>

<style scoped lang="scss">
.inner-box {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
:deep(.thin-slide) {
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