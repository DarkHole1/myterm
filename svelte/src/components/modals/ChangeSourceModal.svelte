<script lang="ts">
    import Button from "../Button.svelte";
    import { events } from "../../events";
    import Loading from "../helpers/Loading.svelte";
    import type { Source, TV } from "../../api/tvs";

    const handleClick = (success: boolean) => async () => {
        if (success && tvData != null) {
            loading = true;
            await tvData.selectSource(newSource);
            loading = false;
        }
        tvData = null;
    };

    let loading = false;
    let tvData: TV | null = null;
    let newSource: Source = "vga";

    events.on("changeSource", (tv) => {
        tvData = tv;
    });
</script>

{#if tvData != null}
    <div class="modal-container">
        <div class="modal-content">
            <div class="title">
                Переключить {tvData.name} на другой источник
            </div>
            <select bind:value={newSource}>
                <option value="vga">VGA</option>
                <option value="hdmi1">HDMI1</option>
                <option value="hdmi2">HDMI2</option>
                <option value="hdmi3">HDMI3</option>
                <option value="component">Component</option>
                <option value="composite">Composite</option>
                <option value="usb">USB</option>
            </select>
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
