<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import GenericButton from './GenericButton.vue';
import GenericDialog from './GenericDialog.vue';

const emit = defineEmits<{
    reset: []
}>()

const show_dialog = ref(false)
function reset(): void {
    show_dialog.value = false
    emit('reset')
}
</script>



<template>
    <GenericButton
        id="reset-btn"
        title="Load new puzzle"
        @click="show_dialog = true"
    >
        <FontAwesomeIcon icon="fa-solid fa-bars" />
    </GenericButton>

    <template v-if="show_dialog">
        <GenericDialog
            :action_buttons="{ cancel: 'Cancel', affirmative: 'Reset' }"
            :is_big="true"
            @cancel="show_dialog = false"
            @affirmative="reset()"
        >
            <p>
                Are you sure you want to reset?
                New letters and words will be randomly picked.
            </p>
        </GenericDialog>
    </template>
</template>



<style scoped>
#reset-btn {
    position: absolute;
    top: 4px;
    right: 4px;

    width: 30px;
    height: 30px;
    font-size: large;
}
</style>
