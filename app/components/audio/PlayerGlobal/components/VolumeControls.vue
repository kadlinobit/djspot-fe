<template>
    <div v-if="playerStore.showCancelLoadingButton" class="text-center">
        <UButton color="error" variant="soft" @click.stop="playerStore.resetAudio">
            {{ $t('player.cancel_loading') }}
        </UButton>
    </div>
    <div v-else class="flex items-center gap-3">
        <div class="flex-shrink-0">
            <UButton
                :disabled="!playerStore.isLoaded || playerStore.isError"
                color="primary"
                variant="ghost"
                :icon="volumeIcon"
                @click.stop="() => onMute()"
            />
        </div>
        <div class="flex-1">
            <USlider
                :model-value="playerStore.volume"
                :max="100"
                :disabled="!playerStore.isLoaded || playerStore.isError"
                color="neutral"
                @update:model-value="
                    (newVolume) => playerStore.setVolume(newVolume)
                "
            />
        </div>
        <div class="flex-shrink-0 flex items-center gap-1">
            <UButton
                color="primary"
                variant="ghost"
                icon="i-heroicons-queue-list"
                @click.stop="() => mainStore.setIsPlaylistOpen(true)"
            />
            <UButton
                color="primary"
                variant="ghost"
                icon="i-heroicons-chevron-down"
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
    if (playerStore.volume === 0) {
        return 'i-heroicons-speaker-x-mark'
    }
    return 'i-heroicons-speaker-wave'
})

function onMute() {
    if (playerStore.isMuted) {
        return playerStore.setVolume(playerStore.previousVolume)
    }

    playerStore.setPreviousVolume(playerStore.volume)
    playerStore.setVolume(0)
}
</script>
