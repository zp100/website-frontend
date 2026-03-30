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
    variants: Array<{
        id: string
        pronunciation?: string
        category: string
        defs: string[]
    }>
}
const definition = ref<Definition | null>(null)
const main_variant = computed(() => definition.value?.variants[0] ?? null)
async function fetch_definition(): Promise<void> {
    const api_url = import.meta.env.VITE_BACKEND_URL
    const define_url = `${api_url}/pangrams/define/${props.found_word}`
    const response = await fetch(define_url)
    definition.value = await response.json()
}
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
            :action_buttons="{ cancel: 'Close' }"
            @cancel="show_dialog = false"
        >
            <template v-if="definition">
                <template v-if="main_variant">
                    <div class="header-line">
                        <div class="header-main">
                            {{ main_variant.id }}
                        </div>

                        <template v-if="main_variant.pronunciation">
                            <div>
                                /{{ main_variant.pronunciation }}/
                            </div>
                        </template>

                        <template v-if="main_variant.id !== found_word">
                            <div>
                                &bull;
                            </div>

                            <div>
                                as "{{ found_word }}"
                            </div>
                        </template>
                    </div>

                    <template v-for="variant in definition.variants">
                        <p>
                            {{ variant.category }}
                        </p>

                        <ul>
                            <template v-for="def in variant.defs">
                                <li>
                                    <p>
                                        {{ def.replace(/:$/, ': <...>') }}
                                    </p>
                                </li>
                            </template>
                        </ul>
                    </template>
                </template>

                <template v-else>
                    <p>
                        No definitions found
                    </p>
                </template>
            </template>

            <template v-else>
                <p>
                    Loading...
                </p>
            </template>
        </GenericDialog>
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


.header-line {
    display: flex;
    flex-flow: row wrap;
    align-items: baseline;
    gap: 8px;

    color: #888;
}


.header-main {
    color: var(--off-white);
    font-size: larger;
    font-weight: bold;
}


ul {
    padding-left: 20px;
    list-style-type: circle;
}
</style>
