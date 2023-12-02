<!-- src/views/HomePage.vue -->
<template>
    <div class="intro">
        <div class="modal">
            <h1>Wildfire in California</h1>
            <el-button size="large" circle @click="handleIntro" class="introButton" :icon="Bottom"></el-button>
        </div>
    </div>
</template>
  
<script setup>
import { useRouter } from 'vue-router';
import { Bottom } from '@element-plus/icons-vue';
const router = useRouter();
const handleIntro = () => {
    router.push('/Home');
};
</script>
  

<style>
template {
    margin: 0;
    padding: 0;
}

.intro {
    margin: 0;
    padding: 0;
    --bg: url(../assets/IntroPage.jpg) no-repeat center/cover;
    background: var(--bg);
    height: 100vh;
}

.modal {
    margin: 0;
    padding: 0;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
}

.modal h1 {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10vw;
    text-stroke: 1px #fff;
    -webkit-text-stroke: 1px #fff;
    background: var(--bg);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}

.introButton {
    position: absolute;
    top: 80%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3vw !important;
    width: 6vw !important;
    height: 6vw !important;
    color: white !important;
    border-radius: 50px;
    border-color: #000;
    cursor: pointer;
    background: var(--bg);


}
</style>