<script lang="ts">
    import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "fontawesome-svelte";
    import API from "../API";

    async function logout() {
        await API.logout();
        location.reload();
    }
</script>

<div class="topbar">
    <div class="title">MyTerm</div>
    <div class="fill" />
    <div class="logout" on:click={logout}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </div>
</div>

<style>
    .topbar {
        display: flex;
        color: var(--font-color);
        font-size: 2rem;
        border-bottom: 2px solid var(--block-highlight-color);
        padding: 0.5rem;
    }
    .fill {
        flex-grow: 1;
    }
    .title {
        font-weight: bold;
    }
</style>
