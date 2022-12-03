<script lang="ts">
    import Button from "./Button.svelte";
    import { user } from "../modals";
    import { onDestroy } from "svelte";
    import type { User } from "../api/users";
    import API from "../API";

    async function handleClick(success: boolean) {
        if (success && userInfo != null) {
            const role = await API.roles.findOrCreate(roleName)
            const res: { role: string; password?: string } = { role: role.id };
            if (password != "") {
                res.password = password;
            }
            userInfo.update(res);
        }
        user.set(null);
    }

    let userInfo: User | null = null;
    let roleName = "";
    let password = "";

    const unsubscribe = user.subscribe((user) => {
        userInfo = user;
        if (user != null) {
            roleName = user.role;
            password = "";
        }
    });

    onDestroy(unsubscribe);
</script>

{#if userInfo}
    <div class="modal-container">
        <div class="modal-content">
            <div class="title">Редактирование {userInfo.name}</div>
            <div class="pair">
                <label for="role" class="form-label">Роль</label>
                <input
                    type="text"
                    class="form-control"
                    id="role"
                    bind:value={roleName}
                />
            </div>
            <div class="pair">
                <label for="password" class="form-label">Пароль</label>
                <input
                    type="text"
                    class="form-control"
                    id="password"
                    bind:value={password}
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
