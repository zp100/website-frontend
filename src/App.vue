<script setup lang="ts">
import { ref } from 'vue'

const status = ref('')

async function getStatus() {
    const url = 'https://website-backend-eight-tau.vercel.app/status'
    const response = await fetch(url)
    const result = await response.json()
    status.value = result['status']
}
</script>

<template>
    <h2>Hello world! :3</h2>
    <p>Status: {{ status }}</p>
    <button @click="getStatus">Get Status</button>
</template>

<style scoped></style>
