<script setup lang="ts">
import { autoTimeout } from '@/pangrams/util';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    messages: string[][]
}>()
const new_message = computed(() => props.messages.at(-1) ?? [])

const is_showing_popup = ref(false)
watch(() => props.messages.length, () => {
    autoTimeout(
        () => is_showing_popup.value = true,
        () => is_showing_popup.value = false,
        4000,
        true
    )
})
</script>



<template>
    <template v-if="is_showing_popup">
        <div id="popup-box">
            <div class="popup">
                <template v-for="fragment in new_message.slice(0, -1)">
                    <div>
                        {{ fragment }}
                    </div>

                    <div>
                        &bull;
                    </div>
                </template>

                <template v-if="new_message.length > 0">
                    <div>
                        {{ new_message.at(-1) }}
                    </div>
                </template>
            </div>
        </div>
    </template>
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
    animation: fade-in 2s linear 2 alternate forwards;
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

@keyframes fade-in {
    0% {
        opacity: 0;
    }

    /* 100ms */
    5% {
        opacity: 1;
    }
}
</style>
