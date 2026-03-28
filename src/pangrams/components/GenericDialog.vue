<script setup lang="ts">
import { computed, onMounted } from 'vue';
import GenericButton from './GenericButton.vue';


type Action = 'cancel' | 'negative' | 'affirmative'


const props = defineProps<{
    title?: string
    subtitle?: string
    message?: string | string[]
    action_buttons: Partial<Record<Action, string>>
}>()
const emit = defineEmits<{
    [K in Action]: []
}>()
const message_list = computed(() => Array.isArray(props.message) ? props.message : [ props.message ])


let dialog_el: HTMLDialogElement
onMounted(() => {
    const el = document.querySelector('dialog')
    if (!el) {
        throw new Error('Dialog not found!')
    }
    dialog_el = el

    register_key_handler()
    dialog_el.showModal()
})


function register_key_handler() {
    dialog_el.addEventListener('keydown', (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') {
            ev.stopPropagation()
            ev.preventDefault()

            dialog_el.close()
            emit('cancel')
        }
    })
}


function select_action(action: Action): void {
    dialog_el.close()

    // Why is this necessary?
    if (action === 'cancel') {
        emit(action)
    } else if (action === 'negative') {
        emit(action)
    } else if (action === 'affirmative') {
        emit(action)
    }
}
</script>



<template>
    <dialog class="dlg">
        <template v-if="title">
            <h2 class="title">
                {{ title }}
            </h2>
        </template>

        <template v-if="subtitle">
            <span class="subtitle">
                {{ subtitle }}
            </span>
        </template>

        <template v-for="message in message_list">
            <p>
                {{ message }}
            </p>
        </template>

        <div class="button-row">
            <template v-for="(label, action) in action_buttons">
                <GenericButton @click="select_action(action)">
                    {{ label }}
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


.title {
    margin-bottom: 5px;
}


.subtitle {
    color: #888;
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
