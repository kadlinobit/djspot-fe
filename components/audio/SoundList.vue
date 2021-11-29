<template>
    <ul>
        <SoundListItem v-for="sound in sounds" :key="sound.id" :sound="sound" />
    </ul>
</template>

<script>
import SoundListItem from '~/components/audio/SoundListItem.vue'

export default {
    components: {
        SoundListItem
    },
    props: {
        sounds: {
            type: Array,
            required: true
        }
    }
}
</script>
