<script lang="ts">
    import Button from "../Button.svelte";
    import { permissions as modalPermissions } from "../../modals";
    import { onDestroy } from "svelte";
    import type { Terminal } from "../../api/terminals";
    import { FontAwesomeIcon } from "fontawesome-svelte";
    import { faSync } from "@fortawesome/free-solid-svg-icons";
    import Loading from "../helpers/Loading.svelte";
    import { events } from "../../events";

    const handleClick = (success: boolean) => async () => {
        if (success && terminalInfo != null) {
            loading = true;
            await terminalInfo.setPermissions(permissions);
            loading = false;
        }
        terminalInfo = null;
    };

    let loading = false;
    let terminalInfo: Terminal | null;
    let permissions: { [key: string]: { show: boolean; write: boolean } } = {};
    let newuser = "";

    events.on("changeTerminalPermissions", (terminal) => {
        terminalInfo = terminal;
        permissions = {};
        terminal.getPermissions().then((perm) => {
            // HACK
            permissions = perm as any;
        });
    });
</script>

{#if terminalInfo}
    <div class="modal-container">
        <div class="modal-content">
            <div class="title">Права для {terminalInfo.name}</div>
            {#each Object.entries(permissions) as [key, value]}
                <div>
                    <span>{key}</span>{" "}
                    <label for={key + "_read"}>Чтение</label>
                    <input
                        type="checkbox"
                        bind:checked={value.show}
                        id={key + "_read"}
                        disabled={loading}
                    />
                    <label for={key + "_write"}>Запись</label>
                    <input
                        type="checkbox"
                        bind:checked={value.write}
                        id={key + "_write"}
                        disabled={loading}
                    />
                </div>
            {/each}
            <div>
                <input bind:value={newuser} disabled={loading} />{" "}
                <button
                    disabled={loading}
                    on:click={() => {
                        permissions[newuser] = { show: true, write: false };
                        newuser = "";
                    }}>Добавить роль</button
                >
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

    label {
        display: unset;
    }
</style>
