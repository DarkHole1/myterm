<script lang="ts">
    import { faSync } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "fontawesome-svelte";

    export let loading: boolean;
</script>

{#if loading}
    <FontAwesomeIcon icon={faSync} spin />
{/if}
