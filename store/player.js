export const state = () => ({
    currentMix: null,
    file: null,
    currentSeconds: 0,
    durationSeconds: 0,
    isLoaded: false,
    looping: false,
    isPlaying: false,
    previousVolume: 80,
    showVolume: false,
    volume: 80,
    isLoading: false,
    isError: false
})

export const mutations = {
    mutateSetCurrentMix(state, mix) {
        state.currentMix = mix
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
    mutateSetShowVolume(state, showVolume) {
        state.showVolume = showVolume
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
    mutateResetAudio(state) {
        state.currentMix = null
        state.file = null
        state.currentSeconds = 0
        state.durationSeconds = 0
        state.isLoaded = false
        state.isPlaying = false
        state.isLoading = false
        state.isError = false
    }
}

export const actions = {
    setCurrentMix({ commit }, mix) {
        commit('mutateSetCurrentMix', mix)
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
    setShowVolume({ commit }, showVolume) {
        commit('mutateSetShowVolume', showVolume)
    },
    setVolume({ commit }, volume) {
        commit('mutateSetVolume', volume)
    },
    setIsLoading({ commit }, isLoading) {
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
     * @param {Object} newMix - object containing new audio mix data
     */
    async loadNewAudio(context, newMix) {
        context.dispatch('resetAudio')
        if (newMix && newMix.url) {
            const audioUrls = await this.$audio.getAudioUrls(newMix.url)
            if (audioUrls && audioUrls.stream) {
                context.dispatch('setCurrentMix', newMix)
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
    currentMix(state) {
        return state.currentMix
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
    showVolume(state) {
        return state.showVolume
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
    }
}
