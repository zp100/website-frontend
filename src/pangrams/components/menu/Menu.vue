<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref } from 'vue'
import GenericButton from '../GenericButton.vue'
import Rules from './Rules.vue';
import GenericDialog from '../GenericDialog.vue';

const emit = defineEmits<{
    close: []
    reset: []
}>()

const tab = ref<'rules' | 'games' | 'settings'>('rules')

const show_reset_dialog = ref(false)
function reset(): void {
    show_reset_dialog.value = false
    emit('reset')
}
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
                title="Games"
                class="menu-button tab"
                @click="tab = 'games'"
            >
                Games
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

            <template v-if="tab === 'games'">
                <p>Games (WIP)</p>

                <GenericButton
                    title="Reset"
                    class="menu-button"
                    style="background-color: red;"
                    @click="show_reset_dialog = true"
                >
                    Reset
                </GenericButton>

                <template v-if="show_reset_dialog">
                    <GenericDialog
                        :action_buttons="{ cancel: 'Cancel', affirmative: 'Reset' }"
                        @cancel="show_reset_dialog=false"
                        @affirmative="reset()"
                    >
                        <p>
                            Are you sure you want to reset?
                            The current puzzle will be deleted.
                        </p>
                    </GenericDialog>
                </template>
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
