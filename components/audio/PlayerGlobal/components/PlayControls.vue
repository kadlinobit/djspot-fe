<template>
    <div class="columns is-vcentered is-mobile is-gapless">
        <div class="column">
            <o-button
                :disabled="!isLoaded || isError || !canPlayPrevious"
                variant="primary"
                size="size-6"
                icon-left="skip-previous"
                @click.stop="playPrevious"
            />
        </div>
        <div class="column">
            <o-button
                :disabled="!isLoaded || isError"
                variant="primary"
                size="size-6"
                icon-left="stop"
                @click.stop="stop"
            />
        </div>
        <div class="column">
            <o-button
                :disabled="!isLoaded || isError"
                variant="primary"
                size="size-6"
                :icon-left="isPlaying ? 'pause' : 'play'"
                @click.stop="setIsPlaying(!isPlaying)"
            />
        </div>
        <div class="column">
            <o-button
                :disabled="!isLoaded || isError || !canPlayNext"
                variant="primary"
                size="size-6"
                icon-left="skip-next"
                @click.stop="playNext"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    props: {
        audioRefName: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapGetters('playlist', [
            'playlist',
            'isSoundInPlaylist',
            'playlistSize',
            'soundIndexInPlaylist'
        ]),
        ...mapGetters('player', ['currentSound', 'isLoaded', 'isPlaying', 'isLoading', 'isError']),
        canPlayNext() {
            if (
                this.isSoundInPlaylist(this.currentSound) &&
                this.playlistSize > 1 &&
                this.soundIndexInPlaylist(this.currentSound) < this.playlistSize - 1
            )
                return true
            return false
        },
        canPlayPrevious() {
            if (
                this.isSoundInPlaylist(this.currentSound) &&
                this.playlistSize > 1 &&
                this.soundIndexInPlaylist(this.currentSound) > 0
            )
                return true
            return false
        }
    },
    methods: {
        ...mapActions('player', ['setIsPlaying', 'setPreviousVolume', 'loadNewAudio']),
        stop() {
            this.setIsPlaying(false)
            this.$parent.$refs[this.audioRefName].currentTime = 0
        },
        playNext() {
            if (this.canPlayNext)
                this.loadNewAudio(this.playlist[this.soundIndexInPlaylist(this.currentSound) + 1])
        },
        playPrevious() {
            if (this.canPlayPrevious)
                this.loadNewAudio(this.playlist[this.soundIndexInPlaylist(this.currentSound) - 1])
        }
    }
}
</script>
