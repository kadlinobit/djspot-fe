<template>
    <div class="level is-mobile">
        <div class="level-left">
            <div v-if="!currentSound || currentSound.id !== sound.id" class="level-item">
                <b-button
                    :disabled="isPlayerLoading"
                    type="is-text"
                    size="is-medium"
                    icon-left="play"
                    @click.prevent="() => onPlayNewSound(sound)"
                />
            </div>
            <div v-if="currentSound && currentSound.id === sound.id" class="level-item">
                <b-button
                    :disabled="isPlayerLoading"
                    type="is-text"
                    size="is-medium"
                    :icon-left="isPlaying ? 'pause' : 'play'"
                    @click.prevent="() => setIsPlaying(!isPlaying)"
                />
            </div>
            <div class="level-item">
                <nuxt-link :to="{ path: `/djs/${sound.dj.slug}/mixes/${sound.id}` }">
                    {{ `${sound.dj.name} – ${sound.name}` }}
                </nuxt-link>
            </div>
        </div>
        <div class="level-right">
            <div class="level-item">
                <b-button
                    v-if="!currentSound || currentSound.id !== sound.id"
                    :disabled="isPlayerLoading"
                    type="is-text"
                    size="is-medium"
                    :icon-left="isSoundInPlaylist(sound) ? 'delete-sweep' : 'playlist-plus'"
                    @click.prevent="() => handleAddOrRemovePlaylistSound(sound)"
                />
                <b-icon
                    v-else
                    custom-class="level-item"
                    icon="checkbox-blank-circle"
                    type="is-success m-4"
                    size="is-small"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    props: {
        sound: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters('player', {
            currentSound: 'currentSound',
            isPlaying: 'isPlaying',
            isPlayerLoading: 'isLoading'
        }),
        ...mapGetters('playlist', ['isSoundInPlaylist'])
    },
    methods: {
        ...mapActions('player', ['loadNewAudio', 'setIsPlaying']),
        ...mapActions('playlist', ['handlePlaySound', 'handleAddOrRemovePlaylistSound']),
        onPlayNewSound(sound) {
            this.handlePlaySound(sound)
            this.loadNewAudio(sound)
        }
    }
}
</script>
