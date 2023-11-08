<!-- src/views/HomePage.vue -->
<template>
    <div>
      <h1>{{ title }}</h1>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const title = ref('Home Page');
  </script>
  