<template>
  <div class="root">
    <div class="header" @click="show = !show">
      <i class="fas fa-plus-circle" v-if="!show"></i>
      <i class="fas fa-minus-circle" v-else></i>
      {{ server.name }}
      <span v-if="server.host">({{ server.host }})</span>
    </div>
    <div class="content" v-if="show">
      <TerminalBlock
        :terminalData="terminal"
        v-for="terminal in terminals"
        :key="terminal.id"
      />
    </div>
  </div>
</template>
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

<script lang="ts">
import { defineComponent } from "vue";
import TerminalBlock from "./TerminalBlock.vue";

export default defineComponent({
  components: { TerminalBlock },
  props: ["server"],
  async mounted() {
    this.terminals = await this.server.fetchTerminals();
  },
  data() {
    return {
      terminals: [],
      show: false,
    };
  },
});
</script>
