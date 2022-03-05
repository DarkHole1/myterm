<template>
  <vue-final-modal
    v-model="show"
    name="userModal"
    content-class="modal-content"
    classes="modal-container"
    @beforeOpen="handleOpen"
  >
    <div class="title">Редактирование {{ name }}</div>
    <div class="pair">
      <label for="role" class="form-label">Роль</label>
      <input type="text" class="form-control" id="role" v-model="role" />
    </div>
    <div class="pair">
      <label for="password" class="form-label">Пароль</label>
      <input type="text" class="form-control" id="password" v-model="password" />
    </div>
    <VButtonDanger @click="handleClick(true)">Отправить</VButtonDanger>
    <VButton @click="handleClick(false)">Отмена</VButton>
  </vue-final-modal>
</template>
<style>
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
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
  border-radius: 0.25rem;
  background: #fff;
}

.modal-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.pair {
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
}

.pair > input {
  font-size: 1.2rem;
  font-family: "Ubuntu Mono", monospace;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue'
import VButtonDanger from './VButtonDanger.vue';
import VButton from './VButton.vue';

export default defineComponent({
    components: { VButton, VButtonDanger },
    data() {
        return {
            show: false,
            name: '%TERMINAL_NAME%',
            role: "",
            password: '',
            // eslint-disable-next-line
            cb: (data: any) => void 0
        }
    }, 
    methods: {
      handleClick(answer: boolean) {
        if(answer) {
          // eslint-disable-next-line
          let res: {role: any, password?: any} = {role: this.role};
          if(this.password.length > 0) res.password = this.password; 
          this.cb(res);
        }
        this.show = false;
      },
      // eslint-disable-next-line
      handleOpen(event: any) {
        const { name, role, cb } = event.ref.params.value;
        this.name = name;
        this.role = role;
        this.password = "";
        this.cb = cb;
      }
    }
})
</script>