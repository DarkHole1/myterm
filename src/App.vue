<template>
    <div class="container">
        <div class="terminal" v-for="terminal in terminals" :key="terminal.name">
            <div class="logo"><i class="fas fa-terminal"></i></div>
            <h2 class="name">{{ terminal.name }}</h2>
            <div class="actions">
                <button class="action restart" v-if="terminal.canRestart"><i class="fas fa-redo"></i></button>
                <button class="action edit" v-if="terminal.canEdit"><i class="fas fa-pencil-alt"></i></button>
            </div>
        </div>
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap');
@import url('https://use.fontawesome.com/releases/v5.15.3/css/all.css');

body {
  font-family: 'Ubuntu Mono', monospace;
  background: #313131;
}

.container {
    width: 50%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.terminal {
  background: #171717;
  color: #EDEDED;
  width: 180px;
  height: 180px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  text-align: right;
  justify-content: flex-end;
  border-radius: 2em;
  transition: 0.5s;
  margin: 1rem;
}

.terminal:hover {
  background: #444444;
}

.terminal > .logo {
  font-size: 5rem;
  text-align: left;
  margin-left: 0.3em;
  transition: 0.5s;
}

.terminal:hover > .logo {
  font-size: 3rem;
}

.terminal > .actions {
  margin-bottom: 1em;
  height: 0;
  opacity: 0;
  transition: 0.5s;
}

.terminal:hover > .actions {
  height: 1.2rem;
  opacity: 1;
}

.terminal > .actions > button {
  padding: 0.3em;
  border-radius: 0.3em;
  border: none;
  color: #EDEDED;
  background: none;
  font-size: 1.2rem;
  margin-left: 0.2em;
}

.terminal > .actions > .restart {
  background: #DA0037;
}

.terminal > .actions > .edit {
  background: #346751;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    data: () => {
        return {
            terminals: [{
                name: 'SW_SERVICE',
                canEdit: true,
                canRestart: true
            }, {
                name: 'ISP1',
                canEdit: true,
                canRestart: true
            }, {
                name: 'ISP2',
                canEdit: true,
                canRestart: true
            }, {
                name: 'SW1',
                canEdit: true,
                canRestart: true
            }, {
                name: 'SW2',
                canEdit: true,
                canRestart: true
            }, {
                name: 'R1',
                canEdit: true,
                canRestart: true
            }, {
                name: '_unused1',
                canEdit: true,
                canRestart: true
            }, {
                name: '_unused2',
                canEdit: true,
                canRestart: true
            }]
        }
    }
})
</script>
