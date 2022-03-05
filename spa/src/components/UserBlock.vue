<template>
  <div class="user">
    <div class='header'>
      <LogoUser />
    </div>
    <h2 class="name">{{ user.name }}</h2>
    <div class="actions">
      <ActionEdit @click="handleEdit" />
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  font-size: 5rem;
  transition: 0.5s;
}

.user {
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

.user:hover {
  background: #444444;
}

.user:hover > .header {
  font-size: 3rem;
}

.user > .actions {
  margin-bottom: 1em;
  height: 0;
  opacity: 0;
  transition: 0.5s;
}

.user:hover > .actions {
  height: 1.2rem;
  opacity: 1;
}

.user > .actions > button {
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
import { defineComponent } from "vue";
import ActionEdit from "./ActionEdit.vue";
import LogoUser from "./LogoUser.vue";

export default defineComponent({
  props: ['user'],
  methods: {
    handleEdit() {
      this.$vfm.show('userModal', {
        name: this.user.name,
        role: this.user.role,
        // eslint-disable-next-line
        cb: (data: any) => {
          this.user.update(data); 
        }
      });
    }
  },
  components: { ActionEdit, LogoUser },
});
</script>