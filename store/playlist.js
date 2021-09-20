import _ from 'lodash'

export const state = () => ({
    playlist: []
})

export const mutations = {
    mutateSetPlaylist(state, playlist) {
        state.playlist = playlist
    }
}

export const actions = {
    handlePlayMix({ commit, state }, mix) {
        if (!state.playlist.some((playlistMix) => playlistMix.id === mix.id)) {
            const newMix = _.clone(mix)
            commit('mutateSetPlaylist', state.playlist.concat([newMix]))
        }
    },
    handleAddToPlaylistMix({ commit }, mix) {}
}

export const getters = {
    playlist(state) {
        return state.playlist
    }
}
