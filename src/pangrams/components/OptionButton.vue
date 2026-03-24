<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import GenericButton from './GenericButton.vue';


const props = defineProps<{
    letter: string
    is_key_letter: boolean
    count: number | undefined
}>()
const emit = defineEmits<{
    click: []
    drag: [spaces: number]
}>()
const display_letter = computed(() => props.letter.toLocaleUpperCase())


let button_dist: number
onMounted(() => {
    const button_el_list = document.querySelectorAll('.option-btn')
    if (button_el_list.length < 2) {
        throw new Error('Buttons not found!')
    }
    button_dist = button_el_list[1]!.getBoundingClientRect().x - button_el_list[0]!.getBoundingClientRect().x
})


const is_dragging = ref(false)
function maybe_click(): void {
    if (!is_dragging.value) {
        emit('click')
    }
}


function start_dragging(ev: MouseEvent): void {
    const button_el = ev.target as HTMLButtonElement
    const drag_controller = new AbortController()

    window.addEventListener('pointermove', (ev) => {
        // Call `getBoundingClientRect` here so that it updates properly as the button is moved by Vue.
        const rect = button_el.getBoundingClientRect()
        const center_x = rect.x + (rect.width / 2)

        const spaces = Math.round((ev.clientX - center_x) / button_dist)
        if (spaces !== 0) {
            emit('drag', spaces)
            is_dragging.value = true
        }
    }, { signal: drag_controller.signal })

    window.addEventListener('pointerup', () => {
        drag_controller.abort()
        setTimeout(() => is_dragging.value = false, 0)
    }, { signal: drag_controller.signal })
}
</script>



<template>
    <GenericButton
        class="option-btn"
        :class="{ 'key-letter': is_key_letter }"
        @click="maybe_click()"
        @pointerdown="start_dragging($event)"
    >
        {{ display_letter }}
        <div class="letter-counter">
            <div>
                {{ count }}
            </div>
        </div>
    </GenericButton>
</template>



<style scoped>
.option-btn {
    position: relative;
    width: var(--button-unit);
    height: var(--button-unit);
    font-size: var(--button-font-size);
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    &.key-letter {
        color: yellow;
    }
}


.letter-counter {
    position: absolute;
    width: 100%;
    height: 0;
    bottom: -4px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    div {
        width: max-content;
        color: var(--off-white);
        background-color: var(--border-color);
        padding: 0 3px;
        border-radius: var(--roundness);

        font-size: small;
    }
}
</style>
