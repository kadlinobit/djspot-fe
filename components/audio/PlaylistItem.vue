<template>
    <li class="columns is-mobile is-vcentered is-gapless playlist-item">
        <div class="column is-narrow playlist-item-handle mr-1">
            <o-icon icon="swap-vertical" />
        </div>
        <div class="column is-narrow mr-1">
            <button-play-pause :sound="playlistItem" />
        </div>
        <div class="column is-text-ellipsis">
            <span @click="setIsPlaylistOpen(false)">
                <nuxt-link :to="`/djs/${playlistItem.dj.slug}/sounds/${playlistItem.id}`">
                    {{ `${playlistItem.dj.name} – ${playlistItem.name}` }}
                </nuxt-link>
            </span>
        </div>

        <div class="column is-narrow">
            <span :class="['tag', soundTagType]">{{ $t(`${playlistItem.type}.type`) }}</span>
        </div>
        <div class="column is-narrow">
            <button-playlist-add-remove :sound="playlistItem" />
        </div>
    </li>
</template>

<script>
import { mapActions } from 'vuex'
import ButtonPlayPause from '~/components/audio/ButtonPlayPause.vue'
import ButtonPlaylistAddRemove from '~/components/audio/ButtonPlaylistAddRemove.vue'

export default {
    components: {
        ButtonPlayPause,
        ButtonPlaylistAddRemove
    },
    props: {
        playlistItem: {
            type: Object,
            required: true
        }
    },
    computed: {
        soundTagType() {
            let tagType
            switch (this.playlistItem.type) {
                case 'mix':
                    tagType = 'is-primary'
                    break
                case 'track':
                    tagType = 'is-success'
                    break
            }
            return tagType
        }
    },
    methods: {
        ...mapActions(['setIsPlaylistOpen'])
    }
}
</script>

<style lang="scss" scoped>
.playlist-item-handle {
    cursor: move;
}

.playlist-item-delete {
    cursor: pointer;
}
</style>
