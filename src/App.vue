<template>
  <div>
    <vue-final-modal v-model="restartModalShow" name="restartModal" :drag="true" content-class="modal-content" classes="modal-container">
      <div style="background: white; width: 100px; display">Hello world</div>
    </vue-final-modal>
    <Container>
      <TerminalBlock
        :terminalData="terminal"
        v-for="terminal in terminals"
        :key="terminal.name"
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

.modal-content {
  display: flex;
}

.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import TerminalBlock from "./components/TerminalBlock.vue";
import Container from "./components/Container.vue";
import API, { Terminal } from './API';

export default defineComponent({
  components: { TerminalBlock, Container },
  provide: {
    api: API
  },
  async mounted() {
    this.terminals = await API.fetchTerminalsList();
  },
  data() {
    return {
      terminals: [] as Terminal[],
      restartModalShow: true
    };
  },
});
</script>
