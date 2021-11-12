<template>
    <div class="buefy-player" style="position: relative">
        <o-loading :full-page="false" :active.sync="isLoading" :can-cancel="false"></o-loading>
        <div class="columns is-vcentered is-mobile">
            <div class="column is-narrow">
                <div class="level is-mobile">
                    <div class="level-item mr-1">
                        <o-button
                            :disabled="!loaded || isError"
                            variant="text"
                            size="medium"
                            icon-left="stop"
                            @click.prevent="stop"
                        />
                    </div>
                    <div class="level-item">
                        <o-button
                            :disabled="!loaded || isError"
                            variant="text"
                            size="medium"
                            :icon-left="playing ? 'pause' : 'play'"
                            @click.prevent="playing = !playing"
                        />
                    </div>
                </div>
            </div>
            <div v-if="isError" class="column">
                <o-notification variant="danger pt-3 pb-3" :closable="false" role="alert">
                    Error loading file
                </o-notification>
            </div>
            <div v-if="!isError && !showVolume" class="column">
                <o-slider
                    :tooltip="false"
                    :value="currentSeconds"
                    :max="durationSeconds"
                    :disabled="!loaded || isError"
                    variant="primary mb-2 mt-2"
                    @change="(value) => seek(value)"
                />
                <div class="level is-mobile">
                    <div class="level-left">
                        <div class="level-item">
                            <div class="tag is-light">
                                {{ $audio.convertTimeHHMMSS(currentSeconds) }}
                            </div>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <div class="tag is-light">
                                {{ $audio.convertTimeHHMMSS(durationSeconds) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!isError && showVolume" class="column">
                <o-slider
                    v-model="volume"
                    :tooltip="false"
                    :max="100"
                    :disabled="!loaded || isError"
                    variant="success mb-2 mt-2"
                />
                <div class="level is-mobile">
                    <div class="level-item">
                        <div class="tag is-light">Volume {{ volume }}</div>
                    </div>
                </div>
            </div>
            <div class="is-narrow">
                <div class="level is-mobile">
                    <div class="level-item mr-2">
                        <o-button
                            :disabled="!loaded || isError"
                            :variant="showVolume ? 'success' : 'text'"
                            size="medium"
                            icon-left="equalizer"
                            @click.prevent="showVolume = !showVolume"
                        />
                    </div>
                    <div class="level-item">
                        <o-switch
                            :disabled="!loaded || isError"
                            :value="!muted"
                            variant="success"
                            @input="mute"
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
            @loadstart="isLoading = true"
            @loadeddata="load"
            @pause="playing = false"
            @play="playing = true"
            @error="onError"
        ></audio>
    </div>
</template>

<script>
export default {
    props: {
        autoPlay: {
            type: Boolean,
            default: false
        },
        file: {
            type: String,
            default: null
        },
        loop: {
            type: Boolean,
            default: false
        },
        audioRefName: {
            type: String,
            default: 'audio'
        }
    },
    data: () => ({
        currentSeconds: 0,
        durationSeconds: 0,
        loaded: false,
        looping: false,
        playing: false,
        previousVolume: 35,
        showVolume: false,
        volume: 100,
        isLoading: false,
        isError: false
    }),
    computed: {
        muted() {
            return this.volume / 100 === 0
        },
        percentComplete() {
            return parseInt((this.currentSeconds / this.durationSeconds) * 100)
        },
        progressStyle() {
            return { width: `${this.percentComplete}%` }
        },
        volumeTitle() {
            return `Volume (${this.volume}%)`
        }
    },
    watch: {
        playing(value) {
            if (value) {
                return this.$refs[this.audioRefName].play()
            }
            this.$refs[this.audioRefName].pause()
        },
        volume(value) {
            this.$refs[this.audioRefName].volume = this.volume / 100
        },
        file(value) {
            this.$refs[this.audioRefName].load()
        }
    },
    created() {
        this.looping = this.loop
    },
    methods: {
        download() {
            this.stop()
            window.open(this.file, 'download')
        },
        load() {
            this.isLoading = false
            this.isError = false

            if (this.$refs[this.audioRefName].readyState >= 2) {
                this.loaded = true
                this.durationSeconds = parseInt(this.$refs[this.audioRefName].duration)
                this.$emit('audio-load-success', { duration: this.durationSeconds })
                return (this.playing = this.autoPlay)
            }

            throw new Error('Failed to load sound file.')
        },
        mute() {
            if (this.muted) {
                return (this.volume = this.previousVolume)
            }

            this.previousVolume = this.volume
            this.volume = 0
        },
        seek(value) {
            if (!this.loaded) return
            this.$refs[this.audioRefName].currentTime = parseInt(value)
        },
        stop() {
            this.playing = false
            this.$refs[this.audioRefName].currentTime = 0
        },
        update(e) {
            this.currentSeconds = parseInt(this.$refs[this.audioRefName].currentTime)
        },
        onError() {
            this.isLoading = false
            this.isError = true
            this.$emit('audio-load-error')
        }
    }
}
</script>
