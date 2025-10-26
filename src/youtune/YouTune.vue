<script setup lang="ts">
import { onMounted, ref } from 'vue'

const track_list = ref([])

onMounted(async () => {
    const api_url = import.meta.env.VITE_BACKEND_URL
    const tracks_url = `${api_url}/youtune/tracks`
    const response = await fetch(tracks_url)
    const result = await response.json()
    
    track_list.value = result['tracks']
})
</script>

<template>
    Hello from YouTune page!

    <h4>Tracks</h4>
    <ul>
        <template v-for="track in track_list">
            <li>{{track}}</li>
        </template>
    </ul>
</template>
