<template>
  <h1>Largest Fires By Decade (1990-2020)</h1>
  <div id="pack-chart"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as d3 from "d3";
import pack from "./pack.js";

onMounted(() => {
  pack("#pack-chart");
});
</script>

<script></script>

<style>
* {
  font-family: sans-serif;
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
</style>
