<template>
  <div>
    <RestartModal />
    <EditModal />
    <Container>
      <ServerCollapse
        v-for="server in servers"
        :key="server.id"
        :server="server"
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
import Container from "./components/Container.vue";
import API, { COMServer } from "./API";
import RestartModal from "./components/RestartModal.vue";
import EditModal from "./components/EditModal.vue";
import ServerCollapse from "./components/ServerCollapse.vue";

export default defineComponent({
  components: {
    Container,
    RestartModal,
    EditModal,
    ServerCollapse,
  },
  provide: {
    api: API,
  },
  async mounted() {
    this.servers = await API.fetchServersList();
  },
  data() {
    return {
      servers: [] as COMServer[],
    };
  },
});
</script>
