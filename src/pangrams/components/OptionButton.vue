<script setup lang="ts">
import { autoTimeout } from '@/pangrams/util';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import GenericButton from './GenericButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{
    letter: string
    is_key_letter: boolean
    count: number | undefined
    index: number,
    is_locked: boolean
}>()
const emit = defineEmits<{
    click: []
    drag: [ spaces: number ]
    swipe: []
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

const generic_button = useTemplateRef('generic-button')
const button_el = computed(() => generic_button.value?.button_el)
watch(() => props.index, (index, old_index) => {
    autoTimeout(
        () => button_el.value?.classList.add(index - old_index > 0 ? 'slide-from-left' : 'slide-from-right'),
        () => button_el.value?.classList.remove('slide-from-left', 'slide-from-right'),
        100,
    )
})

const drag_state = ref<'none' | 'drag' | 'swipe'>('none')
function maybe_click(): void {
    if (drag_state.value === 'none') {
        emit('click')
    }
}

function start_dragging(): void {
    const drag_controller = new AbortController()

    function move(ev: PointerEvent) {
        if (!button_el.value) {
            return
        }

        // Call `getBoundingClientRect` here so that it updates properly as the button is moved by Vue.
        const rect = button_el.value.getBoundingClientRect()

        if (drag_state.value === 'none') {
            const center_y = rect.y + (rect.height / 2)
            const spaces_y = Math.round((ev.clientY - center_y) / button_dist)
            if (spaces_y > 0) {
                emit('swipe')
                drag_state.value = 'swipe'
                return
            }
        }

        if (drag_state.value === 'none' || drag_state.value === 'drag') {
            const center_x = rect.x + (rect.width / 2)
            const spaces_x = Math.round((ev.clientX - center_x) / button_dist)
            if (spaces_x !== 0) {
                emit('drag', spaces_x)
                drag_state.value = 'drag'
            }
        }
    }

    function end() {
        button_el.value?.classList.remove('slide-from-left', 'slide-from-right')
        setTimeout(() => drag_state.value = 'none', 0)
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
        :class="{ 'key-letter': is_key_letter, 'locked': is_locked }"
        @click="maybe_click()"
        @pointerdown="start_dragging()"
    >
        {{ display_letter }}

        <div class="letter-counter">
            <div>
                {{ count }}
            </div>
        </div>

        <template v-if="is_locked">
            <div class="lock-indicator">
                <FontAwesomeIcon icon="fa-solid fa-lock" />
            </div>
        </template>
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

    &.locked {
        background-color: #161616;
        color: var(--bg-color);
    }

    &.key-letter.locked {
        color: #220;
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
        padding: 0 4px 1px;
        border-radius: 999px;

        font-size: small;
    }
}

.lock-indicator {
    position: absolute;
    width: max-content;
    height: 0;
    top: 1px;
    right: 1px;
    color: var(--off-white);
    font-size: x-small;
}
</style>
