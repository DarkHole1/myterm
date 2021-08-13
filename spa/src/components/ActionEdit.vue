<template>
    <button class="action edit" @click="$event.stopPropagation(), $emit('click')"><i class="fas fa-pencil-alt"></i></button>
</template>

<style scoped>
.action.edit {
  background: #346751 !important;
}

.action.edit:hover {
  background: #3f7e63 !important;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['click']
})
</script>
