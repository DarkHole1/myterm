<script lang="ts">
  import {
    faPencilAlt,
    faTrashCan,
    faUser,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import Action from "./Action.svelte";
  import type { User } from "../api/users";
  import { events } from "../events";

  export let user: User;

  function handleEdit() {
    events.dispatch("changeUser", user);
  }

  async function deleteUser() {
    await user.delete();
  }
</script>

<div class="block">
  <div class="header">
    <FontAwesomeIcon class="logo" icon={faUser} />
  </div>
  <h2 class="name">
    {user.name}
  </h2>
  <div class="actions">
    <Action icon={faPencilAlt} on:click={handleEdit} />
    <Action danger icon={faTrashCan} on:click={deleteUser} />
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

  .block:hover {
    background: var(--block-highlight-color);
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
