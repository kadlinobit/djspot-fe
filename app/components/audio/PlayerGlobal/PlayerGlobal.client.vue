<template>
    <div class="relative">
        <!-- Playlist panel slides up above the player -->
        <Transition name="slide-up">
            <div
                v-if="mainStore.isPlaylistOpen"
                class="absolute bottom-full left-0 right-0 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 border border-b-0 border-gray-200 dark:border-gray-800 shadow-lg"
            >
                <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <span class="font-semibold text-sm">Playlist</span>
                    <UButton
                        icon="i-heroicons-x-mark"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                        @click="mainStore.setIsPlaylistOpen(false)"
                    />
                </div>
                <div class="p-2">
                    <Playlist />
                </div>
            </div>
        </Transition>

        <div class="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
            <!-- Progress Bar at top edge -->
            <div class="absolute top-0 left-0 right-0 -mt-2">
                <USlider
                    :model-value="playerStore.currentSeconds"
                    :max="playerStore.durationSeconds"
                    :disabled="!playerStore.isLoaded || playerStore.isError"
                    color="primary"
                    size="sm"
                    class="w-full cursor-pointer"
                    @update:model-value="(value) => { playerStore.setCurrentSeconds(value); isSeeking = true; }"
                    @change="(event) => { seek(playerStore.currentSeconds); isSeeking = false; }"
                    @mousedown="isSeeking = true"
                    @mouseup="isSeeking = false"
                    @touchstart="isSeeking = true"
                    @touchend="isSeeking = false"
                />
            </div>

            <div v-if="playerStore.currentSound" class="p-2 md:hidden">
                <sound-info />
            </div>

            <div class="flex items-center justify-between px-4 py-3 gap-4">
                <div class="flex-shrink-0 w-1/2 md:w-auto">
                    <play-controls :html-audio-ref="htmlAudio" />
                </div>
                <div class="hidden md:block flex-1 min-w-0">
                    <sound-info />
                </div>
                <div class="flex-shrink-0 w-1/2 md:w-auto md:min-w-[200px] lg:min-w-[300px]">
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
                    playerStore.setIsLoading(true), playerStore.setIsPlaying(false)
                "
                @loadeddata="onLoadedData"
                @pause="playerStore.setIsPlaying(false)"
                @play="playerStore.setIsPlaying(true)"
                @error="onError"
                @ended="playNext"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import PlayControls from './components/PlayControls.vue'
import VolumeControls from './components/VolumeControls.vue'
import SoundInfo from './components/SoundInfo.vue'
import Playlist from '~/components/audio/Playlist.client.vue'

import { useMainStore, usePlayerStore, usePlaylistStore } from '~/stores'

const mainStore = useMainStore()
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
}
function playNext() {
    if (canPlayNext.value)
        playerStore.loadNewAudio(
            playlistStore.playlist[
                playlistStore.soundIndexInPlaylist(playerStore.currentSound) + 1
            ]
        )
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}
</style>
