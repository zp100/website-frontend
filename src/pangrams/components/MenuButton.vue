<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import GenericButton from './GenericButton.vue';
import Menu from './Menu.vue';
import GenericDialog from './GenericDialog.vue';

const emit = defineEmits<{
    reset: []
}>()

const show_menu = ref(false)
function reset(): void {
    show_menu.value = false
    emit('reset')
}
</script>



<template>
    <GenericButton
        id="menu-btn"
        title="Menu"
        @click="show_menu = true"
    >
        <FontAwesomeIcon icon="fa-solid fa-bars" />
    </GenericButton>

    <template v-if="show_menu">
        <GenericDialog
            :action_buttons="{ cancel: 'Close' }"
            @cancel="show_menu = false"
        >
            <Menu
                @reset="reset()"
            />
        </GenericDialog>
    </template>
</template>



<style scoped>
#menu-btn {
    position: absolute;
    top: 4px;
    right: 4px;

    width: 30px;
    height: 30px;
    font-size: large;
}
</style>
