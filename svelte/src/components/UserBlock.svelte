<script lang="ts">
  import {
    faPencilAlt,
    faTerminal,
    faUser,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import Action from "./Action.svelte";
  import { user as userModal } from "../modals";

  export let user;

  function handleEdit() {
    userModal.set(user);
  }
</script>

<div class="block">
  <div class="header">
    <!-- <Logo /> -->
    <FontAwesomeIcon class="logo" icon={faUser} />
  </div>
  <h2 class="name">
    {user.name}
  </h2>
  <div class="actions">
    <!-- TODO click -->
    <Action icon={faPencilAlt} on:click={handleEdit} />
    <!-- <ActionRestart v-if="terminalData.canRestart" @click="handleRestart" />
    <ActionEdit v-if="terminalData.canEdit" @click="handleEdit" />
    <ActionPermissions v-if="terminalData.canChangePermissions" @click="handlePermissions" /> -->
  </div>
</div>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    font-size: 5rem;
    transition: 0.5s;
  }

  .block :global(.logo) {
    margin-left: 0.3em;
  }

  .block {
    background: #1d1d1d;
    color: #ededed;
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

  .block:hover {
    background: #2d2d2d;
  }

  .block:hover > .header {
    font-size: 3rem;
  }

  .block > .actions {
    margin-bottom: 1em;
    height: 0;
    opacity: 0;
    transition: 0.5s;
  }

  .block:hover > .actions {
    height: 1.2rem;
    opacity: 1;
  }
</style>
