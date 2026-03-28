<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import GenericDialog from './GenericDialog.vue';


const props = defineProps<{
    found_word: string
    is_pangram: boolean
    guess_word: string
}>()
const display_found_word = computed(() => props.found_word.toLocaleUpperCase())
const is_guess_prefix = computed(() => props.found_word.startsWith(props.guess_word))


const show_dialog = ref(false)
onMounted(async () => {
    await fetch_definition()
})


type Definition = {
    headword: string
    stem: string
    pronunciation: string
    functional_label: string
    def: string
}
const definition = ref<Definition | null>(null)
async function fetch_definition(): Promise<void> {
    const api_url = import.meta.env.VITE_BACKEND_URL
    const define_url = `${api_url}/pangrams/define/${props.found_word}`
    try {
        const response = await fetch(define_url)
        definition.value = await response.json()
    } catch (e: any) {
        throw new Error(e.message)
    }
}


const title = computed(() => definition.value?.headword.replaceAll('*', '•'))
const subtitle = computed(() => {
    let text = `/${definition.value?.pronunciation}/ – ${definition.value?.functional_label}`
    if (props.found_word !== definition.value?.stem) {
        text = `from "${props.found_word}" – ` + text
    }
    return text
})
const message = computed(() => definition.value?.def.replace(/\W+$/, ''))
</script>



<template>
    <div class="answer" :class="{ pangram: is_pangram }" @click="show_dialog = true">
        <template v-if="is_guess_prefix">
            <span class="prefix">
                {{ display_found_word.slice(0, guess_word.length) }}
            </span>
            <span>
                {{ display_found_word.slice(guess_word.length) }}
            </span>
        </template>
        <template v-else>
            {{ display_found_word }}
        </template>
    </div>

    <template v-if="show_dialog">
        <GenericDialog
            :title="title"
            :subtitle="subtitle"
            :message="message"
            :action_buttons="{ cancel: 'Close' }"
            @cancel="show_dialog = false"
        />
    </template>
</template>



<style scoped>
.answer {
    margin: 5px 10px;
    color: var(--off-white);
    cursor: pointer;

    &.pangram {
        color: yellow;
    }
}


.prefix {
    background-color: var(--border-color);
}
</style>
