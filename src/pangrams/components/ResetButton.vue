<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GenericButton from './GenericButton.vue';
import { onMounted } from 'vue';


const emit = defineEmits<{
    reset: []
}>()


let dialog_el: HTMLDialogElement
onMounted(() => {
    const el = document.querySelector('dialog')
    if (!el) {
        throw new Error('Dialog not found!')
    }
    dialog_el = el
})


function reset(): void {
    dialog_el.close()
    emit('reset')
}
</script>



<template>
    <GenericButton
        id="reset-btn"
        title="Load new puzzle"
        @click="dialog_el.showModal()"
    >
        <FontAwesomeIcon icon="fa-solid fa-rotate" />
    </GenericButton>

    <dialog id="reset-dialog">
        <p>
            Are you sure you want to reset?
            New letters and words will be randomly picked.
        </p>

        <div class="button-row">
            <GenericButton @click="dialog_el.close()">
                Cancel
            </GenericButton>

            <GenericButton @click="reset()">
                Reset
            </GenericButton>
        </div>
    </dialog>
</template>



<style scoped>
#reset-btn {
    border: none;
    background-color: transparent;
    color: var(--off-white);
    cursor: pointer;

    position: absolute;
    top: 4px;
    right: 0px;
}


#reset-dialog {
    width: calc(var(--total-width) - 50px);
    color: var(--off-white);
    background-color: var(--off-black);
    border: 1px solid var(--off-white);
    border-radius: var(--roundness);
}


.button-row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    gap: var(--gap-size);

    button {
        padding: 5px 10px;
        font-size: medium;
    }
}
</style>
