<template>
    <div class="level is-mobile">
        <div class="level-left">
            <div v-if="!currentSound || currentSound.id !== sound.id" class="level-item">
                <o-button
                    :disabled="isPlayerLoading"
                    variant="text"
                    size="is-medium"
                    icon-left="play"
                    @click.prevent="() => onPlayNewSound(sound)"
                />
            </div>
            <div v-if="currentSound && currentSound.id === sound.id" class="level-item">
                <o-button
                    :disabled="isPlayerLoading"
                    variant="text"
                    size="is-medium"
                    :icon-left="isPlaying ? 'pause' : 'play'"
                    @click.prevent="() => setIsPlaying(!isPlaying)"
                />
            </div>
            <div class="level-item">
                <nuxt-link :to="{ path: `/djs/${sound.dj.slug}/sounds/${sound.id}` }">
                    {{ `${sound.dj.name} – ${sound.name}` }}
                </nuxt-link>
            </div>
        </div>
        <div class="level-right">
            <div v-if="sound.duration" class="level-item">
                <span class="tag">
                    {{ $audio.convertTimeHHMMSS(sound.duration) }}
                </span>
            </div>
            <div class="level-item">
                <o-button
                    v-if="!currentSound || currentSound.id !== sound.id"
                    :disabled="isPlayerLoading"
                    variant="text"
                    size="is-medium"
                    :icon-left="isSoundInPlaylist(sound) ? 'delete-sweep' : 'playlist-plus'"
                    @click.prevent="() => handleAddOrRemovePlaylistSound(sound)"
                />
                <o-icon
                    v-else
                    custom-class="level-item"
                    icon="checkbox-blank-circle"
                    variant="success m-3"
                    size="small"
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
