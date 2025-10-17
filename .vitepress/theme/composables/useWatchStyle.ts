import { onMounted, onUnmounted } from 'vue';

type CSSProperty = keyof CSSStyleSheet | `--${string}` | string;
type WatchStyleCallback = (newValue: any, oldValue: any) => void;

function watchStyle(
  element: Element,
  cssProperty: CSSProperty,
  callback: WatchStyleCallback
) {
  const isCustomProp = cssProperty.startsWith('--');
  let currentValue = isCustomProp
    ? getComputedStyle(element).getPropertyValue(cssProperty).trim()
    : getComputedStyle(element)[cssProperty];

  const observer = new MutationObserver(() => {
    const newValue = isCustomProp
      ? getComputedStyle(element).getPropertyValue(cssProperty).trim()
      : getComputedStyle(element)[cssProperty];
    if (newValue !== currentValue) {
      callback(newValue, currentValue);
      currentValue = newValue;
    }
  });

  observer.observe(element, {
    attributes: true,
    attributeFilter: ['style', 'class'] // class 变化也可能影响 CSS 变量
  });

  return observer;
}

export function useWatchStyle(
  selector: Element | string,
  property: CSSProperty,
  callback: WatchStyleCallback
) {
  let observer;

  const stop = () => observer?.disconnect();

  onMounted(() => {
    const el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!el) return;

    observer = watchStyle(el, property, callback);
  });

  onUnmounted(() => {
    stop();
  });

  return {
    stop
  }
}