<script setup lang="ts">
import { computed, ref, watch } from 'vue';


const props = defineProps<{
    messages: string[]
}>()
const new_message = computed(() => props.messages.at(-1) ?? '')


const is_showing_popup = ref(false)
let timeout_id: number
watch(() => props.messages.length, () => {
    clearTimeout(timeout_id)
    is_showing_popup.value = false

    // Wait a moment for the old popup to disappear.
    setTimeout(() => {
        is_showing_popup.value = true
        timeout_id = setTimeout(() => is_showing_popup.value = false, 5000)
    }, 0)
})
</script>



<template>
    <div id="popup-box">
        <template v-if="is_showing_popup">
            <div class="popup">
                {{ new_message }}
            </div>
        </template>
    </div>
</template>



<style scoped>
#popup-box {
    position: absolute;
    width: 100%;
    height: 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    bottom: 0;
    animation: fade-in 50ms linear;
}


.popup {
    width: max-content;
    color: var(--off-white);
    background-color: var(--border-color);
    padding: 5px 8px;
    border-radius: var(--roundness);
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 8px;
}
</style>
