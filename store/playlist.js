export const state = () => ({
    playlist: []
})

export const mutations = {
    mutateSetPlaylist(state, playlist) {
        state.playlist = playlist
    },
    mutateAddSoundToEnd(state, sound) {
        state.playlist.push(this.$audio.formatSoundForPlaylist(sound))
    },
    mutateAddSoundToIndex(state, { sound, index }) {
        state.playlist.splice(index, 0, this.$audio.formatSoundForPlaylist(sound))
    },
    mutateDeleteSound(state, sound) {
        state.playlist = state.playlist.filter((playlistSound) => playlistSound.id !== sound.id)
    }
}

export const actions = {
    setPlaylist({ commit }, playlist) {
        commit('mutateSetPlaylist', playlist)
    },
    deleteSound({ commit }, sound) {
        commit('mutateDeleteSound', sound)
        this._vm.$oruga.notification.open({
            message: this.$i18n.t('playlist.removed_from_playlist', [
                `${sound.dj.name} – ${sound.name}`
            ]),
            variant: 'warning'
        })
    },
    handlePlaySound({ commit, state, rootState }, sound) {
        if (!state.playlist.some((playlistSound) => playlistSound.id === sound.id)) {
            let index
            if (rootState.player.currentSound) {
                index = state.playlist.findIndex(
                    (playlistSound) => playlistSound.id === rootState.player.currentSound.id
                )
                index = index !== -1 ? index + 1 : 0
            }

            commit('mutateAddSoundToIndex', { sound, index })
            this._vm.$oruga.notification.open({
                message: this.$i18n.t('playlist.added_to_playlist', [
                    `${sound.dj.name} – ${sound.name}`
                ]),
                variant: 'success'
            })
        }
    },
    handleAddOrRemovePlaylistSound({ commit, state, dispatch }, sound) {
        if (!state.playlist.some((playlistSound) => playlistSound.id === sound.id)) {
            commit('mutateAddSoundToEnd', sound)

            this._vm.$oruga.notification.open({
                message: this.$i18n.t('playlist.added_to_playlist', [
                    `${sound.dj.name} – ${sound.name}`
                ]),
                variant: 'success'
            })
        } else {
            dispatch('deleteSound', sound)
        }
    }
}

export const getters = {
    playlist(state) {
        return state.playlist
    },
    isSoundInPlaylist: (state) => (sound) => {
        return state.playlist.some((playlistSound) => playlistSound.id === sound.id)
    }
}
