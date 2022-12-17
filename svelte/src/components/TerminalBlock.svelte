<script lang="ts">
  import {
    faLock,
    faPencilAlt,
    faTerminal,
    faTrashCan,
    faUndo,
    faUserLock,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import type { Terminal } from "../api/terminals";
  import { edit, permissions, restart } from "../modals";
  import Action from "./Action.svelte";

  export let terminalData: Terminal;

  function open() {
    window.open(terminalData.link(), "_blank");
  }

  async function deleteTerminal(e) {
    e.stopPropagation();
    await terminalData.delete();
  }
</script>

<div class="terminal" on:click={open}>
  <div class="header">
    <!-- <Logo /> -->
    <FontAwesomeIcon class="logo" icon={faTerminal} />
    <span>{terminalData.comPort}</span>
  </div>
  <h2 class="name">
    {#if terminalData.readonly}
      <FontAwesomeIcon icon={faLock} />
    {/if}
    {terminalData.name}
  </h2>
  <div class="actions">
    {#if terminalData.canEdit}
      <Action
        icon={faPencilAlt}
        on:click={(e) => {
          $edit = terminalData;
          e.stopPropagation();
        }}
      />
    {/if}
    {#if terminalData.canChangePermissions}
      <Action
        icon={faUserLock}
        on:click={(e) => {
          $permissions = terminalData;
          e.stopPropagation();
        }}
      />
    {/if}
    {#if terminalData.canEdit}
      <Action danger icon={faTrashCan} on:click={deleteTerminal} />
    {/if}
    {#if terminalData.canRestart}
      <Action
        icon={faUndo}
        danger
        on:click={(e) => {
          $restart = terminalData;
          e.stopPropagation();
        }}
      />
    {/if}
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
