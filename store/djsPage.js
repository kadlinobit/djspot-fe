import Vue from 'vue'
import _ from 'lodash'

export const state = () => ({
    djsCount: 0,
    djs: {},
    searchName: '',
    searchCity: '',
    searchGenres: [],
    sort: 'name:asc',
    perPage: 5,
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
    getDjsCount(state) {
        return state.djsCount
    },
    getDjs(state) {
        return state.djs
    },
    getSearchName(state) {
        return state.searchName
    },
    getSearchCity(state) {
        return state.searchCity
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
        const searchCity = state.searchCity.toLowerCase().trim()
        const searchGenres = state.searchGenres

        const where = {}

        if (searchName) {
            where.name_contains = searchName
        }
        if (searchCity) {
            where.city_contains = searchCity
        }

        if (!_.isEmpty(searchGenres)) {
            where.genres.id = searchGenres.map((genre) => genre.id)
        }

        return where
    }
}
