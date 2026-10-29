<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PuzzleInterface from './components/PuzzleInterface.vue'
import MenuButton from './components/MenuButton.vue'
import Spinner from './components/Spinner.vue'
import { sample, sleep, type Puzzle } from './util'

const is_loaded = ref(false)
onMounted(async () => {
    document.title = 'Pangrams'
    await setup()
    is_loaded.value = true
})

type WordListResponse = {
    min_len: number
    word_list: string[]
    puzzle_list: string[]
}
const word_list_response = ref<WordListResponse>({
    // Dummy values, will get overwritten.
    min_len: 0,
    word_list: [],
    puzzle_list: [],
})
const my_puzzle_list = ref<Puzzle[]>([])
const current_puzzle = computed(() => my_puzzle_list.value.at(-1)!)
async function setup(): Promise<void> {
    const local_word_list_response = window.localStorage.getItem('word_list_response')
    const local_my_puzzle_list = window.localStorage.getItem('my_puzzle_list')
    if (local_word_list_response && local_my_puzzle_list) {
        word_list_response.value = JSON.parse(local_word_list_response)
        my_puzzle_list.value = JSON.parse(local_my_puzzle_list)
        if (my_puzzle_list.value.length >= 1) {
            return
        }
    }

    await fetch_word_list()
    await create_puzzle()
}

async function fetch_word_list(): Promise<void> {
    const api_url = import.meta.env.VITE_BACKEND_URL
    const word_list_url = `${api_url}/pangrams/word_list`
    const response = await fetch(word_list_url)
    word_list_response.value = await response.json()
    window.localStorage.setItem('word_list_response', JSON.stringify(word_list_response.value))
}

async function create_puzzle(): Promise<void> {
    // DEBUG: Temporary fix to prevent infinite puzzles, until the menu is more-developed.
    my_puzzle_list.value.length = 0

    while (true) {
        await sleep(0)

        const try_letters = sample(word_list_response.value.puzzle_list).split('')
        const try_key_letter = sample(try_letters)
        const try_answer_word_list = word_list_response.value.word_list.filter((word) =>
            is_valid(word, try_letters, try_key_letter))

        if (try_answer_word_list.length >= 15 && try_answer_word_list.length <= 50) {
            my_puzzle_list.value.push({
                letters: try_letters,
                key_letter: try_key_letter,
                answer_word_list: try_answer_word_list,
                found_words: [],
                score: 0,
            })
            window.localStorage.setItem('my_puzzle_list', JSON.stringify(my_puzzle_list.value))
            return
        }
    }
}

async function reset_puzzle(): Promise<void> {
    is_loaded.value = false
    await create_puzzle()
    is_loaded.value = true
}

function is_valid(word: string, letters: string[], key_letter: string): boolean {
    const word_letters = new Set(word.split(''))

    if (!word_letters.has(key_letter)) {
        return false
    }

    const alphabet = new Set('abcdefghijklmnopqrstuvwxyz'.split(''))
    const invalid_letters = alphabet.difference(new Set(letters))
    if (!word_letters.isDisjointFrom(invalid_letters)) {
        return false
    }

    return true
}

function update_puzzle(found_words: string[], score: number): void {
    current_puzzle.value.found_words = found_words
    current_puzzle.value.score = score
    window.localStorage.setItem('my_puzzle_list', JSON.stringify(my_puzzle_list.value))
}
</script>



<template>
    <div id="game">
        <template v-if="is_loaded">
            <MenuButton @reset="reset_puzzle()" />

            <PuzzleInterface
                :puzzle="current_puzzle"
                :min_len="word_list_response.min_len"
                :word_list="word_list_response.word_list"
                @update_puzzle="update_puzzle"
            />
        </template>

        <template v-else>
            <Spinner />
        </template>
    </div>
</template>



<style>
:root {
    --off-black: #111;
    --bg-color: #222;
    --border-color: #333;
    --muted: #777;
    --off-white: #ddd;
    --temporary: #7df;
    --separator-gap-size: 6px;

    --gap-size: 4px;
    --total-width: 350px;
    --roundness: 2px;
    --button-unit: calc((var(--total-width) - 6 * var(--gap-size)) / 7);
    --wide-button-unit: calc((var(--total-width) - 3 * var(--gap-size)) / 4);
    --guess-font-size: xx-large;
    --button-font-size: x-large;

    font-family: Arial, Helvetica, sans-serif;
}

#game {
    width: 100svw;
    height: 100svh;
    background-color: var(--off-black);
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.separator {
    color: var(--muted);
}

.text-block {
    margin: 3px 5px;
    padding: 2px 5px;
    border-radius: var(--roundness);
    color: var(--border-color);
}
</style>
