<template>
    <li class="columns is-mobile is-vcentered is-gapless is-mobile">
        <div v-if="!currentSound || currentSound.id !== sound.id" class="column is-narrow mr-1">
            <o-button
                :disabled="isPlayerLoading"
                variant="text"
                size="is-medium"
                icon-left="play"
                @click.prevent="() => onPlayNewSound(sound)"
            />
        </div>
        <div v-if="currentSound && currentSound.id === sound.id" class="column is-narrow mr-1">
            <o-button
                :disabled="isPlayerLoading"
                variant="text"
                size="is-medium"
                :icon-left="isPlaying ? 'pause' : 'play'"
                @click.prevent="() => setIsPlaying(!isPlaying)"
            />
        </div>
        <div class="column is-text-ellipsis mr-1">
            <nuxt-link :to="{ path: `/djs/${sound.dj.slug}/sounds/${sound.id}` }">
                {{ `${sound.dj.name} – ${sound.name}` }}
            </nuxt-link>
        </div>

        <div v-if="sound.duration" class="column is-narrow mr-1">
            <span class="tag">
                {{ $audio.convertTimeHHMMSS(sound.duration) }}
            </span>
        </div>
        <div class="column is-narrow mr-1">
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
    </li>
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
