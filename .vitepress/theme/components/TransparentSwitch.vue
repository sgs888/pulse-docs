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
  </BaseTemplate>
  <BaseTemplate
    v-if="isTransparent"
    class="blur"
    :icon="blurIcon"
    :title="blurTipInfo.title"
    :helper="!isMobile"
    :helper-desc="blurTipInfo.desc"
  >
    <TkSwitch v-model="isBlur" />
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
  desc: '部分元素背景透明化，支持设置透明程度；支持主题扩散',
};
const blurIcon = `<svg class="icon" viewBox="0 0 1024 1024"  width="48" height="48">
  <path d="M182.592 85.312h-11.968c-47.104 0-85.312 38.208-85.312 85.376v11.904l97.28-97.28zM85.312 303.36v-60.352l157.568-157.568h60.352L85.312 303.296z m0 120.64v-60.288l278.272-278.336h60.352L85.312 424z m0 120.704v-60.352l398.976-398.976h60.288L85.312 544.64z m0 120.704v-60.352l519.68-519.68h60.288L493.568 257.152a159.36 159.36 0 0 1 56.704 3.584l175.36-175.36h60.352L593.152 278.272c12.416 7.36 23.68 16.448 33.344 26.88l219.776-219.776h7.04c15.36 0 29.76 4.096 42.24 11.2l-245.12 245.056c6.656 15.04 10.496 31.68 10.88 49.472l264.832-264.832c7.936 12.928 12.48 28.16 12.48 44.48v3.328L654.08 458.624a213.12 213.12 0 0 1-17.6 48.384c6.912 3.072 13.568 6.272 19.968 9.6l282.24-282.24v60.352l-244.672 244.672c13.312 9.28 24.64 18.432 33.792 26.56l210.88-210.88v60.288l-184.32 184.448c7.68 15.04 11.776 31.296 13.184 47.104l171.136-171.2v60.352l-402.56 402.56h-60.352L646.336 768h-60.288L415.36 938.688h-60.352L525.696 768H465.28l-170.688 170.688h-60.352L404.992 768h-39.936c-6.4 0-12.672-0.512-18.816-1.6L174.08 938.688h-3.392c-16.256 0-31.488-4.608-44.48-12.48l177.28-177.28a109.76 109.76 0 0 1-29.824-30.528l-177.152 177.152a84.928 84.928 0 0 1-11.136-42.24v-6.976l171.776-171.776a131.328 131.328 0 0 1 10.88-71.168L85.312 785.92v-60.352l282.112-282.048a260.352 260.352 0 0 1-4.672-55.68l-277.44 277.44z m571.392 273.28h-60.352l342.272-342.208v60.352l-281.92 281.92z m120.704 0h-60.352l221.568-221.568v60.352l-161.28 161.28z m161.28-100.864v15.616c0 47.104-38.272 85.312-85.376 85.312h-15.616l100.928-100.928zM512 298.688c-58.88 0-106.688 42.496-106.688 94.976a206.592 206.592 0 0 0 9.344 62.976 169.152 169.152 0 0 0 19.2 41.152c8 12.16 17.408 22.464 27.904 30.336a282.624 282.624 0 0 0-98.688 40.512 316.416 316.416 0 0 0-40.32 30.848 70.4 70.4 0 0 0-18.752 28.16c-3.648 9.856-5.376 20.48-5.376 31.296a66.112 66.112 0 0 0 35.84 58.944c9.152 4.736 19.52 7.488 30.592 7.488h293.888c36.608 0 66.368-29.76 66.368-66.432 0-9.024-1.216-17.984-3.776-26.496a71.552 71.552 0 0 0-24.064-36.224 317.632 317.632 0 0 0-72.96-47.744 283.84 283.84 0 0 0-44.16-16.128 264.32 264.32 0 0 0-16.064-3.84c24.576-17.856 43.072-49.088 50.624-91.136 2.432-13.44 3.712-28.096 3.712-43.712 0-6.272-0.64-12.416-1.92-18.304a90.176 90.176 0 0 0-20.48-39.936 105.152 105.152 0 0 0-34.56-25.792 116.736 116.736 0 0 0-49.344-10.944H512zM381.44 489.856l-45.44 45.44c15.36-10.24 33.152-20.288 53.312-29.056a206.912 206.912 0 0 1-7.872-16.384z" />
</svg>`;
const blurTipInfo = {
  title: '背景模糊',
  desc: '开启透明化的场景下，部分元素支持背景模糊，支持设置模糊大小；透明度为1时失效',
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
  const softColor = getColorByTheme(color, 0.94, alpha);
  const navColor = getColorByTheme(color, 0.93, alpha);
  const elmColor = getColorByTheme(color, 0.92, alpha);

  return {
    '--pulse-soft-bg-color': softColor,
    '--pulse-sidebar-bg-color': softColor,
    '--pulse-nav-bg-color': navColor,
    '--pulse-deep-bg-color': elmColor,
    '--pulse-alt-bg-color': softColor,
  }
}

const generateLightSpreadColorVars = (color: string, alpha: number) => {
  const softColor = getColorByTheme(color, 0.93, alpha);
  const navColor = getColorByTheme(color, 0.96, alpha);
  const elmColor = getColorByTheme(color, 0.945, alpha);

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