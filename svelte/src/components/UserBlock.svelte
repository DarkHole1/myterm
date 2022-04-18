<script lang="ts">
  import {
    faPencilAlt,
    faTerminal,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import Action from "./Action.svelte";
  import { user as userModal } from '../modals'; 

  export let user;

  function handleEdit() {
    userModal.set(user);
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

<div class="block">
  <div class="header">
    <!-- <Logo /> -->
    <FontAwesomeIcon class="logo" icon={faTerminal} />
  </div>
  <h2 class="name">
    {user.name}
  </h2>
  <div class="actions">
    <!-- TODO click -->
    <Action icon={faPencilAlt} on:click={handleEdit} />
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

  .block :global(.logo) {
    margin-left: 0.3em;
  }

  .block {
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

  .block:hover {
    background: #444444;
  }

  .block:hover > .header {
    font-size: 3rem;
  }

  .block > .actions {
    margin-bottom: 1em;
    height: 0;
    opacity: 0;
    transition: 0.5s;
  }

  .block:hover > .actions {
    height: 1.2rem;
    opacity: 1;
  }
</style>
