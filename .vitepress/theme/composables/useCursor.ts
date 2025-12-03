import { ComputedRef, Ref, watch } from 'vue';
import { CursorTheme, PulseCursor, CursorThemeValue } from '../config/pulseConfig';
import { isClient } from 'vitepress-theme-teek';

const cursorNames: string[] = [
  'default',
  'pointer',
  'text',
  'grab',
  'grabbing',
  'help',
  'move',
  'not-allowed',
  'cross',
];

const varNameList = cursorNames.map(cur => `--pulse-cursor-${cur}`);

const generateCursorMapByType = (theme: CursorThemeValue): Record<string, string> => {
  return cursorNames.reduce((res, curName) => {
    const key = `--pulse-cursor-${curName}`;
    res[key] = `url("cursor/${theme}/${curName}.cur")`;
    return res;
  }, {});
}

export const useCursor = (config?: ComputedRef<PulseCursor> | Ref<PulseCursor>) => {
  const setStyleVar = (key: string, value: string) => {
    if (!isClient) return;
    document.documentElement.style.setProperty(key, value);
  }

  const removeStyleVar = (key: string) => {
    if (!isClient) return;
    document.documentElement.style.removeProperty(key);
  }

  const setCursorTheme = (theme: CursorThemeValue) => {
    if (!isClient) return;
    document.documentElement.dataset.cursorTheme = theme;
  }

  const removeCursorTheme = () => {
    if (!isClient) return;
    document.documentElement.removeAttribute('data-cursor-theme');
  }

  const setCursorType = (theme: CursorThemeValue) => {
    if (theme === CursorTheme.Custom) {

    } else {
      setCursorTheme(theme);
    }
  }

  const update = (val: PulseCursor) => {
    if (!isClient) return;

    const invalid = !val.enabled || !val.theme;

    if (invalid || val.theme === CursorTheme.Default) {
      removeCursorTheme();
    } else {
      setCursorType(val.theme);
    }
  }

  watch(config, update, {
    immediate: true,
  })
}