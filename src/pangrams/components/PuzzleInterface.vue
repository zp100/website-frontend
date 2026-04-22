<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Puzzle } from '../util'
import ActionButton from './ActionButton.vue'
import Answer from './Answer.vue'
import DynamicPopup from './DynamicPopup.vue'
import GuessLetter from './GuessLetter.vue'
import OptionButton from './OptionButton.vue'
import Stats from './Stats.vue'

const props = defineProps<{
    puzzle: Puzzle
    min_len: number
    word_list: string[]
}>()
const emit = defineEmits<{
    update_puzzle: [ found_words: string[], score: number ]
}>()

let total_score: number
onMounted(() => {
    register_key_handler()
    set_letter_counts()
    total_score = props.puzzle.answer_word_list.reduce((score, word) => score + get_score(word), 0)
})

const guess = ref<string[]>([])
const guess_word = computed(() => guess.value.join(''))
function register_key_handler(): void {
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

        if (ev.repeat || ev.altKey || ev.ctrlKey || ev.metaKey) {
            return
        }

        const isLetter = /^[A-Za-z]$/.test(ev.key)
        if (isLetter) {
            guess.value.push(ev.key)
            return
        }
    })
}

function get_score(word: string): number {
    const base_score = word.length * (word.length + 1) / 2
    return (is_pangram(word) ? base_score * 2 : base_score)
}

const letter_counts = ref<Record<string, number>>({})
function set_letter_counts(): void {
    letter_counts.value = {}

    props.puzzle.answer_word_list.forEach((word) => {
        word.split('').forEach((letter) => {
            if (letter_counts.value[letter] !== undefined) {
                letter_counts.value[letter] += 1
            } else {
                letter_counts.value[letter] = 1
            }
        })
    })

    props.puzzle.found_words.forEach((word) => {
        word.split('').forEach((letter) => {
            if (letter_counts.value[letter] !== undefined) {
                letter_counts.value[letter] -= 1
            }
        })
    })
}

const popup_messages = ref<string[]>([])
function show_stats(): void {
    popup_messages.value.push(`
        ${props.puzzle.answer_word_list.length - props.puzzle.found_words.length} word(s) remaining,
        ${total_score - props.puzzle.score} score remaining
    `)
}

function is_pangram(word: string): boolean {
    return new Set(word.split('')).isSupersetOf(new Set(props.puzzle.letters))
}

function move_letter(old_index: number, spaces: number): void {
    const new_index = old_index + spaces
    if (new_index < 0 || new_index >= props.puzzle.letters.length) {
        return
    }

    const removed = props.puzzle.letters.splice(old_index, 1)
    const letter = removed[0]!
    props.puzzle.letters.splice(new_index, 0, letter)
}

function shuffle_letters(): void {
    for (let i = props.puzzle.letters.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))

        let temp = props.puzzle.letters[i]
        props.puzzle.letters[i] = props.puzzle.letters[j]!
        props.puzzle.letters[j] = temp!
    }
}

function clear_guess(): void {
    guess.value.length = 0
}

function backspace_guess(): void {
    guess.value.pop()
}

const found_words_sorted = computed(() => props.puzzle.found_words.toSorted())
function submit_guess(): void {
    if (guess.value.length === 0) {
        return
    }

    const guess_letters = guess.value
    guess.value = []

    if (guess_letters.length < props.min_len) {
        popup_messages.value.push(`Must be at least ${props.min_len} letters long`)
        return
    }

    const guess_word = guess_letters.join('')
    if (!props.word_list.includes(guess_word)) {
        popup_messages.value.push('Not in word list')
        return
    }

    if (props.puzzle.found_words.includes(guess_word)) {
        popup_messages.value.push('Already found')
        return
    }

    if (!guess_letters.includes(props.puzzle.key_letter)) {
        popup_messages.value.push('Must contain key letter')
        return
    }

    const is_bad_input = guess_letters.some((letter) => !props.puzzle.letters.includes(letter))
    if (is_bad_input) {
        popup_messages.value.push('Must use listed letters')
        return
    }

    const word_score = get_score(guess_word)
    emit('update_puzzle', props.puzzle.found_words.concat(guess_word), props.puzzle.score + word_score)
    if (props.puzzle.found_words.length === props.puzzle.answer_word_list.length) {
        popup_messages.value.push('All words found!')
    } else {
        popup_messages.value.push(`+${word_score}`)
    }

    set_letter_counts()
}
</script>



<template>
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
                :index="index"
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



<style scoped>
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

#input {
    margin: 20px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1px;
}

#cursor {
    height: 45px;
    width: 4px;
    margin: 0 -1px;
    border-radius: 2px;
    background-color: var(--border-color);
}

#options {
    touch-action: none;
    overscroll-behavior: none;

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
