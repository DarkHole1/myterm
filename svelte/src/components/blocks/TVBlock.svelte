<script lang="ts">
  import {
    faLayerGroup,
    faPlug,
    faPlugCircleXmark,
    faTv,
    faVolumeHigh,
    faVolumeXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import type { TV } from "../../api/tvs";
  import { events } from "../../events";
  import Action from "../Action.svelte";

  export let tvData: TV;
</script>

<div class="tv">
  <div class="header">
    <FontAwesomeIcon class="logo" icon={faTv} />
  </div>
  <h2 class="name">
    {tvData.name}
  </h2>
  <div class="actions">
    <Action icon={faPlug} />
    <Action icon={faPlugCircleXmark} danger />
    <Action icon={faLayerGroup} />
    <Action icon={faVolumeHigh} />
    <Action icon={faVolumeXmark} danger />
  </div>
</div>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    font-size: 5rem;
    transition: 0.5s;
  }

  .tv :global(.logo) {
    margin-left: 0.3em;
  }

  .tv {
    background: var(--block-color);
    color: var(--font-color);
    min-width: 180px;
    height: 180px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    text-align: right;
    justify-content: flex-end;
    border-radius: 2em;
    transition: 0.5s;
    margin: 1rem;
  }

  .tv:hover {
    background: var(--block-highlight-color);
  }

  .tv:hover > .header {
    font-size: 3rem;
  }

  .tv > .actions {
    margin-bottom: 1em;
    height: 0;
    opacity: 0;
    transition: 0.5s;
  }

  .tv:hover > .actions {
    height: 1.2rem;
    opacity: 1;
  }
</style>
