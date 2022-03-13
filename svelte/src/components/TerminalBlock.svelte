<script lang="ts">
  import {
    faLock,
    faPencilAlt,
    faTerminal,
    faUndo,
    faUserLock,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import Action from "./Action.svelte";

  export let terminalData;

  function open() {
    // TODO:
  }
  // import { defineComponent, PropType } from "vue";
  // import Logo from "./Logo.vue";
  // import ActionRestart from "./ActionRestart.vue";
  // import ActionEdit from "./ActionEdit.vue";
  // import ActionPermissions from "./ActionPermissions.vue";
  // import { Terminal } from "../API";

  // export default defineComponent({
  //   props: {
  //     terminalData: {
  //       type: Object as PropType<Terminal>,
  //       required: true
  //     }
  //   },
  //   methods: {
  //     open() {
  //       window.open(this.terminalData.link(), '_blank');
  //     },
  //     handleRestart() {
  //       this.$vfm.show('restartModal', {
  //         name: this.terminalData.name,
  //         cb: () => {
  //           this.terminalData.restart()
  //         }
  //       })
  //     },
  //     handleEdit() {
  //       this.$vfm.show('editModal', {
  //         name: this.terminalData.name,
  //         host: this.terminalData.host,
  //         port: this.terminalData.port,
  //         // eslint-disable-next-line
  //         cb: (data: any) => {
  //           const { host, port, name } = data;
  //           this.terminalData.updateData({ host, port, name });
  //         }
  //       });
  //     },
  //     async handlePermissions() {
  //       const permissions = await this.terminalData.permissions();
  //       this.$vfm.show('permissionsModal', {
  //         permissions,
  //         // eslint-disable-next-line
  //         cb: (data: any) => {
  //           this.terminalData.changePermissions(data);
  //         }
  //       });
  //     }
  //   },
  //   components: { Logo, ActionRestart, ActionEdit, ActionPermissions },
  // });
</script>

<div class="terminal" on:click={open}>
  <div class="header">
    <!-- <Logo /> -->
    <FontAwesomeIcon icon={faTerminal} />
    <span>{terminalData.comPort}</span>
  </div>
  <h2 class="name">
    {#if terminalData.readonly}
      <FontAwesomeIcon icon={faLock} />
    {/if}
    {terminalData.name}
  </h2>
  <div class="actions">
    <!-- TODO click -->
    {#if terminalData.canRestart}
      <Action icon={faUndo} danger />
    {/if}
    {#if terminalData.canEdit}
      <Action icon={faPencilAlt} />
    {/if}
    {#if terminalData.canChangePermissions}
      <Action icon={faUserLock} />
    {/if}
    <!-- <ActionRestart v-if="terminalData.canRestart" @click="handleRestart" />
    <ActionEdit v-if="terminalData.canEdit" @click="handleEdit" />
    <ActionPermissions v-if="terminalData.canChangePermissions" @click="handlePermissions" /> -->
  </div>
</div>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    font-size: 5rem;
    transition: 0.5s;
  }

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

  .terminal:hover > .header {
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
</style>
