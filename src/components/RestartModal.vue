<template>
    <vue-final-modal v-model="show" name="restartModal" content-class="modal-content" classes="modal-container">
      <div class="title">Вы действительно хотите перезагрузить %TERMINAL_NAME%?</div>
      <VButtonDanger @click="handleClick(true)">Да</VButtonDanger>
      <VButton @click="handleClick(false)">Нет</VButton>
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
            show: true
        }
    }, 
    methods: {
      handleClick(answer: boolean) {
        alert(answer);
        this.show = false;
      }
    }
})
</script>