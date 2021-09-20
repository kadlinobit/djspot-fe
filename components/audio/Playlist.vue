<template>
    <div class="playlist">
        <div v-for="playlistItem in playlist" :key="playlistItem.id" class="playlist-item">
            {{ playlistItem.name }}
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters('playlist', ['playlist'])
    }
}
</script>
