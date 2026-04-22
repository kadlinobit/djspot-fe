<template>
    <ul class="flex flex-col gap-2">
        <SoundListItem v-for="sound in sounds" :key="sound.id" :sound="sound" />
    </ul>
</template>

<script setup lang="ts">
import SoundListItem from '~/components/audio/SoundListItem.vue'

const props = defineProps({
    sounds: {
        type: Array<object>,
        required: true
    }
})
</script>
