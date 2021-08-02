<template>
    <button><slot></slot></button>
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