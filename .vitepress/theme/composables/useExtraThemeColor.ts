import { readonly, toValue, computed, watch, MaybeRef, shallowRef } from 'vue';
import { useData } from 'vitepress';
import { getLightColor, getDarkColor, isClient, hexToRgb } from 'vitepress-theme-teek';

const pulseBrand3 = '--pulse-brand-3';
const pulseBrand4 = '--pulse-brand-4';
const pulseBrand5 = '--pulse-brand-5';
const pulseBrand6 = '--pulse-brand-6';
const pulseBrand7 = '--pulse-brand-7';
const pulseBrand8 = '--pulse-brand-8';
const pulseBrand9 = '--pulse-brand-9';

const pulseBrandTr1 = '--pulse-brand-tr-1';
const pulseBrandTr2 = '--pulse-brand-tr-2';
const pulseBrandTr3 = '--pulse-brand-tr-3';
const pulseBrandTr4 = '--pulse-brand-tr-4';
const pulseBrandTr5 = '--pulse-brand-tr-5';
const pulseBrandTr6 = '--pulse-brand-tr-6';
const pulseBrandTr7 = '--pulse-brand-tr-7';
const pulseBrandTr8 = '--pulse-brand-tr-8';
const pulseBrandTr9 = '--pulse-brand-tr-9';

const pulseBrandGr = '--pulse-brand-gr';
const pulseBrandGr1 = '--pulse-brand-gr-1';
const pulseBrandGr2 = '--pulse-brand-gr-2';
const pulseBrandGr3 = '--pulse-brand-gr-3';
const pulseBrandBr = '--pulse-brand-br';
const pulseBrandGrBr1 = '--pulse-brand-gr-br-1';
const pulseBrandGrBr2 = '--pulse-brand-gr-br-2';
const pulseBrandGrBr3 = '--pulse-brand-gr-br-3';


const varNameList = [
  pulseBrand3,
  pulseBrand4,
  pulseBrand5,
  pulseBrand6,
  pulseBrand7,
  pulseBrand8,
  pulseBrand9,
  pulseBrandTr1,
  pulseBrandTr2,
  pulseBrandTr3,
  pulseBrandTr4,
  pulseBrandTr5,
  pulseBrandTr6,
  pulseBrandTr7,
  pulseBrandTr8,
  pulseBrandTr9,
  pulseBrandGr,
  pulseBrandGr1,
  pulseBrandGr2,
  pulseBrandGr3,
  pulseBrandBr,
  pulseBrandGrBr1,
  pulseBrandGrBr2,
  pulseBrandGrBr3,
];

/**
 * hex 转 rgba
 * @param hex
 * @param alpha 0~1之间的数字
 */
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
  const a = alpha * 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/**
 * hex 转 带透明度的hex
 * @param str hex
 * @param alpha 0~1之间的数字
 */
const hexToHexWidthAlpha = (str: string, alpha: number) => {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(str)) {
    console.error("[Pulse Error] 输入错误的 hex");
    return str;
  }
  if (alpha < 0 || alpha > 1) {
    console.error("[Pulse Error] alpha必须为0~1之间的数字");
    return str;
  }

  const alphaStr = Number((alpha * 255).toFixed(0)).toString(16);
  return `${str}${alphaStr}`;
};

const getTransparentColor = (color: string, alpha: number) => {
  return hexToHexWidthAlpha(color, alpha);
}

const hexToHSL = (hex: string) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const toHex = (val) => {
    const hex = Math.round(val * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

const gradientColor = (baseHex: string, hueShift: number = 20, steps: number = 3) => {
  const [h, s, l] = hexToHSL(baseHex);
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const newH = h + (hueShift * i / (steps - 1));
    colors.push(hslToHex(newH, s, l));
  }
  return colors;
}

const lightenColor = (hex: string, amount: number = 20) => {
  const [h, s, l] = hexToHSL(hex);
  const newL = Math.min(100, l + amount); // 限制最大为 100%
  return hslToHex(h, s, newL < 0 ? 0 : newL);
}

export const useExtraThemeColor = (color: MaybeRef<string>) => {
  const { isDark } = useData();

  // 主题色
  const themeColor = computed(() => toValue(color));
  const isStop = shallowRef(true);
  let stopWatch: ReturnType<typeof watch> | null = null;

  const setStyleVar = (key: string, value: string) => {
    if (!isClient) return;
    document.documentElement.style.setProperty(key, value);
  };

  const removeStyleVar = (key: string) => {
    if (!isClient) return;
    document.documentElement.style.removeProperty(key);
  };

  const clear = () => {
    Object.values(varNameList).forEach(key => {
      removeStyleVar(key);
    });
  }

  const switchTransparent = () => {
    if (!isClient) return;
    const color = themeColor.value;
    if (!color) return;

    const transparentColorMap = {
      [pulseBrandTr1]: getTransparentColor(color, 0.1),
      [pulseBrandTr2]: getTransparentColor(color, 0.2),
      [pulseBrandTr3]: getTransparentColor(color, 0.3),
      [pulseBrandTr4]: getTransparentColor(color, 0.4),
      [pulseBrandTr5]: getTransparentColor(color, 0.5),
      [pulseBrandTr6]: getTransparentColor(color, 0.6),
      [pulseBrandTr7]: getTransparentColor(color, 0.7),
      [pulseBrandTr8]: getTransparentColor(color, 0.8),
      [pulseBrandTr9]: getTransparentColor(color, 0.9),
    }

    Object.keys(transparentColorMap).forEach(key => {
      setStyleVar(key, transparentColorMap[key]);
    });
  };

  const switchLight = () => {
    if (!isClient) return;
    const color = themeColor.value;
    if (!color) return;

    const lightColorMap = {
      [pulseBrand3]: getLightColor(color, 0.3),
      [pulseBrand4]: getLightColor(color, 0.4),
      [pulseBrand5]: getLightColor(color, 0.5),
      [pulseBrand6]: getLightColor(color, 0.6),
      [pulseBrand7]: getLightColor(color, 0.7),
      [pulseBrand8]: getLightColor(color, 0.8),
      [pulseBrand9]: getLightColor(color, 0.9),
    };

    Object.keys(lightColorMap).forEach(key => {
      setStyleVar(key, lightColorMap[key]);
    });
  }

  const switchDark = () => {
    if (!isClient) return;
    const color = themeColor.value;
    if (!color) return;

    const darkColorMap = {
      [pulseBrand3]: getDarkColor(color, 0.3),
      [pulseBrand4]: getDarkColor(color, 0.4),
      [pulseBrand5]: getDarkColor(color, 0.5),
      [pulseBrand6]: getDarkColor(color, 0.6),
      [pulseBrand7]: getDarkColor(color, 0.7),
      [pulseBrand8]: getDarkColor(color, 0.8),
      [pulseBrand9]: getDarkColor(color, 0.9),
    }

    Object.keys(darkColorMap).forEach(key => {
      setStyleVar(key, darkColorMap[key]);
    });
  }

  // 生成渐变色
  const generateGradient = () => {
    if (!isClient) return;
    const color = themeColor.value;
    if (!color) return;

    const list = gradientColor(color, 80, 4);
    const brightList = list.map(color => lightenColor(color, isDark.value ? -10 : 15));

    const gradientColorMap = {
      [pulseBrandGr]: list[0],
      [pulseBrandGr1]: list[1],
      [pulseBrandGr2]: list[2],
      [pulseBrandGr3]: list[3],
      [pulseBrandBr]: brightList[0],
      [pulseBrandGrBr1]: brightList[1],
      [pulseBrandGrBr2]: brightList[2],
      [pulseBrandGrBr3]: brightList[3],
    }

    Object.keys(gradientColorMap).forEach(key => {
      setStyleVar(key, gradientColorMap[key]);
    });
  }

  const update = () => {
    switchTransparent();
    generateGradient();
    if (isDark.value) {
      switchDark();
    } else {
      switchLight();
    }
  }

  const start = () => {
    if (!isStop.value || !!stopWatch) return;
    isStop.value = false;

    update();

    stopWatch = watch([themeColor, isDark], update, { flush: "post" });
  }

  const stop = () => {
    stopWatch?.();
    stopWatch = null;
    isStop.value = true;
    clear();
  };

  // watch([themeColor, isDark], update, { immediate: true });

  return {
    isStop: readonly(isStop),
    start,
    stop,
    update,
    clear,
  };
};