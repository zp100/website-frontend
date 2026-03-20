<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>



<template>
    <div class="spinner">
        <FontAwesomeIcon icon="fa-solid fa-spinner" />
    </div>
</template>



<style scoped>
.spinner {
    color: white;
    font-size: var(--guess-font-size);
    animation: spin 2s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(1turn);
    }
}
</style>
