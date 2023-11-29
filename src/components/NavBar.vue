<template>
  <el-menu
      :default-active="this.$route.path"
      router
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
  >
    <el-menu-item index="/Home">Home Page</el-menu-item>
    <el-menu-item index="/Page1">By County</el-menu-item>
    <el-menu-item index="/Page2">By Cause</el-menu-item>
    <el-menu-item index="/Page3">Risky Area Prediction</el-menu-item>
    <!--    <el-menu-item index="/Page4">Page4</el-menu-item>-->
    <el-menu-item index="/pack">Damage Pack (experimental)</el-menu-item>
    <!-- <el-menu-item index="/timelapse">Timelapse (experimental)</el-menu-item> -->
  </el-menu>
</template>

<script setup>
const handleSelect = (key, keyPath) => {
  console.log("Go To Page:", keyPath);
};
</script>

<style></style>
