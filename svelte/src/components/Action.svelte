<script lang="ts">
    import { FontAwesomeIcon } from 'fontawesome-svelte';

    export let danger = false;
    export let icon;
</script>

<button on:click class:danger>
    <FontAwesomeIcon {icon} />
</button>

<style>
    button {
        background: var(--main-color);
        padding: 0.3em;
        border-radius: 0.3em;
        border: none;
        color: var(--font-color);
        font-size: 1.2rem;
        margin-left: 0.2em;
    }
    
    button:active {
        background-color: var(--main-color);
    }

    /* button:hover {
        background: #3f7e63;
    } */

    button.danger {
        background: var(--danger-color);
    }

    /* button.danger:hover {
        background: #ff1550;
    } */
</style>
