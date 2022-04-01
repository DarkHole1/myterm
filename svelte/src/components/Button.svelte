<script lang="ts">
    export let danger: boolean = false;
</script>

<template>
    <button on:click class:danger><slot /></button>
</template>

<style>
    button {
        background: transparent;
        padding: 0.25rem 0.5rem;
        border-width: 1px;
        border-radius: 0.25rem;
        font-family: "Ubuntu Mono", monospace;
        font-size: 1.2rem;
        margin: 0.2rem;
    }

    button.danger {
        background: #da0037;
        color: white;
    }
</style>
