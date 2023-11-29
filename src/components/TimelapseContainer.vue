<template>
  <div id="timelapse-chart"></div>
  <!-- <svg id="timelapse-chart" width="500" height="300"></svg> -->
</template>

<script setup>
import { onMounted } from "vue";
import * as d3 from "d3";
import timelapse from "./timelapse.js";

onMounted(() => {
  timelapse("#timelapse-chart");
});
</script>

<script></script>

<style>
#timelapse-chart {
  width: 400px;
}

* {
  font-family: sans-serif;
}

@keyframes slideout {
  0% {
    /* transform: translateY(-15px); */
    opacity: 0%;
  }

  10% {
    /* transform: translateY(100%); */
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
  opacity: 50%;
  margin-left: 10rem;
  margin-top: 5rem;
}
</style>
