<template>
    <button class="action permissions" @click="$event.stopPropagation(), $emit('click')"><i class="fa-solid fa-user-lock"></i></button>
</template>

<style scoped>
.action.permissions {
  background: #346751 !important;
}

.action.permissions:hover {
  background: #3f7e63 !important;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['click']
})
</script>
