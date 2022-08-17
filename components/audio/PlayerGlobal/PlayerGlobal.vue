<template>
    <div class="o-player is-relative">
        <o-slider
            :tooltip="false"
            :value="playerStore.currentSeconds"
            :max="playerStore.durationSeconds"
            :disabled="!playerStore.isLoaded || playerStore.isError"
            variant="secondary mb-0 mt-0"
            @change="(value) => seek(value)"
            @dragstart="isSeeking = true"
            @dragend="isSeeking = false"
        />
        <div v-if="playerStore.currentSound" class="p-2 is-hidden-tablet">
            <sound-info />
        </div>
        <div class="columns is-gapless is-vcentered is-mobile mb-1 mt-1">
            <div class="column is-narrow-tablet is-6-mobile ml-2">
                <play-controls :html-audio-ref="htmlAudio" />
            </div>
            <div class="column is-hidden-mobile is-text-ellipsis">
                <sound-info />
            </div>
            <div
                class="column is-6-mobile is-4-tablet is-3-desktop is-2-widescreen"
            >
                <volume-controls />
            </div>
        </div>
        <audio
            ref="htmlAudio"
            preload="auto"
            style="display: none"
            :loop="false"
            :src="playerStore.file"
            @timeupdate="updateCurrentSeconds"
            @loadstart="
                playerStore.setIsLoading(true)
                playerStore.setIsPlaying(false)
            "
            @loadeddata="onLoadedData"
            @pause="playerStore.setIsPlaying(false)"
            @play="playerStore.setIsPlaying(true)"
            @error="onError"
            @ended="playNext"
        ></audio>
    </div>
</template>

<script setup lang="ts">
import PlayControls from './components/PlayControls.vue'
import VolumeControls from './components/VolumeControls.vue'
import SoundInfo from './components/SoundInfo.vue'

import { usePlayerStore, usePlaylistStore } from '~/stores'

const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

const isSeeking = ref<boolean>(false)
const htmlAudio = ref(null)

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

watch(
    () => playerStore.isPlaying,
    (isPlaying) => {
        if (isPlaying) {
            return htmlAudio.value.play()
        }
        htmlAudio.value.pause()
    }
)

watch(
    () => playerStore.volume,
    (volume) => {
        htmlAudio.value.volume = volume / 100
    }
)

watch(
    () => playerStore.file,
    (file) => {
        htmlAudio.value.load()
    }
)

function onLoadedData() {
    playerStore.setIsLoading(false)
    playerStore.setIsError(false)

    if (htmlAudio.value.readyState >= 2) {
        playerStore.setIsLoaded(true)
        playerStore.setDurationSeconds(parseInt(htmlAudio.value.duration))
        if (playerStore.isAutoplay) {
            playerStore.setIsPlaying(true)
        }
        playerStore.setIsAutoplay(false)
    } else {
        playerStore.setIsAutoplay(false)
        throw new Error('Failed to load sound file.')
    }
}
function seek(value) {
    if (!playerStore.isLoaded) return
    htmlAudio.value.currentTime = parseInt(value)
}
function updateCurrentSeconds() {
    if (!isSeeking.value)
        playerStore.setCurrentSeconds(Math.floor(htmlAudio.value.currentTime))
}
function onError() {
    playerStore.setIsLoading(false)
    playerStore.setIsError(true)
    // $emit('audio-load-error')
}
function playNext() {
    if (canPlayNext)
        playerStore.loadNewAudio(
            playlistStore.playlist[
                playlistStore.soundIndexInPlaylist(playerStore.currentSound) + 1
            ]
        )
}
</script>
