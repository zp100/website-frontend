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

const options = ref<Array<{ letter: string; count: number; is_locked: boolean }>>(
    props.puzzle.letters.map((letter) => ({
        letter,
        count: NaN,
        is_locked: false,
    }))
)

let total_score = 0
onMounted(() => {
    register_key_handler()
    set_letter_counts()
    total_score = props.puzzle.answer_word_list.reduce((score, word) => score + get_score(word), 0)
})

const guess = ref<string>('')
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
            guess.value += ev.key
            return
        }
    })
}

function get_score(word: string): number {
    const base_score = word.length * (word.length + 1) / 2
    return (is_pangram(word) ? base_score * 2 : base_score)
}

function set_letter_counts(): void {
    const letter_counts: Record<string, number> = {}

    props.puzzle.answer_word_list.forEach((word) => {
        word.split('').forEach((letter) => {
            if (letter_counts[letter] !== undefined) {
                letter_counts[letter] += 1
            } else {
                letter_counts[letter] = 1
            }
        })
    })

    props.puzzle.found_words.forEach((word) => {
        word.split('').forEach((letter) => {
            if (letter_counts[letter] !== undefined) {
                letter_counts[letter] -= 1
            }
        })
    })

    options.value.forEach((option) => {
        option.count = letter_counts[option.letter] ?? 0
    })
}

const popup_messages = ref<string[][]>([])
function show_stats(): void {
    popup(
        `${props.puzzle.answer_word_list.length - props.puzzle.found_words.length} word(s) remaining`,
        `${total_score - props.puzzle.score} score remaining`,
    )
}

function is_pangram(word: string): boolean {
    return new Set(word.split('')).isSupersetOf(new Set(props.puzzle.letters))
}

function move_letter(old_index: number, spaces: number): void {
    const new_index = old_index + spaces
    if (new_index < 0 || new_index >= options.value.length) {
        return
    }

    const removed = options.value.splice(old_index, 1)
    const option = removed[0]!
    options.value.splice(new_index, 0, option)
}

function shuffle_letters(): void {
    for (let i = options.value.length - 1; i > 0; i--) {
        if (options.value[i]?.is_locked) {
            continue
        }

        let j = Math.floor(Math.random() * (i + 1))
        if (options.value[j]?.is_locked) {
            continue
        }

        let temp = options.value[i]
        options.value[i] = options.value[j]!
        options.value[j] = temp!
    }
}

function clear_guess(): void {
    guess.value = ''
}

function backspace_guess(): void {
    guess.value = guess.value.slice(0, -1)
}

const found_words_sorted = computed(() => props.puzzle.found_words.toSorted())
function submit_guess(): void {
    if (guess.value === '') {
        return
    }

    const guess_word = guess.value
    guess.value = ''

    if (guess_word.length < props.min_len) {
        popup(guess_word.toLocaleUpperCase(), `Must be at least ${props.min_len} letters long`)
        return
    }

    if (!props.word_list.includes(guess_word)) {
        popup(guess_word.toLocaleUpperCase(), 'Not in word list')
        return
    }

    if (props.puzzle.found_words.includes(guess_word)) {
        popup(guess_word.toLocaleUpperCase().toLocaleUpperCase(), 'Already found')
        return
    }

    if (!guess_word.includes(props.puzzle.key_letter)) {
        popup(guess_word.toLocaleUpperCase(), 'Must contain key letter')
        return
    }

    const is_bad_input = guess_word.split('').some((letter) => !props.puzzle.letters.includes(letter))
    if (is_bad_input) {
        popup(guess_word.toLocaleUpperCase(), 'Must use listed letters')
        return
    }

    const word_score = get_score(guess_word)
    emit('update_puzzle', props.puzzle.found_words.concat(guess_word), props.puzzle.score + word_score)
    if (props.puzzle.found_words.length === props.puzzle.answer_word_list.length) {
        popup('All words found!')
    } else {
        popup(guess_word.toLocaleUpperCase(), `+${word_score}`)
    }

    set_letter_counts()
}

function popup(...text: string[]): void {
    popup_messages.value.push(text)
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
                    :guess="guess"
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
        <template v-for="(option, index) in options" :key="option.letter">
            <OptionButton
                :letter="option.letter"
                :is_key_letter="option.letter === puzzle.key_letter"
                :count="option.count"
                :index="index"
                :is_locked="option.is_locked"
                @click="guess += option.letter"
                @drag="(spaces) => move_letter(index, spaces)"
                @swipe="option.is_locked = !option.is_locked"
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
