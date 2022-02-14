<template>
    <!-- <client-only> -->
    <section class="section">
        <div class="container">
            <h1 class="title">DJs {{ djsCount }}</h1>
            <o-field>
                <o-input
                    v-model="searchNameLocal"
                    :placeholder="$t('dj.search_dj')"
                    type="search"
                    expanded
                ></o-input>
                <p class="control">
                    <o-button type="is-primary" label="Search" @click="onSearch" />
                </p>
            </o-field>
            <o-field class="no-label" horizontal>
                <o-select v-model="sortLocal" expanded @input="onSearch">
                    <option
                        v-for="option in djsPageSortOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ $t(option.label) }}
                    </option>
                </o-select>
                <o-select v-model="searchCityLocal" expanded @input="onSearch">
                    <option value="">
                        {{ `Celá ČR` }}
                    </option>
                    <option
                        v-for="option in citiesOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ option.label }}
                    </option>
                </o-select>
                <client-only>
                    <o-validated-tag-input
                        v-model="searchGenresLocal"
                        name="genres"
                        :tags="genresOptions"
                        :is-validation-on="false"
                        field="name"
                        maxtags="3"
                        expanded
                        :placeholder="$t('dj.select_3_genres')"
                    />
                </client-only>
            </o-field>

            <p v-if="$fetchState.pending">Loading ...</p>
            <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
            <div v-else-if="!$fetchState.pending && djsCount === 0">
                <section class="hero is-secondary is-medium">
                    <div class="hero-body">
                        <p class="title">{{ $t('dj.no_djs_found') }}</p>
                        <p class="subtitle">
                            <a @click="resetSearch">{{ $t('dj.reset_search') }}</a>
                        </p>
                    </div>
                </section>
            </div>
            <div v-else>
                <dj-list :djs="djs[currentPage]" />

                <o-pagination
                    :current="currentPage"
                    :total="djsCount"
                    :range-before="1"
                    :range-after="1"
                    order="centered"
                    size="small"
                    :per-page="perPage"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
                    @change="onPageChange"
                >
                </o-pagination>
            </div>
        </div>
    </section>
    <!-- </client-only> -->
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue'
import DjList from '~/components/dj/DjList.vue'

export default {
    name: 'DjsPage',
    components: {
        OValidatedTagInput,
        DjList
    },
    data() {
        return {
            searchNameLocal: '',
            searchCityLocal: '',
            searchGenresLocal: [],
            sortLocal: ''
        }
    },
    async fetch() {
        this.fetchGenres()
        this.syncLocalSearchValues()

        if (_.isArray(this.djs[this.currentPage]) && !_.isEmpty(this.djs[this.currentPage])) return

        try {
            const djs = await this.fetchDjs(1)
            this.setDjsCount(djs.meta.filter_count)

            if (Array.isArray(djs.data)) {
                this.setNewDjs(djs.data)
            } else {
                this.$fetchState.error = 'DJs not fetched'
                return this.$nuxt.error({ statusCode: 404, message: 'DJs not fetched' })
            }
        } catch (e) {
            this.$fetchState.error = e
            if (e.statusCode && e.statusCode === 404) {
                return this.$nuxt.error({ statusCode: 404, message: e.message })
            }
        }
    },
    computed: {
        ...mapGetters('djsPage', [
            'currentPage',
            'perPage',
            'sort',
            'djsCount',
            'djs',
            'filter',
            'searchName',
            'searchCity',
            'searchGenres'
        ]),
        ...mapGetters('form', ['djsPageSortOptions', 'citiesOptions', 'genresOptions'])
    },
    methods: {
        ...mapActions('djsPage', [
            'setCurrentPage',
            'setPerPage',
            'setSort',
            'setDjsCount',
            'setNewDjs',
            'setPageDjs',
            'setSearchName',
            'setSearchCity',
            'setSearchGenres',
            'initNewSearch'
        ]),
        ...mapActions('form', ['fetchGenres']),
        async fetchDjs(page) {
            const djs = await this.$axios.$request('items/dj', {
                method: 'search',
                data: {
                    query: {
                        filter: this.filter,
                        meta: '*',
                        limit: this.perPage,
                        page,
                        sort: this.sort
                    }
                }
            })

            return djs
        },
        async resetSearch() {
            this.searchNameLocal = ''
            this.searchCityLocal = ''
            this.searchGenresLocal = []

            await this.onSearch()
        },
        async onSearch() {
            this.initNewSearch({
                searchName: this.searchNameLocal,
                searchCity: this.searchCityLocal,
                searchGenres: this.searchGenresLocal,
                sort: this.sortLocal
            })
            await this.$fetch()
        },
        async onPageChange(pageNumber) {
            this.syncLocalSearchValues()
            this.setCurrentPage(pageNumber)

            if (!_.isArray(this.djs[pageNumber]) || _.isEmpty(this.djs[pageNumber])) {
                const pageDjs = await this.fetchDjs(this.currentPage)
                this.setPageDjs({ djs: pageDjs.data, pageNumber })
            }
        },
        syncLocalSearchValues() {
            this.searchNameLocal = this.searchName
            this.searchCityLocal = this.searchCity
            this.searchGenresLocal = this.searchGenres
            this.sortLocal = this.sort
        }
    }
}
</script>
