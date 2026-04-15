<template>
    <div v-if="playerStore.showCancelLoadingButton" class="has-text-centered">
        <o-button variant="danger" @click.stop="playerStore.resetAudio">
            {{ $t('player.cancel_loading') }}
        </o-button>
    </div>
    <div v-else class="columns is-vcentered is-mobile is-gapless">
        <div class="column is-narrow mr-3">
            <o-button
                :disabled="!playerStore.isLoaded || playerStore.isError"
                variant="primary"
                size="size-6"
                :icon-left="volumeIcon"
                @click.stop="() => onMute()"
            />
        </div>
        <div class="column mr-4">
            <o-slider
                :modelValue="playerStore.volume"
                :tooltip="false"
                :max="100"
                :disabled="!playerStore.isLoaded || playerStore.isError"
                variant="secondary"
                @update:modelValue="
                    (newVolume) => playerStore.setVolume(newVolume)
                "
            />
        </div>
        <div class="column is-narrow">
            <o-button
                variant="primary"
                size="size-6"
                icon-left="playlist-music"
                @click.stop="() => mainStore.setIsPlaylistOpen(true)"
            />
        </div>
        <div class="column is-narrow mr-2">
            <o-button
                variant="primary"
                size="size-6"
                icon-left="chevron-down"
                @click.stop="() => mainStore.setIsBottomBarOpen(false)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMainStore, usePlayerStore, usePlaylistStore } from '~/stores'
const mainStore = useMainStore()
const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

const volumeIcon = computed(() => {
    let volumeIcon = 'volume-off'
    if (playerStore.volume > 0 && playerStore.volume <= 30) {
        volumeIcon = 'volume-low'
    }
    if (playerStore.volume > 30 && playerStore.volume <= 60) {
        volumeIcon = 'volume-medium'
    }
    if (playerStore.volume > 60) {
        volumeIcon = 'volume-high'
    }
    return volumeIcon
})

function onMute() {
    if (playerStore.isMuted) {
        return playerStore.setVolume(playerStore.previousVolume)
    }

    playerStore.setPreviousVolume(playerStore.volume)
    playerStore.setVolume(0)
}
</script>
