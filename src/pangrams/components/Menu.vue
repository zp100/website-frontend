<script setup lang="ts">
import GenericButton from './GenericButton.vue'

const emit = defineEmits<{
    close: []
    reset: []
}>()
</script>



<template>
    <div id="menu" class="dlg big">
        <div>
            Menu (WIP)
        </div>

        <div class="button-row">
            <GenericButton
                class="btn"
                title="Exit menu"
                @click="emit('close')"
            >
                Close
            </GenericButton>

            <GenericButton
                id="reset-btn"
                class="btn"
                title="Load new puzzle"
                @click="emit('reset')"
            >
                Reset
            </GenericButton>
        </div>
    </div>
</template>



<style scoped>
#menu {
    position: absolute;
    padding: 16px;
    z-index: 1;
}

.dlg {
    --dlg-margin: 50px;
    &.big {
        --dlg-margin: 25px;
    }

    width: calc(var(--total-width) - var(--dlg-margin));
    max-height: calc(100% - var(--dlg-margin));
    color: var(--off-white);
    background-color: var(--off-black);
    border: 1px solid var(--off-white);
    border-radius: var(--roundness);
}

.button-row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    gap: var(--gap-size);

    button {
        padding: 5px 10px;
        font-size: medium;
    }
}

#reset-btn {
    background-color: red;
}
</style>
