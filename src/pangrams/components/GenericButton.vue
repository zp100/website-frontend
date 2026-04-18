<script setup lang="ts">
import { useTemplateRef } from 'vue';


const button_el = useTemplateRef('btn')
defineExpose({
    button_el,
})
</script>



<template>
    <button ref="btn" class="btn" @keydown.enter.prevent>
        <slot></slot>
    </button>
</template>



<style scoped>
.btn {
    border: none;
    border-radius: var(--roundness);
    background-color: var(--bg-color);
    color: var(--off-white);
    cursor: pointer;

    &:active {
        outline: 2px solid var(--border-color);
    }
}
</style>
