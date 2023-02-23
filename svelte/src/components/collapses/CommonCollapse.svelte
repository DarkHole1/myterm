<script lang="ts">
  import { faCaretRight, faPlus } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { slide } from "svelte/transition";

  export let title: string;
  export let buttonTitle: string | undefined;

  let show = false;
  const rotation = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });

  function toggle() {
    show = !show;
    $rotation = Number(show);
  }
</script>

<div class="root">
  <div class="header" on:click={toggle}>
    <FontAwesomeIcon
      icon={faCaretRight}
      transform={{ rotate: $rotation * 90 }}
    />
    <span class="text">{title}</span>
    <div class="gap" />
    {#if buttonTitle}
      <span class="text" on:click|stopPropagation>
        <span>{buttonTitle}</span>
        <FontAwesomeIcon icon={faPlus} transform="shrink-2 down-1" />
      </span>
    {/if}
  </div>
  {#if show}
    <div class="content" transition:slide>
      <slot />
    </div>
  {/if}
</div>
