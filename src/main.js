import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/index.css'

const app = createApp(App);
router.isReady().then(() => {
    router.push('/')
  })
app.use(router);
app.use(ElementPlus);



app.mount('#app');
