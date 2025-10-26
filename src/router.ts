import { createRouter, createWebHistory } from 'vue-router'
import Home from './home/Home.vue'
import YouTune from './youtune/YouTune.vue'

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
