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

<script>
// import { mapActions } from 'vuex'
import Draggable from 'vuedraggable'
import PlaylistItem from '~/components/audio/PlaylistItem.vue'

export default {
    components: {
        Draggable,
        PlaylistItem
    },
    computed: {
        playlist: {
            get() {
                return this.$store.getters['playlist/playlist']
            },
            set(value) {
                this.$store.dispatch('playlist/setPlaylist', value)
            }
        }
    }
}
</script>
