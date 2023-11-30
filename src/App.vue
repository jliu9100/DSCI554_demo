<template>
  <div id="app" v-if="loaded">

    <full-page ref="fullpage" id="fullpage">
      <div class="section">
        <IntroPage />
      </div>
      <div class="section">
        <HomePage />
      </div>
      <div class="section">
        <SubPage1 />
      </div>
      <div class="section">
        <PackPage />
      </div>
      <div class="section">
        <Page2 />
      </div>
      <div class="section">
        <Page3 />
      </div>
      <div class="section">
        <TimelapsePage />
      </div>
    </full-page>
  </div>
  <div v-if="!loaded">
    <LoadingPage />
  </div>

</template>

<script setup>
import IntroPage from "@/views/IntroPage.vue";
import HomePage from "@/views/HomePage.vue";
import SubPage1 from "@/views/SubPage1.vue";
import Page2 from "@/views/Page2.vue";
import Page3 from "@/views/Page3.vue";
import TimelapsePage from "@/views/TimelapsePage.vue";
import PackPage from "@/views/PackPage.vue";
import LoadingPage from '@/views/LoadingPage.vue';
import { computed, watchEffect, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTimelapseDataStore } from "@/stores/timelapseData";
import { usePackDataStore } from "@/stores/packData";
import { useGeneralDataStore } from "@/stores/generalData";
import { useCauseDataStore } from "@/stores/causeData";

const loaded = ref(false);
const timelapseStore = useTimelapseDataStore();
const packStore = usePackDataStore();
const generalStore = useGeneralDataStore();
const causeStore = useCauseDataStore();
await Promise.all([
  await timelapseStore.loadData(),
  await packStore.loadData(),
  await generalStore.loadData(),
  await causeStore.loadData()
]);
watchEffect(() => {
  loaded.value = true;
})
</script>

<style></style>

<style>
.fp-watermark {
  opacity: 0%;
}
</style>