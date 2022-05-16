import Vue from 'vue'
import _ from 'lodash'

export const state = () => ({
    djsCount: 0,
    djs: {},
    searchName: '',
    searchCity: '',
    searchGenres: [],
    sort: 'name',
    perPage: 12,
    currentPage: 1
})

export const mutations = {
    mutateSetDjsCount(state, djsCount) {
        state.djsCount = djsCount
    },
    mutateSetDjs(state, djs) {
        state.djs = djs
    },
    mutateSetNewDjs(state, djs) {
        state.djs = { 1: [...djs] }
    },
    mutateSetPageDjs(state, { djs, pageNumber }) {
        Vue.set(state.djs, pageNumber, djs)
    },
    mutateSetSearchName(state, searchName) {
        state.searchName = searchName
    },
    mutateSetSearchGenres(state, searchGenres) {
        state.searchGenres = searchGenres
    },
    mutateSetSearchCity(state, searchCity) {
        state.searchCity = searchCity
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
    setDjsCount({ commit }, djsCount) {
        commit('mutateSetDjsCount', djsCount)
    },
    setNewDjs({ commit }, djs) {
        commit('mutateSetNewDjs', djs)
    },
    setPageDjs({ commit }, { djs, pageNumber }) {
        commit('mutateSetPageDjs', { djs, pageNumber })
    },
    setSearchName({ commit }, searchName) {
        commit('mutateSetSearchName', searchName)
    },
    setSearchCity({ commit }, searchCity) {
        commit('mutateSetSearchCity', searchCity)
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
    initNewSearch({ commit }, { searchName, searchCity, searchGenres, sort }) {
        commit('mutateSetSearchName', searchName)
        commit('mutateSetSearchCity', searchCity)
        commit('mutateSetSearchGenres', searchGenres)
        commit('mutateSetSort', sort)
        commit('mutateSetDjs', {})
        commit('mutateSetCurrentPage', 1)
    }
}

export const getters = {
    djsCount(state) {
        return state.djsCount
    },
    djs(state) {
        return state.djs
    },
    searchName(state) {
        return state.searchName
    },
    searchCity(state) {
        return state.searchCity
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
        const searchCity = state.searchCity.toLowerCase().trim()
        const searchGenres = state.searchGenres

        if (!searchName && !searchCity && _.isEmpty(searchGenres)) return null

        const filter = { _and: [] }

        if (searchName) {
            filter._and.push({
                name: {
                    _contains: searchName
                }
            })
        }
        if (searchCity) {
            filter._and.push({
                city: {
                    _eq: searchCity
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
