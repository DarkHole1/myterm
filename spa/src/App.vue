<template>
  <div>
    <RestartModal />
    <EditModal />
    <Container>
      <ServerCollapse>
        <TerminalBlock
          :terminalData="terminal"
          v-for="terminal in terminals"
          :key="terminal.id"
        />
      </ServerCollapse>
    </Container>
    <Container>
      <TerminalBlock
        :terminalData="terminal"
        v-for="terminal in terminals"
        :key="terminal.id"
      />
    </Container>
  </div>
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
import API, { Terminal } from "./API";
import RestartModal from "./components/RestartModal.vue";
import EditModal from "./components/EditModal.vue";
import ServerCollapse from "./components/ServerCollapse.vue";

export default defineComponent({
  components: {
    TerminalBlock,
    Container,
    RestartModal,
    EditModal,
    ServerCollapse,
  },
  provide: {
    api: API,
  },
  async mounted() {
    this.terminals = await API.fetchTerminalsList();
  },
  data() {
    return {
      terminals: [] as Terminal[],
    };
  },
});
</script>
