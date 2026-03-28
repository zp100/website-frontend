<script setup lang="ts">
import { onMounted } from 'vue';
import GenericButton from './GenericButton.vue';


type Action = 'cancel' | 'close' | 'reset'
type ActionButton = {
    action: Action
    label: string
}


const props = defineProps<{
    message: string
    action_buttons: ActionButton[]
}>()
const emit = defineEmits<{
    [K in Action]: []
}>()


let dialog_el: HTMLDialogElement
onMounted(() => {
    const el = document.querySelector('dialog')
    if (!el) {
        throw new Error('Dialog not found!')
    }
    dialog_el = el
    dialog_el.showModal()
})


function select_action(action: Action): void {
    dialog_el.close()
    if (action === 'cancel') {
        emit(action)
    } else if (action === 'close') {
        emit(action)
    } else if (action === 'reset') {
        emit(action)
    }
}
</script>



<template>
    <dialog class="dlg">
        <p>
            {{ message }}
        </p>

        <div class="button-row">
            <template v-for="action_button in action_buttons">
                <GenericButton @click="select_action(action_button.action)">
                    {{ action_button.label }}
                </GenericButton>
            </template>
        </div>
    </dialog>
</template>



<style scoped>
.dlg {
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
