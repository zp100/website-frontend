<script setup lang="ts">
const props = defineProps<{
    progress_percent: number
}>()
</script>



<template>
    <span class="progress-bar">
        <span :style="{ width: `${progress_percent}%` }"></span>
    </span>
</template>



<style scoped>
.progress-bar {
    display: inline-block;
    width: 50px;
    height: 11px;
    border-radius: var(--roundness);
    outline: 1px solid var(--off-black);
    background-color: var(--bg-color);

    span {
        display: block;
        height: 100%;
        border-radius: var(--roundness);
        background-color: yellow;
    }
}
</style>
