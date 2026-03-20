<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


const props = defineProps<{
    title: string
    icon: string
}>()
const emit = defineEmits<{
    click: []
}>()
</script>



<template>
    <button
        class="action-btn"
        :title="title"
        @keydown.prevent=""
        @click="emit('click')"
    >
        <FontAwesomeIcon :icon="`fa-solid fa-${icon}`" />
    </button>
</template>



<style scoped>
.action-btn {
    width: var(--wide-button-unit);
    height: var(--button-unit);
    font-size: x-large;
}
</style>
