<script setup lang="ts">
import { onMounted, ref } from 'vue'
import YouTubePlayer from './components/YouTubePlayer.vue'

const track_list = ref([])
const is_player_loaded = ref(false)

onMounted(async () => {
    const api_url = import.meta.env.VITE_BACKEND_URL
    const tracks_url = `${api_url}/youtune/tracks`
    const response = await fetch(tracks_url)
    const result = await response.json()
    
    track_list.value = result['tracks']
})

function load_player() {
    is_player_loaded.value = true
}
</script>

<template>
    Hello from YouTune page!

    <h4>Tracks</h4>
    <ul>
        <template v-for="track in track_list">
            <li>{{track}}</li>
        </template>
    </ul>

    <template v-if="is_player_loaded">
        <YouTubePlayer />
    </template>
    <template v-else>
        <button @click="load_player">Load Player</button>
    </template>
</template>
