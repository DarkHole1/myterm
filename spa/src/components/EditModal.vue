<template>
  <vue-final-modal
    v-model="show"
    name="editModal"
    content-class="modal-content"
    classes="modal-container"
    @beforeOpen="handleOpen"
  >
    <div class="title">Редактирование {{ name }}</div>
    <div class="pair">
      <label for="host" class="form-label">IP адрес</label>
      <input type="text" class="form-control" id="host" v-model="host" />
    </div>
    <div class="pair">
      <label for="port" class="form-label">Порт</label>
      <input type="number" class="form-control" id="port" v-model.number="port" />
    </div>
    <div class="pair">
      <label for="newName" class="form-label">Название</label>
      <input type="text" class="form-control" id="newName" v-model="newName" />
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
            host: "Test",
            port: 0,
            newName: '%TERMINAL_NAME%',
            // eslint-disable-next-line
            cb: (data: any) => void 0
        }
    }, 
    methods: {
      handleClick(answer: boolean) {
        if(answer) {
          this.cb({
            host: this.host,
            port: this.port,
            name: this.newName
          });
        }
        this.show = false;
      },
      // eslint-disable-next-line
      handleOpen(event: any) {
        const { host, port, name, cb } = event.ref.params.value;
        this.host = host;
        this.port = port;
        this.name = name;
        this.newName = name;
        this.cb = cb;
      }
    }
})
</script>