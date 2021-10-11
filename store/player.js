export const state = () => ({
    currentSound: null,
    file: null,
    currentSeconds: 0,
    durationSeconds: 0,
    isLoaded: false,
    looping: false,
    isPlaying: false,
    previousVolume: 80,
    volume: 80,
    isLoading: false,
    isError: false,
    showCancelLoading: false,
    cancelLoadingTimeout: null,
    showCancelLoadingButton: false
})

export const mutations = {
    mutateSetCurrentSound(state, sound) {
        state.currentSound = this.$audio.formatSoundForPlaylist(sound)
    },
    mutateSetFile(state, file) {
        state.file = file
    },
    mutateSetCurrentSeconds(state, currentSeconds) {
        state.currentSeconds = currentSeconds
    },
    mutateSetDurationSeconds(state, durationSeconds) {
        state.durationSeconds = durationSeconds
    },
    mutateSetIsLoaded(state, isLoaded) {
        state.isLoaded = isLoaded
    },
    mutateSetLooping(state, looping) {
        state.looping = looping
    },
    mutateSetIsPlaying(state, isPlaying) {
        state.isPlaying = isPlaying
    },
    mutateSetPreviousVolume(state, previousVolume) {
        state.previousVolume = previousVolume
    },
    mutateSetVolume(state, volume) {
        state.volume = volume
    },
    mutateSetIsLoading(state, isLoading) {
        state.isLoading = isLoading
    },
    mutateSetIsError(state, isError) {
        state.isError = isError
    },
    mutateSetShowCancelLoadingButton(state, showCancelLoadingButton) {
        state.showCancelLoadingButton = showCancelLoadingButton
    },
    mutateSetCancelLoadingTimeout(state, cancelLoadingTimeout) {
        state.cancelLoadingTimeout = cancelLoadingTimeout
    },
    mutateResetAudio(state) {
        state.currentSound = null
        state.file = null
        state.currentSeconds = 0
        state.durationSeconds = 0
        state.isLoaded = false
        state.isPlaying = false
        state.isLoading = false
        state.isError = false
        state.showCancelLoadingButton = false
        state.cancelLoadingTimeout = null
    }
}

export const actions = {
    setCurrentSound({ commit }, sound) {
        commit('mutateSetCurrentSound', sound)
    },
    setFile({ commit }, file) {
        commit('mutateSetFile', file)
    },
    setCurrentSeconds({ commit }, currentSeconds) {
        commit('mutateSetCurrentSeconds', currentSeconds)
    },
    setDurationSeconds({ commit }, durationSeconds) {
        commit('mutateSetDurationSeconds', durationSeconds)
    },
    setIsLoaded({ commit }, isLoaded) {
        commit('mutateSetIsLoaded', isLoaded)
    },
    setLooping({ commit }, looping) {
        commit('mutateSetLooping', looping)
    },
    setIsPlaying({ commit }, isPlaying) {
        commit('mutateSetIsPlaying', isPlaying)
    },
    setPreviousVolume({ commit }, previousVolume) {
        commit('mutateSetPreviousVolume', previousVolume)
    },
    setVolume({ commit }, volume) {
        commit('mutateSetVolume', volume)
    },
    setIsLoading({ commit, state }, isLoading) {
        /*  When loading begins, set timeout that will display 
            the "cancel loading" button after couple of seconds of loading */
        if (isLoading) {
            commit(
                'mutateSetCancelLoadingTimeout',
                setTimeout(() => {
                    commit('mutateSetShowCancelLoadingButton', true)
                }, 100)
            )
        }
        /*  When loading is finished, clear timeout and hide the "Cancel loading" button */
        if (!isLoading) {
            clearTimeout(state.cancelLoadingTimeout)
            commit('mutateSetShowCancelLoadingButton', false)
            commit('mutateSetCancelLoadingTimeout', null)
        }

        commit('mutateSetIsLoading', isLoading)
    },
    setIsError({ commit }, isError) {
        commit('mutateSetIsError', isError)
    },
    resetAudio({ commit }) {
        commit('mutateResetAudio')
    },
    /**
     * Sets new audio for the player, fetches audio stream url
     * @param {Object} context - vuex store context
     * @param {Object} newSound - object containing new sound data
     */
    async loadNewAudio(context, newSound) {
        context.dispatch('resetAudio')
        if (newSound && newSound.url) {
            const audioUrls = await this.$audio.getAudioUrls(newSound.url)
            if (audioUrls && audioUrls.stream) {
                context.dispatch('setCurrentSound', newSound)
                context.dispatch('setFile', audioUrls.stream)
            } else {
                context.dispatch('setIsError', true)
            }
            return
        }
        context.dispatch('setIsError', true)
    }
}

export const getters = {
    currentSound(state) {
        return state.currentSound
    },
    file(state) {
        return state.file
    },
    currentSeconds(state) {
        return state.currentSeconds
    },
    durationSeconds(state) {
        return state.durationSeconds
    },
    isLoaded(state) {
        return state.isLoaded
    },
    looping(state) {
        return state.looping
    },
    isPlaying(state) {
        return state.isPlaying
    },
    previousVolume(state) {
        return state.previousVolume
    },
    volume(state) {
        return state.volume
    },
    isLoading(state) {
        return state.isLoading
    },
    isError(state) {
        return state.isError
    },
    isMuted(state) {
        return state.volume / 100 === 0
    },
    percentComplete(state) {
        return parseInt((state.currentSeconds / state.durationSeconds) * 100)
    },
    showCancelLoadingButton(state) {
        return state.showCancelLoadingButton
    }
}
