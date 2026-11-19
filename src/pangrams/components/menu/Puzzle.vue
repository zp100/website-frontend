<script setup lang="ts">
import { puzzles_key, type Puzzle } from '@/pangrams/util'
import { computed, inject, onMounted, ref } from 'vue'
import GenericButton from '../GenericButton.vue'
import GenericDialog from '../GenericDialog.vue'

const props = defineProps<{
    puzzle_num: number
}>()
const emit = defineEmits<{
    close_menu: []
}>()
const puzzles = inject(puzzles_key)!
const puzzle = computed(() => puzzles.my_puzzle_list.value[props.puzzle_num]!)

function play_puzzle(): void {
    puzzles.set_current_puzzle_num(props.puzzle_num)
    emit('close_menu')
}

const show_delete_dialog = ref(false)
function delete_puzzle(): void {
    const new_my_puzzle_list = puzzles.my_puzzle_list.value.filter((_, i) => i !== props.puzzle_num)
    puzzles.set_my_puzzle_list(new_my_puzzle_list)
    show_delete_dialog.value = false
}
</script>



<template>
    <div class="puzzle">
        <div>
            <template v-for="letter in puzzle.letters">
                <span class="text-block letter" :class="{ 'key-letter': letter === puzzle.key_letter }">
                    {{ letter.toLocaleUpperCase() }}
                </span>
            </template>
        </div>

        <div class="info">
            <span>Words: {{ puzzle.found_words.length }}</span>

            <GenericButton
                title="Play"
                class="menu-button"
                @click="play_puzzle()"
            >
                Play
            </GenericButton>

            <GenericButton
                title="Delete"
                class="menu-button"
                @click="show_delete_dialog = true"
            >
                Delete
            </GenericButton>

            <template v-if="show_delete_dialog">
                <GenericDialog
                    :action_buttons="{ cancel: 'Cancel', affirmative: 'Delete' }"
                    @cancel="show_delete_dialog=false"
                    @affirmative="delete_puzzle()"
                >
                    <p>Are you sure you want to delete this puzzle?</p>
                </GenericDialog>
            </template>
        </div>
    </div>
</template>



<style scoped>
.puzzle {
    padding: 10px;
    background-color: var(--off-black);
    border: 1px solid var(--border-color);
    border-radius: var(--roundness);

    display: flex;
    flex-flow: column nowrap;
    gap: var(--gap-size);
}

.letter {
    color: var(--off-white);
}

.key-letter {
    color: yellow;
}

.info {
    display: flex;
    flex-flow: row nowrap;
    gap: var(--gap-size);
    align-items: center;

    span {
        flex: 1;
    }
}
</style>
