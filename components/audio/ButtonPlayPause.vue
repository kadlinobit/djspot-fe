<template>
    <client-only>
        <div class="button-play-pause">
            <o-button
                v-if="!currentSound || currentSound.id !== sound.id"
                :disabled="isPlayerLoading"
                :variant="variant"
                :size="size"
                icon-left="play"
                @click.prevent="() => onPlayNewSound(sound)"
            />
            <o-button
                v-if="currentSound && currentSound.id === sound.id"
                :disabled="isPlayerLoading"
                variant="text"
                :size="size"
                :icon-left="isPlaying ? 'pause' : 'play'"
                @click.prevent="() => setIsPlaying(!isPlaying)"
            />
        </div>
    </client-only>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    props: {
        sound: {
            type: Object,
            required: true
        },
        size: {
            type: String,
            default: null
        },
        variant: {
            type: String,
            default: 'text'
        }
    },
    computed: {
        ...mapGetters('player', {
            currentSound: 'currentSound',
            isPlaying: 'isPlaying',
            isPlayerLoading: 'isLoading'
        })
    },
    methods: {
        ...mapActions('player', ['loadNewAudio', 'setIsPlaying']),
        ...mapActions('playlist', ['handlePlaySound']),
        onPlayNewSound(sound) {
            this.handlePlaySound(sound)
            this.loadNewAudio(sound)
        }
    }
}
</script>
