<script lang="ts">
    import Button from "./Button.svelte";
    import { edit } from "../modals";
    import { onDestroy } from "svelte";

    function handleClick(success: boolean) {
        if (success) {
            // TODO
            const res = "";
            terminalInfo.update(res);
        }
        edit.set(null);
    }

    let terminalInfo;
    let host = "";
    let port = 0;
    let name = "";

    const unsubscribe = edit.subscribe(terminal => {
        terminalInfo = terminal;
        if (terminal != null) {
            host = terminal.host;
            port = terminal.port;
            name = terminal.name;
        }
    });

    onDestroy(unsubscribe);

    // export default defineComponent({
    //     components: { VButton, VButtonDanger },
    //     data() {
    //         return {
    //             show: false,
    //             name: "%TERMINAL_NAME%",
    //             role: "",
    //             password: "",
    //             // eslint-disable-next-line
    //             cb: (data: any) => void 0,
    //         };
    //     },
    //     methods: {
    //         handleClick(answer: boolean) {
    //             if (answer) {
    //                 // eslint-disable-next-line
    //                 let res: { role: any; password?: any } = {
    //                     role: this.role,
    //                 };
    //                 if (this.password.length > 0) res.password = this.password;
    //                 this.cb(res);
    //             }
    //             this.show = false;
    //         },
    //         // eslint-disable-next-line
    //         handleOpen(event: any) {
    //             const { name, role, cb } = event.ref.params.value;
    //             this.name = name;
    //             this.role = role;
    //             this.password = "";
    //             this.cb = cb;
    //         },
    //     },
    // });
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
                />
            </div>
            <div class="pair">
                <label for="port" class="form-label">Порт</label>
                <input
                    type="number"
                    class="form-control"
                    id="port"
                    bind:value={port}
                />
            </div>
            <div class="pair">
                <label for="newName" class="form-label">Название</label>
                <input
                    type="text"
                    class="form-control"
                    id="newName"
                    bind:value={name}
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
