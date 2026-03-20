<script setup lang="ts">
const props = defineProps<{
    letter: string
    is_key: boolean
    is_invalid: boolean
}>()
</script>



<template>
    <div
        class="guess-letter"
        :class="{ 'key-letter': is_key, 'invalid-letter': is_invalid }"
    >
        {{ letter.toLocaleUpperCase() }}
    </div>
</template>



<style scoped>
.guess-letter {
    color: white;
    font-size: var(--guess-font-size);

    &.key-letter {
        color: yellow;
    }

    &.invalid-letter {
        color: var(--border-color);
    }
}
</style>
