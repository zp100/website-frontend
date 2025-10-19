<script setup lang="ts">
import { ref } from 'vue'

const server_status = ref('N/A')

async function get_status() {
    server_status.value = 'Loading...'

    const api_url = import.meta.env.VITE_BACKEND_URL
    const status_url = `${api_url}/status`
    try {
        const response = await fetch(status_url)
        const result = await response.json()
        server_status.value = result['status']
    } catch (e: any) {
        console.error(e.message)
        server_status.value = 'Fetch error :('
    }
}
</script>

<template>
    <h2>Hello world! :3</h2>
    <p>Status: {{ server_status }}</p>
    <button @click="get_status">Get Status</button>
</template>
