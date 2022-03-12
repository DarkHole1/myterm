<script lang="ts">
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { faCaretRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";
  import TerminalBlock from "./TerminalBlock.svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  export let server;
  let show = false;
  const rotation = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });

  let terminals = [
    {
      name: "SW_SERVICE",
      comPort: 1,
    },
  ];
  // import { defineComponent } from "vue";
  // import TerminalBlock from "./TerminalBlock.vue";

  // export default defineComponent({
  //   components: { TerminalBlock },
  //   props: ["server"],
  //   async mounted() {
  //     this.terminals = await this.server.fetchTerminals();
  //   },
  //   data() {
  //     return {
  //       terminals: [],
  //       show: false,
  //     };
  //   },
  // });
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
    <i class="fas fa-plus-circle" v-if="!show" />
    <i class="fas fa-minus-circle" v-else />
    {server.name}
    {#if server.host}
      <span>({server.host})</span>
    {/if}
  </div>
  {#if show}
    <div class="content" transition:slide>
      {#each terminals as terminalData}
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
</style>
