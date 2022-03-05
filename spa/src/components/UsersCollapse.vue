<template>
  <div class="root">
    <div class="header" @click="show = !show">
      <i class="fas fa-plus-circle" v-if="!show"></i>
      <i class="fas fa-minus-circle" v-else></i>
      Пользователи
    </div>
    <div class="content" v-if="show">
      <UserBlock
        :user="user"
        v-for="user in users"
        :key="user.id"
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
import UserBlock from "./UserBlock.vue";
import API, { User } from '../API';

export default defineComponent({
  components: { UserBlock },
  async mounted() {
    this.users = await API.fetchUsersList();
  },
  data() {
    return {
      users: [] as User[],
      show: false
    };
  },
});
</script>
