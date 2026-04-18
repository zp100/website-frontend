<script setup lang="ts">
const props = defineProps<{
    percent: number
}>()
</script>



<template>
    <span class="progress-bar">
        <span class="progress" :class="{ full: percent === 100 }" :style="{ width: `${percent}%` }"></span>
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
}

.progress {
    display: block;
    height: 100%;
    border-radius: var(--roundness);
    background-color: var(--off-white);

    &.full {
        background-color: yellow;
    }
}
</style>
