import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './AppWrapper.vue';
import router from './router';
import "vue-fullpage.js/dist/style.css";
import VueFullPage from "vue-fullpage.js";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/index.css'


const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(VueFullPage)
app.mount('#app');
