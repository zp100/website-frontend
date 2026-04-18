<script setup lang="ts">
import { computed } from 'vue';
import ProgressBar from './ProgressBar.vue';

const props = defineProps<{
    words: number
    words_total: number
    score: number
    score_total: number
}>()
const percent = computed(() => Math.floor(100 * props.score / props.score_total))
</script>



<template>
    <div id="stats">
        <div class="popup">
            <div>
                Words:
                <span :class="{ full: percent === 100 }">
                    {{ words }}/{{ words_total }}
                </span>
            </div>

            <div>
               &bull;
            </div>

            <div>
                Score:
                <span :class="{ full: percent === 100 }">
                    {{ score }}/{{ score_total }}
                </span>
            </div>

            <ProgressBar :percent="percent" />
        </div>
    </div>
</template>



<style scoped>
#stats {
    position: absolute;
    width: 100%;
    height: 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    top: 0;
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

    cursor: pointer;
}

.full {
    color: yellow;
}
</style>
