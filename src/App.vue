<template>
  <div id="app" v-if="loaded">

    <full-page ref="fullpage" id="fullpage" :options="options">
      <div class="section fp-auto-height-responsive">
        <IntroPage />
      </div>
      <div class="section fp-auto-height-responsive">
        <HomePage />
      </div>
      <div class="section fp-auto-height-responsive">
        <SubPage1 />
      </div>
      <div class="section fp-auto-height-responsive">
        <PackPage />
      </div>
      <div class="section fp-auto-height-responsive">
        <Page2 />
      </div>
      <div class="section fp-auto-height-responsive">
        <Page3 />
      </div>
      <div class="section fp-auto-height-responsive">
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
const options = ref({
  scrollBar: true,
  touchSensitivity: 1,
  // menu: true,
  navigation: true,
  // scrollOverflow: false,
  bigSectionsDestination: 'top',
  // autoScrolling: false
})

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

#fp-nav ul li a span,
.fp-slidesNav ul li a span {
    background: red !important;
}

.section{
  height: 100vh !important;
}
</style>