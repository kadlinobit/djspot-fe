<template>
    <div class="playlist">
        <p v-if="playlistStore.playlistSize === 0" class="text-center text-sm text-gray-400 dark:text-gray-500 py-6">
            {{ $t('playlist.empty') }}
        </p>
        <draggable
            v-else
            v-model="playlist"
            tag="ul"
            class="flex flex-col gap-2"
            handle=".playlist-item-handle"
            item-key="id"
        >
            <template #item="{ element }">
                <playlist-item :key="element.id" :playlist-item="element" />
            </template>
        </draggable>
    </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable';
import PlaylistItem from '~/components/audio/PlaylistItem.client.vue';
import { usePlaylistStore } from '~/stores';

const playlistStore = usePlaylistStore();
const playlist = computed({
    get() {
        return playlistStore.playlist;
    },
    set(value) {
        playlistStore.setPlaylist(value);
    }
});
</script>
