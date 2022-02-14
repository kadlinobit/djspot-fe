import Vue from 'vue'
import _ from 'lodash'

export const state = () => ({
    soundsCount: 0,
    sounds: {},
    searchName: '',
    searchType: '',
    searchGenres: [],
    sort: '-name',
    perPage: 5,
    currentPage: 1
})

export const mutations = {
    mutateSetSoundsCount(state, soundsCount) {
        state.soundsCount = soundsCount
    },
    mutateSetSounds(state, sounds) {
        state.sounds = sounds
    },
    mutateSetNewSounds(state, sounds) {
        state.sounds = { 1: [...sounds] }
    },
    mutateSetPageSounds(state, { sounds, pageNumber }) {
        Vue.set(state.sounds, pageNumber, sounds)
    },
    mutateSetSearchName(state, searchName) {
        state.searchName = searchName
    },
    mutateSetSearchGenres(state, searchGenres) {
        state.searchGenres = searchGenres
    },
    mutateSetSearchType(state, searchType) {
        state.searchType = searchType
    },
    mutateSetSort(state, sort) {
        state.sort = sort
    },
    mutateSetPerPage(state, perPage) {
        state.perPage = perPage
    },
    mutateSetCurrentPage(state, currentPage) {
        state.currentPage = currentPage
    }
}

export const actions = {
    setSoundsCount({ commit }, soundsCount) {
        commit('mutateSetSoundsCount', soundsCount)
    },
    setNewSounds({ commit }, sounds) {
        commit('mutateSetNewSounds', sounds)
    },
    setPageSounds({ commit }, { sounds, pageNumber }) {
        commit('mutateSetPageSounds', { sounds, pageNumber })
    },
    setSearchName({ commit }, searchName) {
        commit('mutateSetSearchName', searchName)
    },
    setSearchType({ commit }, searchType) {
        commit('mutateSetSearchType', searchType)
    },
    setSearchGenres({ commit }, searchGenres) {
        commit('mutateSetSearchGenres', searchGenres)
    },
    setSort({ commit }, sort) {
        commit('mutateSetSort', sort)
    },
    setPerPage({ commit }, perPage) {
        commit('mutateSetPerPage', perPage)
    },
    setCurrentPage({ commit }, currentPage) {
        commit('mutateSetCurrentPage', currentPage)
    },
    initNewSearch({ commit }, { searchName, searchType, searchGenres, sort }) {
        commit('mutateSetSearchName', searchName)
        commit('mutateSetSearchType', searchType)
        commit('mutateSetSearchGenres', searchGenres)
        commit('mutateSetSort', sort)
        commit('mutateSetSounds', {})
        commit('mutateSetCurrentPage', 1)
    }
}

export const getters = {
    soundsCount(state) {
        return state.soundsCount
    },
    sounds(state) {
        return state.sounds
    },
    searchName(state) {
        return state.searchName
    },
    searchType(state) {
        return state.searchType
    },
    searchGenres(state) {
        return state.searchGenres
    },
    sort(state) {
        return state.sort
    },
    perPage(state) {
        return state.perPage
    },
    currentPage(state) {
        return state.currentPage
    },
    filter(state) {
        const searchName = state.searchName.toLowerCase().trim()
        const searchType = state.searchType.toLowerCase().trim()
        const searchGenres = state.searchGenres

        if (!searchName && !searchType && _.isEmpty(searchGenres)) return null

        const filter = { _and: [] }

        if (searchName) {
            filter._and.push({
                _or: [
                    {
                        name: {
                            _contains: searchName
                        }
                    },
                    {
                        dj: {
                            name: {
                                _contains: searchName
                            }
                        }
                    }
                ]
            })
        }
        if (searchType) {
            filter._and.push({
                type: {
                    _eq: searchType
                }
            })
        }

        if (!_.isEmpty(searchGenres)) {
            filter._and.push({
                genres: {
                    genre_id: {
                        _in: searchGenres.map((genre) => genre.id)
                    }
                }
            })
        }

        return filter
    }
}
