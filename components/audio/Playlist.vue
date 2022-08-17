<template>
    <div class="playlist">
        <draggable v-model="playlist" tag="ul" handle=".playlist-item-handle">
            <playlist-item
                v-for="playlistItem in playlist"
                :key="playlistItem.id"
                :playlist-item="playlistItem"
            >
            </playlist-item>
        </draggable>
    </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import PlaylistItem from '~/components/audio/PlaylistItem.vue'
import { usePlaylistStore } from '~/stores'

const playlistStore = usePlaylistStore()

const playlist = computed({
    get() {
        return playlistStore.playlist
    },
    set(value) {
        playlistStore.setPlaylist(value)
    }
})
</script>
