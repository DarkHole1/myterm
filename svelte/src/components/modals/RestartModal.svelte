<script lang="ts">
    import Button from "../Button.svelte";
    import type { Terminal } from "../../api/terminals";
    import { events } from "../../events";
    import Loading from "../helpers/Loading.svelte";

    const handleClick = (success: boolean) => async () => {
        if (success && terminalInfo != null) {
            loading = true;
            await terminalInfo.restart();
            loading = false;
        }
        terminalInfo = null;
    };

    let loading = false;
    let terminalInfo: Terminal | null = null;

    events.on("restartTerminal", (terminal) => {
        terminalInfo = terminal;
    });
</script>

{#if terminalInfo != null}
    <div class="modal-container">
        <div class="modal-content">
            <div class="title">Перезапустить {terminalInfo.name}</div>
            <Button danger on:click={handleClick(true)}
                >Да <Loading {loading} /></Button
            >
            <Button on:click={handleClick(false)}>Нет</Button>
        </div>
    </div>
{/if}

<style>
    .title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .modal-content {
        position: relative;
        display: flex;
        flex-direction: column;
        max-height: 90%;
        margin: 0 1rem;
        margin-top: 1.5rem;
        padding: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.25rem;
        background: #fff;
    }

    .modal-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
</style>
