import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import YouTune from './views/YouTune.vue'

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/youtune',
            name: 'youtune',
            component: YouTune,
        },
    ],
})
