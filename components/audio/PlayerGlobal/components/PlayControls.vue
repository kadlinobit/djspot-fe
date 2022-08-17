<template>
    <div class="columns is-vcentered is-mobile is-gapless">
        <div class="column">
            <o-button
                :disabled="
                    !playerStore.isLoaded ||
                    playerStore.isError ||
                    !canPlayPrevious
                "
                variant="primary"
                size="size-6"
                icon-left="skip-previous"
                @click.stop="playPrevious"
            />
        </div>
        <div class="column">
            <o-button
                :disabled="!playerStore.isLoaded || playerStore.isError"
                variant="primary"
                size="size-6"
                icon-left="stop"
                @click.stop="stop"
            />
        </div>
        <div class="column">
            <o-button
                :disabled="!playerStore.isLoaded || playerStore.isError"
                variant="primary"
                size="size-6"
                :icon-left="playerStore.isPlaying ? 'pause' : 'play'"
                @click.stop="playerStore.setIsPlaying(!playerStore.isPlaying)"
            />
        </div>
        <div class="column">
            <o-button
                :disabled="
                    !playerStore.isLoaded || playerStore.isError || !canPlayNext
                "
                variant="primary"
                size="size-6"
                icon-left="skip-next"
                @click.stop="playNext"
            />
        </div>
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
    if (canPlayNext)
        playerStore.loadNewAudio(
            playlistStore.playlist[
                playlistStore.soundIndexInPlaylist(playerStore.currentSound) + 1
            ]
        )
}
function playPrevious() {
    if (canPlayPrevious)
        playerStore.loadNewAudio(
            playlistStore.playlist[
                playlistStore.soundIndexInPlaylist(playerStore.currentSound) - 1
            ]
        )
}
</script>
