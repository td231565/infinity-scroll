<script setup lang="ts">
import { ref } from 'vue'
import FetchGithubRepos from '@/utils/fetchGithub'
import { useInfiniteScroll } from '@vueuse/core'
import CardItem from './components/CardItem.vue'
import Spinner from '@/components/LoadingSpinner.vue'
import ToTop from '@/components/ToTopBtn.vue'

const vueRepos = new FetchGithubRepos(import.meta.env.VITE_GITHUB)
vueRepos.setOwner('vuejs')

const isLoading = ref(false)
const isEnd = ref(false)
const listRef = ref<HTMLElement>()
const listData = ref<any[]>([])

useInfiniteScroll(
  listRef,
  async () => {
    // load more
    if (vueRepos.isEnd()) {
      isEnd.value = true
      return
    }
    isLoading.value = true
    const nextPage = await vueRepos.getNextPage()
    listData.value.push(...nextPage)
    isLoading.value = false
  },
  { distance: 10 }
)
</script>

<template>
  <article class="w-[100svw] max-w-[500px] mx-auto pt-8">
    <h1 class="ml-3 sm:ml-0 mb-5 text-lg">
      Repos from: <span class="text-green-900 font-bold text-2xl">{{ vueRepos.getOwner() }}</span>
    </h1>
    <ul
      ref="listRef"
      class="w-full h-[calc(100svh-120px)] lg:max-h-[600px] p-3 lg:border overflow-y-auto relative"
    >
      <li v-for="repo in listData" :key="repo.id">
        <CardItem :data="repo" />
      </li>
      <li v-if="isLoading" class="text-center p-4">
        <Spinner />
      </li>
      <li v-if="isEnd" class="text-center p-2 text-gray-400">no more</li>
      <ToTop :container-el="listRef" />
    </ul>
  </article>
</template>

<style scoped></style>
