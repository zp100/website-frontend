<script setup lang="ts">
import GenericButton from './GenericButton.vue';

const emit = defineEmits<{
    reset: []
}>()
</script>



<template>
    <div>
        Menu (WIP)
    </div>

    <br />

    <GenericButton
        id="reset-btn"
        title="Load new puzzle"
        @click="emit('reset')"
    >
        Reset
    </GenericButton>
</template>



<style scoped>
#reset-btn {
    background-color: red;
    padding: 5px 10px;
    font-size: medium;
}
</style>
