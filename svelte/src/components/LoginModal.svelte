<script lang="ts">
import API from "../API";

    import { user } from "../modals";

    import Button from "./Button.svelte";

    let user = "";
    let password = "";

    function handleClick() {
        API.login(user, password);
    }
</script>

<div class="modal-container">
    <div class="modal-content">
        <div class="title">Вход MyTerm</div>
        <div class="pair">
            <label for="role" class="form-label">Логин</label>
            <input
                type="text"
                class="form-control"
                id="role"
                bind:value={user}
            />
        </div>
        <div class="pair">
            <label for="password" class="form-label">Пароль</label>
            <input
                type="password"
                class="form-control"
                id="password"
                bind:value={password}
            />
        </div>
        <Button success on:click={() => handleClick()}>Войти</Button>
    </div>
</div>

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
