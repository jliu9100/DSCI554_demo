<template>
    <el-menu :default-active="this.$route.path" router class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="/">Home Page</el-menu-item>
        <el-menu-item index="/Page1">California County</el-menu-item>
        <el-menu-item index="/Page2">Page2</el-menu-item>
        <el-menu-item index="/Page3">Page3</el-menu-item>
        <el-menu-item index="/Page4">Page4</el-menu-item>
    </el-menu>
</template>

<script setup>
// import { ref } from 'vue'
const handleSelect = (key, keyPath) => {
    console.log("Go To Page:", keyPath)
}
</script>

<style></style>
