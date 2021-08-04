<template>
  <div class="terminal" @click="open">
    <Logo />
    <h2 class="name"><i class="fas fa-lock" v-if="terminalData.readonly"></i> {{ terminalData.name }}</h2>
    <div class="actions">
      <ActionRestart v-if="terminalData.canRestart" @click="handleRestart" />
      <ActionEdit v-if="terminalData.canEdit" />
    </div>
  </div>
</template>

<style scoped>
.terminal {
  background: #171717;
  color: #ededed;
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

.terminal:hover {
  background: #444444;
}

.terminal:hover > .logo {
  font-size: 3rem;
}

.terminal > .actions {
  margin-bottom: 1em;
  height: 0;
  opacity: 0;
  transition: 0.5s;
}

.terminal:hover > .actions {
  height: 1.2rem;
  opacity: 1;
}

.terminal > .actions > button {
  padding: 0.3em;
  border-radius: 0.3em;
  border: none;
  color: #ededed;
  background: none;
  font-size: 1.2rem;
  margin-left: 0.2em;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Logo from "./Logo.vue";
import ActionRestart from "./ActionRestart.vue";
import ActionEdit from "./ActionEdit.vue";
import { Terminal } from "@/API";

export default defineComponent({
  props: {
    terminalData: {
      type: Object as PropType<Terminal>,
      required: true
    }
  },
  methods: {
    open() {
      window.open(this.terminalData.link(), '_blank');
    },
    handleRestart() {
      this.$vfm.show('restartModal', {
        name: this.terminalData.name,
        cb: () => {
          this.terminalData.restart()
        }
      })
    }
  },
  components: { Logo, ActionRestart, ActionEdit },
});
</script>