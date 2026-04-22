<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PuzzleInterface from './components/PuzzleInterface.vue'
import ResetButton from './components/ResetButton.vue'
import Spinner from './components/Spinner.vue'
import type { Puzzle } from './util'

const is_loaded = ref(false)
onMounted(async () => {
    document.title = 'Pangrams'
    await setup(true)
    is_loaded.value = true
})

type WordListResponse = {
    min_len: number
    word_list: string[]
    puzzle_list: string[]
}
let word_list_response: WordListResponse
const puzzle = ref<Puzzle>({
    letters: [],
    key_letter: '',
    answer_word_list: [],
    found_words: [],
    score: 0,
})
async function setup(check_storage: boolean): Promise<void> {
    let is_puzzle_ready = false

    if (check_storage) {
        const local_word_list_response = window.localStorage.getItem('word_list_response')
        const local_puzzle = window.localStorage.getItem('puzzle')
        if (local_word_list_response && local_puzzle) {
            word_list_response = JSON.parse(local_word_list_response)
            puzzle.value = JSON.parse(local_puzzle)
            is_puzzle_ready = true
        }
    }

    if (!is_puzzle_ready) {
        await fetch_word_list()
        set_puzzle()
        window.localStorage.setItem('word_list_response', JSON.stringify(word_list_response))
        window.localStorage.setItem('puzzle', JSON.stringify(puzzle.value))
    }
}

async function fetch_word_list(): Promise<void> {
    const api_url = import.meta.env.VITE_BACKEND_URL
    const word_list_url = `${api_url}/pangrams/word_list`
    const response = await fetch(word_list_url)
    word_list_response = await response.json()
}

function set_puzzle(): void {
    while (true) {
        const try_letters = sample(word_list_response.puzzle_list).split('')
        const try_key_letter = sample(try_letters)
        const try_answer_word_list = word_list_response.word_list.filter((word) =>
            is_valid(word, try_letters, try_key_letter))

        if (try_answer_word_list.length >= 15 && try_answer_word_list.length <= 50) {
            puzzle.value.letters = try_letters
            puzzle.value.key_letter = try_key_letter
            puzzle.value.answer_word_list = try_answer_word_list
            puzzle.value.found_words = []
            puzzle.value.score = 0
            return
        }
    }
}

function sample<T>(items: T[]): T {
    const index = Math.floor(Math.random() * items.length)
    const choice = items[index]
    if (choice === undefined) {
        throw new Error(`Index ${index} is out of bounds of array ${items}.`)
    }

    return choice
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

async function reset_puzzle(): Promise<void> {
    is_loaded.value = false
    await setup(false)
    is_loaded.value = true
}

function update_puzzle(found_words: string[], score: number): void {
    puzzle.value.found_words = found_words
    puzzle.value.score = score
    window.localStorage.setItem('puzzle', JSON.stringify(puzzle.value))
}
</script>



<template>
    <div id="game">
        <template v-if="is_loaded">
            <ResetButton @reset="reset_puzzle()" />

            <PuzzleInterface
                :puzzle="puzzle"
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
</style>
