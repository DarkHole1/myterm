<script lang="ts">
    import Button from "./Button.svelte";
    import { restart } from "../modals";
    import { onDestroy } from "svelte";

    function handleClick(success: boolean) {
        alert(success);
        if (success) {
            // TODO
        }
        restart.set(null);
    }

    let terminalInfo;

    const unsubscribe = restart.subscribe((terminal) => {
        terminalInfo = terminal;
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

{#if terminalInfo != null}
    <div class="modal-container">
        <div class="modal-content">
            <div class="title">Перезапустить {terminalInfo.name}</div>
            <Button danger on:click={() => handleClick(true)}>Да</Button>
            <Button on:click={() => handleClick(false)}>Нет</Button>
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
