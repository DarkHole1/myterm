<script lang="ts">
    import Button from "../Button.svelte";
    import type { Terminal } from "../../api/terminals";
    import { events } from "../../events";
    import Loading from "../helpers/Loading.svelte";

    const handleClick = (success: boolean) => async () => {
        if (success && terminalInfo) {
            const res = {
                host,
                port,
                name,
            };
            loading = true;
            await terminalInfo.update(res);
            loading = false;
        }
        terminalInfo = null;
    };

    let loading = false;
    let terminalInfo: Terminal | null;
    let host = "";
    let port = 0;
    let name = "";

    events.on("editTerminal", (terminal) => {
        terminalInfo = terminal;
        host = terminal.host ?? "";
        port = terminal.port ?? 0;
        name = terminal.name;
    });
</script>

{#if terminalInfo}
    <div class="modal-container">
        <div class="modal-content">
            <div class="title">Редактирование {terminalInfo.name}</div>
            <div class="pair">
                <label for="host" class="form-label">IP адрес</label>
                <input
                    type="text"
                    class="form-control"
                    id="host"
                    bind:value={host}
                    disabled={loading}
                />
            </div>
            <div class="pair">
                <label for="port" class="form-label">Порт</label>
                <input
                    type="number"
                    class="form-control"
                    id="port"
                    bind:value={port}
                    disabled={loading}
                />
            </div>
            <div class="pair">
                <label for="newName" class="form-label">Название</label>
                <input
                    type="text"
                    class="form-control"
                    id="newName"
                    bind:value={name}
                    disabled={loading}
                />
            </div>
            <Button danger on:click={handleClick(true)}>
                Отправить
                <Loading {loading} />
            </Button>
            <Button on:click={handleClick(false)}>Отмена</Button>
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

    .pair {
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
    }

    .pair > input {
        font-size: 1.2rem;
        font-family: "Ubuntu Mono", monospace;
    }
</style>
