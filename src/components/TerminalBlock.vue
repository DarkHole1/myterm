<template>
    <div class="terminal">
        <Logo />
        <h2 class="name">{{ terminalData.name }}</h2>
        <div class="actions">
            <ActionRestart v-if="terminalData.canRestart" />
            <ActionEdit v-if="terminalData.canEdit" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Logo from './Logo.vue'
import ActionRestart from './ActionRestart.vue'
import ActionEdit from './ActionEdit.vue'

export default defineComponent({
    props: ['terminalData'],
    components: { Logo, ActionRestart, ActionEdit }
})
</script>