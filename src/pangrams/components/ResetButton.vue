<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GenericButton from './GenericButton.vue';


const emit = defineEmits<{
    click: []
}>()
</script>



<template>
    <GenericButton
        id="reset-btn"
        title="Load new puzzle"
        @click="emit('click')"
    >
        <FontAwesomeIcon icon="fa-solid fa-rotate" />
    </GenericButton>
</template>



<style scoped>
#reset-btn {
    border: none;
    background-color: transparent;
    color: var(--off-white);
    cursor: pointer;

    position: absolute;
    top: 5px;
    right: 5px;
}
</style>
