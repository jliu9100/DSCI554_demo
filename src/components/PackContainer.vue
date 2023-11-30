<template>
  <h1>Largest Fires By Decade (1990-2020)</h1>
  <div id="pack-chart"></div>
  <Pack />
</template>

<script setup>
import Pack from "./Pack.vue";

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
