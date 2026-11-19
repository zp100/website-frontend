<script setup lang="ts">
import { puzzles_key } from '@/pangrams/util.ts'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { inject, ref } from 'vue'
import GenericButton from '../GenericButton.vue'
import Rules from './Rules.vue'
import Puzzle from './Puzzle.vue'

const emit = defineEmits<{
    close: []
}>()
const puzzles = inject(puzzles_key)!

const tab = ref<'rules' | 'puzzles' | 'new' | 'settings'>('rules')
</script>



<template>
    <div id="menu" class="dlg big">
        <div class="button-row">
            <GenericButton
                title="Rules"
                class="menu-button tab"
                @click="tab = 'rules'"
            >
                Rules
            </GenericButton>

            <GenericButton
                title="Puzzles"
                class="menu-button tab"
                @click="tab = 'puzzles'"
            >
                Puzzles
            </GenericButton>

            <GenericButton
                title="New"
                class="menu-button tab"
                @click="tab = 'new'"
            >
                New
            </GenericButton>

            <GenericButton
                title="Settings"
                class="menu-button tab"
                @click="tab = 'settings'"
            >
                Settings
            </GenericButton>

            <GenericButton
                title="Exit menu"
                class="menu-button"
                @click="emit('close')"
            >
                <FontAwesomeIcon icon="fa-solid fa-xmark" />
            </GenericButton>
        </div>

        <div class="content">
            <template v-if="tab === 'rules'">
                <Rules />
            </template>

            <template v-if="tab === 'puzzles'">
                <template v-for="(puzzles, index) in puzzles.my_puzzle_list.value" :key="puzzles.letters.join()">
                    <Puzzle
                        :puzzle_num="index"
                        @close_menu="emit('close')"
                    />
                </template>
            </template>

            <template v-if="tab === 'new'">
                <p>New (WIP)</p>
            </template>

            <template v-if="tab === 'settings'">
                <p>Settings (WIP)</p>
            </template>
        </div>
    </div>
</template>



<style scoped>
#menu {
    height: 100%;
    padding: 16px;
    overflow-y: auto;
}

.dlg {
    --dlg-margin: 50px;
    &.big {
        --dlg-margin: 25px;
    }

    width: calc(var(--total-width) - var(--dlg-margin));
    max-height: calc(100% - 50px);
    color: var(--off-white);
    background-color: var(--off-black);
    border: 1px solid var(--off-white);
    border-radius: var(--roundness);
}

.button-row {
    position: sticky;
    top: -16px;
    padding: var(--gap-size);
    background-color: var(--off-black);
    margin: -16px;
    margin-bottom: 16px;

    display: flex;
    flex-flow: row nowrap;
    gap: var(--gap-size);

    .tab {
        flex: 1;
    }
}
</style>
