import { ComputedRef, Ref, watch } from 'vue';
import { CursorTheme, CursorThemeValue, CursorAppendTheme } from '../config/pulseConfig';
import { isClient } from 'vitepress-theme-teek';
import { useCssVars } from './useCssVars';

export interface CursorParams {
  enabled: boolean;
  theme: CursorThemeValue | string;
}

const cursorNames: string[] = [
  'default',
  'pointer',
  'text',
  'grab',
  'help',
  'move',
  'not-allowed',
  'cross',
];

const generateCursorVars = (theme: CursorAppendTheme) => {
  return cursorNames.reduce((res, curName) => {
    const key = `--pulse-cursor-${curName}`;
    const cursor = theme[curName];
    if (cursor && cursor.url) {
      const x = cursor.x || 0;
      const y = cursor.y || 0;
      res[key] = `url("${cursor.url}") ${x} ${y}, ${curName}`;
    }
    return res;
  }, {});
}

export const useCursor = (
  config: ComputedRef<CursorParams> | Ref<CursorParams>,
  append?: CursorAppendTheme[],
) => {
  const styleId = 'cursor-theme';
  const { setCSSVariables, removeCSSVariableStyle } = useCssVars();

  const setCursorTheme = (theme: string) => {
    if (!isClient) return;
    document.documentElement.dataset.cursorTheme = theme;
  }

  const removeCursorTheme = () => {
    if (!isClient) return;
    document.documentElement.removeAttribute('data-cursor-theme');
  }

  const clear = () => {
    removeCursorTheme();
    removeCSSVariableStyle(styleId, 'clear');
  }

  const update = (val: CursorParams) => {
    if (!isClient) return;

    const invalid = !val.enabled || !val.theme;
    const appendTheme = append.find(item => item.key === val.theme);

    if (invalid || val.theme === CursorTheme.Default) {
      clear();
    } else if (appendTheme) {
      removeCursorTheme();
      const cssVars = generateCursorVars(appendTheme);
      setCSSVariables(styleId, cssVars);
    } else {
      removeCSSVariableStyle(styleId, 'clear');
      setCursorTheme(val.theme);
    }
  }

  watch(config, update, {
    immediate: true,
  })
}