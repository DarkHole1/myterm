<template>
  <div>
    <vue-final-modal v-model="restartModalShow" name="restartModal" :drag="true" content-class="modal-content" classes="modal-container">
      <div style="font-size: 1.5rem; margin-bottom: 1rem;">Вы действительно хотите перезагрузить %TERMINAL_NAME%?</div>
      <VButtonDanger>Да</VButtonDanger><VButton>Нет</VButton>
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
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  margin: 0 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: .25rem;
  background: #fff;
}

.modal-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import TerminalBlock from "./components/TerminalBlock.vue";
import Container from "./components/Container.vue";
import API, { Terminal } from './API';
import VButtonDanger from './components/VButtonDanger.vue';
import VButton from './components/VButton.vue';

export default defineComponent({
  components: { TerminalBlock, Container, VButtonDanger, VButton },
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
