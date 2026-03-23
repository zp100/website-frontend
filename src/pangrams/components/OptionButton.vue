<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import GenericButton from './GenericButton.vue';


const props = defineProps<{
    letter: string
    is_key_letter: boolean
    count: number | undefined
    index: number
}>()
const emit = defineEmits<{
    click: []
    drag: [old_index: number, new_index: number]
}>()
const display_letter = computed(() => props.letter.toLocaleUpperCase())


const button_dist = ref(NaN)
onMounted(() => {
    const button_el = document.querySelector('.option-btn') as HTMLButtonElement
    const width = parseFloat(window.getComputedStyle(button_el).getPropertyValue('width'))
    const gap_size = parseFloat(window.getComputedStyle(button_el).getPropertyValue('--gap-size'))
    button_dist.value = width + gap_size
})


const is_dragging = ref(false)
function maybe_click(): void {
    if (!is_dragging.value) {
        emit('click')
    }
}


function start_dragging(ev: MouseEvent): void {
    const start_index = props.index
    const start_x = ev.clientX
    const drag_controller = new AbortController()

    window.addEventListener('mousemove', (ev) => {
        const offset = ev.clientX - start_x
        const places = Math.round(offset / button_dist.value)
        const new_index = start_index + places
        if (new_index !== props.index) {
            emit('drag', props.index, new_index)
            is_dragging.value = true
        }
    }, { signal: drag_controller.signal })

    window.addEventListener('mouseup', () => {
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
        @mousedown="start_dragging($event)"
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
