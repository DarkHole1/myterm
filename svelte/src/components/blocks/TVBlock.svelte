<script lang="ts">
  import {
    faPencilAlt,
    faTv,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import type { Terminal } from "../../api/terminals";
  import { events } from "../../events";
  import Action from "../Action.svelte";

  export let tvData: any;
</script>

<div class="terminal">
  <div class="header">
    <FontAwesomeIcon class="logo" icon={faTv} />
  </div>
  <h2 class="name">
    {tvData.name}
  </h2>
  <div class="actions">
    <Action
      icon={faPencilAlt}
      on:click={(e) => {
        e.stopPropagation();
        // events.dispatch("editTerminal", terminalData);
      }}
    />
  </div>
</div>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    font-size: 5rem;
    transition: 0.5s;
  }

  .terminal :global(.logo) {
    margin-left: 0.3em;
  }

  .terminal {
    background: var(--block-color);
    color: var(--font-color);
    width: 180px;
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

  .terminal:hover {
    background: var(--block-highlight-color);
  }

  .terminal:hover > .header {
    font-size: 3rem;
  }

  .terminal > .actions {
    margin-bottom: 1em;
    height: 0;
    opacity: 0;
    transition: 0.5s;
  }

  .terminal:hover > .actions {
    height: 1.2rem;
    opacity: 1;
  }
</style>
