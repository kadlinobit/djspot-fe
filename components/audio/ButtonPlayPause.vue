<template>
    <client-only>
        <div class="button-play-pause">
            <o-button
                v-if="
                    !playerStore.currentSound ||
                    playerStore.currentSound.id !== sound.id
                "
                :disabled="playerStore.isLoading"
                :variant="variant"
                :size="size"
                icon-left="play"
                @click.prevent="() => onPlayNewSound(sound)"
            />
            <o-button
                v-if="
                    playerStore.currentSound &&
                    playerStore.currentSound.id === sound.id
                "
                :disabled="playerStore.isLoading"
                :variant="variant"
                :size="size"
                :icon-left="playerStore.isPlaying ? 'pause' : 'play'"
                @click.prevent="
                    () => playerStore.setIsPlaying(!playerStore.isPlaying)
                "
            />
        </div>
    </client-only>
</template>

<script setup lang="ts">
import { usePlayerStore, usePlaylistStore } from '~/stores'
const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

interface Props {
    sound: object
    size?: string
    variant?: string
}

const props = withDefaults(defineProps<Props>(), {
    sound: null,
    size: null,
    variant: 'text'
})

function onPlayNewSound(sound) {
    playlistStore.handlePlaySound(sound)
    playerStore.loadNewAudio(sound)
}
</script>
