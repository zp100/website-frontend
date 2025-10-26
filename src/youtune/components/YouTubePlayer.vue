<script setup lang="ts">
import { ref } from 'vue'
import YouTube from 'vue3-youtube'

const youtube = ref<YT.Player>()

function play_video() {
    get_player().playVideo()
}

function get_player() {
    if (youtube.value === undefined) {
        throw new Error('YouTube player not loaded')
    }
    
    return youtube.value
}
</script>

<template>
    <YouTube
        ref="youtube"
        src="https://www.youtube.com/watch?v=BjjNdkFGrPI"
        @ready="play_video"
    />
</template>
