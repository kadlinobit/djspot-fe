import { defineStore } from 'pinia';
import { useMainStore } from '../stores';
import type { ISoundDefault } from '~/plugins/directus/collection';

export const usePlayerStore = defineStore(
    'player',
    () => {

        const currentSound = ref<ISoundDefault>();
        const file = ref<string | undefined>(undefined);
        const currentSeconds = ref(0);
        const durationSeconds = ref(0);
        const isLoaded = ref(false);
        const looping = ref(false);
        const isPlaying = ref(false);
        const previousVolume = ref(80);
        const volume = ref(80);
        const isLoading = ref(false);
        const isError = ref(false);
        const isAutoplay = ref(false);
        const showCancelLoading = ref(false);
        const cancelLoadingTimeout = ref<
            ReturnType<typeof setTimeout> | undefined
        >(undefined);
        const showCancelLoadingButton = ref(false);

        // GETTERS
        const isMuted = computed(() => {
            return volume.value / 100 === 0;
        });

        const percentComplete = computed(() => {
            return Math.floor(
                (currentSeconds.value / durationSeconds.value) * 100
            );
        });

        // ACTIONS
        function setCurrentSound(value: ISoundDefault) {
            currentSound.value = value;
        }
        function setFile(value: string) {
            file.value = value;
        }

        function setCurrentSeconds(value: number) {
            currentSeconds.value = value;
        }
        function setDurationSeconds(value: number) {
            durationSeconds.value = value;
        }
        function setIsLoaded(value: boolean) {
            isLoaded.value = value;
        }
        function setLooping(value: boolean) {
            looping.value = value;
        }
        function setIsPlaying(value: boolean) {
            if (value) {
                const mainStore = useMainStore();
                mainStore.setIsBottomBarOpen(true);
            }
            isPlaying.value = value;
        }
        function setPreviousVolume(value: number) {
            previousVolume.value = value;
        }
        function setVolume(value: number) {
            volume.value = value;
        }
        function setIsLoading(value: boolean) {
            /*  When loading begins, set timeout that will display
                the "cancel loading" button after couple of seconds of loading */
            if (value) {
                cancelLoadingTimeout.value = setTimeout(() => {
                    showCancelLoadingButton.value = true;
                }, 100);
            }
            /*  When loading is finished, clear timeout and hide the "Cancel loading" button */
            if (!value) {
                clearTimeout(cancelLoadingTimeout.value);
                showCancelLoadingButton.value = false;
                cancelLoadingTimeout.value = undefined;
            }

            isLoading.value = value;
        }
        function setIsError(value: boolean) {
            isError.value = value;
        }
        function setIsAutoplay(value: boolean) {
            isAutoplay.value = value;
        }
        function resetAudio() {
            currentSound.value = undefined;
            file.value = undefined;
            currentSeconds.value = 0;
            durationSeconds.value = 0;
            isLoaded.value = false;
            isPlaying.value = false;
            isLoading.value = false;
            isError.value = false;
            showCancelLoadingButton.value = false;
            cancelLoadingTimeout.value = undefined;
        }
        async function loadNewAudio(newSound: ISoundDefault) {
            resetAudio();
            setIsAutoplay(true);

            if (newSound.url) {
                const audioUrls = await $fetch<{ stream: string | null; download: string | null } | null>('/api/audio-url', { query: { url: newSound.url } });
                if (audioUrls && audioUrls.stream) {
                    setCurrentSound(newSound);
                    setFile(audioUrls.stream);
                } else {
                    setIsError(true);
                }
                return;
            }
            setIsError(true);
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
        };
    },
    { persist: true }
);
