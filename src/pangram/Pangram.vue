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

        if (try_answer_word_list.length >= 10 && try_answer_word_list.length <= 50) {
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


function submit_guess(): void {
    const guess_letters = guess.value
    guess.value = []

    if (!guess_letters.includes(key_letter.value)) {
        window.alert('must contain key letter')
        return
    }

    if (guess_letters.length < 4) {
        window.alert('too short lmao')
        return
    }

    const is_bad_input = guess_letters.some((letter) => !puzzle_letters.value.includes(letter))
    if (is_bad_input) {
        window.alert('invalid letters bruh')
        return
    }

    const guess_word = guess_letters.join('')
    if (word_list.includes(guess_word)) {
        window.alert('word found!')
        return
    } else {
        window.alert('not in word list')
        return
    }
}


</script>



<template>
    <div id="game">
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
            <button class="action-btn" @click="guess.length = 0">
                <font-awesome-icon icon="fa-regular fa-trash-can" />
            </button>
            <button class="action-btn" @click="guess.pop()">
                <font-awesome-icon icon="fa-regular fa-square-caret-left" />
            </button>
            <button class="action-btn" @click="submit_guess()">
                <font-awesome-icon icon="fa-regular fa-circle-right" />
            </button>
        </div>
    </div>
</template>



<style scoped>
#game {
    width: 100vw;
    height: 100vh;
    background-color: #111;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-family: Arial, Helvetica, sans-serif;
}

#input {
    margin: 10  px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.guess-letter {
    color: white;
    font-size: xx-large;

    &.key-letter {
        color: #ff0;
    }

    &.invalid-letter {
        color: #333;
    }
}

#cursor {
    height: 1.2em;
    width: 4px;
    border-radius: 2px;
    background-color: #333;
}

button {
    border: none;
    border-radius: 5px;
    background-color: #222;
    color: #ddd;
    cursor: pointer;

    &:hover {
        outline: 2px solid #444;
    }
}

#options {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.option-letter {
    width: 50px;
    height: 50px;
    font-size: xx-large;

    &.key-letter {
        color: #ff0;
    }
}

#actions {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.action-btn {
    width: 130px;
    height: 50px;
    font-size: x-large;
}
</style>
