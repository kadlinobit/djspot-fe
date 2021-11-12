<template>
    <div class="buefy-player is-relative">
        <o-slider
            :tooltip="false"
            :value="currentSeconds"
            :max="durationSeconds"
            :disabled="!isLoaded || isError"
            variant="primary mb-0 mt-0"
            @change="(value) => seek(value)"
        />
        <div class="columns is-vcentered is-mobile mb-0 mt-1">
            <div class="column is-narrow ml-2">
                <div class="columns is-vcentered is-mobile is-gapless">
                    <div class="column">
                        <o-button
                            :disabled="!isLoaded || isError"
                            variant="text"
                            size="size-6"
                            icon-left="stop"
                            @click.prevent="stop"
                        />
                    </div>
                    <div class="column">
                        <o-button
                            :disabled="!isLoaded || isError"
                            variant="text"
                            size="size-6"
                            :icon-left="isPlaying ? 'pause' : 'play'"
                            @click.prevent="setIsPlaying(!isPlaying)"
                        />
                    </div>
                </div>
            </div>
            <div v-if="isError" class="column">
                <o-notification variant="danger pt-3 pb-3" role="alert">
                    {{ $t('player.error_loading_file') }}
                </o-notification>
            </div>
            <div v-if="!isError" class="column">
                <div class="columns is-vcentered is-mobile is-relative">
                    <o-loading
                        :full-page="false"
                        :active.sync="isLoading"
                        :can-cancel="false"
                    ></o-loading>
                    <div class="column is-narrow">
                        <div class="tag is-light">
                            {{ $audio.convertTimeHHMMSS(currentSeconds) }}
                        </div>
                    </div>
                    <div class="column">
                        <span v-if="currentSound">
                            {{ `${currentSound.dj.name} - ${currentSound.name}` }}
                        </span>
                    </div>
                    <div class="column is-narrow">
                        <div class="tag is-light">
                            {{ $audio.convertTimeHHMMSS(durationSeconds) }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-one-quarter-mobile is-one-fifth-desktop">
                <div v-if="showCancelLoadingButton" class="has-text-centered">
                    <o-button variant="danger" @click.prevent="resetAudio">
                        {{ $t('player.cancel_loading') }}
                    </o-button>
                </div>
                <div v-else class="columns is-vcentered is-mobile is-gapless">
                    <div class="column is-narrow mr-3">
                        <o-button
                            :disabled="!isLoaded || isError"
                            variant="text"
                            size="size-6"
                            :icon-left="volumeIcon"
                            @click.prevent="() => onMute()"
                        />
                    </div>
                    <div class="column mr-4">
                        <o-slider
                            :value="volume"
                            :tooltip="false"
                            :max="100"
                            :disabled="!isLoaded || isError"
                            variant="success"
                            @input="(newVolume) => setVolume(newVolume)"
                        />
                    </div>
                    <div class="column">
                        <o-button
                            variant="text"
                            size="size-6"
                            icon-left="playlist-music"
                            @click.stop="() => setIsPlaylistOpen(true)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <audio
            :ref="audioRefName"
            preload="auto"
            style="display: none"
            :loop="looping"
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
        ></audio>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    props: {
        audioRefName: {
            type: String,
            default: 'global-player-audio'
        }
    },
    data: () => ({}),
    computed: {
        ...mapGetters(['isPlaylistOpen']),
        ...mapGetters('player', [
            'currentSound',
            'file',
            'currentSeconds',
            'durationSeconds',
            'isLoaded',
            'looping',
            'isPlaying',
            'previousVolume',
            'volume',
            'isLoading',
            'isError',
            'isMuted',
            'percentComplete',
            'showCancelLoadingButton'
        ]),
        volumeIcon() {
            let volumeIcon = 'volume-off'
            if (this.volume > 0 && this.volume <= 30) {
                volumeIcon = 'volume-low'
            }
            if (this.volume > 30 && this.volume <= 60) {
                volumeIcon = 'volume-medium'
            }
            if (this.volume > 60) {
                volumeIcon = 'volume-high'
            }
            return volumeIcon
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
    created() {
        // this.looping = this.loop
    },
    methods: {
        ...mapActions(['setIsPlaylistOpen']),
        ...mapActions('player', [
            'setCurrentSound',
            'setFile',
            'setCurrentSeconds',
            'setDurationSeconds',
            'setIsLoaded',
            'setLooping',
            'setIsPlaying',
            'setPreviousVolume',
            'setShowVolume',
            'setVolume',
            'setIsLoading',
            'setIsError',
            'setIsMuted',
            'setPercentComplete',
            'resetAudio',
            'loadNewAudio'
        ]),
        onLoadedData() {
            this.setIsLoading(false)
            this.setIsError(false)

            if (this.$refs[this.audioRefName].readyState >= 2) {
                this.setIsLoaded(true)
                this.setDurationSeconds(parseInt(this.$refs[this.audioRefName].duration))
                this.setIsPlaying(true)
            } else {
                throw new Error('Failed to load sound file.')
            }
        },
        async loadFile() {},
        onMute() {
            if (this.isMuted) {
                return this.setVolume(this.previousVolume)
            }

            this.setPreviousVolume(this.volume)
            this.setVolume(0)
        },
        seek(value) {
            if (!this.isLoaded) return
            this.$refs[this.audioRefName].currentTime = parseInt(value)
        },
        stop() {
            this.setIsPlaying(false)
            this.$refs[this.audioRefName].currentTime = 0
        },
        update(e) {
            this.setCurrentSeconds(parseInt(this.$refs[this.audioRefName].currentTime))
        },
        onError() {
            this.setIsLoading(false)
            this.setIsError(true)
            this.$emit('audio-load-error')
        },
        onOpenPlaylist() {
            this.$nuxt.$emit('openPlaylist')
        }
    }
}
</script>
