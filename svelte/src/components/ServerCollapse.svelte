<script lang="ts">
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { faCaretRight, faCaretDown, faPlug, faPlus } from "@fortawesome/free-solid-svg-icons";
  import TerminalBlock from "./TerminalBlock.svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  // import type { Terminal } from "../API";

  export let server;
  let show = false;
  const rotation = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });

  const { terminals } = server;
</script>

<div class="root">
  <div
    class="header"
    on:click={() => {
      show = !show;
      rotation.set(Number(show));
    }}
  >
    <FontAwesomeIcon
      icon={faCaretRight}
      transform={{ rotate: $rotation * 90 }}
    />
    <span class="text">
      {server.name}
      {#if server.host}
        <span>({server.host})</span>
      {/if}
    </span>
    <div class="gap"></div>
    <span class="new-terminal">
      <span>Новый терминал</span>
      <FontAwesomeIcon icon={faPlus} transform="shrink-2 down-1" />
    </span>
  </div>
  {#if show}
    <div class="content" transition:slide>
      {#each $terminals as terminalData}
        <TerminalBlock {terminalData} />
      {/each}
    </div>
  {/if}
</div>

<style scoped>
  .root {
    flex-grow: 1;
  }
  .header {
    display: flex;
    color: #ededed;
    font-size: 2rem;
    font-family: "Ubuntu Mono", monospace;
  }
  .content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .gap {
    flex-grow: 1;
  }
  .text {
    margin-left: 0.5em;
  }
  .new-terminal {
    color: var(--main-color);
    font-size: 1.6rem;
    line-height: 2rem;
    vertical-align: middle;
  }
</style>
