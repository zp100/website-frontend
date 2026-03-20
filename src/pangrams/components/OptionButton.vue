<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps<{
    letter: string
    is_key_letter: boolean
    count: number | undefined
}>()
const emit = defineEmits<{
    click: []
}>()
const display_letter = computed(() => props.letter.toLocaleUpperCase())
</script>



<template>
    <button
        class="option-btn"
        :class="{ 'key-letter': is_key_letter }"
        @keydown.prevent=""
        @click="emit('click')"
    >
        {{ display_letter }}
        <div class="letter-counter">
            <div>
                {{ count }}
            </div>
        </div>
    </button>
</template>



<style scoped>
.option-btn {
    position: relative;
    width: var(--button-unit);
    height: var(--button-unit);
    font-size: x-large;
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
