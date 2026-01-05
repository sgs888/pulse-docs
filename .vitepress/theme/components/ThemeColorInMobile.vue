<template>
  <div v-if="!disabledThemeColor" class="mobile-theme-color-button" title="主题色">
    <div @click="openSetting" class="inner-btn">
      <TkIcon :icon="magicIcon" :size="22" />
    </div>
    <div class="theme-color-list" v-show="visible">
      <div class="spread-box">扩散：
        <TkSwitch v-model="isSpread" />
      </div>
      <ul v-for="item in themeColorSelectList" :key="item.label">
        <li class="theme-title text" :title="item.tip" :aria-label="item.label">
          {{ item.label }}
        </li>
        <li>
          <ul>
            <li
              v-for="option in item.options"
              :key="item.label + option.value"
              :class="['color-item', 'text', { active: option.value === themeColorName }]"
              @click="handleChangePrimaryColor(option)"
              role="button"
              :title="option.title"
              :aria-label="option.ariaLabel ?? option.title ?? option.label"
            >
              {{ option.label }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useData } from 'vitepress';
import {
  useThemeColorList,
  useTeekConfig,
  useCommon,
  useStorage,
  useThemeColor,
  type ThemeColorOption,
  type ThemeEnhance,
  TkIcon,
  magicIcon,
  varNameList,
  themeColorList,
  themeColorStorageKey,
  themeBgColorStorageKey,
  isClient,
  themeColorAttribute,
  TkSwitch,
  ThemeColorName
} from 'vitepress-theme-teek';

const { isMobile } = useCommon();
const { frontmatter } = useData();
const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>('themeEnhance', { enabled: true });
const themeColorSelectList = useThemeColorList();

const themeColorName = useStorage<string>(
  themeColorStorageKey,
  themeEnhanceConfig.value.themeColor?.defaultColorName || ThemeColorName.vpDefault
);
const isSpread = useStorage(themeBgColorStorageKey, themeEnhanceConfig.value.themeColor?.defaultSpread || false);

const visible = ref(false);
const oldThemeColor = ref(themeColorName.value);
// 主题色
const primaryColor = ref('');
// 根据 primaryColor 计算其他 var 变量需要的颜色，并直接覆盖这些 var 变量的颜色
const { clear, updateSpread } = useThemeColor(primaryColor, () => {
  // 内置的 VP、EP 主题色需要忽略部分 var 变量，因为这些 var 变量已经固定，无需自动计算新的值替换（具体看 packages/theme-chalk/var/theme-color.scss 文件）
  if (themeColorList.includes(themeColorName.value)) {
    return [varNameList.vpBrand1, varNameList.vpBrand2, varNameList.vpBrand3, varNameList.vpBrandSoft];
  }
});

const disabledThemeColor = computed(() => {
  const { enabled = true, themeColor = {}, position = 'top' } = themeEnhanceConfig.value;
  return !enabled || themeColor.disabled || (!isMobile.value && position === 'top');
});

const openSetting = () => {
  visible.value = !visible.value;
};

const closeSetting = (e: Event) => {
  const colorList = document.querySelector('.mobile-theme-color-button');
  const isCursor = colorList && colorList.contains(e.target as Element);
  if (!isCursor) {
    visible.value = false;
  }
};

const handleChangePrimaryColor = (option: ThemeColorOption) => {
  themeColorName.value = option.value;
};

/**
 * 更新主题色
 */
const update = (val: string) => {
  if (!isClient) return;

  const el = document.documentElement;

  if (el.getAttribute(themeColorAttribute) === val) return;
  el.setAttribute(themeColorAttribute, val);

  // includes 为 true 走内置主题色逻辑
  if (themeColorList.includes(val)) {
    // 先清除旧属性再获取新属性，否则一直获取的是旧属性
    clear();
    primaryColor.value = getComputedStyle(el).getPropertyValue(varNameList.vpBrand1);
  } else {
    const appendThemeColor = themeEnhanceConfig.value.themeColor?.append || [];
    // 扁平化 options 并获取 val 对应的 option
    const option = appendThemeColor
      .map(item => item.options)
      .flat()
      .filter(item => item.value === val);

    const color = option[0]?.color;

    // 如果 color 不存在，则默认从 css var 获取主题色，因此先清除旧属性再获取新属性，否则一直获取的是旧属性
    !color && clear();
    primaryColor.value = color || getComputedStyle(el).getPropertyValue(varNameList.vpBrand1);
  }

  themeEnhanceConfig.value.themeColor?.switchColorDone?.(val);
};

watch(themeColorName, update, { immediate: true });

// 文章单独设置主题色
watch(
  () => frontmatter.value.themeColorName,
  newVal => {
    if (newVal) {
      oldThemeColor.value = themeColorName.value;
      themeColorName.value = newVal;
    } else {
      // 还原
      themeColorName.value = oldThemeColor.value;
    }
  },
  { immediate: true }
);
// 扩散到其他 var 变量（useThemeColor composables）
watch(isSpread, updateSpread, { immediate: true, flush: 'post' });

onMounted(() => {
  if (frontmatter.value.themeColor) update(frontmatter.value.themeColor);
  else update(themeColorName.value);
  window.addEventListener('click', closeSetting);
});
onUnmounted(() => {
  window.removeEventListener('click', closeSetting);
});
</script>

<style scoped lang="scss">
@use '../styles/cursor/index.scss' as cursor;

.mobile-theme-color-button {
  position: fixed;
  bottom: 68px;
  right: 16px;
  width: 40px;
  height: 40px;
}
.inner-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--pulse-brand-gr-1) 0%, var(--pulse-brand-4) 100%);
  box-shadow: 0 4px 10px var(--pulse-brand-tr-4);
  transition: all 0.3s ease;
  cursor: cursor.$pointer;
  z-index: 999;
  &:hover {
    background: linear-gradient(45deg, var(--pulse-brand-gr-br-2) 0%, var(--pulse-brand-gr-br-1) 100%);
    transform: scale(1.02);
    box-shadow: 0 6px 20px var(--pulse-brand-tr-4);
  }
  .tk-icon {
    color: #fff;
  }
}
.theme-color-list {
  position: fixed;
  bottom: 118px;
  right: 20px;
  width: 120px;
  height: auto;
  max-height: 350px;
  overflow: auto;
  background-color: var(--tk-popover-bg-color);
  box-shadow: var(--tk-popover-shadow);
  border: 1px solid var(--tk-popover-border-color);
  border-radius: 6px;
  padding: 6px 0 8px;
  z-index: 999;
  .text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .theme-title {
    font-size: 12px;
    color: var(--tk-el-color-info);
    padding: 0 10px;
  }
  .color-item {
    cursor: cursor.$pointer;
    font-size: 14px;
    padding: 0 10px 0 15px;
    &.active {
      background-color: var(--tk-theme-color);
      color: var(--tk-bg-color);
    }
  }
}
.spread-box {
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 13px;
  color: var(--tk-el-color-info);
}
</style>