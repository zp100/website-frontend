<script setup lang="ts">
import { onMounted, ref } from 'vue'


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


let puzzle_letters: string[]
let key_letter: string
function set_puzzle(): void {
    const try_puzzle_letters = sample(puzzle_list).split('')
    const try_key_letter = sample(try_puzzle_letters)
    const answer_word_list = word_list.filter((word) => is_valid(word, try_puzzle_letters, try_key_letter))
    console.log({ try_puzzle_letters, try_key_letter, answer_word_list })
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


// Update guess when keys are pressed.
const guess = ref<string[]>([])
window.addEventListener('keydown', (ev: KeyboardEvent) => {
    if (ev.key === 'Backspace') {
        guess.value.pop()
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
</script>



<template>
    <div id="game">
        <div v-for="letter in guess" class="guess-letter">
            {{ letter.toLocaleUpperCase() }}
        </div>
    </div>
</template>



<style scoped>
#game {
    width: 100vw;
    height: 100vh;
    background-color: #111;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
}

.guess-letter {
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
}
</style>
