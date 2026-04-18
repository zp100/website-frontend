<script setup lang="ts">
import { autoTimeout } from '@/util';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import GenericButton from './GenericButton.vue';


const props = defineProps<{
    letter: string
    is_key_letter: boolean
    count: number | undefined
    index: number
}>()
const emit = defineEmits<{
    click: []
    drag: [ spaces: number ]
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


const generic_button = useTemplateRef('generic-button')
const button_el = computed(() => generic_button.value?.button_el)
watch(() => props.index, (index, old_index) => {
    autoTimeout(
        () => button_el.value?.classList.add(index - old_index > 0 ? 'slide-from-left' : 'slide-from-right'),
        () => button_el.value?.classList.remove('slide-from-left', 'slide-from-right'),
        100,
    )
})


function start_dragging(): void {
    const drag_controller = new AbortController()

    function move(ev: PointerEvent) {
        // Call `getBoundingClientRect` here so that it updates properly as the button is moved by Vue.
        const rect = button_el.value!.getBoundingClientRect()
        const center_x = rect.x + (rect.width / 2)

        const spaces = Math.round((ev.clientX - center_x) / button_dist)
        if (spaces !== 0) {
            emit('drag', spaces)
            is_dragging.value = true
        }
    }

    function end() {
        button_el.value!.classList.remove('slide-from-left', 'slide-from-right')
        setTimeout(() => is_dragging.value = false, 0)
        drag_controller.abort()
    }

    window.addEventListener('pointermove', (ev) => move(ev), { signal: drag_controller.signal })
    window.addEventListener('pointerup', () => end(), { signal: drag_controller.signal })
    window.addEventListener('pointercancel', () => end(), { signal: drag_controller.signal })
}
</script>



<template>
    <GenericButton
        ref="generic-button"
        class="option-btn"
        :class="{ 'key-letter': is_key_letter }"
        @click="maybe_click()"
        @pointerdown="start_dragging()"
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

    &.slide-from-left {
        z-index: 1;
        animation: slide-from-left 100ms ease-out;
    }

    &.slide-from-right {
        z-index: 1;
        animation: slide-from-right 100ms ease-out;
    }
}


@keyframes slide-from-left {
    from {
        transform: translateX(-20px);
    }

    to {
        transform: translateX(0);
    }
}


@keyframes slide-from-right {
    from {
        transform: translateX(20px);
    }

    to {
        transform: translateX(0);
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
