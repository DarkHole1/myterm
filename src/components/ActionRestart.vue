<template>
    <button class="action restart" @click="handleClick"><i class="fas fa-undo"></i></button>
</template>
<style scoped>
.restart {
  background: #da0037 !important;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['click'],
  methods: {
    handleClick(event: MouseEvent) {
      event.stopPropagation();
      this.$emit('click');
    }
  }
})
</script>
