import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';
import Page1 from '../views/Page1.vue';
import Page2 from '../views/Page2.vue';
import Page3 from '../views/Page3.vue';
import Page4 from '../views/Page4.vue';

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: Home
        },
        {
            path: '/page1',
            name: 'PageWOName1',
            component: Page1
        },
        {
            path: '/page2',
            name: 'PageWOName2',
            component: Page2
        },
        {
            path: '/page3',
            name: 'PageWOName3',
            component: Page3
        },
        {
            path: '/page4',
            name: 'PageWOName4',
            component: Page4
        }
    ],
});



export default router;
