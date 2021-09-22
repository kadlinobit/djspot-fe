import _ from 'lodash'
import { ToastProgrammatic as Toast } from 'buefy'

export const state = () => ({
    playlist: []
})

export const mutations = {
    mutateSetPlaylist(state, playlist) {
        state.playlist = playlist
    },
    mutateAddMixToEnd(state, mix) {
        state.playlist.push(_.clone(mix))
    },
    mutateAddMixToIndex(state, { mix, index }) {
        state.playlist.splice(index, 0, _.clone(mix))
    },
    mutateDeleteMix(state, mix) {
        state.playlist = state.playlist.filter((playlistMix) => playlistMix.id !== mix.id)
    }
}

export const actions = {
    setPlaylist({ commit }, playlist) {
        commit('mutateSetPlaylist', playlist)
    },
    deleteMix({ commit }, mix) {
        commit('mutateDeleteMix', mix)
        Toast.open({
            message: this.$i18n.t('playlist.removed_from_playlist', [
                `${mix.dj.name} – ${mix.name}`
            ]),
            type: 'is-warning'
        })
    },
    handlePlayMix({ commit, state, rootState }, mix) {
        if (!state.playlist.some((playlistMix) => playlistMix.id === mix.id)) {
            let index
            if (rootState.player.currentMix) {
                index = state.playlist.findIndex(
                    (playlistMix) => playlistMix.id === rootState.player.currentMix.id
                )
                index = index !== -1 ? index + 1 : 0
            }

            commit('mutateAddMixToIndex', { mix, index })
            Toast.open({
                message: this.$i18n.t('playlist.added_to_playlist', [
                    `${mix.dj.name} – ${mix.name}`
                ]),
                type: 'is-success'
            })
        }
    },
    handleAddOrRemovePlaylistMix({ commit, state, dispatch }, mix) {
        if (!state.playlist.some((playlistMix) => playlistMix.id === mix.id)) {
            commit('mutateAddMixToEnd', mix)
            Toast.open({
                message: this.$i18n.t('playlist.added_to_playlist', [
                    `${mix.dj.name} – ${mix.name}`
                ]),
                type: 'is-success'
            })
        } else {
            dispatch('deleteMix', mix)
        }
    }
}

export const getters = {
    playlist(state) {
        return state.playlist
    },
    isMixInPlaylist: (state) => (mix) => {
        return state.playlist.some((playlistMix) => playlistMix.id === mix.id)
    }
}
