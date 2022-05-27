<script lang="ts">
    import Button from "./Button.svelte";
    import { role } from "../modals";
    import { onDestroy } from "svelte";

    function handleClick(success: boolean) {
        if (success) {
            // const res = {
            //     host, port, name
            // };
            // terminalInfo.update(res);
        }
        // edit.set(null);
    }

    let oldRole = "";
    let newRole = "";

    const unsubscribe = role.subscribe(role => {
        oldRole = role
        newRole = ""
    });

    onDestroy(unsubscribe);
</script>

{#if role}
    <div class="modal-container">
        <div class="modal-content">
            <div class="title">Редактирование роли {role}</div>
            <div class="pair">
                <label for="newRole" class="form-label">Новое название</label>
                <input
                    type="text"
                    class="form-control"
                    id="newRole"
                    bind:value={newRole}
                />
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
