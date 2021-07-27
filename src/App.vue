<template>
  <Container>
    <TerminalBlock
      :terminalData="terminal"
      v-for="terminal in terminals"
      :key="terminal.name"
    />
  </Container>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap");
@import url("https://use.fontawesome.com/releases/v5.15.3/css/all.css");

body {
  font-family: "Ubuntu Mono", monospace;
  background: #313131;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import TerminalBlock from "./components/TerminalBlock.vue";
import Container from "./components/Container.vue";

export default defineComponent({
  components: { TerminalBlock, Container },
  data: () => {
    return {
      terminals: [
        {
          name: "SW_SERVICE",
          canEdit: true,
          canRestart: true,
        },
        {
          name: "ISP1",
          canEdit: false,
          canRestart: true,
        },
        {
          name: "ISP2",
          canEdit: true,
          canRestart: false,
        },
        {
          name: "SW1",
          canEdit: true,
          canRestart: true,
        },
        {
          name: "SW2",
          canEdit: true,
          canRestart: true,
        },
        {
          name: "R1",
          canEdit: true,
          canRestart: true,
        },
        {
          name: "_unused1",
          canEdit: true,
          canRestart: true,
        },
        {
          name: "_unused2",
          canEdit: true,
          canRestart: true,
        },
      ],
    };
  },
});
</script>
