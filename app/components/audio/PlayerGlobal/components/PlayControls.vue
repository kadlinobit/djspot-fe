<template>
    <div class="flex items-center gap-2">
        <UButton
            :disabled="
                !playerStore.isLoaded ||
                playerStore.isError ||
                !canPlayPrevious
            "
            color="primary"
            variant="soft"
            icon="i-heroicons-backward"
            @click.stop="playPrevious"
        />
        <UButton
            :disabled="!playerStore.isLoaded || playerStore.isError"
            color="primary"
            variant="soft"
            icon="i-heroicons-stop"
            @click.stop="stop"
        />
        <UButton
            :disabled="!playerStore.isLoaded || playerStore.isError"
            color="primary"
            variant="soft"
            :icon="playerStore.isPlaying ? 'i-heroicons-pause' : 'i-heroicons-play'"
            @click.stop="playerStore.setIsPlaying(!playerStore.isPlaying)"
        />
        <UButton
            :disabled="
                !playerStore.isLoaded || playerStore.isError || !canPlayNext
            "
            color="primary"
            variant="soft"
            icon="i-heroicons-forward"
            @click.stop="playNext"
        />
    </div>
</template>

<script setup lang="ts">
import { usePlayerStore, usePlaylistStore } from '~/stores'
const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

interface Props {
    htmlAudioRef?: any
}

const props = withDefaults(defineProps<Props>(), {
    htmlAudioRef: null
})

// const props = defineProps({ htmlAudioRef: Object })
const htmlAudio = toRef(props, 'htmlAudioRef')

const canPlayNext = computed(() => {
    if (
        playlistStore.isSoundInPlaylist(playerStore.currentSound) &&
        playlistStore.playlistSize > 1 &&
        playlistStore.soundIndexInPlaylist(playerStore.currentSound) <
            playlistStore.playlistSize - 1
    )
        return true
    return false
})
const canPlayPrevious = computed<boolean>(() => {
    if (
        playlistStore.isSoundInPlaylist(playerStore.currentSound) &&
        playlistStore.playlistSize > 1 &&
        playlistStore.soundIndexInPlaylist(playerStore.currentSound) > 0
    )
        return true
    return false
})

function stop() {
    playerStore.setIsPlaying(false)
    htmlAudio.value.currentTime = 0
}
function playNext() {
    if (canPlayNext.value)
        playerStore.loadNewAudio(
            playlistStore.playlist[
                playlistStore.soundIndexInPlaylist(playerStore.currentSound) + 1
            ]
        )
}
function playPrevious() {
    if (canPlayPrevious.value)
        playerStore.loadNewAudio(
            playlistStore.playlist[
                playlistStore.soundIndexInPlaylist(playerStore.currentSound) - 1
            ]
        )
}
</script>
