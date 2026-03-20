<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps<{
    found_word: string
    is_pangram: boolean
    guess_word: string
}>()
const display_answer = computed(() => props.found_word.toLocaleUpperCase())
const is_guess_prefix = computed(() => props.found_word.startsWith(props.guess_word))
</script>



<template>
    <div class="answer" :class="{ pangram: is_pangram }">
        <template v-if="is_guess_prefix">
            <span class="prefix">
                {{ display_answer.slice(0, guess_word.length) }}
            </span>
            <span>
                {{ display_answer.slice(guess_word.length) }}
            </span>
        </template>
        <template v-else>
            {{ display_answer }}
        </template>
    </div>
</template>



<style scoped>
.answer {
    margin: 5px 10px;
    color: var(--off-white);

    &.pangram {
        color: yellow;
    }
}


.prefix {
    background-color: var(--border-color);
}
</style>
