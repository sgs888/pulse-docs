<template>
  <TransitionGroup tag="ul" :name="transitionName">
    <li v-for="post in displayPostList" :key="post.url" :class="{ 'full-img': coverImgMode === 'full' }">
      <TkHomePostItemCard v-if="postConfig.postStyle === 'card'" :post />
      <TkHomePostItem v-else :post :coverImgMode />
    </li>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed, PropType, ref, watchEffect } from 'vue';
import {
  type Post,
  type TkContentData,
  TkHomePostItem,
  useLocale,
  useNamespace,
  useTeekConfig
} from 'vitepress-theme-teek';
import TkHomePostItemCard from 'vitepress-theme-teek/es/components/theme/HomePostList/src/HomePostItemCard.vue';

const props = defineProps({
  currentPosts: {
    type: Array as PropType<TkContentData[]>,
    required: true
  },
  transitionName: {
    type: String,
    required: false
  }
});

const ns = useNamespace('post-list');
const { t } = useLocale();
const { getTeekConfigRef } = useTeekConfig();
const postConfig = getTeekConfigRef<Required<Post>>('post', {
  postStyle: 'list',
  coverImgMode: 'default',
  emptyLabel: t('tk.homePost.emptyLabel'),
  transition: true,
  transitionName: ns.join('slide-fade')
});
const coverImgMode = ref(postConfig.value.coverImgMode);

const displayPostList = computed(() => {
  const copyList = JSON.parse(JSON.stringify(props.currentPosts));
  return copyList.map(post => {
    // 私密文章摘要加密
    if (post.frontmatter.private) {
      post.capture = post.capture?.replace(/[^\s]/g, '*');
      post.excerpt = post.excerpt?.replace(/[^\s]/g, '*');
    }
    return post;
  });
});

watchEffect(() => {
  coverImgMode.value = postConfig.value.coverImgMode;
});
</script>

<style scoped lang="scss">

</style>