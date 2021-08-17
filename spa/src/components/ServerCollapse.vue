<template>
  <div class="root">
    <div class="header" @click="show = !show">
      <i class="fas fa-plus-circle" v-if="show"></i>
      <i class="fas fa-minus-circle" v-else></i>
      Hello world
    </div>
    <div class="content" v-if="show">
      <slot />
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
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            show: false
        }
    }
})
</script>
