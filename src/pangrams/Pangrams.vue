<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ActionButton from './components/ActionButton.vue'
import Answer from './components/Answer.vue'
import DynamicPopup from './components/DynamicPopup.vue'
import GuessLetter from './components/GuessLetter.vue'
import OptionButton from './components/OptionButton.vue'
import ResetButton from './components/ResetButton.vue'
import Spinner from './components/Spinner.vue'
import Stats from './components/Stats.vue'


const is_loaded = ref(false)
onMounted(async () => {
    document.title = 'Pangrams'
    register_key_handler()
    await setup(true)
    is_loaded.value = true
})


const guess = ref<string[]>([])
const guess_word = computed(() => guess.value.join(''))
function register_key_handler() {
    window.addEventListener('keydown', (ev: KeyboardEvent) => {
        if (ev.key === 'Shift') {
            shuffle_letters()
            return
        }

        if (ev.key === 'Escape') {
            clear_guess()
            return
        }

        if (ev.key === 'Backspace') {
            backspace_guess()
            return
        }

        if (ev.key === 'Enter') {
            submit_guess()
            return
        }

        if (ev.repeat) {
            return
        }

        const isLetter = /^[A-Za-z]$/.test(ev.key)
        if (isLetter) {
            guess.value.push(ev.key)
            return
        }
    })
}


type WordListResponse = {
    min_len: number;
    word_list: string[];
    puzzle_list: string[];
}
let word_list_response: WordListResponse
type Puzzle = {
    letters: string[]
    key_letter: string
    answer_word_list: string[]
    found_words: string[]
    score: number
}
const puzzle = ref<Puzzle>({
    letters: [],
    key_letter: '',
    answer_word_list: [],
    found_words: [],
    score: 0,
})
let total_score: number
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

    set_letter_counts()
    total_score = puzzle.value.answer_word_list.reduce((score, word) => score + get_score(word), 0)
}


async function fetch_word_list(): Promise<void> {
    const api_url = import.meta.env.VITE_BACKEND_URL
    const word_list_url = `${api_url}/pangrams/word_list`
    try {
        const response = await fetch(word_list_url)
        word_list_response = await response.json()
    } catch (e: any) {
        throw new Error(e.message)
    }
}


function set_puzzle(): void {
    while (true) {
        const try_letters = sample(word_list_response.puzzle_list).split('')
        const try_key_letter = sample(try_letters)
        const try_answer_word_list = word_list_response.word_list.filter((word) =>
            is_valid(word, try_letters, try_key_letter))

        if (try_answer_word_list.length >= 10 && try_answer_word_list.length <= 60) {
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


function get_score(word: string): number {
    const base_score = word.length * (word.length + 1) / 2
    return (is_pangram(word) ? base_score * 2 : base_score)
}


const letter_counts = ref<Record<string, number>>({})
function set_letter_counts(): void {
    letter_counts.value = {}

    puzzle.value.answer_word_list.forEach((word) => {
        word.split('').forEach((letter) => {
            if (letter_counts.value[letter] !== undefined) {
                letter_counts.value[letter] += 1
            } else {
                letter_counts.value[letter] = 1
            }
        })
    })

    puzzle.value.found_words.forEach((word) => {
        word.split('').forEach((letter) => {
            if (letter_counts.value[letter] !== undefined) {
                letter_counts.value[letter] -= 1
            }
        })
    })
}


async function reset_puzzle(): Promise<void> {
    is_loaded.value = false
    await setup(false)
    is_loaded.value = true
}


function show_stats(): void {
    set_popup(`
        ${puzzle.value.answer_word_list.length - puzzle.value.found_words.length} word(s) remaining,
        ${total_score - puzzle.value.score} score remaining
    `)
}


function is_pangram(word: string): boolean {
    return new Set(word.split('')).isSupersetOf(new Set(puzzle.value.letters))
}


function move_letter(old_index: number, spaces: number): void {
    const new_index = old_index + spaces
    if (new_index < 0 || new_index >= puzzle.value.letters.length) {
        return
    }

    const removed = puzzle.value.letters.splice(old_index, 1)
    const letter = removed[0]!
    puzzle.value.letters.splice(new_index, 0, letter)
}


function shuffle_letters(): void {
    for (let i = puzzle.value.letters.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))

        let temp = puzzle.value.letters[i]
        puzzle.value.letters[i] = puzzle.value.letters[j]!;
        puzzle.value.letters[j] = temp!;
    }
}


function clear_guess(): void {
    guess.value.length = 0
}


function backspace_guess(): void {
    guess.value.pop()
}


const found_words_sorted = computed(() => puzzle.value.found_words.toSorted())
function submit_guess(): void {
    if (guess.value.length === 0) {
        return
    }

    const guess_letters = guess.value
    guess.value = []

    if (guess_letters.length < word_list_response.min_len) {
        set_popup(`Must be at least ${word_list_response.min_len} letters long`)
        return
    }

    const guess_word = guess_letters.join('')
    if (!word_list_response.word_list.includes(guess_word)) {
        set_popup('Not in word list')
        return
    }

    if (puzzle.value.found_words.includes(guess_word)) {
        set_popup('Already found')
        return
    }

    if (!guess_letters.includes(puzzle.value.key_letter)) {
        set_popup('Must contain key letter')
        return
    }

    const is_bad_input = guess_letters.some((letter) => !puzzle.value.letters.includes(letter))
    if (is_bad_input) {
        set_popup('Must use listed letters')
        return
    }

    const word_score = get_score(guess_word)
    puzzle.value.score += word_score
    puzzle.value.found_words.push(guess_word)
    if (puzzle.value.found_words.length === puzzle.value.answer_word_list.length) {
        set_popup('All words found!')
    } else {
        set_popup(`+${word_score}`)
    }

    set_letter_counts()
    window.localStorage.setItem('puzzle', JSON.stringify(puzzle.value))
}


const popup_messages = ref<string[]>([])
function set_popup(message: string): void {
    popup_messages.value.push(message)
}
</script>



<template>
    <div id="game">
        <template v-if="is_loaded">
            <ResetButton @reset="reset_puzzle()" />

            <div id="word-box">
                <Stats @click="show_stats()"
                    :words="puzzle.found_words.length"
                    :words_total="puzzle.answer_word_list.length"
                    :score="puzzle.score"
                    :score_total="total_score"
                />

                <div id="found-words">
                    <template v-for="word in found_words_sorted" :key="word">
                        <Answer
                            :found_word="word"
                            :is_pangram="is_pangram(word)"
                            :guess_word="guess_word"
                        />
                    </template>
                </div>

                <DynamicPopup
                    :messages="popup_messages"
                />
            </div>

            <div id="input">
                <template v-for="letter in guess">
                    <GuessLetter
                        :letter="letter"
                        :is_key="letter === puzzle.key_letter"
                        :is_invalid="!puzzle.letters.includes(letter)"
                    />
                </template>

                <div id="cursor"></div>
            </div>

            <div id="options">
                <template v-for="(letter, index) in puzzle.letters" :key="letter">
                    <OptionButton
                        :letter="letter"
                        :is_key_letter="letter === puzzle.key_letter"
                        :count="letter_counts[letter]"
                        @click="guess.push(letter)"
                        @drag="(spaces) => move_letter(index, spaces)"
                    />
                </template>
            </div>

            <div id="actions">
                <ActionButton title="Shuffle letters (Shift)" icon="shuffle" @click="shuffle_letters()" />
                <ActionButton title="Clear (Esc)" icon="trash-can" @click="clear_guess()" />
                <ActionButton title="Backspace" icon="delete-left" @click="backspace_guess()" />
                <ActionButton title="Submit word (Enter)" icon="circle-chevron-right" @click="submit_guess()" />
            </div>
        </template>

        <template v-else>
            <Spinner />
        </template>
    </div>
</template>



<style scoped>
#game {
    --off-black: #111;
    --bg-color: #222;
    --border-color: #333;
    --off-white: #ddd;

    --gap-size: 10px;
    --total-width: 350px;
    --roundness: 2px;
    --button-unit: calc((var(--total-width) - 6 * var(--gap-size)) / 7);
    --wide-button-unit: calc((var(--total-width) - 3 * var(--gap-size)) / 4);
    --guess-font-size: xx-large;
    --button-font-size: x-large;

    width: 100vw;
    height: 100vh;
    background-color: var(--off-black);
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
    font-family: Arial, Helvetica, sans-serif;
}

#word-box {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
}

#found-words {
    width: calc(var(--total-width) - 30px);
    height: 250px;
    overflow-y: auto;
    border-radius: var(--roundness);
    outline: 2px solid var(--border-color);
    padding: 15px;

    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
}

#score {
    position: absolute;
    width: 100%;
    height: 0;
    top: 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    div {
        width: max-content;
        color: var(--off-white);
        background-color: var(--border-color);
        padding: 5px 8px;
        border-radius: var(--roundness);
    }
}

#popup {
    position: absolute;
    width: 100%;
    height: 0;
    bottom: 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    animation: fade-in 50ms linear;

    div {
        width: max-content;
        color: var(--off-white);
        background-color: var(--border-color);
        padding: 5px 8px;
        border-radius: var(--roundness);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

#input {
    margin: 20px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 2px;
}

#cursor {
    height: 45px;
    width: 4px;
    margin: 0 -2px;
    border-radius: 2px;
    background-color: var(--border-color);
}

#options {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: var(--gap-size);
}

#actions {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: var(--gap-size);
}
</style>
