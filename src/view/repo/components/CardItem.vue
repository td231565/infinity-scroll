<script setup lang="ts">
// import { ref } from 'vue'

const prop = defineProps<{
  data: any
}>()
</script>

<template>
  <div class="mb-3 px-3 py-1 shadow rounded">
    <h3 class="mb-1 font-bold text-lg">{{ prop.data.name }}</h3>
    <p>{{ prop.data.description }}</p>
    <p class="mt-2">
      <a
        :href="prop.data.html_url"
        target="_blank"
        rel="noopener noreferrer"
        class="no-underline ease-in text-green-950 hover:bg-green-400/[0.2]"
        >{{ prop.data.html_url }}</a
      >
    </p>
  </div>
</template>

<style scoped></style>
