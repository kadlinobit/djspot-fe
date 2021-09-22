<template>
    <li class="level is-mobile playlist-item">
        <div class="level-left">
            <div class="level-item playlist-item-handle mr-2">
                <b-icon icon="swap-vertical" />
            </div>
            <div v-if="!currentMix || currentMix.id !== playlistItem.id" class="level-item">
                <b-button
                    :disabled="isPlayerLoading"
                    type="is-text"
                    icon-left="play"
                    @click.prevent="() => loadNewAudio(playlistItem)"
                />
            </div>
            <div v-if="currentMix && currentMix.id === playlistItem.id" class="level-item">
                <b-button
                    :disabled="isPlayerLoading"
                    type="is-text"
                    :icon-left="isPlaying ? 'pause' : 'play'"
                    @click.prevent="() => setIsPlaying(!isPlaying)"
                />
            </div>
            <div class="level-item">
                {{ `${playlistItem.dj.name} – ${playlistItem.name}` }}
            </div>
        </div>
        <div class="level-right">
            <b-button
                v-if="!currentMix || currentMix.id !== playlistItem.id"
                type="is-text"
                :disabled="isPlayerLoading"
                custom-class="level-item"
                icon-left="delete-sweep"
                @click.prevent="() => deleteMix(playlistItem)"
            />
            <b-icon
                v-else
                custom-class="level-item"
                icon="checkbox-blank-circle"
                type="is-success m-3"
                size="is-small"
            />
        </div>
    </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    props: {
        playlistItem: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters('player', {
            currentMix: 'currentMix',
            isPlaying: 'isPlaying',
            isPlayerLoading: 'isLoading'
        }),
        ...mapGetters('playlist', ['isMixInPlaylist'])
    },
    methods: {
        ...mapActions('player', ['loadNewAudio', 'setIsPlaying']),
        ...mapActions('playlist', ['deleteMix'])
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
