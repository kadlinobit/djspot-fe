<template>
    <UButton
        :color="playlistStore.isSoundInPlaylist(sound) ? 'primary' : 'neutral'"
        :variant="playlistStore.isSoundInPlaylist(sound) ? 'solid' : 'soft'"
        icon="i-heroicons-queue-list"
        size="md"
        @click="playlistStore.handleAddOrRemovePlaylistSound(sound)"
    >
        Playlist
    </UButton>
</template>

<script setup lang="ts">
import { usePlaylistStore } from '~/stores';
import type { ISoundDefault } from '~/plugins/directus/collection';

const playlistStore = usePlaylistStore();

defineProps<{
    sound: ISoundDefault;
}>();
</script>
