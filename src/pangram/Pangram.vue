<script setup lang="ts">
import { onMounted, ref } from 'vue'


// Update guess when keys are pressed.
const guess = ref<string[]>([])
window.addEventListener('keydown', (ev: KeyboardEvent) => {
    if (ev.key === 'Backspace') {
        guess.value.pop()
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


let word_list: string[]
let puzzle_list: string[]
onMounted(async () => {
    ({ word_list, puzzle_list } = await get_word_list())
    set_puzzle()
})


type WordListResponse = {
    word_list: string[]
    puzzle_list: string[]
}
async function get_word_list(): Promise<WordListResponse> {
    const api_url = import.meta.env.VITE_BACKEND_URL
    const word_list_url = `${api_url}/pangram/word_list`
    try {
        const response = await fetch(word_list_url)
        const result = await response.json() as WordListResponse
        return result
    } catch (e: any) {
        throw new Error(e.message)
    }
}


const puzzle_letters = ref<string[]>([])
const key_letter = ref('')
const answer_word_list = ref<string[]>([])
function set_puzzle(): void {
    while (true) {
        const try_puzzle_letters = sample(puzzle_list).split('')
        const try_key_letter = sample(try_puzzle_letters)
        const try_answer_word_list = word_list.filter((word) => is_valid(word, try_puzzle_letters, try_key_letter))

        if (try_answer_word_list.length >= 15 && try_answer_word_list.length <= 30) {
            puzzle_letters.value = try_puzzle_letters
            key_letter.value = try_key_letter
            answer_word_list.value = try_answer_word_list
            return
        }
    }
}


function sample<T>(items: T[]): T {
    const index = Math.floor(Math.random() * items.length)
    const choice = items[index]
    if (!choice) {
        throw new Error(`Index ${index} is out of bounds of array ${items}.`)
    }

    return choice
}


function is_valid(word: string, puzzle_letters: string[], key_letter: string): boolean {
    const letters = new Set(word.split(''))

    if (!letters.has(key_letter)) {
        return false
    }

    const alphabet = new Set('abcdefghijklmnopqrstuvwxyz'.split(''))
    const invalid_letters = alphabet.difference(new Set(puzzle_letters))
    if (!letters.isDisjointFrom(invalid_letters)) {
        return false
    }

    return true
}


function shuffle_letters(): void {
    for (let i = puzzle_letters.value.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))

        let temp = puzzle_letters.value[i]
        puzzle_letters.value[i] = puzzle_letters.value[j] as string;
        puzzle_letters.value[j] = temp as string;
    }
}


const found_words = ref<string[]>([])
function submit_guess(): void {
    const guess_letters = guess.value
    guess.value = []

    if (!guess_letters.includes(key_letter.value)) {
        popup('Must contain key letter')
        return
    }

    if (guess_letters.length < 4) {
        popup('Must be at least 4 letters long')
        return
    }

    const is_bad_input = guess_letters.some((letter) => !puzzle_letters.value.includes(letter))
    if (is_bad_input) {
        popup('Must use listed letters')
        return
    }

    const guess_word = guess_letters.join('')

    if (found_words.value.includes(guess_word)) {
        popup('Already found')
        return
    }

    if (!word_list.includes(guess_word)) {
        popup('Not in word list')
        return
    }

    found_words.value.push(guess_word)
}


const popup_message = ref('')
const is_showing_popup = ref(false)
function popup(message: string): void {
    popup_message.value = message
    is_showing_popup.value = true
    setTimeout(() => is_showing_popup.value = false, 3000)
}
</script>



<template>
    <div id="game">
        <div id="word-box">
            <div id="word-count">
                <div>
                    {{ found_words.length }} / {{ answer_word_list.length }}
                </div>
            </div>

            <div id="found-words">
                <div v-for="word in found_words" class="answer">
                    {{ word.toLocaleUpperCase() }}
                </div>
            </div>

            <div v-show="is_showing_popup" id="popup">
                <div>
                    {{ popup_message }}
                </div>
            </div>
        </div>

        <div id="input">
            <div
                v-for="letter in guess"
                class="guess-letter"
                :class="{ 'key-letter': letter === key_letter, 'invalid-letter': !puzzle_letters.includes(letter) }"
            >
                {{ letter.toLocaleUpperCase() }}
            </div>

            <div id="cursor" class="guess-letter"></div>
        </div>

        <div id="options">
            <button
                v-for="letter in puzzle_letters"
                class="option-letter"
                :class="{ 'key-letter': letter === key_letter }"
                @click="guess.push(letter)"
            >
                {{ letter.toLocaleUpperCase() }}
            </button>
        </div>

        <div id="actions">
            <button class="action-btn" @click="shuffle_letters()">
                <font-awesome-icon icon="fa-solid fa-shuffle" />
            </button>
            <button class="action-btn" @click="guess.length = 0">
                <font-awesome-icon icon="fa-solid fa-trash-can" />
            </button>
            <button class="action-btn" @click="guess.pop()">
                <font-awesome-icon icon="fa-solid fa-delete-left" />
            </button>
            <button class="action-btn" @click="submit_guess()">
                <font-awesome-icon icon="fa-solid fa-circle-chevron-right" />
            </button>
        </div>
    </div>
</template>



<style scoped>
#game {
    --border-color: #333;
    --off-white: #ddd;
    --gap-size: 10px;
    --total-width: 350px;
    --button-unit: calc((var(--total-width) - 6 * var(--gap-size)) / 7);
    --wide-button-unit: calc((var(--total-width) - 3 * var(--gap-size)) / 4);

    width: 100vw;
    height: 100vh;
    background-color: #111;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: var(--gap-size);
    font-family: Arial, Helvetica, sans-serif;
}

#word-box {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
}

#found-words {
    width: calc(var(--total-width) - 20px);
    height: 260px;
    border-radius: 2px;
    outline: 2px solid var(--border-color);
    padding: 15px;

    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
}

#word-count {
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
        border-radius: 2px;
    }
}

.answer {
    margin: 5px 10px;
    color: var(--off-white);
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

    div {
        width: max-content;
        color: var(--off-white);
        background-color: var(--border-color);
        padding: 5px 8px;
        border-radius: 2px;
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

.guess-letter {
    color: white;
    font-size: xx-large;

    &.key-letter {
        color: yellow;
    }

    &.invalid-letter {
        color: var(--border-color);
    }
}

#cursor {
    height: 1.3em;
    width: 4px;
    border-radius: 2px;
    background-color: var(--border-color);
}

button {
    border: none;
    border-radius: 5px;
    background-color: #222;
    color: var(--off-white);
    cursor: pointer;

    &:hover {
        outline: 2px solid var(--border-color);
    }
}

#options {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: var(--gap-size);
}

.option-letter {
    width: var(--button-unit);
    height: var(--button-unit);
    font-size: x-large;

    &.key-letter {
        color: yellow;
    }
}

#actions {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: var(--gap-size);
}

.action-btn {
    width: var(--wide-button-unit);
    height: var(--button-unit);
    font-size: x-large;
}
</style>
