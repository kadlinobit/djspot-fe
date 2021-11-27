import Vue from 'vue'
import _ from 'lodash'

export const state = () => ({
    soundsCount: 0,
    sounds: {},
    searchName: '',
    searchType: '',
    searchGenres: [],
    sort: 'name:asc',
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
    setoundsCount({ commit }, soundsCount) {
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
    getSoundsCount(state) {
        return state.soundsCount
    },
    getSounds(state) {
        return state.sounds
    },
    getSearchName(state) {
        return state.searchName
    },
    getSearchType(state) {
        return state.searchType
    },
    getSearchGenres(state) {
        return state.searchGenres
    },
    getSort(state) {
        return state.sort
    },
    getPerPage(state) {
        return state.perPage
    },
    getCurrentPage(state) {
        return state.currentPage
    },
    getWhere(state) {
        const searchName = state.searchName.toLowerCase().trim()
        const searchType = state.searchType.toLowerCase().trim()
        const searchGenres = state.searchGenres

        const where = {}

        if (searchName) {
            where.name_contains = searchName
        }
        if (searchType) {
            where.type_contains = searchType
        }

        if (!_.isEmpty(searchGenres)) {
            where.genres.id = searchGenres.map((genre) => genre.id)
        }

        return where
    }
}
