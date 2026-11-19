<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, onMounted, provide, ref } from 'vue'
import GenericButton from './components/GenericButton.vue'
import Menu from './components/menu/Menu.vue'
import PuzzleInterface from './components/puzzle/PuzzleInterface.vue'
import Spinner from './components/Spinner.vue'
import { puzzles_key, sample, sleep, type Puzzle } from './util'

const is_loaded = ref(false)
onMounted(async () => {
    document.title = 'Pangrams'
    await setup()
    set_current_puzzle_num(my_puzzle_list.value.length - 1)
    is_loaded.value = true
})

const show_menu = ref(false)
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

const my_puzzle_list = ref<Puzzle[]>([])
function set_my_puzzle_list(list: Puzzle[]): void {
    my_puzzle_list.value = list;
    window.localStorage.setItem('my_puzzle_list', JSON.stringify(my_puzzle_list.value))
}
const current_puzzle_num = ref(0)
function set_current_puzzle_num(num: number): void {
    current_puzzle_num.value = num;
}
async function create_puzzle(): Promise<void> {
    is_loaded.value = false
    while (true) {
        await sleep(0)

        const try_letters = sample(word_list_response.value.puzzle_list).split('')
        const try_key_letter = sample(try_letters)
        const try_answer_word_list = word_list_response.value.word_list.filter(
            (word) => is_valid(word, try_letters, try_key_letter)
        )

        if (try_answer_word_list.length >= 25 && try_answer_word_list.length <= 50) {
            const new_puzzle = {
                letters: try_letters,
                key_letter: try_key_letter,
                answer_word_list: try_answer_word_list,
                found_words: [],
                score: 0,
            }
            set_my_puzzle_list(my_puzzle_list.value.concat(new_puzzle))
            set_current_puzzle_num(my_puzzle_list.value.length - 1)
            is_loaded.value = true
            return
        }
    }
}
provide(puzzles_key, {
    my_puzzle_list,
    set_my_puzzle_list,
    current_puzzle_num,
    set_current_puzzle_num,
    create_puzzle,
})

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
</script>



<template>
    <div id="game">
        <template v-if="show_menu">
            <Menu @close="show_menu = false" />
        </template>

        <template v-else-if="is_loaded">
            <GenericButton
                id="menu-btn"
                title="Menu"
                @click="show_menu = true"
            >
                <FontAwesomeIcon icon="fa-solid fa-bars" />
            </GenericButton>

            <PuzzleInterface
                :min_len="word_list_response.min_len"
                :word_list="word_list_response.word_list"
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
    --muted: #666;
    --off-white: #ccc;
    --temporary: #0cf;
    --separator-gap-size: 6px;

    --gap-size: 4px;
    --total-width: 350px;
    --roundness: 2px;
    --button-unit: calc((var(--total-width) - 6 * var(--gap-size)) / 7);
    --wide-button-unit: calc((var(--total-width) - 3 * var(--gap-size)) / 4);
    --guess-font-size: xx-large;
    --button-font-size: x-large;

    color: var(--off-white);
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

#menu-btn {
    position: absolute;
    top: 4px;
    right: 4px;

    width: 30px;
    height: 30px;
    font-size: large;
}

.popup {
    width: max-content;
    background-color: var(--border-color);
    padding: 5px 8px;
    border-radius: var(--roundness);

    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: var(--separator-gap-size);
    cursor: pointer;
}

.separator {
    color: var(--muted);
}

.text-block {
    margin: 5px;
    padding: 1px 3px;
    border-radius: var(--roundness);
    color: var(--muted);
}

.menu-button {
    padding: 5px 10px;
    font-size: medium;
}
</style>
