<template>
    <client-only>
        <div class="button-playlist-add-remove">
            <UButton
                v-if="
                    !playerStore.currentSound ||
                    playerStore.currentSound.id !== sound.id
                "
                :disabled="playerStore.isLoading"
                :color="color"
                :size="size"
                variant="ghost"
                :icon="
                    playlistStore.isSoundInPlaylist(sound)
                        ? 'i-heroicons-trash'
                        : 'i-heroicons-queue-list'
                "
                @click="
                    () => playlistStore.handleAddOrRemovePlaylistSound(sound)
                "
            />
            <UIcon
                v-else
                name="i-heroicons-check-circle"
                class="m-3 size-4 text-success-500"
            />
        </div>
    </client-only>
</template>

<script setup lang="ts">
import { usePlayerStore, usePlaylistStore } from '~/stores'
const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

interface Props {
    sound: Sound
    size?: string
    color?: string
}

const props = withDefaults(defineProps<Props>(), {
    sound: null,
    size: null,
    color: 'neutral'
})
</script>
