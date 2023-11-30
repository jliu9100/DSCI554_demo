<template>
  <Suspense>
    <template #default>
      <App />
    </template>

    <template #fallback>
      <LoadingPage />
    </template>
  </Suspense>
</template>

<script setup>
import App from './App.vue';
import LoadingPage from '@/views/LoadingPage.vue';
</script>

<style></style>
