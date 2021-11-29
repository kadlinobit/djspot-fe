<template>
    <div class="o-player is-relative">
        <o-slider
            :tooltip="false"
            :value="currentSeconds"
            :max="durationSeconds"
            :disabled="!isLoaded || isError"
            variant="secondary mb-0 mt-0"
            @change="(value) => seek(value)"
        />
        <div v-if="currentSound" class="p-2 is-hidden-tablet">
            <sound-info />
        </div>
        <div class="columns is-gapless is-vcentered is-mobile mb-1 mt-1">
            <div class="column is-narrow-tablet is-6-mobile ml-2">
                <play-controls :audio-ref-name="audioRefName" />
            </div>
            <div class="column is-hidden-mobile is-text-ellipsis">
                <sound-info />
            </div>
            <div class="column is-6-mobile is-4-tablet is-3-desktop is-2-widescreen">
                <volume-controls />
            </div>
        </div>
        <audio
            :ref="audioRefName"
            preload="auto"
            style="display: none"
            :loop="false"
            :src="file"
            @timeupdate="update"
            @loadstart="
                setIsLoading(true)
                setIsPlaying(false)
            "
            @loadeddata="onLoadedData"
            @pause="setIsPlaying(false)"
            @play="setIsPlaying(true)"
            @error="onError"
            @ended="playNext"
        ></audio>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PlayControls from './components/PlayControls.vue'
import VolumeControls from './components/VolumeControls.vue'
import SoundInfo from './components/SoundInfo.vue'

export default {
    components: {
        PlayControls,
        VolumeControls,
        SoundInfo
    },
    props: {
        audioRefName: {
            type: String,
            default: 'global-player-audio'
        }
    },
    data: () => ({}),
    computed: {
        ...mapGetters('playlist', [
            'playlist',
            'playlistSize',
            'isSoundInPlaylist',
            'soundIndexInPlaylist'
        ]),
        ...mapGetters('player', [
            'currentSound',
            'file',
            'currentSeconds',
            'durationSeconds',
            'isLoaded',
            'isPlaying',
            'volume',
            'isLoading',
            'isError',
            'isAutoplay'
        ]),
        canPlayNext() {
            if (
                this.isSoundInPlaylist(this.currentSound) &&
                this.playlistSize > 1 &&
                this.soundIndexInPlaylist(this.currentSound) < this.playlistSize - 1
            )
                return true
            return false
        }
    },
    watch: {
        isPlaying(value) {
            if (value) {
                return this.$refs[this.audioRefName].play()
            }
            this.$refs[this.audioRefName].pause()
        },
        volume(value) {
            this.$refs[this.audioRefName].volume = value / 100
        },
        file() {
            this.$refs[this.audioRefName].load()
        }
    },
    methods: {
        ...mapActions('player', [
            'setCurrentSeconds',
            'setDurationSeconds',
            'setIsLoaded',
            'setIsPlaying',
            'setIsLoading',
            'setIsError',
            'setIsAutoplay',
            'loadNewAudio'
        ]),
        onLoadedData() {
            this.setIsLoading(false)
            this.setIsError(false)

            if (this.$refs[this.audioRefName].readyState >= 2) {
                this.setIsLoaded(true)
                this.setDurationSeconds(parseInt(this.$refs[this.audioRefName].duration))
                if (this.isAutoplay) {
                    this.setIsPlaying(true)
                }
                this.setIsAutoplay(false)
            } else {
                this.setIsAutoplay(false)
                throw new Error('Failed to load sound file.')
            }
        },
        seek(value) {
            if (!this.isLoaded) return
            this.$refs[this.audioRefName].currentTime = parseInt(value)
        },
        update(e) {
            this.setCurrentSeconds(parseInt(this.$refs[this.audioRefName].currentTime))
        },
        onError() {
            this.setIsLoading(false)
            this.setIsError(true)
            this.$emit('audio-load-error')
        },
        playNext() {
            if (this.canPlayNext)
                this.loadNewAudio(this.playlist[this.soundIndexInPlaylist(this.currentSound) + 1])
        }
    }
}
</script>
