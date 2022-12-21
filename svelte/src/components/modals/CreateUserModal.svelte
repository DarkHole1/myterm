<script lang="ts">
    import Button from "../Button.svelte";
    import API from "../../API";
    import { events } from "../../events";
    import Loading from "../helpers/Loading.svelte";

    let enabled = false;
    let name = "";
    let password = "";
    let role = "";
    let loading = false;

    events.on("createUser", () => {
        enabled = true;
        name = "Новый пользователь";
        password = "";
        role = "";
    });

    const handleClick = (success: boolean) => async () => {
        if (success) {
            loading = true;
            await API.users.create({
                name,
                role,
                password,
            });
            loading = false;
        }
        enabled = false;
    }
</script>

{#if enabled}
    <div class="modal-container">
        <div class="modal-content">
            <div class="title">Создание нового пользователя</div>
            <div class="pair">
                <label for="name">Имя</label>
                <input
                    type="text"
                    id="name"
                    bind:value={name}
                    disabled={loading}
                />
            </div>
            <div class="pair">
                <label for="role">Роль</label>
                <input
                    type="text"
                    id="role"
                    bind:value={role}
                    disabled={loading}
                />
            </div>
            <div class="pair">
                <label for="password">Пароль</label>
                <input
                    type="password"
                    id="password"
                    bind:value={password}
                    disabled={loading}
                />
            </div>
            <Button success on:click={handleClick(true)}>
                Создать
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
