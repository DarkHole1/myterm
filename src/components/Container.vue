<template>
    <div class="container">
        <slot />
    </div>
</template>

<style scoped>
.container {
  width: 50%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>