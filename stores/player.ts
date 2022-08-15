import { defineStore } from 'pinia'
import { useMainStore } from './'

// interface State {
//     currentSound: object
//     file: string
//     currentSeconds: number
//     durationSeconds: number
//     isLoaded: boolean
//     looping: boolean
//     isPlaying: boolean
//     previousVolume: number
//     volume: number
//     isLoading: boolean
//     isError: boolean
//     isAutoplay: boolean
//     showCancelLoading: boolean
//     cancelLoadingTimeout: number
//     showCancelLoadingButton: boolean
// }

export const usePlayerStore = defineStore('player', () => {
    const { $audio } = useNuxtApp()

    const currentSound = ref(null)
    const file = ref(null)
    const currentSeconds = ref(0)
    const durationSeconds = ref(0)
    const isLoaded = ref(false)
    const looping = ref(false)
    const isPlaying = ref(false)
    const previousVolume = ref(80)
    const volume = ref(80)
    const isLoading = ref(false)
    const isError = ref(false)
    const isAutoplay = ref(false)
    const showCancelLoading = ref(false)
    const cancelLoadingTimeout = ref(null)
    const showCancelLoadingButton = ref(false)

    // GETTERS
    const isMuted = computed(() => {
        return volume.value / 100 === 0
    })

    const percentComplete = computed(() => {
        return Math.floor((currentSeconds.value / durationSeconds.value) * 100)
    })

    // ACTIONS
    function setCurrentSound(value) {
        currentSound.value = value
    }
    function setFile(value) {
        file.value = value
    }

    function setCurrentSeconds(value) {
        currentSeconds.value = value
    }
    function setDurationSeconds(value) {
        durationSeconds.value = value
    }
    function setIsLoaded(value) {
        isLoaded.value = value
    }
    function setLooping(value) {
        looping.value = value
    }
    function setIsPlaying(value) {
        if (value) {
            const mainStore = useMainStore()
            mainStore.setIsBottomBarOpen(true)
        }
        isPlaying.value = value
    }
    function setPreviousVolume(value) {
        previousVolume.value = value
    }
    function setVolume(value) {
        volume.value = value
    }
    function setIsLoading(value) {
        /*  When loading begins, set timeout that will display 
                the "cancel loading" button after couple of seconds of loading */
        if (value) {
            cancelLoadingTimeout.value = setTimeout(() => {
                showCancelLoadingButton.value = true
            }, 100)
        }
        /*  When loading is finished, clear timeout and hide the "Cancel loading" button */
        if (!value) {
            clearTimeout(cancelLoadingTimeout.value)
            showCancelLoadingButton.value = false
            cancelLoadingTimeout.value = null
        }

        isLoading.value = value
    }
    function setIsError(value) {
        isError.value = value
    }
    function setIsAutoplay(value) {
        isAutoplay.value = value
    }
    function resetAudio() {
        currentSound.value = null
        file.value = null
        currentSeconds.value = 0
        durationSeconds.value = 0
        isLoaded.value = false
        isPlaying.value = false
        isLoading.value = false
        isError.value = false
        showCancelLoadingButton.value = false
        cancelLoadingTimeout.value = null
    }
    /**
     * Sets new audio for the player, fetches audio stream url
     * @param {Object} newSound - object containing new sound data
     */
    async function loadNewAudio(newSound) {
        resetAudio()
        // Set autoplay true as this is user called action for loading new audio
        setIsAutoplay(true)

        if (newSound && newSound.url) {
            const audioUrls = await $audio.getAudioUrls(newSound.url)
            if (audioUrls && audioUrls.stream) {
                setCurrentSound(newSound)
                setFile(audioUrls.stream)
            } else {
                setIsError(true)
            }
            return
        }
        setIsError(true)
    }

    return {
        currentSound,
        file,
        currentSeconds,
        durationSeconds,
        isLoaded,
        looping,
        isPlaying,
        previousVolume,
        volume,
        isLoading,
        isError,
        isAutoplay,
        showCancelLoading,
        cancelLoadingTimeout,
        showCancelLoadingButton,

        // GETTERS
        isMuted,
        percentComplete,

        // ACTIONS
        setCurrentSound,
        setFile,
        setCurrentSeconds,
        setDurationSeconds,
        setIsLoaded,
        setLooping,
        setIsPlaying,
        setPreviousVolume,
        setVolume,
        setIsLoading,
        setIsError,
        setIsAutoplay,
        resetAudio,
        loadNewAudio
    }
})
