<template>
    <button @click="$emit('click')"><slot></slot></button>
</template>
<style scoped>
button {
    background: transparent;
    padding: .25rem .5rem;
    border-width: 1px;
    border-radius: .25rem;
    font-family: "Ubuntu Mono", monospace;
    font-size: 1.2rem;
    margin: 0.2rem;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    emits: ['click']
})
</script>