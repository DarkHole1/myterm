<template>
    <vue-final-modal v-model="show" name="permissionsModal" content-class="modal-content" classes="modal-container" @beforeOpen="handleOpen">
      <div v-for="value, key in params.permissions" :key="key">
        <a>{{ key }}</a>{{ " " }}
        <input :value="value" @input="params.permissions[key] = $event.target.value">
      </div>
      <div>
        <input v-model="newuser" />{{ " " }}
        <button @click="params.permissions[newuser] = ''; newuser = ''">Добавить роль</button>
      </div>
      <VButtonDanger @click="handleClick(true)">Изменить</VButtonDanger>
      <VButton @click="handleClick(false)">Закрыть</VButton>
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
import { defineComponent } from 'vue'
import VButtonDanger from './VButtonDanger.vue';
import VButton from './VButton.vue';

export default defineComponent({
    components: { VButton, VButtonDanger },
    data() {
        return {
            show: false,
            newuser: "",
            params: {
              permissions: {},
              // eslint-disable-next-line
              cb: (x: any) => void 0
            }
        }
    }, 
    methods: {
      handleClick(answer: boolean) {
        if(answer) {
          this.params.cb(this.params.permissions);
        }
        this.show = false;
      },
      // eslint-disable-next-line
      handleOpen(event: any) {
        this.params = event.ref.params;
      }
    }
})
</script>