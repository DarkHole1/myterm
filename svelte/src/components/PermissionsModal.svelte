<script lang="ts">
    import Button from "./Button.svelte";
    import { permissions as modalPermissions } from "../modals";
    import { onDestroy } from "svelte";
    import type { Terminal } from "../api/terminals";

    function handleClick(success: boolean) {
        if (success && terminalInfo != null) {
            terminalInfo.setPermissions(permissions);
        }
        modalPermissions.set(null);
    }
    
    // TODO: not any
    let terminalInfo : Terminal | null;
    let permissions: { [key: string]: { show: boolean; write: boolean } } = {};
    let newuser = "";

    const unsubscribe = modalPermissions.subscribe((terminal) => {
        terminalInfo = terminal;
        if (terminal != null) {
            permissions = {};
            terminal.getPermissions().then((perm) => {
                // HACK
                permissions = perm as any;
            });
        }
    });

    onDestroy(unsubscribe);
</script>

{#if terminalInfo}
    <div class="modal-container">
        <div class="modal-content">
            <div class="title">Права для {terminalInfo.name}</div>
            {#each Object.entries(permissions) as [key, value]}
                <div>
                    <span>{key}</span>{" "}
                    <label for={key + '_read'}>Чтение</label>
                    <input type="checkbox" bind:checked={value.show} id={key + "_read"} />
                    <label for={key + '_write'}>Запись</label>
                    <input type="checkbox" bind:checked={value.write} />
                </div>
            {/each}
            <div>
                <input bind:value={newuser} />{" "}
                <button
                    on:click={() => {
                        permissions[newuser] = { show: true, write: false };
                        newuser = "";
                    }}>Добавить роль</button
                >
            </div>
            <Button danger on:click={() => handleClick(true)}>Отправить</Button>
            <Button on:click={() => handleClick(false)}>Отмена</Button>
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
