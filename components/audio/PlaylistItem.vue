<template>
    <li class="columns is-mobile is-vcentered is-gapless playlist-item">
        <div class="column is-narrow playlist-item-handle mr-1">
            <o-icon icon="swap-vertical" />
        </div>
        <div
            v-if="!currentSound || currentSound.id !== playlistItem.id"
            class="column is-narrow mr-1"
        >
            <o-button
                :disabled="isPlayerLoading"
                variant="text"
                icon-left="play"
                @click.prevent="() => loadNewAudio(playlistItem)"
            />
        </div>
        <div
            v-if="currentSound && currentSound.id === playlistItem.id"
            class="column is-narrow mr-1"
        >
            <o-button
                :disabled="isPlayerLoading"
                variant="text"
                :icon-left="isPlaying ? 'pause' : 'play'"
                @click.prevent="() => setIsPlaying(!isPlaying)"
            />
        </div>
        <div class="column is-text-ellipsis">
            {{ `${playlistItem.dj.name} – ${playlistItem.name}` }}
        </div>

        <div class="column is-narrow">
            <span :class="['tag', soundTagType]">{{ $t(`${playlistItem.type}.type`) }}</span>
        </div>
        <o-button
            v-if="!currentSound || currentSound.id !== playlistItem.id"
            variant="text"
            :disabled="isPlayerLoading"
            custom-class="column is-narrow"
            icon-left="delete-sweep"
            @click.prevent="() => deleteSound(playlistItem)"
        />
        <o-icon
            v-else
            custom-class="column is-narrow"
            icon="checkbox-blank-circle"
            variant="success m-3"
            size="small"
        />
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
            currentSound: 'currentSound',
            isPlaying: 'isPlaying',
            isPlayerLoading: 'isLoading'
        }),
        ...mapGetters('playlist', ['isSoundInPlaylist']),
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
        ...mapActions('player', ['loadNewAudio', 'setIsPlaying']),
        ...mapActions('playlist', ['deleteSound'])
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
