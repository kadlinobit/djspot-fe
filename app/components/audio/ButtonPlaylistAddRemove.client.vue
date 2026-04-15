<template>
    <client-only>
        <div class="button-playlist-add-remove">
            <o-button
                v-if="
                    !playerStore.currentSound ||
                    playerStore.currentSound.id !== sound.id
                "
                :disabled="playerStore.isLoading"
                :variant="variant"
                :size="size"
                :icon-left="
                    playlistStore.isSoundInPlaylist(sound)
                        ? 'delete-sweep'
                        : 'playlist-plus'
                "
                @click="
                    () => playlistStore.handleAddOrRemovePlaylistSound(sound)
                "
            />
            <o-icon
                v-else
                custom-class="level-item"
                icon="checkbox-blank-circle"
                variant="success m-3"
                size="small"
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
    variant?: string
}

const props = withDefaults(defineProps<Props>(), {
    sound: null,
    size: null,
    variant: 'text'
})
</script>
