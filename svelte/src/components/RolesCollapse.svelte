<script lang="ts">
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { faCaretRight, faPlus } from "@fortawesome/free-solid-svg-icons";
  import UserBlock from "./UserBlock.svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import API from "../API";

  let show = false;
  const rotation = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });

  // const { users } = API;
  const roles = ["a", "b", "c"]
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
    <span class="text">Роли</span>
    <div class="gap"></div>
  </div>
  {#if show}
    <div class="content" transition:slide>
      {#each roles as role}
        <div>{role}</div>
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
  .new-user {
    color: var(--main-color);
    font-size: 1.6rem;
    line-height: 2rem;
    vertical-align: middle;
  }
</style>
