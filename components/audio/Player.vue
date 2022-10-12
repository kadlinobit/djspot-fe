<template>
    <div class="o-player-preview" style="position: relative">
        <o-loading
            :full-page="false"
            :active="isLoading.value"
            :can-cancel="false"
        ></o-loading>
        <div class="columns is-vcentered is-mobile">
            <div class="column is-narrow">
                <div class="level is-mobile">
                    <div class="level-item mr-1">
                        <o-button
                            :disabled="!loaded || isError"
                            variant="text"
                            size="size-6"
                            icon-left="stop"
                            @click.prevent="stop"
                        />
                    </div>
                    <div class="level-item">
                        <o-button
                            :disabled="!loaded || isError"
                            variant="text"
                            size="size-6"
                            :icon-left="playing ? 'pause' : 'play'"
                            @click.prevent="playing = !playing"
                        />
                    </div>
                </div>
            </div>
            <div v-if="isError" class="column">
                <o-notification
                    variant="danger pt-3 pb-3"
                    :closable="false"
                    role="alert"
                >
                    {{ $i18n.t('player.error_loading_file') }}
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
            <div class="column is-narrow">
                <o-button
                    :disabled="!loaded || isError"
                    :variant="showVolume ? 'success' : 'text'"
                    size="size-6"
                    :icon-left="volumeIcon"
                    @click.prevent="showVolume = !showVolume"
                />
            </div>
        </div>
        <audio
            ref="audioPlayer"
            preload="auto"
            style="display: none"
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

<script setup lang="ts">
const { $audio, $i18n } = useNuxtApp()

interface Props {
    autoPlay?: boolean
    file?: string
}

const props = withDefaults(defineProps<Props>(), {
    autoPlay: false,
    file: null
})

const emit = defineEmits(['audio-load-error', 'audio-load-success'])

const currentSeconds = ref(0)
const durationSeconds = ref(0)
const loaded = ref(false)
const playing = ref(false)
const previousVolume = ref(35)
const showVolume = ref(false)
const volume = ref(100)
const isLoading = ref(false)
const isError = ref(false)
const audioPlayer = ref(null)

const percentComplete = computed(() => {
    return (currentSeconds.value / durationSeconds.value) * 100
})
const progressStyle = computed(() => {
    return { width: `${percentComplete.value}%` }
})
const volumeTitle = computed(() => {
    return `Volume (${volume.value}%)`
})
const volumeIcon = computed(() => {
    let volumeIcon = 'volume-off'
    if (volume.value > 0 && volume.value <= 30) {
        volumeIcon = 'volume-low'
    }
    if (volume.value > 30 && volume.value <= 60) {
        volumeIcon = 'volume-medium'
    }
    if (volume.value > 60) {
        volumeIcon = 'volume-high'
    }
    return volumeIcon
})

watch(playing, (val) => {
    if (val) {
        return audioPlayer.value.play()
    }
    audioPlayer.value.pause()
})
watch(volume, (val) => {
    audioPlayer.value.volume = val / 100
})
watch(
    () => props.file,
    (val) => {
        audioPlayer.value.load()
    }
)

function load() {
    isLoading.value = false
    isError.value = false

    if (audioPlayer.value.readyState >= 2) {
        loaded.value = true
        durationSeconds.value = parseInt(audioPlayer.value.duration)
        emit('audio-load-success', {
            duration: durationSeconds.value
        })
        playing.value = props.autoPlay
        return
    }

    throw new Error('Failed to load sound file.')
}
function seek(val) {
    if (!loaded.value) return
    audioPlayer.value.currentTime = parseInt(val)
}
function stop() {
    playing.value = false
    audioPlayer.value.currentTime = 0
}
function update() {
    currentSeconds.value = parseInt(audioPlayer.value.currentTime)
}
function onError() {
    isLoading.value = false
    isError.value = true
    emit('audio-load-error')
}
</script>
