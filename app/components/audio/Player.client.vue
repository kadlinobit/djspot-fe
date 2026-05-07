<template>
    <div class="relative bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10 rounded-lg">
            <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
        </div>
        <div class="flex items-center gap-4">
            <div class="flex-shrink-0 flex items-center gap-1">
                <UButton
                    :disabled="!loaded || isError"
                    variant="ghost"
                    color="primary"
                    icon="i-heroicons-stop"
                    @click.prevent="stop"
                />
                <UButton
                    :disabled="!loaded || isError"
                    variant="ghost"
                    color="primary"
                    :icon="playing ? 'i-heroicons-pause' : 'i-heroicons-play'"
                    @click.prevent="playing = !playing"
                />
            </div>
            <div v-if="isError" class="flex-1">
                <UAlert
                    color="error"
                    variant="subtle"
                    :title="$i18n.t('player.error_loading_file')"
                />
            </div>
            <div v-if="!isError && !showVolume" class="flex-1 min-w-0 flex flex-col gap-1">
                <USlider
                    :model-value="currentSeconds"
                    :max="durationSeconds"
                    :disabled="!loaded || isError"
                    color="primary"
                    size="sm"
                    class="cursor-pointer"
                    @update:model-value="(value) => { currentSeconds = value; isSeeking = true; }"
                    @change="() => { seek(currentSeconds); isSeeking = false; }"
                    @mousedown="isSeeking = true"
                    @mouseup="isSeeking = false"
                    @touchstart="isSeeking = true"
                    @touchend="isSeeking = false"
                />
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>{{ convertTimeHHMMSS(currentSeconds) }}</span>
                    <span>{{ convertTimeHHMMSS(durationSeconds) }}</span>
                </div>
            </div>
            <div v-if="!isError && showVolume" class="flex-1 min-w-0 flex flex-col gap-1">
                <USlider
                    v-model="volume"
                    :max="100"
                    :disabled="!loaded || isError"
                    color="neutral"
                    size="sm"
                />
                <div class="text-xs text-gray-500 text-center">Volume {{ volume }}</div>
            </div>
            <div class="flex-shrink-0">
                <UButton
                    :disabled="!loaded || isError"
                    :variant="showVolume ? 'soft' : 'ghost'"
                    :color="showVolume ? 'primary' : 'neutral'"
                    :icon="volumeIcon"
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
        />
    </div>
</template>

<script setup lang="ts">
const { $i18n } = useNuxtApp()

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
const isSeeking = ref(false)
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
    if (volume.value === 0) {
        return 'i-heroicons-speaker-x-mark'
    }
    return 'i-heroicons-speaker-wave'
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
    if (!isSeeking.value) {
        currentSeconds.value = parseInt(audioPlayer.value.currentTime)
    }
}
function onError() {
    isLoading.value = false
    isError.value = true
    emit('audio-load-error')
}
</script>
