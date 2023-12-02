<!-- src/views/TimelapsePage.vue -->
<template>
  <div class="wrp">
    <h1>Timelapse</h1>
    <TimelapseContainer />
  </div>
</template>

<script setup>
import TimelapseContainer from "@/components/TimelapseContainer.vue";
</script>

<script>
export default {
  name: "TimelapsePage",
};
</script>

<style>
.wrp {
  height: 90vh;

}
</style>
