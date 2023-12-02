<template>
  <div ref="timelapseRef" id="timelapse-chart"></div>
    <Timelapse />
</template>

<script async setup>
import { onMounted, watchEffect, onUnmounted } from "vue";
import * as d3 from "d3";
import Timelapse from "./Timelapse.vue";

// const debounce = (fn, delay) => {
//   let timer = null;
//   return function () {
//     if (timer) {
//       clearTimeout(timer);
//     }
//     timer = setTimeout(fn, delay);
//   };
// };


// onMounted(() => {
//   window.addEventListener('resize', debounce(handleResize, 300));
// });

// onUnmounted(() => {
//   window.removeEventListener('resize', handleResize);
// });

// const handleResize = () => {
// };
</script>

<script></script>

<style>
#timelapse-chart {
  width: 70vw;
}

* {
  font-family: sans-serif;
}

@keyframes slideout {
  0% {
    opacity: 0%;
  }

  10% {
    opacity: 80%;
  }

  80% {
    opacity: 60%;
  }

  100% {
    transform: translateY(calc(var(--height) * -1px));
    opacity: 0%;
  }
}

.mooove {
  stroke: black;
  stroke-width: 3;
  animation-name: slideout;
  animation-duration: calc(var(--height-proportion) * 4s + 2s);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.axis {
  font-size: 1em;
  border-top: 5px;
}

.axis-label {
  font-size: 1.2em;
  font-weight: bold;
}

.tooltip-div {
  display: inline-flex;
  flex-direction: column;
  background-color: #007aff;
  border: solid;
  border-color: black;
  border-width: 2px;
  border-radius: 5px;
  padding: 5px;
  color: white;
  font-size: 1em;
}

div.tooltip-div p {
  margin: 5px;
}

.month-container {
  display: flex;
  align-items: center;
  justify-content: center;
  fill: grey;
  font-weight: bold;
  font-size: 6rem;
  opacity: 45%;
  margin-left: 0rem;
  margin-top: 10rem;
}
</style>
