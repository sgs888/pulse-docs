import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useVpRouter } from "vitepress-theme-teek";

export const useFakeScrollbar = () => {
  const vpRouter = useVpRouter();
  const stateKey = 'updateScrollBar';

  const scrollContainer = document.documentElement;
  const scrollBarRef = ref<HTMLElement | null>(null);
  const thumbRef = ref<HTMLElement | null>(null);

  let hideTimer: number | null = null;
  let isDragging = false;
  let startY = 0;
  let startThumbTop = 0;

  const showScrollbar = () => {
    const scrollbar = scrollBarRef.value;
    if (!scrollbar) return;
    scrollbar.classList.add('hover');
    if (hideTimer) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
  };

  const hideScrollbar = () => {
    const scrollbar = scrollBarRef.value;
    if (!scrollbar) return;
    scrollbar.classList.remove('hover');
  };

  const handleMouseLeave = () => {
    hideTimer = window.setTimeout(() => {
      hideScrollbar();
    }, 300);
  };

  const updateThumbSize = () => {
    const container = scrollContainer;
    const thumb = thumbRef.value;
    if (!container || !thumb) return;

    const ratio = container.clientHeight / container.scrollHeight;
    thumb.style.height = `${Math.max(ratio * 100, 5)}%`; // 最小 5%
  };

  const syncThumbPosition = () => {
    const container = scrollContainer;
    const thumb = thumbRef.value;
    if (!container || !thumb || container.scrollHeight <= container.clientHeight) return;

    const scrollRatio = container.scrollTop / (container.scrollHeight - container.clientHeight);
    const maxThumbTop = container.clientHeight - thumb.offsetHeight;
    const thumbTop = scrollRatio * maxThumbTop;

    thumb.style.transform = `translateY(${thumbTop}px)`;
  };

  const handleScroll = () => {
    syncThumbPosition();
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const thumb = thumbRef.value;
    if (!thumb) return;

    isDragging = true;
    startY = e.clientY;
    startThumbTop = getTranslateY(thumb);
    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const getTranslateY = (el: HTMLElement): number => {
    const transform = window.getComputedStyle(el).transform;
    const matrix = new DOMMatrixReadOnly(transform);
    return matrix.f || 0;
  };

  const handleDragging = (e: MouseEvent) => {
    if (!isDragging) return;
    const container = scrollContainer;
    const thumb = thumbRef.value;
    if (!container || !thumb) return;

    const dy = e.clientY - startY;
    const maxThumbTop = container.clientHeight - thumb.offsetHeight;
    const newThumbTop = Math.max(0, Math.min(maxThumbTop, startThumbTop + dy));

    const scrollRatio = newThumbTop / maxThumbTop;
    const maxScrollTop = container.scrollHeight - container.clientHeight;
    container.scrollTop = scrollRatio * maxScrollTop;
  };

  const handleDragEnd = () => {
    isDragging = false;
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  const bindEvents = () => {
    scrollContainer.addEventListener('mouseenter', showScrollbar);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);
    thumbRef.value?.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('resize', updateAndSync);
  };

  const unbindEvents = () => {
    if (hideTimer) {
      window.clearTimeout(hideTimer);
    }
    scrollContainer.removeEventListener('mouseenter', showScrollbar);
    scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('scroll', handleScroll);
    thumbRef.value?.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('resize', updateAndSync);
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  const updateAndSync = () => {
    nextTick(() => {
      updateThumbSize();
      syncThumbPosition();
    });
  };

  vpRouter.bindAfterRouteChange(stateKey, () => {
    updateAndSync();
  });

  onMounted(() => {
    bindEvents();
    nextTick(updateAndSync);
  });

  onUnmounted(() => {
    unbindEvents();
  });

  return {
    scrollBarRef,
    thumbRef,
    isDragging,
  };
};