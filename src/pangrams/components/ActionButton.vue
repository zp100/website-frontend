<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GenericButton from './GenericButton.vue';


const props = defineProps<{
    title: string
    icon: string
}>()
const emit = defineEmits<{
    click: []
}>()
</script>



<template>
    <GenericButton
        class="puzzle-btn action-btn"
        :title="title"
        @click="emit('click')"
    >
        <FontAwesomeIcon :icon="`fa-solid fa-${icon}`" />
    </GenericButton>
</template>



<style scoped>
.action-btn {
    width: var(--wide-button-unit);
    height: var(--button-unit);
    font-size: var(--button-font-size);
}
</style>
